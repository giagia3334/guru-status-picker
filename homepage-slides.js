(() => {
  const hero = document.querySelector('.sunset-offer');
  if (!hero) return;
  const videos = [...hero.querySelectorAll('video')];
  const copy = [...hero.querySelectorAll('.sunset-offer-copy')];
  const controls = hero.querySelector('.homepage-indicators');
  const buttons = [...controls.querySelectorAll('button')];
  let active = 0;
  let animationFrame;
  let swipeStart;

  function updateProgress() {
    const video = videos[active];
    const progress = video.duration > 0 ? video.currentTime / video.duration : 0;
    buttons[active].style.setProperty('--slide-progress', Math.min(1, progress));
  }

  function animateProgress() {
    updateProgress();
    if (!videos[active].paused && !videos[active].ended) {
      animationFrame = requestAnimationFrame(animateProgress);
    }
  }

  function show(next) {
    if (next === active) return;
    videos[active].pause();
    videos[active].hidden = true;
    copy[active].hidden = true;
    buttons[active].removeAttribute('aria-current');
    buttons[active].style.removeProperty('--slide-progress');
    cancelAnimationFrame(animationFrame);
    active = next;
    videos[active].hidden = false;
    copy[active].hidden = false;
    buttons[active].setAttribute('aria-current', 'true');
    videos[active].currentTime = 0;
    updateProgress();
    videos[active].play().catch(() => {});
  }

  videos.forEach((video, index) => {
    const next = (index + 1) % videos.length;
    video.addEventListener('ended', () => {
      if (active === index) show(next);
    });
    video.addEventListener('playing', () => {
      if (active !== index) return;
      cancelAnimationFrame(animationFrame);
      animateProgress();
    });
    video.addEventListener('timeupdate', () => {
      if (active === index) updateProgress();
      if (video.duration - video.currentTime < 4) videos[next].preload = 'auto';
    });
    buttons[index].addEventListener('click', () => show(index));
  });
  hero.addEventListener('touchstart', (event) => {
    swipeStart = undefined;
    if (event.touches.length !== 1 || event.target.closest('button, a')) return;
    const touch = event.changedTouches[0];
    swipeStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  hero.addEventListener('touchcancel', () => { swipeStart = undefined; });
  hero.addEventListener('touchend', (event) => {
    if (!swipeStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - swipeStart.x;
    const dy = touch.clientY - swipeStart.y;
    swipeStart = undefined;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    const direction = dx < 0 ? 1 : -1;
    show((active + direction + videos.length) % videos.length);
  }, { passive: true });

  // Treat a trackpad swipe as one gesture, not as a stream of slide changes.
  // The previous same-direction guard could keep rejecting later swipes while
  // macOS was still sending low-amplitude momentum wheel events.
  let wheelGesture = null;
  let wheelIdleTimer = null;
  const WHEEL_IDLE_MS = 160;
  const WHEEL_THRESHOLD = 30;

  hero.addEventListener('wheel', (event) => {
    if (event.ctrlKey) return; // Preserve browser pinch-to-zoom.

    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? hero.clientWidth : 1;
    const dx = event.deltaX * scale;
    const dy = event.deltaY * scale;
    const horizontal = Math.abs(dx) > Math.abs(dy) * 1.15;

    // Never interfere with normal vertical page scrolling.
    if (!wheelGesture && !horizontal) return;
    if (!wheelGesture) wheelGesture = { x: 0, y: 0, navigated: false };

    clearTimeout(wheelIdleTimer);
    wheelIdleTimer = setTimeout(() => { wheelGesture = null; }, WHEEL_IDLE_MS);

    if (wheelGesture.navigated) {
      // Consume only the horizontal momentum of an already-handled swipe.
      if (horizontal && event.cancelable) event.preventDefault();
      return;
    }

    wheelGesture.x += dx;
    wheelGesture.y += Math.abs(dy);
    if (Math.abs(wheelGesture.x) <= wheelGesture.y * 1.15) return;
    if (event.cancelable) event.preventDefault();
    if (Math.abs(wheelGesture.x) < WHEEL_THRESHOLD) return;

    const direction = Math.sign(wheelGesture.x);
    wheelGesture.navigated = true;
    show((active + direction + videos.length) % videos.length);
  }, { passive: false });

  controls.hidden = false;
})();

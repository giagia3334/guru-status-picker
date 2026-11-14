function bindReviewGestures(viewport, { canMove, onStart, onMove, onEnd }) {
  let pointer = null;
  let suppressClick = false;

  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || pointer || !event.isPrimary || event.button !== 0 || !canMove()) return;
    if (event.pointerType === 'mouse' && event.target.closest('a,button')) return;
    suppressClick = false;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, horizontal: false };
  });

  viewport.addEventListener('pointermove', event => {
    if (pointer?.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    if (!pointer.horizontal) {
      const dy = event.clientY - pointer.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
      if (Math.abs(dy) >= Math.abs(dx)) {
        pointer = null;
        return;
      }
      pointer.horizontal = true;
      suppressClick = true;
      viewport.setPointerCapture(event.pointerId);
      onStart();
    }
    pointer.x = event.clientX;
    onMove(-dx);
  });

  const finish = event => {
    if (pointer?.id !== event.pointerId) return;
    if (pointer.horizontal) onEnd();
    pointer = null;
  };
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    viewport.addEventListener(type, finish);
  }
  viewport.addEventListener('pointerleave', event => {
    if (!pointer?.horizontal) finish(event);
  });

  let touch = null;
  viewport.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || !canMove()) return;
    const point = event.changedTouches[0];
    suppressClick = false;
    touch = { id: point.identifier, x: point.clientX, y: point.clientY, horizontal: false };
  }, { passive: true });

  viewport.addEventListener('touchmove', event => {
    if (!touch) return;
    const point = Array.from(event.changedTouches).find(item => item.identifier === touch.id);
    if (!point) return;
    const dx = point.clientX - touch.x;
    const dy = point.clientY - touch.y;
    if (!touch.horizontal) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
      if (Math.abs(dy) >= Math.abs(dx) || !event.cancelable) {
        touch = null;
        return;
      }
      touch.horizontal = true;
      suppressClick = true;
      onStart();
    }
    if (event.cancelable) event.preventDefault();
    touch.x = point.clientX;
    onMove(-dx);
  }, { passive: false });

  const finishTouch = event => {
    if (!touch || !Array.from(event.changedTouches).some(item => item.identifier === touch.id)) return;
    if (touch.horizontal) onEnd();
    touch = null;
  };
  viewport.addEventListener('touchend', finishTouch);
  viewport.addEventListener('touchcancel', finishTouch);

  viewport.addEventListener('click', event => {
    if (!suppressClick || event.detail === 0) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  let wheelTimeout;
  viewport.addEventListener('wheel', event => {
    if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY) || !canMove()) return;
    event.preventDefault();
    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1;
    onStart();
    onMove(event.deltaX * scale);
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      if (!pointer?.horizontal) onEnd();
    }, 140);
  }, { passive: false });
}

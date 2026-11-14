(() => {
  const group = document.querySelector('.developer-metrics');
  const displacement = document.querySelector('#metric-dissolve feDisplacementMap');
  if (!group || !displacement || !('IntersectionObserver' in window)) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const values = [...group.querySelectorAll('.developer-metric-value')];
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    if (motion.matches) return;
    values.forEach(value => { value.style.filter = 'url(#metric-dissolve)'; });
    const start = performance.now();
    function resolve(now) {
      const progress = motion.matches ? 1 : Math.min(1, (now - start) / 850);
      displacement.setAttribute('scale', String(58 * (1 - progress) ** 2));
      if (progress < 1) requestAnimationFrame(resolve);
      else values.forEach(value => { value.style.removeProperty('filter'); });
    }
    resolve(start);
  }, { threshold: 0.25 });
  observer.observe(group);
})();

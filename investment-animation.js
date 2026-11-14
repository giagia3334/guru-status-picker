/* V68 — animate both KPI values and the mini-charts when the section enters the viewport. */
(() => {
  const cards = Array.from(document.querySelectorAll('.investment-kpi-v67 .investment-card'));
  if (!cards.length) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) return;

  const formatValue = (target, decimals, fraction) => {
    const n = (target * fraction).toFixed(decimals);
    return `${n}%`;
  };
  function countUp(el, duration = 1900) {
    const target = Number(el.dataset.countTo);
    const decimals = Number(el.dataset.countDecimals || 0);
    if (!Number.isFinite(target)) return;
    const prefix = el.classList.contains('kpi-main-value') ? '+' : '';
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Smooth accelerating start and a gentle deceleration at the end.
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + formatValue(target, decimals, eased);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toFixed(decimals) + '%';
    };
    requestAnimationFrame(tick);
  }

  cards.forEach(card => {
    card.querySelectorAll('[data-count-to]').forEach(el => {
      el.textContent = (el.classList.contains('kpi-main-value') ? '+' : '') + (0).toFixed(Number(el.dataset.countDecimals || 0)) + '%';
    });
    card.querySelector('.investment-chart')?.classList.add('investment-animate-ready');
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      card.querySelector('.investment-chart')?.classList.add('is-visible');
      card.querySelectorAll('[data-count-to]').forEach(el => countUp(el));
      observer.unobserve(card);
    });
  }, { threshold: 0.24, rootMargin: '0px 0px -5% 0px' });
  cards.forEach(card => observer.observe(card));
})();

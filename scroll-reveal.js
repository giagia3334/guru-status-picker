(() => {
  if (!('IntersectionObserver' in window)) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;

  const groups = [
    ['.completed-heading-row, .reality-gallery-heading, .showroom-carousel-heading, .infrastructure-head, .quality-intro, .investment-heading-row, .neighborhood-header, .guest-reviews-header, .developer-numbers-heading', 'rise'],
    ['.finish-comparison-title, .finish-comparison-description, .developer-story-title, .contact-left', 'left'],
    ['.finish-comparison-showcase, .developer-story-copy, .contact-right', 'right'],
    ['.completed-gallery-image, .guru-stack-stage, #showroom-carousel-viewport', 'scale'],
    ['.infra-card', 'scale', true],
    ['.quality-feature-card', 'rise', true],
    ['.developer-metric', 'rise', true],
    ['.guru-footer-grid > div', 'rise', true]
  ];

  const reveal = element => {
    element.classList.remove('scroll-reveal-pending');
    observer.unobserve(element);
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) reveal(entry.target);
    }
  }, { threshold: 0.06 });

  for (const [selector, effect, stagger] of groups) {
    document.querySelectorAll(selector).forEach((element, index) => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < innerHeight || bounds.height === 0) return;
      element.dataset.scrollReveal = effect;
      if (stagger) element.style.setProperty('--scroll-reveal-delay', `${index % 4 * 65}ms`);
      element.classList.add('scroll-reveal-pending');
      observer.observe(element);
    });
  }

  document.addEventListener('focusin', event => {
    const element = event.target.closest('.scroll-reveal-pending');
    if (element) reveal(element);
  });
  motion.addEventListener('change', event => {
    if (event.matches) {
      document.querySelectorAll('.scroll-reveal-pending').forEach(reveal);
    }
  });
})();

(() => {
  const offer = document.querySelector('.black-friday');
  if (!offer || typeof offer.showModal !== 'function') return;

  offer.querySelector('.black-friday-close').addEventListener('click', () => offer.close());
  offer.querySelector('.black-friday-cta').addEventListener('click', () => offer.close());
  offer.addEventListener('click', event => {
    if (event.target === offer) offer.close();
  });

  const elapsed = performance.now();
  window.setTimeout(() => offer.showModal(), Math.max(0, 30000 - elapsed));
})();

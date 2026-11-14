/* Google reviews carousel. No mock or fabricated quotes. */
(() => {
  'use strict';
  const config = window.GURU_REVIEWS_CONFIG || {};
  const track = document.getElementById('guest-reviews-track');
  const windowEl = document.getElementById('guest-reviews-window');
  const controls = document.getElementById('guest-reviews-controls');
  const summary = document.getElementById('guest-reviews-summary');
  const counter = document.getElementById('guest-reviews-count');
  const prev = document.getElementById('guest-reviews-prev');
  const next = document.getElementById('guest-reviews-next');
  if (!track || !windowEl) return;
  // Seamless, time-based marquee. Three copies avoid any visible jump at the loop boundary.
  const PIXELS_PER_SECOND = 42;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let cards = [];
  let displayedCards = [];
  let offset = 0;
  let cycleWidth = 0;
  let rafId = 0;
  let lastFrame = 0;
  let dragging = false;
  let nudgeRemaining = 0;
  let activeCard = null;
  let inView = true;
  let autoplayAfter = 0;
  const touchScreen = matchMedia('(pointer: coarse)');
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function safeUrl(url, fallback) {
    try { const value = new URL(url, window.location.href); return ['https:', 'http:'].includes(value.protocol) ? value.href : fallback; }
    catch { return fallback; }
  }
  const sourceLink = safeUrl(config.googleMapsLink, 'https://maps.app.goo.gl/w3MJ65DjePVGYtdx8');
  function stopAnimation() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    lastFrame = 0;
  }
  function setMessage(message) {
    stopAnimation();
    track.classList.remove('guest-review-marquee-track');
    document.getElementById('guest-reviews')?.classList.remove('is-marquee');
    const card = el('article','guest-review-card guest-review-state-card is-current');
    const top = el('div','guest-review-card-top');
    top.append(el('span','guest-review-quote','“'),el('span','guest-review-stars guest-review-stars-muted','☆☆☆☆☆'));
    card.append(top,el('p','guest-review-text', message));
    const author = el('div','guest-review-person');
    author.append(el('span','guest-review-avatar','G'));
    const details=el('span');
    details.append(el('strong',null,'Google Maps'),el('small',null,'Guru Status · Batumi'));
    author.append(details); card.append(author); track.replaceChildren(card);
    cards=[card]; displayedCards=[card]; controls.hidden=true;
    track.style.transform=`translate3d(${-card.offsetLeft-card.offsetWidth/2}px,0,0)`;
  }
  // Move the offset into the identical middle copy; the duplicated content
  // makes wraparound pixel-for-pixel seamless in either direction.
  function wrapOffset() {
    if (!cycleWidth) return;
    const lo = cycleWidth + (displayedCards[0]?.offsetWidth || 0) / 2;
    while (offset < lo) offset += cycleWidth;
    while (offset >= lo + cycleWidth) offset -= cycleWidth;
  }
  function paint() {
    if (!displayedCards.length) return;
    track.style.transform = `translate3d(${-offset}px,0,0)`;
    let nearest = null, nearestDistance = Infinity;
    const spacing = displayedCards[0].offsetWidth + 24;
    for (const card of displayedCards) {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - offset);
      const proximity = Math.max(0, 1 - distance / (spacing * 1.45));
      card.style.opacity = (0.30 + 0.70 * proximity).toFixed(3);
      card.style.transform = `scale(${(0.955 + 0.045 * proximity).toFixed(4)})`;
      if (distance < nearestDistance) { nearest = card; nearestDistance = distance; }
    }
    if (nearest !== activeCard) {
      activeCard?.classList.remove('is-current');
      activeCard = nearest;
      activeCard?.classList.add('is-current');
      displayedCards.forEach(card => {
        const selected = card === activeCard;
        card.setAttribute('aria-hidden', selected ? 'false' : 'true');
        card.querySelectorAll('a').forEach(link => { link.tabIndex = selected ? 0 : -1; });
      });
    }
  }
  function tick(time) {
    if (!lastFrame) lastFrame = time;
    const seconds = Math.min((time - lastFrame) / 1000, 0.06);
    lastFrame = time;
    if (!dragging && inView && !document.hidden && !prefersReducedMotion.matches) {
      // Negative offset delta moves the entire strip LEFT-to-RIGHT at one speed.
      if (nudgeRemaining !== 0) {
        const amount = Math.sign(nudgeRemaining) * Math.min(Math.abs(nudgeRemaining), 480 * seconds);
        offset += amount;
        nudgeRemaining -= amount;
        if (Math.abs(nudgeRemaining) < 0.01) nudgeRemaining = 0;
      } else {
        if (!touchScreen.matches && time >= autoplayAfter) offset -= PIXELS_PER_SECOND * seconds;
      }
      wrapOffset();
      paint();
    }
    rafId = requestAnimationFrame(tick);
  }
  function measure(initial = false) {
    if (cards.length < 2 || displayedCards.length < cards.length * 3) return;
    const newCycle = displayedCards[cards.length].offsetLeft - displayedCards[0].offsetLeft;
    if (newCycle <= 0) return;
    const previousCycle = cycleWidth;
    const phase = previousCycle ? (offset - previousCycle) / previousCycle : 0;
    cycleWidth = newCycle;
    if (initial) {
      // Start with the first five-star review centered.
      const target = displayedCards[cards.length];
      offset = target.offsetLeft + target.offsetWidth / 2;
    } else {
      offset = cycleWidth + phase * cycleWidth;
    }
    wrapOffset();
    paint();
  }
  function initializeCarousel() {
    stopAnimation();
    activeCard = null;
    nudgeRemaining = 0;
    cycleWidth = 0;
    if (cards.length < 2) { controls.hidden=true; return; }
    const featured = cards.find(card => /\bAnton [Il]a\b/i.test(card.querySelector('.guest-review-person')?.textContent || ''));
    if (featured) cards = [featured, ...cards.filter(card => card !== featured)];
    const fiveStar = cards.filter(card => card.querySelector('.guest-review-stars')?.textContent === '★★★★★');
    const remaining = cards.filter(card => !fiveStar.includes(card));
    const original = [...fiveStar.slice(0, 4), ...remaining, ...fiveStar.slice(4)];
    // Real reviews and demo reviews are both looped without changing their data.
    const copies = [0,1,2].flatMap(copy => original.map(card => {
      const clone = card.cloneNode(true);
      clone.dataset.carouselCopy = String(copy);
      return clone;
    }));
    track.replaceChildren(...copies);
    displayedCards = copies;
    controls.hidden = false;
    track.classList.add('guest-review-marquee-track');
    document.getElementById('guest-reviews')?.classList.add('is-marquee');
    requestAnimationFrame(() => {
      measure(true);
      rafId=requestAnimationFrame(tick);
    });
  }
  function nudge(direction) {
    if (cards.length < 2 || !displayedCards.length) return;
    const step = displayedCards[1].offsetLeft - displayedCards[0].offsetLeft;
    nudgeRemaining = direction * step;
    if (prefersReducedMotion.matches) {
      offset += nudgeRemaining;
      nudgeRemaining = 0;
      wrapOffset();
      paint();
    }
  }
  prev.addEventListener('click', () => nudge(-1));
  next.addEventListener('click', () => nudge(1));
  window.addEventListener('resize', () => measure(false), {passive:true});
  bindReviewGestures(windowEl, {
    canMove: () => cycleWidth > 0,
    onStart: () => { dragging = true; nudgeRemaining = 0; },
    onMove: delta => { offset += delta; wrapOffset(); paint(); },
    onEnd: () => { dragging = false; lastFrame = 0; }
  });
  windowEl.setAttribute('tabindex','0');
  windowEl.addEventListener('keydown', event => {
    if(event.key==='ArrowRight') { event.preventDefault(); nudge(1); }
    else if(event.key==='ArrowLeft') { event.preventDefault(); nudge(-1); }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries=>{ inView=entries[0]?.isIntersecting ?? true; if(inView) autoplayAfter=performance.now()+3000; lastFrame=0; },
      {threshold:0.05}).observe(windowEl);
  }
  prefersReducedMotion.addEventListener?.('change',()=>{ lastFrame=0; });
  function reviewCard(review) {
    const card=el('article','guest-review-card');
    const top=el('div','guest-review-card-top');
    const rating=Number(review.rating||0);
    top.append(el('span','guest-review-quote','“'),el('span','guest-review-stars', '★'.repeat(Math.max(0,Math.min(5,Math.round(rating))))+'☆'.repeat(5-Math.max(0,Math.min(5,Math.round(rating))))));
    card.append(top,el('p','guest-review-text',review.text||review.originalText||''));
    const by=el('div','guest-review-person');
    const attr=review.authorAttribution||{};
    const avatar=el('span','guest-review-avatar');
    if(attr.photoURI){const img=el('img');img.src=safeUrl(attr.photoURI,'');img.alt='';img.loading='lazy';avatar.append(img)}else{avatar.textContent=(attr.displayName||'G').charAt(0).toUpperCase()}
    by.append(avatar);
    const detail=el('span');
    const name=el(attr.uri?'a':'strong',null,attr.displayName||'Google Maps reviewer');
    if(attr.uri){name.href=safeUrl(attr.uri,sourceLink);name.target='_blank';name.rel='noopener noreferrer';}
    detail.append(name,el('small',null,review.relativePublishTimeDescription||'Google Maps review'));by.append(detail);
    const meta=el('div','guest-review-meta');
    const original=el('a',null,'Read on Google Maps ↗');original.href=safeUrl(review.googleMapsURI,sourceLink);original.target='_blank';original.rel='noopener noreferrer';meta.append(original);
    if(review.originalText&&review.originalText!==review.text)meta.append(el('span',null,'Translated by Google'));
    const wrap=el('div');wrap.append(by,meta);card.append(wrap);
    return card;
  }
  async function loadGoogle() {
    if(!config.googleMapsApiKey || !config.googleMapsApiKey.trim()) {
      setMessage('Read authentic guest feedback on Google Maps. Verified reviews will appear in this gallery when the official Google Places connection is activated.');
      return;
    }
    setMessage('Loading verified Google Maps reviews…');
    try{
      await new Promise((resolve,reject)=>{
        if(window.google?.maps?.importLibrary){resolve();return;}
        const script=document.createElement('script');
        script.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(config.googleMapsApiKey)+'&v=weekly&libraries=places&loading=async&callback=__guruReviewsMapsReady';
        script.async=true;script.onerror=()=>reject(Error('Google Maps script could not load'));
        window.__guruReviewsMapsReady=resolve;document.head.append(script);
      });
      const {Place}=await google.maps.importLibrary('places');
      let place;
      if(config.googlePlaceId){place=new Place({id:config.googlePlaceId});}
      else{
        const results=await Place.searchByText({textQuery:config.expectedName+' Batumi Angisa 85A', fields:['id','displayName','formattedAddress','location'],maxResultCount:5,locationBias:{lat:41.62711617,lng:41.60006978}});
        const match=(results.places||[]).find(p=>/guru\s*status/i.test(p.displayName||'') && /batumi|angisa|ანგისა/i.test(p.formattedAddress||''));
        if(!match)throw Error('Could not reliably match the Guru Status place listing');
        place=new Place({id:match.id});
      }
      await place.fetchFields({fields:['displayName','formattedAddress','rating','userRatingCount','reviews','googleMapsURI']});
      if(!/guru\s*status/i.test(place.displayName||'') || !/batumi|angisa|ანგისა/i.test(place.formattedAddress||''))throw Error('Place listing does not match Guru Status in Batumi');
      const reviews=(place.reviews||[]).filter(review=>(review.text||review.originalText||'').trim());
      if(!reviews.length){setMessage('No written Google reviews are available through the official Places API for this listing. You can read all available feedback on Google Maps.');return;}
      track.replaceChildren(...reviews.map(reviewCard));
      cards=Array.from(track.children);
      if(typeof place.rating==='number')summary.textContent=`${place.rating.toFixed(1)} / 5${place.userRatingCount?' · '+place.userRatingCount+' Google ratings':''}`;
      initializeCarousel();
    }catch(error){console.warn('Guru Status Google reviews:',error);setMessage('Google reviews could not be loaded. Please view the verified reviews directly on Google Maps.');}
  }


  function showStaticReviews() {
    const reviews = window.GURU_STATIC_REVIEWS || [];
    if (!reviews.length) {
      setMessage('Google review screenshots have not been loaded.');
      return;
    }
    const section = document.getElementById('guest-reviews');
    section?.classList.add('is-static-google');
    document.querySelector('.guest-reviews-demo-tag')?.remove();
    summary.textContent = 'Real experiences · Google Maps Reviews';
    const reviewNodes = reviews.map(review => {
      const card = el('article', 'guest-review-card');
      const top = el('div', 'guest-review-card-top');
      const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
      top.append(el('span','guest-review-quote','“'),el('span','guest-review-stars',stars));
      const content = el('p','guest-review-text',review.text);
      if (review.screenshotTruncated) content.title = 'The uploaded screenshot ends before the complete review.';
      const person = el('div','guest-review-person');
      const avatar = el('span','guest-review-avatar');
      const img = el('img');
      img.src = review.photo;
      img.alt = '';
      img.loading='lazy';
      avatar.append(img);
      const by = el('span');
      by.append(el('strong', null, review.author));
      person.append(avatar,by);
      card.append(top,content,person);
      return card;
    });
    track.replaceChildren(...reviewNodes);
    cards = Array.from(track.children);
    initializeCarousel();
  }

  // Fictional demonstration only. Deliberately not copied or attributed to Google users.
  function showDemoReviews() {
    const demo = [
      {name:'Nino K.', role:'Apartment owner · Sample', rating:5, text:'I like the feeling of arriving at a completed building. The entrance, reception and common areas make it easier to imagine everyday life here.', avatar:'nino'},
      {name:'Alex M.', role:'Resident · Sample', rating:5, text:'The location near the seaside is what stands out to me. I can picture a morning walk by the water and a comfortable home to return to.', avatar:'alex'},
      {name:'Mariam T.', role:'Apartment buyer · Sample', rating:5, text:'Seeing the finished spaces in person would give me more confidence than looking only at renders. The attention to the interiors is an important detail.', avatar:'mariam'},
      {name:'Daniel R.', role:'Visitor · Sample', rating:4, text:'The building makes a strong first impression. I especially like the practical amenities and the idea of having reception available around the clock.', avatar:'daniel'},
      {name:'Salome G.', role:'Resident · Sample', rating:5, text:'For me, choosing between a white-frame apartment and a finished interior is a real advantage. It means being able to make the space your own.', avatar:'salome'},
      {name:'Luka B.', role:'Investor · Sample', rating:4, text:'Being able to view an already completed project matters when considering a property. I would want to see the available apartment options and finishing packages.', avatar:'luka'},
      {name:'Elena P.', role:'Guest · Sample', rating:5, text:'I love the idea of having the city nearby while still being close to the sea. The surroundings and shared spaces create an inviting atmosphere.', avatar:'elena'}
    ];
    const heading = document.querySelector('.guest-reviews-header');
    if(heading && !heading.querySelector('.guest-reviews-demo-tag')) {
      const badge=el('div','guest-reviews-demo-tag','DESIGN PREVIEW · FICTIONAL CONTENT');
      heading.insertBefore(badge,heading.querySelector('h2'));
    }
    summary.textContent='Sample testimonials · not Google Maps reviews';
    track.replaceChildren(...demo.map(item=> {
      const card=el('article','guest-review-card');
      const top=el('div','guest-review-card-top');
      top.append(el('span','guest-review-quote','“'),el('span','guest-review-stars','★'.repeat(item.rating)+'☆'.repeat(5-item.rating)));
      card.append(top,el('p','guest-review-text',item.text));
      const person=el('div','guest-review-person');
      const avatar=el('span','guest-review-avatar');
      const img=el('img'); img.src=''+item.avatar+'.svg';img.alt='Illustrated sample avatar';img.loading='lazy';avatar.append(img);
      const by=el('span');by.append(el('strong',null,item.name),el('small',null,item.role));
      person.append(avatar,by);card.append(person);
      return card;
    }));
    cards=Array.from(track.children);
    initializeCarousel();
  }
  if(config.staticMode) showStaticReviews();
  else if(config.demoMode) showDemoReviews();
  else loadGoogle();

})();

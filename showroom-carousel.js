(()=>{
  const viewport=document.getElementById('showroom-carousel-viewport');
  const track=document.getElementById('showroom-carousel-track');
  if(!viewport||!track)return;
  const slides=[...track.querySelectorAll('.showroom-slide')];
  const count=slides.length;if(!count)return;
  const indicator=document.querySelector('.showroom-carousel-indicators');
  const video=slides[0].querySelector('video');
  let videoInView = !('IntersectionObserver' in window);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const wrap=i=>(i%count+count)%count;
  let active=0,drag=null,dragOffset=0,lastWheel=0,suppressClick=false;
  // Reference uses a dense row of fine vertical tick marks, not large pagination bars.
  const ticks=Array.from({length:49},(_,i)=>{
    const btn=document.createElement('button');btn.type='button';
    const target=Math.min(count-1,Math.round(i*(count-1)/48));
    btn.setAttribute('aria-label',`Go to gallery item ${target+1}`);
    btn.addEventListener('click',()=>setActive(target));
    indicator?.append(btn);return btn;
  });
  const meta=document.createElement('div');meta.className='showroom-reel-meta';
  meta.innerHTML='<span class="showroom-reel-number">01</span><span class="showroom-reel-name">Showroom film</span>';
  viewport.after(meta);
  function dist(i){let d=wrap(i-active);if(d>count/2)d-=count;return d;}
  function render(){
    const width=viewport.clientWidth;
    const card=slides[active].getBoundingClientRect().width || Math.min(310,width*.21);
    const scale=width<761?.64:.51;
    const small=card*scale;
    const gap=width<761?12:16;
    const base=card/2+gap+small/2;
    const pitch=small+gap;
    slides.forEach((el,i)=>{
      const d=dist(i),m=Math.abs(d),visible=m<=(width<761?3:5);
      let x=d===0?0:Math.sign(d)*(base+(m-1)*pitch);
      x+=dragOffset*(d===0?1:.4);
      const s=d===0?1:scale;
      if(el.dataset.hiddenBefore==='true'&&visible){
        el.style.transition='none';el.style.transform=`translate3d(calc(-50% + ${x}px),-50%,0) scale(${s})`;
        el.getBoundingClientRect();
      }
      el.style.transition=visible?'':'none';
      el.style.transform=`translate3d(calc(-50% + ${x}px),-50%,0) scale(${s})`;
      el.style.opacity=visible?'1':'0';
      el.style.zIndex=String(15-m);
      el.classList.toggle('is-current',d===0);el.classList.toggle('is-near',visible&&d!==0);
      el.dataset.hiddenBefore=String(!visible);
      el.setAttribute('aria-hidden',String(!visible));
      if(!visible)el.setAttribute('inert','');else el.removeAttribute('inert');
    });
    // Center the starting video on the 49-tick reel; advance cyclically with the slides.
    const selected=(24+Math.round(active*49/count))%49;
    ticks.forEach((el,i)=>{el.classList.toggle('is-current',i===selected);el.setAttribute('aria-current',String(i===selected));});
    meta.querySelector('.showroom-reel-number').textContent=String(active+1).padStart(2,'0');
    meta.querySelector('.showroom-reel-name').textContent=active===0?'Showroom film':'Interior details';
    syncVideo();
  }
  function syncVideo(){
    if(!video)return;
    if(active===0 && videoInView){
      if(video.paused)video.play().catch(()=>{});
    }else if(!video.paused){
      video.pause();
    }
  }
  function setActive(i){active=wrap(i);dragOffset=0;render();}
  function step(d){setActive(active+d);}
  slides.forEach((slide,i)=>slide.addEventListener('click',e=>{
    if(suppressClick||i===active)return;
    if(slide.classList.contains('is-near'))setActive(i);
  }));
  viewport.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,horizontal:false};
    if(e.pointerType==='mouse')viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!drag.horizontal){
      if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){drag=null;return;}
      if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy))drag.horizontal=true;
    }
    if(drag.horizontal){viewport.classList.add('is-dragging');dragOffset=dx*.34;render();}
  });
  function endDrag(e){
    if(!drag||drag.id!==e.pointerId)return;
    const dx=e.clientX-drag.x,h=drag.horizontal;
    drag=null;dragOffset=0;viewport.classList.remove('is-dragging');
    if(h){suppressClick=true;setTimeout(()=>suppressClick=false,200);if(Math.abs(dx)>35)step(dx<0?1:-1);else render();}
  }
  viewport.addEventListener('pointerup',endDrag);
  viewport.addEventListener('pointercancel',e=>{if(drag?.id===e.pointerId){drag=null;dragOffset=0;viewport.classList.remove('is-dragging');render();}});
  viewport.addEventListener('dragstart',e=>e.preventDefault());
  viewport.addEventListener('wheel',e=>{
    const horizontal=Math.abs(e.deltaX)>Math.abs(e.deltaY);
    // Horizontal trackpad swipes are handled; vertical scrolling remains page navigation.
    if(!horizontal||Math.abs(e.deltaX)<4)return;
    e.preventDefault();const now=performance.now();if(now-lastWheel<380)return;
    lastWheel=now;step(e.deltaX>0?1:-1);
  },{passive:false});
  document.addEventListener('keydown',e=>{
    if(!viewport.matches(':hover')&&!viewport.contains(document.activeElement))return;
    if(e.key==='ArrowRight'){e.preventDefault();step(1);}if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}
  });
  if(video && 'IntersectionObserver' in window){
    new IntersectionObserver(([entry])=>{
      videoInView=entry.isIntersecting;
      syncVideo();
    },{rootMargin:'120px 0px',threshold:.15}).observe(viewport);
  }
  if(video){
    video.controls=false;video.removeAttribute('controls');
    video.muted=true;video.defaultMuted=true;video.loop=true;
    video.setAttribute('muted','');video.setAttribute('loop','');
    video.setAttribute('playsinline','');video.setAttribute('disablepictureinpicture','');
    video.setAttribute('controlslist','nodownload noplaybackrate nofullscreen');
  }
  window.addEventListener('resize',render);
  render();
})();

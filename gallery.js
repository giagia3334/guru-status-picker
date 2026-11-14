(()=>{
  const files=Array.from({length:17},(_,i)=>`bento-${String(i+1).padStart(2,'0')}.webp`);
  const items=[{type:'video',src:'guru-holding-film.mp4',poster:'video-poster.jpg',label:'Residence film'},...files.map((src,i)=>({type:'image',src,label:`Residence detail ${String(i+1).padStart(2,'0')}`}))];
  const stage=document.getElementById('guru-stack-stage');
  const prev=document.getElementById('guru-stack-prev');
  const next=document.getElementById('guru-stack-next');
  const counter=document.getElementById('guru-stack-counter');
  const lightbox=document.getElementById('reality-lightbox');
  if(!stage||!lightbox)return;
  const pic=lightbox.querySelector('.reality-lightbox-image');
  const count=lightbox.querySelector('.reality-lightbox-count');
  const n=items.length;
  let selected=0,lightIndex=0,restoreFocus=null,dragStart=null,dragging=false;
  const cards=items.map((item,i)=>{
    const card=document.createElement('div');
    card.className='guru-stack-card';
    card.dataset.index=i;
    card.setAttribute('aria-label',item.label);
    card.setAttribute('role','group');
    const media=item.type==='video'
      ? `<video playsinline muted preload="none" poster="${item.poster}" aria-label="Guru Status residence film"><source src="${item.src}" type="video/mp4"></video>`
      : `<img src="${item.src}" alt="Guru Status – ${item.label}" loading="lazy" decoding="async">`;
    card.innerHTML=`<div class="guru-stack-media">${media}</div>`;
    if(item.type==='video'){
      const video=card.querySelector('video');
      video.muted=true;
      video.defaultMuted=true;
      video.playsInline=true;
      video.loop=true;
      video.controls=false;
      video.setAttribute('muted','');
      video.setAttribute('playsinline','');
      card.addEventListener('click',()=>{ if(dragging) return; if(i!==selected) go(i); });
      video.addEventListener('ended',()=>card.classList.remove('is-playing'));
    }else{
      card.addEventListener('click',()=>{if(dragging)return;if(i!==selected)go(i);else open(i,card)});
    }
    stage.appendChild(card);return card;
  });
  const wrap=(v)=>((v%n)+n)%n;
  const stopVideos=(except=-1)=>cards.forEach((c,i)=>{if(i!==except){const v=c.querySelector('video');if(v&&!v.paused)v.pause();c.classList.remove('is-playing')}});
  function signedDistance(index,active){let d=index-active;if(d>n/2)d-=n;if(d< -n/2)d+=n;return d}
  function render(){
    const narrow=window.innerWidth<=650;
    const medium=window.innerWidth<=980;
    const step=narrow?94:medium?140:185;
    const scaleStep=narrow?.15:.12;
    cards.forEach((card,i)=>{
      const d=signedDistance(i,selected),a=Math.abs(d);
      const visible=a<=3;
      const scale=Math.max(.44,1-a*scaleStep);
      card.style.setProperty('--stack-x',`${d*step}px`);
      card.style.setProperty('--stack-scale',String(scale));
      card.style.setProperty('--stack-y',`${Math.min(a,3)*(narrow?7:10)}px`);
      card.style.setProperty('--stack-angle',`${d===0?0:-Math.sign(d)*Math.min(a*7,20)}deg`);
      card.style.setProperty('--stack-opacity',String(a>3?0:Math.max(.48,1-a*.135)));
      card.style.zIndex=String(20-a);
      card.classList.toggle('is-active',d===0);
      card.classList.toggle('is-hidden',!visible);
      card.setAttribute('aria-hidden',visible?'false':'true');
      card.style.pointerEvents=visible?'auto':'none';
    });
    if(counter) counter.textContent=`${String(selected+1).padStart(2,'0')} / ${String(n).padStart(2,'0')}`;
  }
  function syncActiveVideo(){
    const active=cards[selected];
    const video=active?.querySelector('video');
    if(video && stageInView){
      video.muted=true;
      video.defaultMuted=true;
      video.currentTime=video.currentTime||0;
      video.play().then(()=>active.classList.add('is-playing')).catch(()=>{});
    }else{
      stopVideos();
    }
  }
  function go(i){stopVideos();selected=wrap(i);render();syncActiveVideo()}
  prev?.addEventListener('click',()=>go(selected-1));next?.addEventListener('click',()=>go(selected+1));
  stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();go(selected-1)}else if(e.key==='ArrowRight'){e.preventDefault();go(selected+1)}});
  stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragStart={x:e.clientX,y:e.clientY};dragging=false});
  stage.addEventListener('pointerup',e=>{if(!dragStart)return;const dx=e.clientX-dragStart.x;const dy=e.clientY-dragStart.y;if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)){dragging=true;go(selected+(dx<0?1:-1));setTimeout(()=>dragging=false,70)}dragStart=null});
  stage.addEventListener('pointercancel',()=>dragStart=null);
  let wheelLocked=false;
  stage.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)*1.2 && Math.abs(e.deltaX)>12){e.preventDefault();if(wheelLocked)return;wheelLocked=true;go(selected+(e.deltaX>0?1:-1));setTimeout(()=>wheelLocked=false,300)}},{passive:false});

  let stageInView=false;
  const observer=new IntersectionObserver((entries)=>{
    const entry=entries[0];
    stageInView=!!entry?.isIntersecting && entry.intersectionRatio>=0.45;
    if(stageInView) syncActiveVideo();
    else stopVideos();
  },{threshold:[0,0.2,0.45,0.65]});
  observer.observe(stage);
  const open=(i,el)=>{lightIndex=i;restoreFocus=el;updateLight();lightbox.hidden=false;document.body.style.overflow='hidden';lightbox.querySelector('.reality-lightbox-close').focus()};
  const updateLight=()=>{const src=items[lightIndex];if(src.type==='video')return;pic.src=src.src;pic.alt=`Guru Status ${src.label}`;count.textContent=`${String(lightIndex+1).padStart(2,'0')} / ${n}`};
  const shiftLight=step=>{let i=wrap(lightIndex+step);if(items[i].type==='video')i=wrap(i+step);lightIndex=i;updateLight()};
  const close=()=>{lightbox.hidden=true;document.body.style.overflow='';pic.removeAttribute('src');restoreFocus?.focus()};
  lightbox.querySelector('.reality-lightbox-close').addEventListener('click',close);
  lightbox.querySelector('.reality-lightbox-prev').addEventListener('click',()=>shiftLight(-1));
  lightbox.querySelector('.reality-lightbox-next').addEventListener('click',()=>shiftLight(1));
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)close()});
  document.addEventListener('keydown',e=>{if(lightbox.hidden)return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')shiftLight(-1);else if(e.key==='ArrowRight')shiftLight(1)});
  window.addEventListener('resize',render,{passive:true});render();syncActiveVideo();
})();
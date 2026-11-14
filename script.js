const menu=document.querySelector('.menu-toggle');const links=document.querySelector('#site-nav');menu.addEventListener('click',()=>{let open=links.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Close menu':'Open menu')});links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.querySelector('#year').textContent=new Date().getFullYear();document.querySelector('#lead-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;const subject=encodeURIComponent('Guru Status — Private enquiry');const body=encodeURIComponent('Name: '+f.elements['name'].value+'\nPhone: '+f.elements['phone'].value+'\nInterested in: '+f.elements['interest'].value+'\n\nSent from the Guru Status website prototype');window.location.href='mailto:info@guruholding.ge?subject='+subject+'&body='+body;});


// Interactive, touch-friendly, keyboard-accessible finish comparison.
(() => {
  const stage=document.querySelector('#finish-comparison-visual');
  const slider=document.querySelector('#finish-slider');
  if(!stage || !slider) return;
  const defaultSplit=()=>matchMedia("(max-width: 760px)").matches?18:25;
  let value=defaultSplit();
  const setValue=(num)=>{
    value=Math.max(0,Math.min(100,Math.round(num)));
    stage.style.setProperty('--reveal',value+'%');
    slider.setAttribute('aria-valuenow',String(value));
    slider.setAttribute('aria-valuetext',value+' percent white-frame view; '+(100-value)+' percent turnkey view');
  };
  const fromPointer=(event)=>{
    const rect=stage.getBoundingClientRect();
    setValue(100*(event.clientX-rect.left)/rect.width);
  };
  let gesture=null;
  slider.addEventListener('pointerdown',event=>{
    if(!event.isPrimary || event.button!==0)return;
    gesture={id:event.pointerId,x:event.clientX,y:event.clientY,dragging:event.pointerType==='mouse'};
    slider.setPointerCapture(event.pointerId);
    if(gesture.dragging)fromPointer(event);
  });
  slider.addEventListener('pointermove',event=>{
    if(gesture?.id!==event.pointerId)return;
    if(!gesture.dragging){
      const dx=Math.abs(event.clientX-gesture.x),dy=Math.abs(event.clientY-gesture.y);
      if(dy>8 && dy>=dx){gesture=null;return;}
      if(dx<=8 || dx<=dy)return;
      gesture.dragging=true;
    }
    fromPointer(event);
  });
  for(const type of ['pointerup','pointercancel','lostpointercapture']){
    slider.addEventListener(type,event=>{
      if(gesture?.id===event.pointerId)gesture=null;
    });
  }
  setValue(value);
  slider.addEventListener('keydown',(event)=>{
    const steps={ArrowLeft:-2,ArrowDown:-2,ArrowRight:2,ArrowUp:2,PageDown:-10,PageUp:10};
    if(event.key in steps){event.preventDefault();setValue(value+steps[event.key])}
    if(event.key==='Home'){event.preventDefault();setValue(0)}
    if(event.key==='End'){event.preventDefault();setValue(100)}
  });

  const roomPairs={
    living:{before:'living-before.webp',after:'living-after.webp',label:'Living Space'},
    kitchen:{before:'kitchen-before.webp',after:'kitchen-after.webp',label:'Kitchen'},
    bathroom:{before:'bathroom-before.webp',after:'bathroom-after.webp',label:'Bathroom'}
  };
  const tabs=[...document.querySelectorAll('.finish-room-tab')];
  const beforeImage=stage.querySelector('.finish-before');
  const afterImage=stage.querySelector('.finish-after');
  let currentRoom='living';
  // Prefetch the paired files so switching is immediate, including from local HTML.
  Object.values(roomPairs).forEach(pair=>[pair.before,pair.after].forEach(src=>{const i=new Image();i.src=src;}));
  const showRoom=(room,focus=false)=>{
    if(!roomPairs[room] || room===currentRoom)return;
    const pair=roomPairs[room];
    currentRoom=room;
    beforeImage.src=pair.before;
    afterImage.src=pair.after;
    beforeImage.alt='White-frame '+pair.label.toLowerCase();
    afterImage.alt='Turnkey '+pair.label.toLowerCase();
    stage.setAttribute('aria-label',pair.label+': white frame compared with turnkey interior');
    slider.setAttribute('aria-label','Compare white frame and turnkey '+pair.label.toLowerCase());
    tabs.forEach(tab=>{
      const active=tab.dataset.room===room;
      tab.classList.toggle('is-active',active);
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
      if(active && focus) tab.focus();
    });
    setValue(defaultSplit());
  };
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>showRoom(tab.dataset.room));
    tab.addEventListener('keydown',(event)=>{
      let next=index;
      if(event.key==='ArrowRight')next=(index+1)%tabs.length;
      else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=tabs.length-1;
      else return;
      event.preventDefault();
      showRoom(tabs[next].dataset.room,true);
    });
  });
})();

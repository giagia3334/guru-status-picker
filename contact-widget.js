(()=>{
  const widget=document.getElementById('guru-contact-widget');
  if(!widget)return;
  const toggle=widget.querySelector('.guru-contact-toggle');
  const options=widget.querySelector('.guru-contact-options');
  const formLink=widget.querySelector('[data-contact-form]');
  const setOpen=(open)=>{
    widget.classList.toggle('is-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close contact options':'Open contact options');
    options.setAttribute('aria-hidden',String(!open));
    options.querySelectorAll('a').forEach(link=>link.tabIndex=open?0:-1);
  };
  setOpen(false);
  toggle.addEventListener('click',()=>setOpen(!widget.classList.contains('is-open')));
  document.addEventListener('pointerdown',event=>{if(!widget.contains(event.target))setOpen(false)});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&widget.classList.contains('is-open')){setOpen(false);toggle.focus()}});
  formLink.addEventListener('click',event=>{
    const form=document.querySelector('#lead-form');
    if(!form)return;
    event.preventDefault();setOpen(false);
    document.querySelector('#contact')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    history.replaceState(null,'','#contact');
    setTimeout(()=>form.querySelector('input')?.focus({preventScroll:true}),450);
  });
  widget.querySelector('[data-contact-whatsapp]')?.addEventListener('click',()=>setOpen(false));
})();

/* falkon.js – shared scripts v2 */
document.addEventListener('DOMContentLoaded', () => {

  /* ── PRELOADER ── */
  const pre = document.getElementById('preloader');
  if (pre) {
    window.addEventListener('load', () => {
      setTimeout(() => { pre.classList.add('hidden'); }, 300);
    });
    setTimeout(() => { pre.classList.add('hidden'); }, 1000);
  }

  /* ── CURSOR ── */
  const cur = document.createElement('div'); cur.className = 'cur';
  const ring = document.createElement('div'); ring.className = 'cur-ring';
  document.body.append(cur, ring);
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; cur.style.left=mx+'px'; cur.style.top=my+'px'; });
  (function animR(){ rx+=(mx-rx)*.11; ry+=(my-ry)*.11; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animR); })();
  document.querySelectorAll('a,button,.cat-card,.feat-cell,.tcard,.val-cell,.instr-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ cur.style.width='20px'; cur.style.height='20px'; cur.style.background='#c9885a'; ring.style.width='54px'; ring.style.height='54px'; });
    el.addEventListener('mouseleave',()=>{ cur.style.width='10px'; cur.style.height='10px'; cur.style.background='var(--red)'; ring.style.width='34px'; ring.style.height='34px'; });
  });

  /* ── NAVBAR ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    /* Pages with a light hero (.page-hero) and no dark .hero need dark text while at top */
    if (document.querySelector('.page-hero') && !document.querySelector('.hero')) {
      navbar.classList.add('nav-light');
    }
    const onScroll = ()=> navbar.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a=>{
      const href = a.getAttribute('href');
      if (href===path||(path===''&&href==='index.html')||(href&&!href.startsWith('http')&&href.includes(path))) a.classList.add('active');
    });
    document.querySelectorAll('.mobile-menu a').forEach(a=>{
      const href = a.getAttribute('href');
      if (href===path||(path===''&&href==='index.html')||(href&&!href.startsWith('http')&&href.includes(path))) a.classList.add('active');
    });
  }

  /* ── MOBILE MENU ── */
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu-close');
  if (burger && mobileMenu) {
    const toggle = ()=>{ burger.classList.toggle('open'); mobileMenu.classList.toggle('open'); document.body.style.overflow=mobileMenu.classList.contains('open')?'hidden':''; };
    burger.addEventListener('click', toggle);
    if (mobileClose) mobileClose.addEventListener('click', toggle);
    mobileMenu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=>{ mobileMenu.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow=''; }));
  }

  /* ── SCROLL REVEAL ── */
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('up'); });
  }, {threshold:.1});
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el=>obs.observe(el));

  /* ── COUNTERS ── */
  const cObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target, target=+el.dataset.target, dur=1800, t0=performance.now();
      const tick=now=>{
        const p=Math.min((now-t0)/dur,1), ep=1-Math.pow(1-p,3);
        el.textContent=Math.floor(ep*target);
        if(p<1) requestAnimationFrame(tick); else el.textContent=target;
      };
      requestAnimationFrame(tick);
      cObs.unobserve(el);
    });
  },{threshold:.5});
  document.querySelectorAll('.counter').forEach(el=>cObs.observe(el));

  /* ── STEPS STAGGER ── */
  const stepObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.querySelectorAll('.step-item').forEach((item,i)=> setTimeout(()=>item.classList.add('visible'),i*120));
      stepObs.unobserve(e.target);
    });
  },{threshold:.1});
  document.querySelectorAll('.steps-row').forEach(el=>stepObs.observe(el));

  /* ── CAT CARD 3D TILT ── */
  document.querySelectorAll('.cat-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width-.5)*6;
      const y=((e.clientY-r.top)/r.height-.5)*-5;
      card.style.transform=`perspective(900px) rotateY(${x}deg) rotateX(${y}deg)`;
    });
    card.addEventListener('mouseleave',()=>{ card.style.transform=''; card.style.transition='transform .6s cubic-bezier(.25,.46,.45,.94)'; });
    card.addEventListener('mouseenter',()=>{ card.style.transition='transform .1s'; });
  });

  /* ── ROAD DASHES ── */
  const dw = document.querySelector('.road-dash-strip');
  if(dw){ for(let i=0;i<28;i++){ const d=document.createElement('div'); d.className='road-dash-item'; dw.appendChild(d); } }

});

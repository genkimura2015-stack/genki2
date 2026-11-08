(() => {
  document.documentElement.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Mobile menu
  const burger = $('.burger'), menu = $('#menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Smooth scrolling (CSS handles it; this adds focus + hash update for older browsers)
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = $(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  }));

  // Scroll reveal
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));

  // Active nav highlighting
  const links = $$('nav a[href^="#"]:not(.btn)');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  // Course card interactions (touch / keyboard friendly)
  $$('.card[tabindex]').forEach(c => {
    c.addEventListener('touchstart', () => { $$('.card.hot').forEach(x => x.classList.remove('hot')); c.classList.add('hot'); }, { passive: true });
  });

  // Back to top
  const up = $('.up');
  addEventListener('scroll', () => up.classList.toggle('show', scrollY > 600), { passive: true });
  up.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Lightbox
  const lb = $('.lb'), body = $('.lb-body');
  let opener = null;
  const close = () => { lb.hidden = true; opener && opener.focus(); };
  $$('.tile').forEach(t => t.addEventListener('click', () => {
    opener = t;
    body.style.background = getComputedStyle(t).background;
    body.innerHTML = t.innerHTML;
    lb.hidden = false;
    $('.lb-x').focus();
  }));
  $('.lb-x').addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) close(); });
})();

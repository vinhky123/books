/* ============================================================
   DEEP WORK — sidebar, scroll-spy, mobile drawer
   ============================================================ */
(function () {
  'use strict';

  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('sidebarClose');

  /* ---- scrim for mobile drawer ---- */
  const scrim = document.createElement('div');
  scrim.className = 'scrim';
  document.body.appendChild(scrim);

  function openSidebar() { sidebar.classList.add('open'); scrim.classList.add('show'); }
  function closeSidebar() { sidebar.classList.remove('open'); scrim.classList.remove('show'); }

  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  scrim.addEventListener('click', closeSidebar);

  /* close drawer after clicking a link (mobile) */
  sidebar.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => { if (window.innerWidth <= 920) closeSidebar(); })
  );

  /* ---- reading progress ---- */
  const bar = document.getElementById('progressBar');
  function onScroll() {
    const h = document.documentElement;
    const pct = h.scrollHeight - h.clientHeight > 0
      ? (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 : 0;
    bar.style.width = pct + '%';
  }
  document.addEventListener('scroll', onScroll, { passive: true });

  /* ---- scroll-spy: highlight current item in sidebar ---- */
  const links = Array.from(sidebar.querySelectorAll('.tree a[href^="#"]'));
  const map = new Map();
  links.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        const link = map.get(entry.target);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  map.forEach((_, sec) => spy.observe(sec));

  /* ---- subtle reveal on scroll ---- */
  const revealEls = document.querySelectorAll('.compare__col, .insight, .vrm__item, .subblock, .philo-row, .tick, .odx__i, .bonus, .tl, .crit');
  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
  });
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        revealer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealer.observe(el));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  onScroll();
})();

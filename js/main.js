/* Luana Almeida — portfólio: rolagem fluida + animações */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasLib = window.gsap && window.ScrollTrigger;
  var lenis = null;

  // ---------- tema da barra superior ----------
  var body = document.body;
  function theme(t) {
    ['th-hero', 'th-or', 'th-dark', 'th-light'].forEach(function (c) { body.classList.remove(c); });
    body.classList.add('th-' + t);
  }
  theme('hero');

  if (!hasLib) { document.documentElement.classList.add('no-js'); return; }
  gsap.registerPlugin(ScrollTrigger);

  // ---------- rolagem suave ----------
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      var el = id.length > 1 && $(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { duration: 1.8, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
      else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // ---------- progresso, tema por seção, item ativo do menu ----------
  var bar = $('#progress');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) { bar.style.transform = 'scaleX(' + s.progress + ')'; } });
  [['.intro', 'or'], ['.about', 'light'], ['.purpose', 'dark'], ['.journey', 'light'],
    ['.skills', 'light'], ['.edu', 'light'], ['.services', 'dark'], ['.contact', 'or']].forEach(function (p) {
    ScrollTrigger.create({ trigger: p[0], start: 'top 40px', end: 'bottom 40px', onToggle: function (s) { if (s.isActive) theme(p[1]); } });
  });
  var navLinks = $$('.nav a');
  ['#quem-sou', '#trajetoria', '#competencias', '#formacao', '#servicos', '#contato'].forEach(function (id) {
    ScrollTrigger.create({ trigger: id, start: 'top 50%', end: 'bottom 50%', onToggle: function (s) {
      navLinks.forEach(function (a) { a.classList.toggle('on', s.isActive && a.getAttribute('href') === id); });
    } });
  });

  if (reduce) { return; }

  // ---------- HERO: entrada ----------
  var title = $('#heroTitle');
  gsap.set('#heroTitle b', { yPercent: 105, visibility: 'visible' });
  gsap.set('#heroPhoto', { yPercent: 8 });
  gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 })
    .to('#heroTitle b', { yPercent: 0, duration: 1.3, stagger: 0.12 })
    .to('#heroPhoto', { opacity: 1, yPercent: 0, duration: 1.4 }, 0.25)
    .to('#heroSub', { opacity: 1, duration: 1 }, 0.9)
    .to('#hint', { opacity: 1, duration: 1 }, 1.1);

  // ---------- HERO: a faixa laranja toma a tela ----------
  var mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', function () { heroScrub('inset(0% 56% 0% 0%)'); });
  mm.add('(max-width: 860px)', function () { heroScrub('inset(0% 0% 55% 0%)'); });
  function heroScrub(from) {
    gsap.set('#heroOrange', { clipPath: from });
    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.7,
        onUpdate: function (s) { if (s.isActive) theme(s.progress > 0.42 ? 'or' : 'hero'); } }
    });
    tl.to('#heroOrange', { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut' }, 0)
      .to('.hero-peach', { opacity: 0, duration: 0.4 }, 0.2)
      .to('#heroPhoto', { y: '-14vh', scale: 1.07, transformOrigin: '50% 100%', duration: 1 }, 0)
      .to('#heroUi', { opacity: 0, duration: 0.25 }, 0)
      .to(title, { color: '#ffffff', duration: 0.3 }, 0.35)
      .to(title, { y: '-30vh', opacity: 0, duration: 0.45 }, 0.55);
  }

  // ---------- frases que se acendem palavra por palavra ----------
  function split(el) {
    var txt = el.textContent.trim();
    el.setAttribute('aria-label', txt);
    el.innerHTML = txt.split(/\s+/).map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
    return $$('.w', el);
  }
  var introWords = split($('.intro .statement'));
  gsap.timeline({ scrollTrigger: { trigger: '.intro', start: 'top top', end: 'bottom bottom', scrub: 0.5 } })
    .to(introWords, { opacity: 1, ease: 'none', stagger: 0.09, duration: 0.2 })
    .to({}, { duration: 1.1 });

  var pWords = split($('.purpose .statement'));
  gsap.timeline({ scrollTrigger: { trigger: '.purpose', start: 'top top', end: 'bottom bottom', scrub: 0.5 } })
    .fromTo('#purposeImg', { scale: 1.3 }, { scale: 1, ease: 'none', duration: 3 }, 0)
    .to(pWords, { opacity: 1, ease: 'none', stagger: 0.12, duration: 0.2 }, 0)
    .to('#purposeSecond', { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8 }, '>-0.2')
    .to({}, { duration: 0.8 });

  // ---------- revelações (um gatilho por elemento: seguro mesmo com saltos de rolagem) ----------
  function reveal(sel, start, fn) {
    $$(sel).forEach(function (el, i) {
      var done = false;
      function go() { if (done) return; done = true; fn(el, i); }
      ScrollTrigger.create({ trigger: el, start: start, onEnter: go, onLeave: go });
    });
  }
  gsap.set('[data-title]', { opacity: 0, y: 50 });
  reveal('[data-title]', 'top 88%', function (el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' });
    el.classList.add('in');
  });
  reveal('.rv', 'top 90%', function (el) {
    var sib = $$('.rv', el.parentNode).indexOf(el);
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: Math.max(sib, 0) * 0.1 });
  });
  gsap.set('.ph', { clipPath: 'inset(100% 0% 0% 0%)' });
  reveal('.ph', 'top 92%', function (el) {
    var sib = $$('.ph', el.parentNode).indexOf(el);
    gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut', delay: Math.max(sib, 0) * 0.14 });
  });
  $$('.act-line').forEach(function (l) {
    gsap.fromTo(l, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: l, start: 'top 95%', once: true } });
  });

  // ---------- paralaxe ----------
  $$('.ph img, .skills-photo img, .contact-photo img').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('.chap-num').forEach(function (n) {
    gsap.fromTo(n, { y: 80 }, { y: -80, ease: 'none', scrollTrigger: { trigger: n.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  var aboutImg = $('.about-photo img');
  if (aboutImg) gsap.fromTo(aboutImg, { y: 40 }, { y: -20, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  mm.add('(min-width: 861px)', function () {
    $$('.collage').forEach(function (c) {
      $$('.ph', c).forEach(function (ph, i) {
        gsap.fromTo(ph, { y: i % 2 ? 50 : -10 }, { y: i % 2 ? -40 : 30, ease: 'none',
          scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
      });
    });
  });

  // ---------- faixa de competências (acelera com a rolagem) ----------
  var mq = $('#marquee');
  if (mq) {
    var tween = gsap.to(mq, { xPercent: -50, ease: 'none', duration: 38, repeat: -1 });
    ScrollTrigger.create({ trigger: '.skills', start: 'top bottom', end: 'bottom top', onUpdate: function (s) {
      var v = Math.min(Math.abs(s.getVelocity()) / 260, 7);
      gsap.to(tween, { timeScale: 1 + v, duration: 0.3, overwrite: true });
      gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.3, overwrite: false });
    } });
  }

  // ---------- "Obrigada" ----------
  gsap.from('#thanks', { yPercent: 40, opacity: 0, duration: 1.6, ease: 'power4.out', scrollTrigger: { trigger: '#thanks', start: 'top 95%', once: true } });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();

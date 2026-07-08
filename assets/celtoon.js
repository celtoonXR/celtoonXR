/* CELTOON — interações compartilhadas */
(function(){
  'use strict';

  var $ = function(sel){ return document.querySelector(sel); };

  // Navbar: esconde ao rolar para baixo, mostra ao rolar para cima
  (function navbarScroll(){
    var navbar = $('.navbar');
    if(!navbar) return;
    var lastScrollTop = 0;
    window.addEventListener('scroll', function(){
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 80) navbar.style.top = '-' + navbar.offsetHeight + 'px';
      else navbar.style.top = '0';
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
  })();

  // Menu mobile
  (function menuToggle(){
    var toggleBtn = $('.menu-toggle');
    var navLinks = $('.nav-links');
    if(!toggleBtn || !navLinks) return;
    toggleBtn.addEventListener('click', function(){
      navLinks.classList.toggle('active');
    });
  })();

  // Fade-in ao entrar na viewport
  (function initFadeIn(){
    var targets = document.querySelectorAll('.fade-in');
    if(!targets.length) return;
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function(t){ t.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function(el){ io.observe(el); });
  })();

})();

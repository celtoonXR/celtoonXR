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

  // Grid de pontinhos interativo nos heros ([data-dots])
  // Pontos apagam num degradê até a base da seção e acendem
  // (navy → roxo) conforme o mouse passa por cima.
  (function initHeroDots(){
    var hosts = document.querySelectorAll('[data-dots]');
    if(!hosts.length) return;

    hosts.forEach(function(host){
      var canvas = document.createElement('canvas');
      canvas.className = 'hero-dots';
      host.insertBefore(canvas, host.firstChild);
      var ctx = canvas.getContext('2d');
      var dots = [];
      var SPACING = 26;
      var RADIUS = 120;
      var mouse = { x: -9999, y: -9999 };

      function rebuild(){
        canvas.width = host.offsetWidth;
        canvas.height = host.offsetHeight;
        dots = [];
        for(var y = SPACING / 2; y < canvas.height; y += SPACING){
          for(var x = SPACING / 2; x < canvas.width; x += SPACING){
            dots.push({ x: x, y: y, glow: 0 });
          }
        }
      }
      rebuild();
      window.addEventListener('resize', rebuild);

      host.addEventListener('mousemove', function(e){
        var r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      });
      host.addEventListener('mouseleave', function(){
        mouse.x = -9999;
        mouse.y = -9999;
      });

      function frame(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var fadeStart = canvas.height * 0.5;
        var fadeSpan = canvas.height - fadeStart;
        for(var i = 0; i < dots.length; i++){
          var d = dots[i];
          var dx = d.x - mouse.x, dy = d.y - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var target = dist < RADIUS ? (1 - dist / RADIUS) : 0;
          d.glow += (target - d.glow) * (target > d.glow ? 0.35 : 0.06);

          var fade = d.y > fadeStart ? Math.max(0, 1 - (d.y - fadeStart) / fadeSpan) : 1;
          if(fade <= 0.02 && d.glow <= 0.02) continue;

          var g = d.glow;
          // interpola navy (#001a38) → roxo (#7000ff)
          var r_ = Math.round(g * 112);
          var g_ = Math.round(26 - g * 26);
          var b_ = Math.round(56 + g * 199);
          var alpha = (0.16 + 0.8 * g) * fade;
          ctx.fillStyle = 'rgba(' + r_ + ',' + g_ + ',' + b_ + ',' + alpha + ')';
          ctx.beginPath();
          ctx.arc(d.x, d.y, 1.5 + g * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        requestAnimationFrame(frame);
      }
      frame();
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

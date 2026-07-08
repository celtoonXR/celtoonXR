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

  // Lightbox: toque/clique em cards de imagem abre a imagem inteira
  // (object-fit: contain) sobre um fundo escuro. Apenas cards que não
  // são links — âncoras continuam navegando normalmente.
  (function initLightbox(){
    var cards = document.querySelectorAll('div.project-card, div.social-card');
    if(!cards.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Fechar imagem">&times;</button><img alt="">';
    document.body.appendChild(overlay);
    var full = overlay.querySelector('img');

    function open(src, alt){
      full.src = src;
      full.alt = alt || '';
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    overlay.addEventListener('click', function(e){
      if(e.target !== full) close();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') close();
    });

    cards.forEach(function(card){
      var img = card.querySelector('img');
      if(!img) return;
      card.style.cursor = 'zoom-in';
      card.addEventListener('click', function(){
        open(img.currentSrc || img.src, img.alt);
      });
    });
  })();

  // Carrossel genérico ([data-carousel]):
  // - .carousel-track rola com scroll-snap
  // - [data-carousel-prev]/[data-carousel-next] avançam por página
  // - .carousel-dots recebe bolinhas geradas por página
  // Controles somem quando todo o conteúdo cabe na tela.
  (function initCarousels(){
    var roots = document.querySelectorAll('[data-carousel]');
    roots.forEach(function(root){
      var track = root.querySelector('.carousel-track');
      if(!track) return;
      var prev = root.querySelector('[data-carousel-prev]');
      var next = root.querySelector('[data-carousel-next]');
      var dotsWrap = root.querySelector('.carousel-dots');

      function pages(){
        return Math.max(1, Math.round(track.scrollWidth / track.clientWidth));
      }
      function page(){
        return Math.min(pages() - 1, Math.round(track.scrollLeft / track.clientWidth));
      }
      function goTo(p){
        track.scrollTo({ left: p * track.clientWidth, behavior: 'smooth' });
      }
      function update(){
        var n = pages(), p = page();
        var overflow = track.scrollWidth > track.clientWidth + 4;
        if(prev){ prev.disabled = p <= 0; prev.style.display = overflow ? '' : 'none'; }
        if(next){ next.disabled = p >= n - 1; next.style.display = overflow ? '' : 'none'; }
        if(dotsWrap){
          Array.prototype.forEach.call(dotsWrap.children, function(d, i){
            d.classList.toggle('active', i === p);
          });
        }
      }
      function buildDots(){
        if(dotsWrap){
          dotsWrap.innerHTML = '';
          var n = pages();
          // muitas páginas = bolinhas viram ruído; só as setas ficam
          if(n > 1 && n <= 10){
            for(var i = 0; i < n; i++){
              (function(i){
                var b = document.createElement('button');
                b.type = 'button';
                b.setAttribute('aria-label', 'Ir para página ' + (i + 1));
                b.addEventListener('click', function(){ goTo(i); });
                dotsWrap.appendChild(b);
              })(i);
            }
          }
        }
        update();
      }

      if(prev) prev.addEventListener('click', function(e){ e.preventDefault(); goTo(page() - 1); });
      if(next) next.addEventListener('click', function(e){ e.preventDefault(); goTo(page() + 1); });
      track.addEventListener('scroll', function(){ requestAnimationFrame(update); }, { passive: true });
      window.addEventListener('resize', buildDots);
      window.addEventListener('load', buildDots);
      buildDots();
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
          var el = entry.target;
          el.classList.add('visible');
          obs.unobserve(el);
          // Após a entrada, remove .fade-in para que o transform fixado
          // por .js .fade-in.visible não bloqueie efeitos de hover
          // (ex.: .service-card:hover { translateY(-8px) }).
          setTimeout(function(){ el.classList.remove('fade-in'); }, 900);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function(el){ io.observe(el); });
  })();

})();

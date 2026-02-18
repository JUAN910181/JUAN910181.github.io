/* ═══════════════════════════════════════════
   Six Unique Card Hover Effects
   ═══════════════════════════════════════════ */
(function(){
  document.addEventListener('DOMContentLoaded', function() {
    initArtPrism();
    initMarketingSlides();
    initVideoPlayback();
    initEcommerceSheen();
    initTempleParticles();
    initDigitalNetwork();
  });

  /* ────────────────────────────────────────
     Card 1: Art Practice — Prism Shift + Random Preview
     ──────────────────────────────────────── */
  function initArtPrism() {
    var card = document.querySelector('.card-1');
    if (!card) return;
    var fx = card.querySelector('.card-fx');
    if (!fx) return;

    var previewIndex = 0;
    var previewImgs = [];

    // Create prism layers
    var prismLayer = document.createElement('div');
    prismLayer.className = 'prism-layer';
    var prismR = document.createElement('div');
    prismR.className = 'prism-r';
    var prismB = document.createElement('div');
    prismB.className = 'prism-b';
    prismLayer.appendChild(prismR);
    prismLayer.appendChild(prismB);
    fx.appendChild(prismLayer);

    // Create preview image element
    var previewEl = document.createElement('img');
    previewEl.className = 'preview-img';
    previewEl.alt = '';
    fx.appendChild(previewEl);

    // Set prism background from main card image
    var mainImg = card.querySelector('.card-img');
    if (mainImg) {
      var src = mainImg.src;
      prismR.style.backgroundImage = 'url(' + src + ')';
      prismB.style.backgroundImage = 'url(' + src + ')';
    }

    // Preload hover preview images
    if (typeof HOVER_PREVIEW_IMAGES !== 'undefined' && HOVER_PREVIEW_IMAGES.length > 0) {
      HOVER_PREVIEW_IMAGES.forEach(function(src) {
        var img = new Image();
        img.src = src;
        previewImgs.push(img);
      });
    }

    card.addEventListener('mouseenter', function() {
      if (previewImgs.length > 0) {
        previewEl.src = previewImgs[previewIndex].src;
        previewEl.classList.add('active');
        previewIndex = (previewIndex + 1) % previewImgs.length;
      }
    });
    card.addEventListener('mouseleave', function() {
      previewEl.classList.remove('active');
    });
  }

  /* ────────────────────────────────────────
     Card 2: Marketing — Digital Distortion + Slideshow
     ──────────────────────────────────────── */
  function initMarketingSlides() {
    var card = document.querySelector('.card-2');
    if (!card) return;
    var fx = card.querySelector('.card-fx');
    if (!fx) return;

    var slideImgs = [];
    var slideEls = [];
    var currentSlide = 0;
    var slideInterval = null;

    // Create slide image elements
    if (typeof MARKETING_SLIDES !== 'undefined' && MARKETING_SLIDES.length > 0) {
      MARKETING_SLIDES.forEach(function(src, i) {
        var img = document.createElement('img');
        img.className = 'slide-img' + (i === 0 ? ' active' : '');
        img.src = src;
        img.alt = '';
        fx.appendChild(img);
        slideEls.push(img);
      });
    }

    function nextSlide() {
      if (slideEls.length < 2) return;
      slideEls[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slideEls.length;
      slideEls[currentSlide].classList.add('active');
    }

    card.addEventListener('mouseenter', function() {
      if (slideEls.length > 0) {
        slideInterval = setInterval(nextSlide, 2000);
      }
    });
    card.addEventListener('mouseleave', function() {
      clearInterval(slideInterval);
      // Reset to first slide
      slideEls.forEach(function(el, i) {
        el.classList.toggle('active', i === 0);
      });
      currentSlide = 0;
    });
  }

  /* ────────────────────────────────────────
     Card 3: Video — Aperture Focus + Video Playback
     ──────────────────────────────────────── */
  function initVideoPlayback() {
    var card = document.querySelector('.card-3');
    if (!card) return;
    var fx = card.querySelector('.card-fx');
    if (!fx) return;

    // Create aperture mask
    var mask = document.createElement('div');
    mask.className = 'aperture-mask';
    fx.appendChild(mask);

    // Create video element
    if (typeof VIDEO_HOVER_SRC !== 'undefined' && VIDEO_HOVER_SRC) {
      var video = document.createElement('video');
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.src = VIDEO_HOVER_SRC;
      fx.appendChild(video);

      card.addEventListener('mouseenter', function() {
        video.currentTime = 0;
        video.play().catch(function(){});
      });
      card.addEventListener('mouseleave', function() {
        video.pause();
      });
    }
  }

  /* ────────────────────────────────────────
     Card 4: E-Commerce — Scanning Sheen
     ──────────────────────────────────────── */
  function initEcommerceSheen() {
    var card = document.querySelector('.card-4');
    if (!card) return;
    var fx = card.querySelector('.card-fx');
    if (!fx) return;

    var sheen = document.createElement('div');
    sheen.className = 'sheen';
    fx.appendChild(sheen);

    // Reset animation on each hover
    card.addEventListener('mouseenter', function() {
      sheen.style.animation = 'none';
      void sheen.offsetWidth; // reflow
      sheen.style.animation = '';
    });
  }

  /* ────────────────────────────────────────
     Card 5: Temple — Golden Particle Flow
     ──────────────────────────────────────── */
  function initTempleParticles() {
    var card = document.querySelector('.card-5');
    if (!card) return;
    var fx = card.querySelector('.card-fx');
    if (!fx) return;

    var canvas = document.createElement('canvas');
    fx.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var particles = [];
    var hovering = false;
    var raf = null;

    function resizeCanvas() {
      var rect = card.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function spawnParticle() {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(0.5 + Math.random() * 1.2),
        size: 1 + Math.random() * 2,
        life: 0,
        maxLife: 2 + Math.random() * 2,
        // Golden warm color
        r: 255, g: 180 + Math.random() * 60, b: 80 + Math.random() * 40
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hovering && particles.length < 40) {
        spawnParticle();
        if (Math.random() > 0.5) spawnParticle();
      }

      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.life += 0.016;
        if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }

        p.x += p.vx + Math.sin(p.life * 2) * 0.3;
        p.y += p.vy;
        p.vy *= 0.998;

        var lifeRatio = p.life / p.maxLife;
        var alpha = lifeRatio < 0.1 ? lifeRatio * 10 : (1 - lifeRatio);
        alpha *= 0.4;

        // Glow
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        g.addColorStop(0, 'rgba('+p.r+','+p.g+','+p.b+','+alpha*0.4+')');
        g.addColorStop(1, 'rgba('+p.r+','+p.g+','+p.b+',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI*2); ctx.fill();

        // Core
        ctx.fillStyle = 'rgba('+p.r+','+p.g+','+p.b+','+alpha*0.8+')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI*2); ctx.fill();
      }

      if (hovering || particles.length > 0) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = null;
      }
    }

    card.addEventListener('mouseenter', function() {
      hovering = true;
      resizeCanvas();
      if (!raf) raf = requestAnimationFrame(animate);
    });
    card.addEventListener('mouseleave', function() {
      hovering = false;
    });
  }

  /* ────────────────────────────────────────
     Card 6: Digital Lab — Neural Network (Vector Trace)
     ──────────────────────────────────────── */
  function initDigitalNetwork() {
    var card = document.querySelector('.card-6');
    if (!card) return;
    var fx = card.querySelector('.card-fx');
    if (!fx) return;

    var canvas = document.createElement('canvas');
    fx.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var nodes = [];
    var hovering = false;
    var raf = null;
    var NODE_COUNT = 14;
    var CONNECT_DIST = 120;

    function resizeCanvas() {
      var rect = card.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function initNodes() {
      nodes = [];
      for (var i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: 1.5 + Math.random() * 1.5,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & draw nodes
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;

        // Bounce off edges
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        var pulseAlpha = 0.3 + Math.sin(n.pulse) * 0.15;

        // Node glow
        var g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.size * 4);
        g.addColorStop(0, 'rgba(224,255,240,'+pulseAlpha*0.4+')');
        g.addColorStop(1, 'rgba(224,255,240,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.size * 4, 0, Math.PI*2); ctx.fill();

        // Node core
        ctx.fillStyle = 'rgba(224,255,240,'+pulseAlpha*0.8+')';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.size, 0, Math.PI*2); ctx.fill();
      }

      // Draw connections
      ctx.lineWidth = 0.6;
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < CONNECT_DIST) {
            var alpha = (1 - dist / CONNECT_DIST) * 0.15;
            ctx.strokeStyle = 'rgba(224,255,240,'+alpha+')';
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      if (hovering) {
        raf = requestAnimationFrame(animate);
      } else {
        // Fade out by reducing node alpha gradually
        var anyVisible = false;
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].size > 0.1) { anyVisible = true; break; }
        }
        if (anyVisible) {
          nodes.forEach(function(n) { n.size *= 0.95; });
          raf = requestAnimationFrame(animate);
        } else {
          raf = null;
        }
      }
    }

    card.addEventListener('mouseenter', function() {
      hovering = true;
      resizeCanvas();
      initNodes();
      if (!raf) raf = requestAnimationFrame(animate);
    });
    card.addEventListener('mouseleave', function() {
      hovering = false;
    });
  }

})();

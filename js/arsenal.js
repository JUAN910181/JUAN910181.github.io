/* ═══════════════════════════════════════════
   ARSENAL — 滑順輪播 (Transform-based Carousel)
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  var wrapper, track;

  /* ── Drag / Momentum State ── */
  var posX = 0;           // current translateX position
  var isDragging = false;
  var dragStartX = 0;
  var dragStartPos = 0;
  var velX = 0;
  var prevX = 0;
  var prevTime = 0;
  var rafId = null;

  window.initArsenal = function () {
    wrapper = document.getElementById('arsenalTrack');
    if (!wrapper) return;

    /* Create inner track element for transform */
    renderCards();
    initDragCarousel();
    initWheelScroll();
    initScrollAnimation();
  };

  /* ── Render Tool Cards ── */

  function renderCards() {
    var currentCategory = '';
    var html = '';

    html += '<div class="arsenal-track-inner">';

    TOOLS_DATA.forEach(function (tool) {
      if (tool.category !== currentCategory) {
        currentCategory = tool.category;
        html += '<div class="tool-category-label">' + currentCategory + '</div>';
      }

      html += '<div class="tool-card" data-tool="' + tool.name + '">';
      html += '  <div class="tool-card-inner">';
      html += '    <div class="tool-card-face">';
      html += '      <span class="tool-card-abbr">' + tool.abbr + '</span>';
      html += '      <span class="tool-card-name">' + tool.name + '</span>';
      html += '    </div>';
      html += '  </div>';
      html += '</div>';
    });

    html += '</div>';

    wrapper.innerHTML = html;
    track = wrapper.querySelector('.arsenal-track-inner');
  }

  /* ── Clamp position within bounds ── */

  function getMinX() {
    var trackW = track.scrollWidth;
    var wrapperW = wrapper.clientWidth;
    return -(trackW - wrapperW);
  }

  function clamp(val) {
    var minX = getMinX();
    if (val > 0) return 0;
    if (val < minX) return minX;
    return val;
  }

  function setPosition(x) {
    posX = x;
    track.style.transform = 'translateX(' + x + 'px)';
  }

  /* ── Drag Carousel ── */

  function initDragCarousel() {

    wrapper.addEventListener('pointerdown', function (e) {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartPos = posX;
      prevX = e.clientX;
      prevTime = Date.now();
      velX = 0;

      stopMomentum();

      // Remove transition during drag for instant response
      track.style.transition = 'none';
      wrapper.classList.add('is-dragging');
      wrapper.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    wrapper.addEventListener('pointermove', function (e) {
      if (!isDragging) return;

      var now = Date.now();
      var dt = now - prevTime;
      var dx = e.clientX - prevX;

      // Track velocity
      if (dt > 0) {
        velX = dx / dt; // px per ms
      }

      prevX = e.clientX;
      prevTime = now;

      // Move track
      var diff = e.clientX - dragStartX;
      var newPos = dragStartPos + diff;

      // Rubber-band effect at edges
      var minX = getMinX();
      if (newPos > 0) {
        newPos = newPos * 0.3;
      } else if (newPos < minX) {
        newPos = minX + (newPos - minX) * 0.3;
      }

      setPosition(newPos);
    });

    wrapper.addEventListener('pointerup', onDragEnd);
    wrapper.addEventListener('pointercancel', onDragEnd);

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      wrapper.classList.remove('is-dragging');

      // Snap back if out of bounds
      var minX = getMinX();
      if (posX > 0 || posX < minX) {
        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        setPosition(clamp(posX));
        return;
      }

      // Launch momentum
      startMomentum();
    }

    // Prevent accidental clicks after drag
    wrapper.addEventListener('click', function (e) {
      if (Math.abs(velX) > 0.02) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  /* ── Momentum (inertia) ── */

  function startMomentum() {
    var speed = velX * 16;   // px per ms → px per frame (~16ms)
    var friction = 0.94;

    function step() {
      speed *= friction;

      if (Math.abs(speed) < 0.3) {
        rafId = null;
        return;
      }

      var newPos = posX + speed;
      var minX = getMinX();

      // Stop at edges with gentle snap
      if (newPos > 0 || newPos < minX) {
        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        setPosition(clamp(newPos));
        rafId = null;
        return;
      }

      setPosition(newPos);
      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
  }

  function stopMomentum() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  /* ── Mouse Wheel → horizontal scroll ── */

  function initWheelScroll() {
    wrapper.addEventListener('wheel', function (e) {
      e.preventDefault();
      stopMomentum();

      var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      var newPos = clamp(posX - delta);
      setPosition(newPos);
    }, { passive: false });
  }

  /* ── GSAP Scroll Animation ── */

  function initScrollAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    var cards = FX.qsa('.tool-card', wrapper);
    cards.forEach(function (card, i) {
      gsap.fromTo(card,
        { y: 30, opacity: 0, rotateY: -90 },
        {
          y: 0, opacity: 1, rotateY: 0,
          duration: 0.6,
          delay: i * 0.06,
          ease: 'back.out(1.5)',
          immediateRender: false,
          scrollTrigger: {
            trigger: '#sectionArsenal',
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

})();

/* ═══════════════════════════════════════════
   SHARED EFFECTS & UTILITIES
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Math Utilities ── */

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function mapRange(value, inMin, inMax, outMin, outMax) {
    return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
  }

  function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  /* ── DOM Utilities ── */

  function qs(sel, parent) {
    return (parent || document).querySelector(sel);
  }

  function qsa(sel, parent) {
    return Array.from((parent || document).querySelectorAll(sel));
  }

  /* ── Debounce / Throttle ── */

  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function throttle(fn, ms) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= ms) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  /* ── Intersection Observer for Entrance Animations ── */

  function observeEntrance(selector, options = {}) {
    const {
      threshold = 0.15,
      rootMargin = '0px 0px -60px 0px',
      className = 'is-visible',
      once = true
    } = options;

    const elements = qsa(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          entry.target.classList.remove(className);
        }
      });
    }, { threshold, rootMargin });

    elements.forEach(el => observer.observe(el));
    return observer;
  }

  /* ── Ripple Effect ── */

  function createRipple(element, color) {
    color = color || 'var(--electric-blue)';
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 2;

    Object.assign(ripple.style, {
      position: 'absolute',
      width: size + 'px',
      height: size + 'px',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%) scale(0)',
      borderRadius: '50%',
      background: color,
      opacity: '0.3',
      pointerEvents: 'none',
      transition: 'transform 0.6s ease-out, opacity 0.6s ease-out'
    });

    element.style.position = element.style.position || 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.transform = 'translate(-50%, -50%) scale(1)';
      ripple.style.opacity = '0';
    });

    setTimeout(() => ripple.remove(), 700);
  }

  /* ── Mouse Tracker ── */

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  /* ── Export ── */

  window.FX = {
    lerp,
    clamp,
    mapRange,
    distance,
    qs,
    qsa,
    debounce,
    throttle,
    observeEntrance,
    createRipple,
    mouse
  };

})();

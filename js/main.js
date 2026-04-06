/* ═══════════════════════════════════════════
   MAIN — Entry Point & Orchestrator
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── App State ── */
  var savedView = sessionStorage.getItem('appView') || 'hero';
  window.AppState = {
    view: savedView,
    profileShown: false
  };

  /* Persist view changes */
  var _origView = Object.getOwnPropertyDescriptor(window.AppState, 'view');
  Object.defineProperty(window.AppState, 'view', {
    get: function () { return this._view || 'hero'; },
    set: function (v) { this._view = v; sessionStorage.setItem('appView', v); },
    configurable: true
  });
  window.AppState.view = savedView;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    /* Register GSAP plugins */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    /* Body starts locked (hero only) */
    document.body.classList.add('is-locked');

    /* Initialize all modules */
    if (window.initScanner)  window.initScanner();
    if (window.initArsenal)  window.initArsenal();
    if (window.initCategories) window.initCategories();
    if (window.initGallery)  window.initGallery();
    if (window.initAbout)    window.initAbout();

    /* Back to Top */
    initBackToTop();

    /* Restore view after reload — immediate to prevent hero flash */
    if (savedView === 'profile') {
      if (window.openProfileOverlay) window.openProfileOverlay();
    } else if (savedView === 'categories') {
      /* Add no-transition to prevent hero flash during restore */
      var catSection = document.getElementById('sectionCategories');
      if (catSection) catSection.classList.add('no-transition');
      if (window.openCategoriesOverlay) window.openCategoriesOverlay();
      /* Remove no-transition after paint so future transitions work */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (catSection) catSection.classList.remove('no-transition');
        });
      });
    } else if (savedView === 'gallery') {
      if (window.openGalleryOverlay) window.openGalleryOverlay();
    }

    /* Global ESC key handler */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        // Priority: lightbox > gallery overlay > profile overlay
        var lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('is-open')) return; // lightbox handles its own ESC

        if (window.AppState.view === 'gallery' && window.closeGalleryOverlay) {
          window.closeGalleryOverlay();
        } else if (window.AppState.view === 'categories' && window.closeCategoriesOverlay) {
          window.closeCategoriesOverlay();
        } else if (window.AppState.view === 'profile' && window.closeProfileOverlay) {
          window.closeProfileOverlay();
        }
      }
    });
  }

  /* ── Back to Top ── */

  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', FX.throttle(function () {
      if (window.scrollY > window.innerHeight * 0.8) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }, 100));

    btn.addEventListener('click', function () {
      FX.createRipple(btn, 'var(--electric-blue-dim)');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* Hover ripple */
    btn.addEventListener('mouseenter', function () {
      var rippleEl = btn.querySelector('.btt-ripple');
      if (rippleEl) rippleEl.classList.add('is-active');
    });
    btn.addEventListener('mouseleave', function () {
      var rippleEl = btn.querySelector('.btt-ripple');
      if (rippleEl) rippleEl.classList.remove('is-active');
    });
  }

})();

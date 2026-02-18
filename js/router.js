/* ═══════════════════════════════════════════
   SPA Router — Hash-based
   ═══════════════════════════════════════════ */
(function(){
  const ROUTES = {
    '':          'section-home',
    'works':     null, // handled by category sub-routes
    'about':     'section-about'
  };

  const TITLES = {
    '':           'Portfolio',
    'about':      '個人經歷 | Portfolio',
    'works/art':        '藝術實踐 | Portfolio',
    'works/marketing':  '行銷宣傳 | Portfolio',
    'works/video':      '影音相關 | Portfolio',
    'works/ecommerce':  '電商相關 | Portfolio',
    'works/temple':     '宮廟傳統 | Portfolio',
    'works/digital':    '流程專業 | Portfolio'
  };

  function getHash() {
    return location.hash.replace(/^#\/?/, '').replace(/\/$/, '');
  }

  function hideAllSections() {
    document.querySelectorAll('.page-section').forEach(function(s) {
      s.classList.add('hidden');
      s.classList.remove('fade-out');
    });
  }

  function showSection(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.remove('hidden');
      // Trigger reflow for fade-in
      void el.offsetWidth;
    }
  }

  function navigate() {
    var hash = getHash();
    var sections = document.querySelectorAll('.page-section:not(.hidden)');

    // Update page title
    document.title = TITLES[hash] || 'Portfolio';

    // Determine target section
    var targetId;
    if (hash === '' || hash === '/') {
      targetId = 'section-home';
    } else if (hash === 'about') {
      targetId = 'section-about';
    } else if (hash.startsWith('works/')) {
      targetId = 'section-works';
    } else {
      targetId = 'section-home';
    }

    // Fade out current, then switch
    if (sections.length > 0) {
      var current = sections[0];
      if (current.id === targetId) {
        // Same section, might need to update works content
        if (targetId === 'section-works' && typeof window.renderWorks === 'function') {
          var cat = hash.replace('works/', '');
          window.renderWorks(cat);
        }
        return;
      }
      current.classList.add('fade-out');
      setTimeout(function() {
        hideAllSections();
        showSection(targetId);

        // Initialize page-specific content
        if (targetId === 'section-works' && typeof window.renderWorks === 'function') {
          var cat = hash.replace('works/', '');
          window.renderWorks(cat);
        }
        if (targetId === 'section-about' && typeof window.initAbout === 'function') {
          window.initAbout();
        }

        // Re-initialize cursor hover targets
        if (typeof window.refreshCursorTargets === 'function') {
          window.refreshCursorTargets();
        }
        // Re-initialize tilt for cards
        if (typeof window.refreshTilt === 'function') {
          window.refreshTilt();
        }
      }, 300);
    } else {
      hideAllSections();
      showSection(targetId);
      if (targetId === 'section-works' && typeof window.renderWorks === 'function') {
        var cat = hash.replace('works/', '');
        window.renderWorks(cat);
      }
      if (targetId === 'section-about' && typeof window.initAbout === 'function') {
        window.initAbout();
      }
    }
  }

  // Card click → navigate to works page
  function setupCardLinks() {
    var cardMap = {
      'card-1': 'works/art',
      'card-2': 'works/marketing',
      'card-3': 'works/video',
      'card-4': 'works/ecommerce',
      'card-5': 'works/temple',
      'card-6': 'works/digital'
    };
    Object.keys(cardMap).forEach(function(cls) {
      var card = document.querySelector('.' + cls);
      if (card) {
        card.style.cursor = 'none';
        card.addEventListener('click', function() {
          location.hash = '#/' + cardMap[cls];
        });
      }
    });
  }

  // Avatar click → navigate to about page (from home) or home (from elsewhere)
  function setupAvatarLink() {
    var avatar = document.querySelector('.avatar-wrapper');
    if (avatar) {
      avatar.addEventListener('click', function() {
        var hash = getHash();
        if (hash === '' || hash === '/') {
          location.hash = '#/about';
        } else {
          location.hash = '#/';
        }
      });
    }
  }

  // Initialize
  window.addEventListener('hashchange', navigate);
  document.addEventListener('DOMContentLoaded', function() {
    setupCardLinks();
    setupAvatarLink();
    navigate();
  });

  // Expose for external use
  window.navigateTo = function(hash) {
    location.hash = '#/' + hash;
  };
})();

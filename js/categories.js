/* ═══════════════════════════════════════════
   CATEGORIES — Work Category Selection Page
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  var section;
  var isOpen = false;

  window.initCategories = function () {
    section = document.getElementById('sectionCategories');
    if (!section) return;

    /* Build category cards */
    var grid = section.querySelector('.categories-grid');
    if (!grid) return;

    var keys = Object.keys(CATEGORY_INFO);
    var html = '';

    keys.forEach(function (key, i) {
      var cat = CATEGORY_INFO[key];
      var count = WORKS_DATA[key] ? WORKS_DATA[key].length : 0;
      var num = String(i + 1).padStart(2, '0');

      html += '<div class="category-card" data-category="' + key + '">';
      /* Vertical text (visible when collapsed) */
      html += '  <span class="card-vertical-text">' + cat.title + '</span>';
      /* Bottom icon */
      html += '  <span class="card-bottom-icon"><img src="image/姓名logo設計_白.png" alt="" style="width:110%; height:110%; object-fit:contain; opacity:0.1;"></span>';
      /* Expanded content (visible on hover) */
      html += '  <div class="card-expanded">';
      html += '    <span class="card-expanded-number">' + num + '</span>';
      html += '    <span class="card-expanded-count">' + count + ' works</span>';
      html += '    <div class="card-expanded-title">' + cat.title + '</div>';
      html += '    <div class="card-expanded-subtitle">' + cat.subtitle + '</div>';
      html += '    <div class="card-expanded-tagline">' + cat.tagline + '</div>';
      html += '  </div>';
      html += '</div>';
    });

    grid.innerHTML = html;

    /* Card click → open gallery with that category */
    var cards = grid.querySelectorAll('.category-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var cat = this.getAttribute('data-category');
        closeCategoriesOverlay(function () {
          if (window.openGalleryOverlay) {
            window.openGalleryOverlay(cat);
          }
        });
      });
    });
  };

  /* ── Open ── */

  window.openCategoriesOverlay = function () {
    if (isOpen || !section) return;
    isOpen = true;
    window.AppState.view = 'categories';

    /* Show overlay */
    section.classList.add('is-open');

    /* Force reflow then trigger transitions */
    section.offsetHeight;

    /* Stagger card entrance */
    var cards = section.querySelectorAll('.category-card');
    cards.forEach(function (card, i) {
      card.classList.remove('is-visible');
      setTimeout(function () {
        card.classList.add('is-visible');
      }, 200 + i * 100);
    });

    /* Append home avatar to body */
    var existing = document.getElementById('categoriesHomeAvatar');
    if (!existing) {
      var avatarDiv = document.createElement('div');
      avatarDiv.id = 'categoriesHomeAvatar';
      avatarDiv.style.cssText = 'position:fixed; top:24px; left:24px; z-index:99999; width:48px; height:48px; cursor:pointer;';
      avatarDiv.innerHTML = '<img src="image/姓名logo設計_白.png" alt="Back to Home" style="width:100%; height:100%; object-fit:contain; border-radius:50%; transition:transform 0.3s ease;">';
      document.body.appendChild(avatarDiv);

      avatarDiv.addEventListener('click', function () {
        /* Save current view so profile can return here */
        sessionStorage.setItem('profileReturnView', 'categories');
        /* Open profile FIRST (behind categories), then hide categories */
        if (window.openProfileOverlay) window.openProfileOverlay();
        /* Clean up and hide categories after profile is visible */
        var av = document.getElementById('categoriesHomeAvatar');
        var bk = document.getElementById('categoriesBackBtn');
        if (av) av.remove();
        if (bk) bk.remove();
        setTimeout(function () {
          section.classList.remove('is-open', 'is-fading');
          isOpen = false;
          var cards = section.querySelectorAll('.category-card');
          cards.forEach(function (card) { card.classList.remove('is-visible'); });
        }, 300);
      });
      avatarDiv.addEventListener('mouseenter', function () {
        this.querySelector('img').style.transform = 'scale(1.1)';
      });
      avatarDiv.addEventListener('mouseleave', function () {
        this.querySelector('img').style.transform = 'none';
      });
    }

    /* Append back-to-home button — aurora style, aligned with header bottom */
    var existingBack = document.getElementById('categoriesBackBtn');
    if (!existingBack) {
      var backBtn = document.createElement('button');
      backBtn.id = 'categoriesBackBtn';
      backBtn.className = 'aurora-scroll-top';
      backBtn.setAttribute('aria-label', 'Back to home');
      backBtn.style.cssText = 'position:fixed; bottom:auto; right:auto; top:90px; left:24px; z-index:99999;';
      backBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
      document.body.appendChild(backBtn);

      backBtn.addEventListener('click', function () {
        closeCategoriesOverlay();
      });
    }
  };

  /* ── Close ── */

  function closeCategoriesOverlay(callback) {
    if (!isOpen || !section) return;

    /* Clean up avatar and back button */
    var avatar = document.getElementById('categoriesHomeAvatar');
    var backBtn = document.getElementById('categoriesBackBtn');
    if (avatar) avatar.remove();
    if (backBtn) backBtn.remove();

    if (callback) {
      /* Navigating to gallery — keep categories visible as backdrop,
         let gallery open on top, then clean up categories after a short delay */
      isOpen = false;
      callback();

      /* Delay removal so gallery covers the screen first */
      setTimeout(function () {
        section.classList.remove('is-open', 'is-fading');
        var cards = section.querySelectorAll('.category-card');
        cards.forEach(function (card) {
          card.classList.remove('is-visible');
        });
      }, 300);
    } else {
      /* Going back to hero — fade out */
      section.classList.add('is-fading');

      setTimeout(function () {
        section.classList.remove('is-open', 'is-fading');
        isOpen = false;

        var cards = section.querySelectorAll('.category-card');
        cards.forEach(function (card) {
          card.classList.remove('is-visible');
        });

        window.AppState.view = 'hero';
      }, 500);
    }
  }

  window.closeCategoriesOverlay = closeCategoriesOverlay;

})();

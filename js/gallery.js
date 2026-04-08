/* ═══════════════════════════════════════════
   GALLERY — Glass Matrix 標本盒佈局
   + Overlay fly-out animation from folder
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  var grid, filtersContainer, labelsLeft, labelsRight, section, closeBtn;
  var activeCategory = 'all';
  var lightbox = {};
  var isOverlayOpen = false;

  window.initGallery = function () {
    grid = document.getElementById('galleryGrid');
    filtersContainer = document.getElementById('galleryFilters');
    labelsLeft = document.getElementById('galleryLabelsLeft');
    labelsRight = document.getElementById('galleryLabelsRight');
    section = document.getElementById('sectionGallery');
    closeBtn = document.getElementById('galleryClose');

    if (!grid) return;

    renderFilters();
    renderSideLabels();
    renderGallery('all');
    initLightbox();

    /* Close button */
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (window.closeGalleryOverlay) window.closeGalleryOverlay();
      });
    }

    /* Home avatar — will be created dynamically when gallery opens */
  };

  /* ═══════════════════════════════════════════
     OVERLAY — Open (fly-out from folder)
     ═══════════════════════════════════════════ */

  window.openGalleryOverlay = function (category) {
    if (isOverlayOpen || !section || !grid) return;
    isOverlayOpen = true;
    window.AppState.view = 'gallery';

    /* Determine which category to show */
    var filterCat = category || sessionStorage.getItem('galleryCategory') || 'all';
    sessionStorage.setItem('galleryCategory', filterCat);

    /* Check if coming from categories (heroFolder not visible) — skip fly animation */
    var heroFolder = document.getElementById('heroFolder');
    var skipFlyAnimation = !heroFolder || heroFolder.offsetParent === null || window.AppState._view === 'gallery';
    var folderRect = (!skipFlyAnimation && heroFolder) ? heroFolder.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    var cx = folderRect.left + folderRect.width / 2;
    var cy = folderRect.top + folderRect.height / 2;

    /* Step 1: Show overlay with opacity 0 to measure grid positions */
    section.classList.remove('scene--hidden');
    section.classList.add('is-overlay');
    section.style.opacity = '0';

    /* Render gallery with category filter */
    renderGallery(filterCat);

    /* Populate subtitle + breadcrumb */
    var subtitleEl = document.getElementById('gallerySubtitle');
    var breadcrumbEl = document.getElementById('galleryBreadcrumb');
    if (subtitleEl && CATEGORY_INFO[filterCat]) {
      var catInfo = CATEGORY_INFO[filterCat];
      subtitleEl.innerHTML = catInfo.title + ' <span class="gallery-subtitle-en">' + catInfo.subtitle + '</span>';
    } else if (subtitleEl) {
      subtitleEl.innerHTML = '';
    }
    if (breadcrumbEl && CATEGORY_INFO[filterCat]) {
      var catInfo2 = CATEGORY_INFO[filterCat];
      breadcrumbEl.innerHTML =
        '<span class="breadcrumb-item breadcrumb-link" data-nav="home">首頁</span>' +
        '<span class="breadcrumb-sep">›</span>' +
        '<span class="breadcrumb-item breadcrumb-link" data-nav="categories">作品輯錄</span>' +
        '<span class="breadcrumb-sep">›</span>' +
        '<span class="breadcrumb-item breadcrumb-current">' + catInfo2.title + '</span>';

      /* Breadcrumb navigation */
      breadcrumbEl.querySelectorAll('.breadcrumb-link').forEach(function (link) {
        link.addEventListener('click', function () {
          var nav = this.getAttribute('data-nav');
          if (nav === 'home') {
            /* Close gallery → go to hero */
            var ga = document.getElementById('galleryHomeAvatar');
            var gb = document.getElementById('galleryBackBtn');
            var gs = document.getElementById('galleryScrollTop');
            if (ga) ga.remove(); if (gb) gb.remove(); if (gs) gs.remove();
            section.classList.add('is-fading');
            setTimeout(function () {
              section.classList.remove('is-overlay', 'is-fading', 'cards-landed');
              section.classList.add('scene--hidden');
              isOverlayOpen = false;
              window.AppState.view = 'hero';
            }, 400);
          } else if (nav === 'categories') {
            if (window.closeGalleryOverlay) window.closeGalleryOverlay();
          }
        });
      });
    } else if (breadcrumbEl) {
      breadcrumbEl.innerHTML = '';
    }

    /* Sync filter buttons */
    if (filtersContainer) {
      var btns = FX.qsa('[data-cat]', filtersContainer);
      btns.forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-cat') === filterCat);
      });
    }

    /* Force layout so we can measure */
    section.offsetHeight;

    var cards = FX.qsa('.gallery-item', grid);

    /* If coming from categories, skip fly animation entirely — just show */
    if (skipFlyAnimation) {
      section.style.opacity = '';
      section.classList.add('cards-landed');
      if (closeBtn) closeBtn.classList.add('is-visible');
      cards.forEach(function (card) { card.classList.add('is-visible'); });

      /* Delay masonry until overlay is fully visible */
      setTimeout(function () {
        layoutMasonry();
        setupGalleryUI(section, filterCat);
      }, 100);
      return;
    }

    /* Step 2: Measure each card's final position in the grid */
    var finalRects = [];
    cards.forEach(function (card) {
      card.classList.add('is-visible');
      var r = card.getBoundingClientRect();
      finalRects.push({ left: r.left, top: r.top, width: r.width, height: r.height });
    });

    /* Step 3: Set all cards to folder center, stacked */
    if (true) {
      var cardSize = 40;
      cards.forEach(function (card, i) {
        var randomRot = (Math.random() - 0.5) * 30;
        card.style.position = 'fixed';
        card.style.left = (cx - cardSize / 2) + 'px';
        card.style.top = (cy - cardSize / 2) + 'px';
        card.style.width = cardSize + 'px';
        card.style.height = cardSize + 'px';
        card.style.opacity = '0.6';
        card.style.transform = 'rotate(' + randomRot + 'deg)';
        card.style.zIndex = '45';
        card.style.borderRadius = '4px';
        card.style.transition = 'none';
      });
    }

    /* Step 4: Show overlay background */
    section.style.opacity = '';

    /* Step 5: After a beat, fly all cards simultaneously to final positions */
    var flyDelay = skipFlyAnimation ? 0 : 850;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (!skipFlyAnimation) {
          cards.forEach(function (card, i) {
            var f = finalRects[i];
            card.style.transition = 'left 0.8s cubic-bezier(0.16, 1, 0.3, 1), ' +
                                    'top 0.8s cubic-bezier(0.16, 1, 0.3, 1), ' +
                                    'width 0.8s cubic-bezier(0.16, 1, 0.3, 1), ' +
                                    'height 0.8s cubic-bezier(0.16, 1, 0.3, 1), ' +
                                    'opacity 0.8s ease, ' +
                                    'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.left = f.left + 'px';
            card.style.top = f.top + 'px';
            card.style.width = f.width + 'px';
            card.style.height = f.height + 'px';
            card.style.opacity = '1';
            card.style.transform = 'rotate(0deg)';
          });
        }

        /* Step 6: After flight, restore to masonry layout.
           Use transitionend on the first card instead of setTimeout —
           iPad Safari throttles timers and may never fire on time. */
        function restoreCards() {
          cards.forEach(function (card) {
            card.style.position = '';
            card.style.left = '';
            card.style.top = '';
            card.style.width = '';
            card.style.opacity = '';
            card.style.transform = '';
            card.style.zIndex = '';
            card.style.borderRadius = '';
            card.style.transition = '';
            card.style.height = '';
          });

          /* Re-run masonry now that grid is visible */
          layoutMasonry();

          /* Show header, filters, close button */
          section.classList.add('cards-landed');
          if (closeBtn) closeBtn.classList.add('is-visible');

          /* Set up gallery UI elements */
          setupGalleryUI(section, filterCat);
        }

        if (skipFlyAnimation) {
          restoreCards();
        } else {
          var restored = false;
          function onceRestore() {
            if (restored) return;
            restored = true;
            restoreCards();
          }

          /* Primary: listen for transition end on first card */
          if (cards.length > 0) {
            cards[0].addEventListener('transitionend', function handler(e) {
              /* Only react to our fly properties, not child transitions */
              if (e.target === cards[0]) {
                cards[0].removeEventListener('transitionend', handler);
                onceRestore();
              }
            });
          }

          /* Fallback: in case transitionend doesn't fire (iPad edge case) */
          setTimeout(onceRestore, 1200);
        }
      });
    });
  };

  /* ═══════════════════════════════════════════
     OVERLAY — Close (simple fade out)
     ═══════════════════════════════════════════ */

  window.closeGalleryOverlay = function () {
    if (!isOverlayOpen || !section) return;

    /* Hide close button immediately */
    if (closeBtn) closeBtn.classList.remove('is-visible');

    /* Clean up fixed elements */
    var galleryAvatar = document.getElementById('galleryHomeAvatar');
    var galleryBackBtn = document.getElementById('galleryBackBtn');
    var galleryScrollTop = document.getElementById('galleryScrollTop');
    if (galleryAvatar) galleryAvatar.remove();
    if (galleryBackBtn) galleryBackBtn.remove();
    if (galleryScrollTop) galleryScrollTop.remove();

    /* Open categories FIRST (behind gallery) so it's ready when gallery fades */
    if (window.openCategoriesOverlay) {
      window.openCategoriesOverlay();
    }

    /* Fade out gallery overlay (categories is now behind it) */
    section.classList.add('is-fading');

    var onFaded = function () {
      section.removeEventListener('transitionend', onFaded);
      section.classList.remove('is-overlay', 'is-fading', 'cards-landed');
      section.classList.add('scene--hidden');
      isOverlayOpen = false;

      if (!window.openCategoriesOverlay) {
        window.AppState.view = 'hero';
      }
    };

    section.addEventListener('transitionend', onFaded);

    /* Fallback timeout in case transitionend doesn't fire */
    setTimeout(function () {
      if (isOverlayOpen) onFaded();
    }, 500);
  };

  /* ── Render Filter Buttons ── */

  function renderFilters() {
    if (!filtersContainer) return;

    var html = '<button class="filter-btn is-active" data-cat="all">All</button>';
    GALLERY_LABELS.forEach(function (cat) {
      var count = (WORKS_DATA[cat.id] || []).length;
      if (count > 0) {
        html += '<button class="filter-btn" data-cat="' + cat.id + '">' +
                cat.zh + ' <span style="opacity:0.4">(' + count + ')</span></button>';
      }
    });
    filtersContainer.innerHTML = html;

    /* Filter click events */
    FX.qsa('.filter-btn', filtersContainer).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.cat;
        FX.qsa('.filter-btn', filtersContainer).forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        renderGallery(cat);
      });
    });
  }

  /* ── Render Side Labels ── */

  function renderSideLabels() {
    if (!labelsLeft) return;

    var html = '';
    GALLERY_LABELS.forEach(function (cat) {
      html += '<div class="gallery-label" data-cat="' + cat.id + '">' +
              cat.label +
              '<span class="label-zh">' + cat.zh + '</span>' +
              '</div>';
    });
    labelsLeft.innerHTML = html;

    /* Click to filter */
    FX.qsa('.gallery-label', labelsLeft).forEach(function (label) {
      label.addEventListener('click', function () {
        var cat = label.dataset.cat;
        activeCategory = cat;

        /* Update filter buttons */
        FX.qsa('.filter-btn', filtersContainer).forEach(function (b) {
          b.classList.toggle('is-active', b.dataset.cat === cat);
        });

        /* Update side labels */
        FX.qsa('.gallery-label', labelsLeft).forEach(function (l) {
          l.classList.toggle('is-active', l.dataset.cat === cat);
        });

        renderGallery(cat);
      });
    });
  }

  /* ── Render Gallery Items ── */

  /* ═══ Gallery UI Setup (avatar, back btn, scroll-to-top) ═══ */

  function setupGalleryUI(sect, filterCat) {
    /* Home avatar */
    var existingAvatar = document.getElementById('galleryHomeAvatar');
    if (!existingAvatar) {
      var avatarDiv = document.createElement('div');
      avatarDiv.id = 'galleryHomeAvatar';
      avatarDiv.style.cssText = 'position:fixed; top:24px; left:24px; z-index:99999; width:48px; height:48px; cursor:pointer;';
      avatarDiv.innerHTML = '<img src="image/姓名logo設計_白.png" alt="Back to Home" style="width:100%; height:100%; object-fit:contain; border-radius:50%; transition:transform 0.3s ease;">';
      document.body.appendChild(avatarDiv);

      avatarDiv.addEventListener('click', function () {
        /* Save current view so profile can return here */
        sessionStorage.setItem('profileReturnView', 'gallery');
        sessionStorage.setItem('galleryCategory', activeCategory);

        var ga = document.getElementById('galleryHomeAvatar');
        var gb = document.getElementById('galleryBackBtn');
        var gs = document.getElementById('galleryScrollTop');
        if (ga) ga.remove(); if (gb) gb.remove(); if (gs) gs.remove();

        /* Open profile FIRST (behind gallery), then fade out gallery */
        if (window.openProfileOverlay) window.openProfileOverlay();

        sect.classList.add('is-fading');
        setTimeout(function () {
          sect.classList.remove('is-overlay', 'is-fading', 'cards-landed');
          sect.classList.add('scene--hidden');
          isOverlayOpen = false;
        }, 400);
      });
      avatarDiv.addEventListener('mouseenter', function () {
        this.querySelector('img').style.transform = 'scale(1.1)';
      });
      avatarDiv.addEventListener('mouseleave', function () {
        this.querySelector('img').style.transform = 'none';
      });
    }

    /* Back-to-categories button */
    var existingBack = document.getElementById('galleryBackBtn');
    if (!existingBack) {
      var backBtn = document.createElement('button');
      backBtn.id = 'galleryBackBtn';
      backBtn.className = 'aurora-scroll-top';
      backBtn.setAttribute('aria-label', 'Back to categories');
      backBtn.style.cssText = 'position:fixed; bottom:auto; right:auto; top:90px; left:24px; z-index:99999;';
      backBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
      document.body.appendChild(backBtn);

      backBtn.addEventListener('click', function () {
        if (window.closeGalleryOverlay) window.closeGalleryOverlay();
      });
    }

    /* Scroll-to-top button */
    var existingScrollTop = document.getElementById('galleryScrollTop');
    if (!existingScrollTop) {
      var scrollBtn = document.createElement('button');
      scrollBtn.id = 'galleryScrollTop';
      scrollBtn.className = 'aurora-scroll-top';
      scrollBtn.setAttribute('aria-label', 'Scroll to top');
      scrollBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
      document.body.appendChild(scrollBtn);

      scrollBtn.addEventListener('click', function () {
        sect.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ═══ JS Masonry Layout ═══ */

  function getColumnCount() {
    var w = window.innerWidth;
    if (w <= 600) return 2;
    if (w <= 900) return 3;
    if (w <= 1200) return 4;
    return 5;
  }

  function layoutMasonry() {
    if (!grid) return;
    var items = grid.querySelectorAll('.gallery-item');
    if (items.length === 0) return;

    var cols = getColumnCount();
    var gap = 16;
    var gridWidth = grid.clientWidth;
    var colWidth = (gridWidth - gap * (cols - 1)) / cols;
    var colHeights = [];
    for (var c = 0; c < cols; c++) colHeights.push(0);

    /* Wait for images to load, then position */
    var loaded = 0;
    var total = items.length;

    function positionItem(item, idx) {
      /* Find shortest column */
      var minH = colHeights[0], minCol = 0;
      for (var c = 1; c < cols; c++) {
        if (colHeights[c] < minH) { minH = colHeights[c]; minCol = c; }
      }

      var x = minCol * (colWidth + gap);
      var y = colHeights[minCol];

      item.style.left = x + 'px';
      item.style.top = y + 'px';
      item.style.width = colWidth + 'px';

      /* Get actual rendered height */
      var h = item.offsetHeight;
      colHeights[minCol] += h + gap;
    }

    function layoutAll() {
      /* Reset heights */
      for (var c = 0; c < cols; c++) colHeights[c] = 0;
      var gridWidth2 = grid.clientWidth;
      colWidth = (gridWidth2 - gap * (cols - 1)) / cols;

      for (var i = 0; i < items.length; i++) {
        items[i].style.width = colWidth + 'px';
      }
      /* Force reflow so heights are correct */
      grid.offsetHeight;

      for (var i = 0; i < items.length; i++) {
        positionItem(items[i], i);
      }

      /* Set grid height */
      var maxH = 0;
      for (var c = 0; c < cols; c++) {
        if (colHeights[c] > maxH) maxH = colHeights[c];
      }
      grid.style.height = maxH + 'px';
    }

    /* Initial layout */
    layoutAll();

    /* Re-layout after each image loads */
    items.forEach(function (item) {
      var img = item.querySelector('.item-image');
      if (img) {
        if (img.complete) {
          /* Already loaded */
        } else {
          img.addEventListener('load', function () {
            layoutAll();
          });
          img.addEventListener('error', function () {
            layoutAll();
          });
        }
      }
    });

    /* Re-layout on resize */
    if (!window._galleryResizeHandler) {
      window._galleryResizeHandler = function () {
        if (isOverlayOpen) layoutAll();
      };
      window.addEventListener('resize', window._galleryResizeHandler);
    }
  }

  function renderGallery(category) {
    activeCategory = category;
    var items = [];

    if (category === 'all') {
      Object.keys(WORKS_DATA).forEach(function (catKey) {
        WORKS_DATA[catKey].forEach(function (work) {
          items.push({ work: work, category: catKey });
        });
      });
    } else {
      (WORKS_DATA[category] || []).forEach(function (work) {
        items.push({ work: work, category: category });
      });
    }

    if (items.length === 0) {
      grid.innerHTML = '<div class="gallery-empty">此分類尚無作品</div>';
      return;
    }

    var html = '';
    items.forEach(function (item, index) {
      var work = item.work;
      var cover = work.images[0] || '';

      html += '<div class="gallery-item" data-index="' + index + '" data-category="' + item.category + '">';
      html += '  <div class="item-image-wrap">';
      if (cover.indexOf('youtube:') === 0) {
        var ytId = cover.replace('youtube:', '');
        html += '    <img class="item-image" src="https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg" alt="' + work.title + '" loading="lazy">';
        html += '    <div class="item-play-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="white"><polygon points="5 3 19 12 5 21"/></svg></div>';
      } else {
        var coverExt = cover.split('.').pop().toLowerCase().split('?')[0];
        if (coverExt === 'mp4') {
          html += '    <video class="item-image" src="' + cover + '#t=0.5" muted loop playsinline preload="auto"></video>';
          html += '    <div class="item-play-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="white"><polygon points="5 3 19 12 5 21"/></svg></div>';
        } else {
          html += '    <img class="item-image" src="' + cover + '" alt="' + work.title + '" loading="lazy"';
          html += '         onerror="this.src=\'https://picsum.photos/id/' + (1010 + index) + '/600/400\'">';
        }
      }
      html += '  </div>';
      html += '  <div class="item-frost"></div>';
      html += '  <div class="item-content">';
      html += '    <div class="item-title">' + work.title + '</div>';
      html += '    <div class="item-tags">';
      work.tags.forEach(function (tag) {
        html += '    <span class="item-tag">' + tag + '</span>';
      });
      html += '    </div>';
      html += '  </div>';
      html += '</div>';
    });

    grid.innerHTML = html;

    /* JS Masonry — maintains source order (left-to-right, shortest column) */
    layoutMasonry();

    /* Init interactions for new items */
    initItemInteractions(items);

    /* Entrance animation (only when not in overlay fly-out mode) */
    if (!isOverlayOpen) {
      requestAnimationFrame(function () {
        FX.qsa('.gallery-item', grid).forEach(function (el, i) {
          setTimeout(function () {
            el.classList.add('is-visible');
          }, 60 + i * 80);
        });
      });
    }
  }

  /* ── Item Mouse Interactions ── */

  /* Detect touch device (iPad reports hover:hover but has touch) */
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function initItemInteractions(items) {
    FX.qsa('.gallery-item', grid).forEach(function (item, i) {

      if (isTouch) {
        /* ── Touch: tap to reveal, second tap to open lightbox ── */
        item.addEventListener('click', function (e) {
          if (item.classList.contains('is-touched')) {
            /* Already revealed → open lightbox */
            var idx = parseInt(item.dataset.index, 10);
            openLightbox(items[idx].work);
          } else {
            /* First tap → reveal info, clear others */
            e.preventDefault();
            FX.qsa('.gallery-item.is-touched', grid).forEach(function (el) {
              el.classList.remove('is-touched');
            });
            item.classList.add('is-touched');
          }
        });
      } else {
        /* ── Mouse: original behavior ── */

        /* Mouse-relative image shift */
        item.addEventListener('mousemove', function (e) {
          var rect = item.getBoundingClientRect();
          var mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          var my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          item.style.setProperty('--mx', mx.toFixed(3));
          item.style.setProperty('--my', my.toFixed(3));
        });

        item.addEventListener('mouseleave', function () {
          item.style.setProperty('--mx', '0');
          item.style.setProperty('--my', '0');
          /* Pause video on mouse leave */
          var vid = item.querySelector('video.item-image');
          if (vid) { vid.pause(); vid.currentTime = 0.5; }
        });

        /* Hover play for video cards */
        item.addEventListener('mouseenter', function () {
          var vid = item.querySelector('video.item-image');
          if (vid) { vid.currentTime = 0; vid.play(); }
        });

        /* Click to open lightbox */
        item.addEventListener('click', function () {
          var idx = parseInt(item.dataset.index, 10);
          openLightbox(items[idx].work);
        });
      }
    });

    /* Touch: tap outside cards to clear .is-touched */
    if (isTouch) {
      document.addEventListener('click', function (e) {
        if (!e.target.closest('.gallery-item')) {
          FX.qsa('.gallery-item.is-touched', grid).forEach(function (el) {
            el.classList.remove('is-touched');
          });
        }
      });
    }
  }

  /* ═══ LIGHTBOX ═══ */

  function initLightbox() {
    lightbox.el = document.getElementById('lightbox');
    lightbox.media = document.getElementById('lightboxMedia');
    lightbox.title = document.getElementById('lightboxTitle');
    lightbox.tags = document.getElementById('lightboxTags');
    lightbox.desc = document.getElementById('lightboxDesc');
    lightbox.dots = document.getElementById('lightboxDots');
    lightbox.close = document.getElementById('lightboxClose');
    lightbox.prev = document.getElementById('lightboxPrev');
    lightbox.next = document.getElementById('lightboxNext');

    if (!lightbox.el) return;

    lightbox.close.addEventListener('click', closeLightbox);
    lightbox.prev.addEventListener('click', function () { navigateLightbox(-1); });
    lightbox.next.addEventListener('click', function () { navigateLightbox(1); });

    lightbox.el.addEventListener('click', function (e) {
      if (e.target === lightbox.el || e.target.classList.contains('lightbox-body')) {
        closeLightbox();
      }
    });

    /* Keyboard navigation */
    document.addEventListener('keydown', function (e) {
      if (!lightbox.el.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    /* Touch swipe navigation */
    var touchStartX = 0;
    var touchStartY = 0;
    var isSwiping = false;

    lightbox.el.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
      isSwiping = true;
    }, { passive: true });

    lightbox.el.addEventListener('touchend', function (e) {
      if (!isSwiping) return;
      isSwiping = false;
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      /* Only trigger if horizontal swipe > 50px and more horizontal than vertical */
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) navigateLightbox(1);   /* swipe left → next */
        else navigateLightbox(-1);          /* swipe right → prev */
      }
    }, { passive: true });
  }

  lightbox.currentWork = null;
  lightbox.currentIndex = 0;

  function openLightbox(work) {
    lightbox.currentWork = work;
    lightbox.currentIndex = 0;

    updateLightboxContent();
    lightbox.el.classList.add('is-open');
    lightbox.el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    /* Stop any playing video or YouTube iframe */
    var vid = lightbox.media.querySelector('video');
    if (vid) { vid.pause(); vid.src = ''; }
    var yt = lightbox.media.querySelector('iframe');
    if (yt) { yt.src = ''; }
    lightbox.media.innerHTML = '';

    lightbox.el.classList.remove('is-open');
    lightbox.el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    if (!lightbox.currentWork) return;
    var total = lightbox.currentWork.images.length;
    lightbox.currentIndex = (lightbox.currentIndex + dir + total) % total;
    updateLightboxContent();
  }

  function updateLightboxContent() {
    var work = lightbox.currentWork;
    if (!work) return;

    /* Render media based on file type */
    var mediaSrc = work.images[lightbox.currentIndex];

    if (mediaSrc.indexOf('youtube:') === 0) {
      /* YouTube embed */
      var ytId = mediaSrc.replace('youtube:', '');
      lightbox.media.innerHTML = '<iframe class="lightbox-img lightbox-youtube" src="https://www.youtube.com/embed/' + ytId + '?autoplay=1&rel=0&modestbranding=1&origin=' + encodeURIComponent(window.location.origin) + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>' +
        '<a href="https://www.youtube.com/watch?v=' + ytId + '" target="_blank" rel="noopener" style="display:block; text-align:center; margin-top:12px; color:rgba(89,194,255,0.8); font-size:0.85rem; text-decoration:none;">無法播放？點此前往 YouTube 觀看 ↗</a>';
    } else {
      var ext = mediaSrc.split('.').pop().toLowerCase().split('?')[0];
      if (ext === 'mp4') {
        lightbox.media.innerHTML = '<video class="lightbox-img" src="' + mediaSrc + '" controls autoplay loop muted playsinline></video>';
      } else {
        lightbox.media.innerHTML = '<img class="lightbox-img" src="' + mediaSrc + '" alt="' + work.title + '">';
      }
    }

    lightbox.title.textContent = work.title;
    lightbox.desc.textContent = work.desc || '';

    /* Tags */
    var tagsHtml = '';
    work.tags.forEach(function (tag) {
      tagsHtml += '<span class="item-tag">' + tag + '</span>';
    });
    lightbox.tags.innerHTML = tagsHtml;

    /* Dots */
    var dotsHtml = '';
    for (var i = 0; i < work.images.length; i++) {
      dotsHtml += '<span class="lightbox-dot' + (i === lightbox.currentIndex ? ' is-active' : '') +
                  '" data-idx="' + i + '"></span>';
    }
    lightbox.dots.innerHTML = dotsHtml;

    /* Dot clicks */
    FX.qsa('.lightbox-dot', lightbox.dots).forEach(function (dot) {
      dot.addEventListener('click', function () {
        lightbox.currentIndex = parseInt(dot.dataset.idx, 10);
        updateLightboxContent();
      });
    });

    /* Hide nav if only one image */
    var single = work.images.length <= 1;
    lightbox.prev.style.display = single ? 'none' : '';
    lightbox.next.style.display = single ? 'none' : '';
    lightbox.dots.style.display = single ? 'none' : '';
  }

})();

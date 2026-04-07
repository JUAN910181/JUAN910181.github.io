/* ═══════════════════════════════════════════
   ABOUT — Bio Overlay + Timeline
   + Profile Overlay (Arsenal + Timeline)
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  var bioOverlay, bioContent, avatarTrigger;
  var bioTimeout = null;
  var isOpen = false;

  /* Profile overlay elements */
  var profileOverlay, profileClose, profileContent;

  window.initAbout = function () {
    initBio();
    initTimeline();
    initProfileOverlay();
  };

  /* ═══ BIO OVERLAY ═══ */

  function initBio() {
    bioOverlay  = document.getElementById('bioOverlay');
    bioContent  = document.getElementById('bioContent');
    avatarTrigger = document.getElementById('avatarTrigger');

    if (!bioOverlay || !avatarTrigger) return;

    /* Build bio content */
    var lines = BIO_TEXT.split('\n').filter(function (l) { return l.trim(); });
    var html = '<div class="bio-text">';
    lines.forEach(function (line) {
      html += '<p class="bio-line">' + line + '</p>';
    });
    html += '</div>';
    html += '<div class="bio-close-hint">click to view profile</div>';
    bioContent.innerHTML = html;

    /* Events — click: open profile directly */
    avatarTrigger.addEventListener('click', function () {
      sessionStorage.setItem('profileReturnView', 'hero');
      if (window.openProfileOverlay) window.openProfileOverlay();
    });
  }

  function toggleBio() {
    if (isOpen) {
      closeBio();
    } else {
      openBio();
    }
  }

  function openBio() {
    if (isOpen) return;
    isOpen = true;
    bioOverlay.classList.add('is-active');
    bioOverlay.classList.remove('is-dissolving');
    bioOverlay.setAttribute('aria-hidden', 'false');

    /* Stagger bio lines */
    var lines = FX.qsa('.bio-line', bioOverlay);
    lines.forEach(function (line, i) {
      line.classList.remove('is-visible');
      setTimeout(function () {
        line.classList.add('is-visible');
      }, 300 + i * 200);
    });

    /* Auto-dismiss after 8 seconds */
    clearTimeout(bioTimeout);
    bioTimeout = setTimeout(function () {
      if (isOpen) closeBio();
    }, 8000);
  }

  function closeBio() {
    if (!isOpen) return;
    isOpen = false;
    clearTimeout(bioTimeout);

    /* Smoke dissolve */
    bioOverlay.classList.add('is-dissolving');

    setTimeout(function () {
      bioOverlay.classList.remove('is-active');
      bioOverlay.classList.remove('is-dissolving');
      bioOverlay.setAttribute('aria-hidden', 'true');

      /* Reset lines */
      FX.qsa('.bio-line', bioOverlay).forEach(function (line) {
        line.classList.remove('is-visible');
      });

    }, 1200);
  }

  /* ═══ PROFILE OVERLAY (Arsenal + Timeline) ═══ */

  function initProfileOverlay() {
    profileOverlay = document.getElementById('profileOverlay');
    profileClose = document.getElementById('profileClose');
    profileContent = document.getElementById('profileContent');

    if (!profileOverlay) return;

    /* Close button */
    if (profileClose) {
      profileClose.addEventListener('click', function () {
        if (window.closeProfileOverlay) window.closeProfileOverlay();
      });
    }

    /* Click overlay background to close */
    profileOverlay.addEventListener('click', function (e) {
      if (e.target === profileOverlay) {
        if (window.closeProfileOverlay) window.closeProfileOverlay();
      }
    });
  }

  window.openProfileOverlay = function () {
    if (!profileOverlay || !profileContent) return;
    window.AppState.view = 'profile';

    /* Build content: Arsenal + Timeline */
    var html = '';

    /* Arsenal section — infinite loop carousel */
    html += '<div class="profile-section">';
    html += '  <div class="arsenal-header" style="text-align:center; margin-bottom:40px;">';
    html += '    <span class="section-label">Professional Tools</span>';
    html += '    <h2 class="section-title">擅長工具</h2>';
    html += '  </div>';
    html += '  <div id="arsenalCarousel" style="position:relative; display:flex; align-items:center; justify-content:center; gap:24px; height:130px; cursor:grab; user-select:none; overflow:hidden; max-width:100%; margin:0 auto; width:100%; padding:0 20px;">';
    /* 7 visible slots */
    for (var s = 0; s < 7; s++) {
      var slotW = (s === 3) ? '90px' : '70px'; /* center slot wider to fit scale(1.3) */
      var slotH = (s === 3) ? '90px' : '70px';
      html += '<div class="carousel-slot" data-slot="' + s + '" style="flex-shrink:0; width:' + slotW + '; height:' + slotH + '; display:flex; align-items:center; justify-content:center;"></div>';
    }
    html += '  </div>';
    html += '</div>';

    /* Timeline section */
    html += '<div class="profile-section" style="margin-top:80px;">';
    html += '  <div class="about-header" style="text-align:center; margin-bottom:60px;">';
    html += '    <span class="section-label">Work Experience</span>';
    html += '    <h2 class="section-title">工作歷程</h2>';
    html += '  </div>';
    html += '  <div class="timeline-container" style="position:relative; max-width:800px; margin:0 auto; padding-left:40px;">';
    html += '    <div class="timeline-rail"></div>';

    TIMELINE_DATA.forEach(function (ch) {
      html += '<div class="timeline-chapter">';
      html += '  <div class="timeline-node">';
      html += '    <div class="timeline-dot is-active"></div>';
      html += '  </div>';
      html += '  <div class="timeline-card glass-panel">';
      html += '    <div class="chapter-number">Chapter ' + String(ch.chapter).padStart(2, '0') + '</div>';
      html += '    <h3 class="chapter-title">' + ch.title + '</h3>';
      html += '    <div class="chapter-company">' + ch.company + '</div>';
      html += '    <p class="chapter-desc">' + ch.desc + '</p>';
      html += '    <div class="chapter-skills">';
      ch.skills.forEach(function (skill) {
        html += '    <span class="chapter-skill">' + skill + '</span>';
      });
      html += '    </div>';
      html += '  </div>';
      html += '</div>';
    });

    html += '  </div>';
    html += '</div>';

    profileContent.innerHTML = html;

    /* Contact card — slides out from left edge */
    var existingCard = document.getElementById('profileContactCard');
    if (!existingCard) {
      var card = document.createElement('div');
      card.id = 'profileContactCard';
      card.className = 'contact-card';
      card.innerHTML =
        '<div class="contact-card-tab">✉</div>' +
        '<div class="contact-card-body">' +
        '  <div class="contact-card-name">陳俞娟</div>' +
        '  <div class="contact-card-divider"></div>' +
        '  <div class="contact-card-row">' +
        '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>' +
        '    <span>0970-701-233</span>' +
        '  </div>' +
        '  <div class="contact-card-row">' +
        '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
        '    <span>aa40332024@gmail.com</span>' +
        '  </div>' +
        '</div>';
      document.body.appendChild(card);

      /* Touch toggle for mobile */
      card.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        card.classList.toggle('is-touched');
      }, { passive: true });

      /* Close on outside touch */
      document.addEventListener('touchstart', function (e) {
        if (card && !card.contains(e.target)) {
          card.classList.remove('is-touched');
        }
      }, { passive: true });
    }

    /* Top-left avatar — appended to body so position:fixed works (backdrop-filter breaks fixed in overlay) */
    var avatarDiv = document.createElement('div');
    avatarDiv.id = 'profileHomeAvatar';
    avatarDiv.style.cssText = 'position:fixed; top:24px; left:24px; z-index:99999; width:48px; height:48px; cursor:pointer; perspective:400px;';
    avatarDiv.innerHTML = '<img src="image/姓名logo設計_白.png" alt="Back to Home" style="width:100%; height:100%; object-fit:contain; border-radius:50%; transition:transform 0.3s ease;">';
    document.body.appendChild(avatarDiv);

    /* Back button — return to previous page */
    var backBtn = document.createElement('button');
    backBtn.id = 'profileBackBtn';
    backBtn.className = 'aurora-scroll-top';
    backBtn.style.cssText = 'position:fixed; top:84px; left:24px; z-index:99999;';
    backBtn.setAttribute('aria-label', 'Back');
    backBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
    document.body.appendChild(backBtn);

    backBtn.addEventListener('click', function () {
      var returnView = sessionStorage.getItem('profileReturnView') || 'hero';
      sessionStorage.removeItem('profileReturnView');

      if (returnView === 'gallery' || returnView === 'categories') {
        /* Open target FIRST (behind profile), then fade out profile */
        if (returnView === 'gallery' && window.openGalleryOverlay) {
          window.openGalleryOverlay();
        } else if (returnView === 'categories' && window.openCategoriesOverlay) {
          window.openCategoriesOverlay();
        }
        /* Small delay to let target render, then fade out profile */
        setTimeout(function () {
          if (window.closeProfileOverlay) window.closeProfileOverlay();
        }, 100);
      } else {
        /* Return to hero — just close */
        if (window.closeProfileOverlay) window.closeProfileOverlay();
      }
    });

    /* Bottom-right scroll-to-top — appended to body so position:fixed works */
    var scrollBtn = document.createElement('button');
    scrollBtn.id = 'profileScrollTop';
    scrollBtn.className = 'aurora-scroll-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    document.body.appendChild(scrollBtn);

    /* Smooth infinite carousel for arsenal */
    var carousel = document.getElementById('arsenalCarousel');
    if (carousel) {
      var totalItems = TOOLS_DATA.length;
      var visibleCount = 7;
      var floatIdx = 0;        /* continuous floating-point center index */
      var slots = carousel.querySelectorAll('.carousel-slot');
      var isDragging = false;
      var dragStartX = 0;
      var dragStartIdx = 0;
      var prevX = 0;
      var prevTime = 0;
      var velocity = 0;        /* items per ms */
      var animFrame = null;
      var itemSpacing = 94;    /* px per item shift */

      function wrapIdx(i) {
        return ((i % totalItems) + totalItems) % totalItems;
      }

      function renderSmooth() {
        var half = Math.floor(visibleCount / 2);
        var baseIdx = Math.round(floatIdx);
        var frac = floatIdx - baseIdx; /* -0.5 ~ 0.5 fractional offset */

        for (var s = 0; s < visibleCount; s++) {
          var slotOffset = s - half;         /* -2, -1, 0, 1, 2 */
          var dataIdx = wrapIdx(baseIdx + slotOffset);
          var tool = TOOLS_DATA[dataIdx];

          /* Continuous distance from center (including fractional part) */
          var dist = Math.abs(slotOffset - frac);
          var scale = Math.max(1, 1.3 - dist * 0.15);
          var opacity = Math.max(0.4, 1 - dist * 0.15);
          var zIdx = Math.round(10 - dist * 3);

          /* Smooth horizontal shift based on fractional offset */
          var tx = -frac * itemSpacing;

          var slot = slots[s];
          var faceContent = tool.icon
            ? '<img src="' + tool.icon + '" alt="' + tool.name + '" style="width:100%; height:100%; object-fit:cover; border-radius:50%; pointer-events:none;">'
            : '<span class="tool-card-abbr">' + tool.abbr + '</span>' +
              '<span class="tool-card-name">' + tool.name + '</span>';
          slot.innerHTML =
            '<div class="tool-card" style="transform:scale(' + scale.toFixed(3) + ') translateX(' + tx.toFixed(1) + 'px); opacity:' + opacity.toFixed(3) + '; z-index:' + zIdx + '; transition:none;">' +
            '  <div class="tool-card-inner">' +
            '    <div class="tool-card-face">' + faceContent + '</div>' +
            '  </div>' +
            '</div>';
        }
      }

      renderSmooth();

      /* ── Pointer events (mouse + touch unified) ── */

      carousel.addEventListener('pointerdown', function (e) {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartIdx = floatIdx;
        prevX = e.clientX;
        prevTime = Date.now();
        velocity = 0;
        carousel.style.cursor = 'grabbing';
        carousel.setPointerCapture(e.pointerId);
        if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
        e.preventDefault();
      });

      carousel.addEventListener('pointermove', function (e) {
        if (!isDragging) return;
        e.preventDefault();

        var now = Date.now();
        var dt = now - prevTime;
        var dx = e.clientX - prevX;

        if (dt > 0) {
          velocity = (dx / itemSpacing) / dt; /* items per ms */
        }

        prevX = e.clientX;
        prevTime = now;

        /* Update float index continuously */
        var totalDx = e.clientX - dragStartX;
        floatIdx = dragStartIdx - totalDx / itemSpacing;
        renderSmooth();
      });

      carousel.addEventListener('pointerup', onEnd);
      carousel.addEventListener('pointercancel', onEnd);

      function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.cursor = 'grab';
        startMomentum();
      }

      /* ── Momentum with snap to nearest integer ── */

      function startMomentum() {
        var speed = -velocity * 16; /* items per frame (~16ms) */
        var friction = 0.92;

        function step() {
          speed *= friction;

          if (Math.abs(speed) < 0.001) {
            /* Snap to nearest integer index smoothly */
            snapToNearest();
            return;
          }

          floatIdx += speed;
          renderSmooth();
          animFrame = requestAnimationFrame(step);
        }

        animFrame = requestAnimationFrame(step);
      }

      function snapToNearest() {
        var target = Math.round(floatIdx);
        var snapSpeed = 0;
        var stiffness = 0.12;
        var damping = 0.7;

        function spring() {
          var diff = target - floatIdx;
          if (Math.abs(diff) < 0.002 && Math.abs(snapSpeed) < 0.002) {
            floatIdx = target;
            renderSmooth();
            animFrame = null;
            return;
          }

          snapSpeed += diff * stiffness;
          snapSpeed *= damping;
          floatIdx += snapSpeed;
          renderSmooth();
          animFrame = requestAnimationFrame(spring);
        }

        animFrame = requestAnimationFrame(spring);
      }
    }

    /* Scroll-to-top button */
    var scrollTopBtn = document.getElementById('profileScrollTop');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', function () {
        profileOverlay.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* Home avatar — click to close profile and return to cover */
    var homeAvatar = document.getElementById('profileHomeAvatar');
    if (homeAvatar) {
      homeAvatar.addEventListener('click', function () {
        if (window.closeProfileOverlay) window.closeProfileOverlay();
      });
      homeAvatar.addEventListener('mouseenter', function () {
        this.querySelector('img').style.transform = 'rotateY(-30deg) rotateX(10deg)';
      });
      homeAvatar.addEventListener('mouseleave', function () {
        this.querySelector('img').style.transform = 'none';
      });
    }

    /* Show overlay — delay to ensure transition triggers */
    setTimeout(function () {
      profileOverlay.classList.add('is-open');
      profileOverlay.setAttribute('aria-hidden', 'false');
      if (profileClose) profileClose.classList.add('is-visible');
    }, 50);
  };

  window.closeProfileOverlay = function () {
    if (!profileOverlay) return;

    if (profileClose) profileClose.classList.remove('is-visible');
    profileOverlay.classList.add('is-fading');

    setTimeout(function () {
      profileOverlay.classList.remove('is-open', 'is-fading');
      profileOverlay.setAttribute('aria-hidden', 'true');
      /* Only reset to hero if no other view is active */
      if (window.AppState._view === 'profile') {
        window.AppState.view = 'hero';
      }
      /* Clean up fixed elements appended to body */
      var avatar = document.getElementById('profileHomeAvatar');
      var scrollTop = document.getElementById('profileScrollTop');
      var backBtnEl = document.getElementById('profileBackBtn');
      var contactCard = document.getElementById('profileContactCard');
      if (avatar) avatar.remove();
      if (scrollTop) scrollTop.remove();
      if (backBtnEl) backBtnEl.remove();
      if (contactCard) contactCard.remove();
    }, 400);
  };

  /* ═══ TIMELINE (original section — kept for non-overlay use) ═══ */

  function initTimeline() {
    var container = document.getElementById('timelineChapters');
    var progressBar = document.getElementById('timelineProgress');
    if (!container) return;

    /* Render chapters */
    var html = '';
    TIMELINE_DATA.forEach(function (ch, i) {
      html += '<div class="timeline-chapter" data-chapter="' + i + '">';
      html += '  <div class="timeline-node">';
      html += '    <div class="timeline-dot"></div>';
      html += '  </div>';
      html += '  <div class="timeline-card glass-panel">';
      html += '    <div class="chapter-number">Chapter ' + String(ch.chapter).padStart(2, '0') + '</div>';
      html += '    <h3 class="chapter-title">' + ch.title + '</h3>';
      html += '    <div class="chapter-company">' + ch.company + '</div>';
      html += '    <p class="chapter-desc">' + ch.desc + '</p>';
      html += '    <div class="chapter-skills">';
      ch.skills.forEach(function (skill) {
        html += '    <span class="chapter-skill">' + skill + '</span>';
      });
      html += '    </div>';
      html += '  </div>';
      html += '</div>';
    });
    container.innerHTML = html;
  }

})();

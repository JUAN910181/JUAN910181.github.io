/* ═══════════════════════════════════════════
   About Page — Timeline, Chapters, Skills
   ═══════════════════════════════════════════ */
(function(){
  var initialized = false;
  var scrollHandler = null;

  window.initAbout = function() {
    if (initialized) {
      updateActiveNode(0);
      setupStickyTimeline();
      return;
    }
    initialized = true;

    setupTimeline();
    setupScrollObserver();
    setupStickyTimeline();
  };

  /* ── Timeline node click ── */
  function setupTimeline() {
    var nodes = document.querySelectorAll('.timeline-node');
    var chapters = document.querySelectorAll('.chapter');

    nodes.forEach(function(node, i) {
      node.addEventListener('click', function() {
        if (chapters[i]) {
          chapters[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        updateActiveNode(i);
      });
    });

    if (nodes.length > 0) {
      updateActiveNode(0);
    }
  }

  /* ── Active node + progress bar ── */
  function updateActiveNode(activeIndex) {
    var nodes = document.querySelectorAll('.timeline-node');
    var progress = document.querySelector('.timeline-progress');

    nodes.forEach(function(node, i) {
      node.classList.toggle('active', i <= activeIndex);
    });

    if (progress && nodes.length > 0) {
      var pct = nodes.length === 1 ? 100 : (activeIndex / (nodes.length - 1)) * 100;
      progress.style.height = pct + '%';
    }
  }

  /* ── Chapter scroll observer ── */
  function setupScrollObserver() {
    var chapters = document.querySelectorAll('.chapter');
    if (!chapters.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var idx = parseInt(entry.target.dataset.chapter);
          if (!isNaN(idx)) {
            updateActiveNode(idx);
          }
        }
      });
    }, {
      threshold: 0.3
    });

    chapters.forEach(function(ch) {
      observer.observe(ch);
    });
  }

  /* ── JS-driven sticky sidebar ── */
  function setupStickyTimeline() {
    var sidebar = document.getElementById('timelineSidebar');
    var spacer = sidebar ? sidebar.parentElement : null;
    var layout = document.querySelector('.about-layout');
    if (!sidebar || !spacer || !layout) return;

    // Clean up previous handler
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
    }

    var OFFSET_TOP = 40;

    scrollHandler = function() {
      var spacerRect = spacer.getBoundingClientRect();
      var layoutRect = layout.getBoundingClientRect();
      var sidebarH = sidebar.offsetHeight;

      // Case 1: Haven't scrolled past sidebar start → normal flow
      if (spacerRect.top >= OFFSET_TOP) {
        sidebar.classList.remove('is-fixed', 'is-bottom');
        sidebar.style.left = '';
        sidebar.style.width = '';
      }
      // Case 2: Scrolled past layout bottom → anchor to spacer bottom
      // KEY FIX: use layoutRect.bottom (chapters height) not spacerRect.bottom
      else if (layoutRect.bottom <= OFFSET_TOP + sidebarH) {
        sidebar.classList.remove('is-fixed');
        sidebar.classList.add('is-bottom');
        sidebar.style.left = '';
        sidebar.style.width = '';
      }
      // Case 3: In between → fixed to viewport
      else {
        sidebar.classList.add('is-fixed');
        sidebar.classList.remove('is-bottom');
        sidebar.style.left = spacerRect.left + 'px';
        sidebar.style.width = spacer.offsetWidth + 'px';
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler();
  }

})();

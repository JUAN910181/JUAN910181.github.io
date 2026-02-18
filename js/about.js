/* ═══════════════════════════════════════════
   About Page — Timeline, Chapters, Skills
   ═══════════════════════════════════════════ */
(function(){
  var initialized = false;

  window.initAbout = function() {
    if (initialized) {
      updateActiveNode(0);
      return;
    }
    initialized = true;

    setupTimeline();
    setupScrollObserver();
  };

  function setupTimeline() {
    var nodes = document.querySelectorAll('.timeline-node');
    var chapters = document.querySelectorAll('.chapter');

    nodes.forEach(function(node, i) {
      node.addEventListener('click', function() {
        // Scroll to corresponding chapter
        if (chapters[i]) {
          chapters[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        updateActiveNode(i);
      });
    });

    // Set first node as active
    if (nodes.length > 0) {
      updateActiveNode(0);
    }
  }

  function updateActiveNode(activeIndex) {
    var nodes = document.querySelectorAll('.timeline-node');
    var progress = document.querySelector('.timeline-progress');

    nodes.forEach(function(node, i) {
      node.classList.toggle('active', i <= activeIndex);
    });

    // Update progress bar height
    if (progress && nodes.length > 0) {
      var pct = nodes.length === 1 ? 100 : (activeIndex / (nodes.length - 1)) * 100;
      progress.style.height = pct + '%';
    }
  }

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
      threshold: 0.4
    });

    chapters.forEach(function(ch) {
      observer.observe(ch);
    });
  }

})();

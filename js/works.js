/* ═══════════════════════════════════════════
   Works Page — Masonry, Filters, Lightbox
   ═══════════════════════════════════════════ */
(function(){

  var currentCategory = '';
  var currentFilter = 'all';
  var lightboxItems = [];
  var lightboxIndex = 0;

  /* ── Render Works Page ── */
  window.renderWorks = function(category) {
    if (!WORKS_DATA[category] && !CATEGORY_INFO[category]) return;
    currentCategory = category;
    currentFilter = 'all';

    var section = document.getElementById('section-works');
    if (!section) return;

    var info = CATEGORY_INFO[category] || {};
    var works = WORKS_DATA[category] || [];

    // Collect all unique tags
    var allTags = new Set();
    works.forEach(function(w) {
      if (w.tags) w.tags.forEach(function(t) { allTags.add(t); });
    });

    // Build HTML
    var html = '';

    // Back navigation
    html += '<a class="back-nav" href="#/">';
    html += '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>';
    html += '<span>返回首頁</span>';
    html += '</a>';

    // Header
    html += '<div class="works-header">';
    html += '<div>';
    html += '<h1>' + (info.title || category) + ' <span style="font-weight:300;opacity:.5;font-size:.8em">| ' + (info.tagline || '') + '</span></h1>';
    html += '<div class="subtitle-en">' + (info.subtitle || '') + '</div>';
    html += '</div>';
    html += '</div>';

    // Filters
    if (allTags.size > 0) {
      html += '<div class="works-filters">';
      html += '<button class="filter-tag active" data-filter="all">全部</button>';
      allTags.forEach(function(tag) {
        html += '<button class="filter-tag" data-filter="' + tag + '">' + tag + '</button>';
      });
      html += '</div>';
    }

    // Masonry grid
    html += '<div class="works-grid">';
    if (works.length === 0) {
      html += '<div style="text-align:center;padding:80px 0;color:rgba(224,255,240,0.3);font-size:0.85rem;letter-spacing:0.05em;width:100%;">';
      html += '尚未新增作品<br><span style="font-size:0.7rem;opacity:0.6;">請在 js/data.js 中新增作品資料</span>';
      html += '</div>';
    } else {
      works.forEach(function(work, i) {
        var tags = (work.tags || []).join(' ');
        html += '<div class="work-item loading" data-tags="' + tags + '" data-index="' + i + '">';
        html += '<img data-src="' + work.src + '" alt="' + (work.title || '') + '">';
        html += '<div class="work-info">';
        html += '<div class="work-title">' + (work.title || '') + '</div>';
        if (work.tags && work.tags.length) {
          html += '<div class="work-tags">';
          work.tags.forEach(function(t) {
            html += '<span class="work-tag">' + t + '</span>';
          });
          html += '</div>';
        }
        html += '</div></div>';
      });
    }
    html += '</div>';

    section.innerHTML = html;

    // Setup filter buttons
    section.querySelectorAll('.filter-tag').forEach(function(btn) {
      btn.addEventListener('click', function() {
        section.querySelectorAll('.filter-tag').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        filterWorks(section);
      });
    });

    // Lazy load images
    setupLazyLoad(section);

    // Setup lightbox click
    setupLightbox(section, works);

    // Refresh cursor targets
    if (typeof window.refreshCursorTargets === 'function') {
      window.refreshCursorTargets();
    }
  };

  /* ── Filter Works ── */
  function filterWorks(section) {
    section.querySelectorAll('.work-item').forEach(function(item) {
      if (currentFilter === 'all') {
        item.style.display = '';
      } else {
        var tags = item.dataset.tags || '';
        item.style.display = tags.indexOf(currentFilter) >= 0 ? '' : 'none';
      }
    });
  }

  /* ── Lazy Load with IntersectionObserver ── */
  function setupLazyLoad(section) {
    var images = section.querySelectorAll('.work-item img[data-src]');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src;
            img.onload = function() {
              img.classList.add('loaded');
              img.closest('.work-item').classList.remove('loading');
            };
            img.onerror = function() {
              img.closest('.work-item').classList.remove('loading');
              img.closest('.work-item').style.display = 'none';
            };
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '100px' });
      images.forEach(function(img) { observer.observe(img); });
    } else {
      // Fallback: load all
      images.forEach(function(img) {
        img.src = img.dataset.src;
        img.onload = function() {
          img.classList.add('loaded');
          img.closest('.work-item').classList.remove('loading');
        };
      });
    }
  }

  /* ── Lightbox ── */
  function setupLightbox(section, works) {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    section.querySelectorAll('.work-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var idx = parseInt(item.dataset.index);
        if (isNaN(idx)) return;
        openLightbox(works, idx);
      });
    });
  }

  function openLightbox(works, index) {
    lightboxItems = works;
    lightboxIndex = index;
    var lightbox = document.getElementById('lightbox');
    var img = lightbox.querySelector('.lightbox-img');
    var counter = lightbox.querySelector('.lightbox-counter');

    img.src = works[index].src;
    counter.textContent = (index + 1) + ' / ' + works.length;
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    var lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
  }

  function prevLightbox() {
    if (lightboxItems.length === 0) return;
    lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    updateLightbox();
  }

  function nextLightbox() {
    if (lightboxItems.length === 0) return;
    lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
    updateLightbox();
  }

  function updateLightbox() {
    var lightbox = document.getElementById('lightbox');
    var img = lightbox.querySelector('.lightbox-img');
    var counter = lightbox.querySelector('.lightbox-counter');
    img.src = lightboxItems[lightboxIndex].src;
    counter.textContent = (lightboxIndex + 1) + ' / ' + lightboxItems.length;
  }

  // Lightbox event listeners
  document.addEventListener('DOMContentLoaded', function() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', prevLightbox);
    lightbox.querySelector('.lightbox-next').addEventListener('click', nextLightbox);

    // Click background to close
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    });
  });

})();

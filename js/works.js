/* ═══════════════════════════════════════════
   Works Page — Masonry, Filters, Gallery Lightbox
   ═══════════════════════════════════════════ */
(function(){

  var currentCategory = '';
  var currentFilter = 'all';
  var lightboxImages = [];
  var lightboxIndex = 0;
  var currentWork = null;

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
        // Use images[0] as cover; fallback to src for legacy format
        var coverSrc = (work.images && work.images[0]) ? work.images[0] : (work.src || '');
        var imageCount = (work.images) ? work.images.length : 1;
        html += '<div class="work-item loading" data-tags="' + tags + '" data-index="' + i + '">';
        html += '<img data-src="' + coverSrc + '" alt="' + (work.title || '') + '">';
        html += '<div class="work-info">';
        html += '<div class="work-title">' + (work.title || '') + '</div>';
        if (work.tags && work.tags.length) {
          html += '<div class="work-tags">';
          work.tags.forEach(function(t) {
            html += '<span class="work-tag">' + t + '</span>';
          });
          html += '</div>';
        }
        if (imageCount > 1) {
          html += '<div class="work-count">' + imageCount + ' 張</div>';
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

  /* ── Gallery Lightbox ── */
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

  function openLightbox(works, workIndex) {
    currentWork = works[workIndex];
    // Support both new (images[]) and legacy (src) format
    lightboxImages = currentWork.images ? currentWork.images.slice() : [currentWork.src];
    lightboxIndex = 0;

    var lightbox = document.getElementById('lightbox');
    var img = lightbox.querySelector('.lightbox-img');
    var titleEl = lightbox.querySelector('.lightbox-title');
    var tagsEl = lightbox.querySelector('.lightbox-tags');
    var descEl = lightbox.querySelector('.lightbox-desc');
    var dotsEl = lightbox.querySelector('.lightbox-dots');

    // Fill right panel
    titleEl.textContent = currentWork.title || '';

    var tagsHtml = '';
    if (currentWork.tags && currentWork.tags.length) {
      currentWork.tags.forEach(function(t) {
        tagsHtml += '<span class="lightbox-tag">' + t + '</span>';
      });
    }
    tagsEl.innerHTML = tagsHtml;

    descEl.textContent = currentWork.desc || '';

    // Fill image
    img.src = lightboxImages[0];

    // Generate dots
    var dotsHtml = '';
    for (var i = 0; i < lightboxImages.length; i++) {
      dotsHtml += '<button class="lightbox-dot' + (i === 0 ? ' active' : '') + '" data-dot="' + i + '"></button>';
    }
    dotsEl.innerHTML = dotsHtml;

    // Dot click handlers
    dotsEl.querySelectorAll('.lightbox-dot').forEach(function(dot) {
      dot.addEventListener('click', function(e) {
        e.stopPropagation();
        lightboxIndex = parseInt(dot.dataset.dot);
        updateLightbox();
      });
    });

    // Hide arrows if only 1 image
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    if (lightboxImages.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      dotsEl.style.display = 'none';
    } else {
      prevBtn.style.display = '';
      nextBtn.style.display = '';
      dotsEl.style.display = '';
    }

    lightbox.classList.add('active');
  }

  function closeLightbox() {
    var lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
  }

  function prevLightbox() {
    if (lightboxImages.length <= 1) return;
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
  }

  function nextLightbox() {
    if (lightboxImages.length <= 1) return;
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    updateLightbox();
  }

  function updateLightbox() {
    var lightbox = document.getElementById('lightbox');
    var img = lightbox.querySelector('.lightbox-img');
    img.src = lightboxImages[lightboxIndex];

    // Update dots
    lightbox.querySelectorAll('.lightbox-dot').forEach(function(dot, i) {
      dot.classList.toggle('active', i === lightboxIndex);
    });
  }

  // Lightbox event listeners
  document.addEventListener('DOMContentLoaded', function() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function(e) {
      e.stopPropagation();
      prevLightbox();
    });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function(e) {
      e.stopPropagation();
      nextLightbox();
    });

    // Click background to close (only on lightbox itself or lightbox-body empty area)
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

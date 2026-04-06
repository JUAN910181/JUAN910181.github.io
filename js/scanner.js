/* ═══════════════════════════════════════════
   HERO — 毛玻璃揭示效果
   滑鼠移動時以游標為中心的圓形區域顯示清晰文字
   邊緣羽化（radial-gradient mask）
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  var clearLayer, section, cursorRing, heroFolder, clearName, yuJuanImg;
  var mouseX = 0, mouseY = 0;
  var currentX = 0, currentY = 0;
  var isInSection = false;
  var revealRadius = 120;
  var prevX = 0, prevY = 0;
  var chromaX = 0, chromaY = 0;

  window.initScanner = function () {
    clearLayer = document.getElementById('heroClear');
    section    = document.getElementById('sectionScanner');
    heroFolder = document.getElementById('heroFolder');

    if (!clearLayer || !section) return;

    clearName = clearLayer.querySelector('.hero-name');

    /* YuJuan crystal parallax */
    var blurLayer = document.getElementById('heroBlur');
    yuJuanImg = blurLayer ? blurLayer.querySelector('.hero-name-img') : null;

    /* Create cursor ring */
    cursorRing = document.createElement('div');
    cursorRing.className = 'hero-cursor-ring';
    cursorRing.style.opacity = '0';
    document.body.appendChild(cursorRing);

    /* Mouse events */
    section.addEventListener('mouseenter', function () {
      isInSection = true;
      cursorRing.style.opacity = '1';
    });

    section.addEventListener('mouseleave', function () {
      isInSection = false;
      cursorRing.style.opacity = '0';
      /* Fade out: shrink mask to 0 */
      var mask = 'radial-gradient(circle 0px at 50% 50%, black 50%, transparent 100%)';
      clearLayer.style.webkitMaskImage = mask;
      clearLayer.style.maskImage = mask;
    });

    section.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    /* Folder click → open categories overlay */
    if (heroFolder) {
      heroFolder.addEventListener('click', function () {
        if (window.openCategoriesOverlay) {
          window.openCategoriesOverlay();
        }
      });
    }

    /* Start render loop */
    tick();
  };

  function tick() {
    /* Smooth follow */
    currentX = FX.lerp(currentX, mouseX, 0.12);
    currentY = FX.lerp(currentY, mouseY, 0.12);

    /* Velocity-based chromatic aberration */
    var vx = currentX - prevX;
    var vy = currentY - prevY;
    prevX = currentX;
    prevY = currentY;

    /* Smooth the chroma offset (lerp toward target) */
    var maxChroma = 5;
    var targetCX = FX.clamp(vx * 1.2, -maxChroma, maxChroma);
    var targetCY = FX.clamp(vy * 1.2, -maxChroma, maxChroma);
    chromaX = FX.lerp(chromaX, targetCX, 0.15);
    chromaY = FX.lerp(chromaY, targetCY, 0.15);

    if (isInSection) {
      /* Get section-relative coordinates */
      var rect = section.getBoundingClientRect();
      var relX = currentX - rect.left;
      var relY = currentY - rect.top;

      /* Update clear layer mask with feathered edge */
      var mask = 'radial-gradient(circle ' + revealRadius + 'px at ' + relX + 'px ' + relY + 'px, black 40%, transparent 100%)';
      clearLayer.style.webkitMaskImage = mask;
      clearLayer.style.maskImage = mask;

      /* Update cursor ring position */
      cursorRing.style.left = currentX + 'px';
      cursorRing.style.top = currentY + 'px';
      cursorRing.style.width = (revealRadius * 2) + 'px';
      cursorRing.style.height = (revealRadius * 2) + 'px';

      /* Chromatic aberration — RGB split follows movement direction */
      if (clearName) {
        clearName.style.setProperty('--chroma-rx', chromaX.toFixed(2) + 'px');
        clearName.style.setProperty('--chroma-ry', chromaY.toFixed(2) + 'px');
        clearName.style.setProperty('--chroma-bx', (-chromaX).toFixed(2) + 'px');
        clearName.style.setProperty('--chroma-by', (-chromaY).toFixed(2) + 'px');
      }

      /* Subtle parallax on folder (use CSS custom props to avoid overriding float animation) */
      if (heroFolder) {
        var centerX = (currentX / window.innerWidth - 0.5) * 8;
        var centerY = (currentY / window.innerHeight - 0.5) * 6;
        heroFolder.style.setProperty('--folder-px', centerX + 'px');
        heroFolder.style.setProperty('--folder-py', centerY + 'px');
      }

    }

    requestAnimationFrame(tick);
  }

})();

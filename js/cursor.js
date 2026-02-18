/* ═══════════════════════════════════════════
   Moonlight Cursor Trail System
   ═══════════════════════════════════════════ */
(function(){
  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  var canvas = document.getElementById('trail-canvas');
  if (!dot || !ring || !canvas) return;
  var ctx = canvas.getContext('2d');
  var mx = -100, my = -100, ringX = -100, ringY = -100;

  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight }
  resize();
  addEventListener('resize', resize);

  var trail = [];
  var MAX_AGE = 1.8;
  var lastX = -1, lastY = -1, lastSpawn = 0;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx+'px'; dot.style.top = my+'px';

    var now = performance.now();
    if(now - lastSpawn > 14 && lastX >= 0){
      var dx = mx-lastX, dy = my-lastY;
      var speed = Math.sqrt(dx*dx+dy*dy);
      if(speed > 1.5){
        var nx = -dy/(speed||1), ny = dx/(speed||1);
        var w = (Math.random()-0.5)*Math.min(speed*0.35,12);
        trail.push({ x:mx+nx*w, y:my+ny*w, age:0,
          vx:nx*(Math.random()-0.5)*0.4, vy:ny*(Math.random()-0.5)*0.4,
          size:Math.min(2+speed*0.05,4), wobble:Math.random()*Math.PI*2 });
        if(speed > 20 && Math.random()>0.5){
          var w2 = (Math.random()-0.5)*speed*0.5;
          trail.push({ x:mx+nx*w2, y:my+ny*w2, age:0,
            vx:(Math.random()-0.5)*0.8, vy:(Math.random()-0.5)*0.8,
            size:1+Math.random()*1.5, wobble:Math.random()*Math.PI*2 });
        }
      }
      lastSpawn = now;
    }
    lastX = mx; lastY = my;
  });

  // Hover detection setup
  function setupHoverTargets() {
    document.querySelectorAll('.card,.avatar-wrapper,a,button,.filter-tag,.lightbox-nav,.lightbox-close,.timeline-node,.work-item').forEach(function(el) {
      // Remove old listeners to avoid duplicates
      el.removeEventListener('mouseenter', cursorActivate);
      el.removeEventListener('mouseleave', cursorDeactivate);
      el.addEventListener('mouseenter', cursorActivate);
      el.addEventListener('mouseleave', cursorDeactivate);
    });
  }
  function cursorActivate(){ dot.classList.add('active'); ring.classList.add('active') }
  function cursorDeactivate(){ dot.classList.remove('active'); ring.classList.remove('active') }

  setupHoverTargets();

  document.addEventListener('mouseleave', function(){ dot.style.opacity='0'; ring.style.opacity='0' });
  document.addEventListener('mouseenter', function(){ dot.style.opacity='1'; ring.style.opacity='1' });

  var prev = performance.now();
  function animate(now){
    var dt = Math.min((now-prev)/1000, 0.05); prev = now;
    ringX += (mx-ringX)*0.1; ringY += (my-ringY)*0.1;
    ring.style.left = ringX+'px'; ring.style.top = ringY+'px';
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(var i=trail.length-1; i>=0; i--){
      var p = trail[i]; p.age += dt;
      if(p.age >= MAX_AGE){ trail.splice(i,1); continue }
      p.x += p.vx; p.y += p.vy;
      p.wobble += dt*1.8;
      p.x += Math.sin(p.wobble)*0.2; p.y += Math.cos(p.wobble)*0.15;
      var life = 1-p.age/MAX_AGE, alpha = life*life*0.35, r = p.size*life;

      var g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*4);
      g.addColorStop(0,'rgba(224,255,240,'+alpha*0.35+')');
      g.addColorStop(0.4,'rgba(224,255,240,'+alpha*0.08+')');
      g.addColorStop(1,'rgba(224,255,240,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x,p.y,r*4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(240,255,248,'+alpha*0.6+')';
      ctx.beginPath(); ctx.arc(p.x,p.y,r*0.5,0,Math.PI*2); ctx.fill();
    }

    ctx.lineWidth = 0.7;
    for(var i=0; i<trail.length-1; i++){
      var a=trail[i], b=trail[i+1];
      if(a.age>MAX_AGE*0.6 || b.age>MAX_AGE*0.6) continue;
      var d = Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2);
      if(d>45) continue;
      var la = Math.min(1-a.age/MAX_AGE, 1-b.age/MAX_AGE)*0.12;
      ctx.strokeStyle = 'rgba(224,255,240,'+la+')';
      ctx.beginPath();
      ctx.moveTo(a.x,a.y);
      ctx.quadraticCurveTo((a.x+b.x)/2+Math.sin(a.wobble)*2,(a.y+b.y)/2+Math.cos(b.wobble)*2,b.x,b.y);
      ctx.stroke();
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Expose refresh function for SPA navigation
  window.refreshCursorTargets = setupHoverTargets;
})();

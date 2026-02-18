/* ═══════════════════════════════════════════
   3D Tilt + Inverse Specular System
   ═══════════════════════════════════════════ */
(function(){
  var TILT=5, PERSP=900, LERP=0.065;

  function initTilt() {
    document.querySelectorAll('.card').forEach(function(card) {
      // Skip if already initialized
      if (card._tiltInit) return;
      card._tiltInit = true;

      var spec = card.querySelector('.card-specular');
      var tRx=0,tRy=0,cRx=0,cRy=0, tSx=50,tSy=50,cSx=50,cSy=50;
      var tLift=0, cLift=0;
      var hover=false, raf=null;

      function tick(){
        cRx+=(tRx-cRx)*LERP; cRy+=(tRy-cRy)*LERP;
        cSx+=(tSx-cSx)*LERP; cSy+=(tSy-cSy)*LERP;
        cLift+=(tLift-cLift)*LERP;
        card.style.transform = 'perspective('+PERSP+'px) rotateX('+cRx+'deg) rotateY('+cRy+'deg) translateY('+cLift+'px)';
        if(spec) spec.style.background = 'radial-gradient(ellipse 45% 55% at '+cSx+'% '+cSy+'%,rgba(255,255,255,0.15) 0%,rgba(224,255,240,0.05) 30%,rgba(255,255,255,0.01) 55%,transparent 80%)';
        if(hover||Math.abs(tRx-cRx)>0.01||Math.abs(tRy-cRy)>0.01||Math.abs(tSx-cSx)>0.1||Math.abs(tLift-cLift)>0.1)
          raf=requestAnimationFrame(tick); else raf=null;
      }
      function go(){ if(!raf) raf=requestAnimationFrame(tick) }

      card.addEventListener('mousemove', function(e){
        var r=card.getBoundingClientRect();
        var nx=(e.clientX-r.left)/r.width*2-1, ny=(e.clientY-r.top)/r.height*2-1;
        tRx=-ny*TILT; tRy=nx*TILT; tSx=50-nx*28; tSy=50-ny*28; go();
      });
      card.addEventListener('mouseenter', function(){ hover=true; tLift=-8; go() });
      card.addEventListener('mouseleave', function(){ hover=false; tRx=tRy=0; tSx=tSy=50; tLift=0; go() });
    });
  }

  document.addEventListener('DOMContentLoaded', initTilt);
  window.refreshTilt = initTilt;
})();

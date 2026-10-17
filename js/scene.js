/* ============================================================
   HERO 3D SCENE — abstract glass/chrome sculpture
   Three.js r128 (classic script, works from file://)
   Graceful fallback when WebGL is unavailable.
   ============================================================ */
(function () {
  'use strict';

  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function webglAvailable() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  // No WebGL (or no three.js): keep the CSS gradient fallback visible.
  if (!webglAvailable() || typeof THREE === 'undefined') {
    canvas.style.display = 'none';
    return;
  }

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (e) {
    canvas.style.display = 'none';
    return;
  }

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  // Weaker devices: halve the pixel ratio for performance
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) DPR = Math.min(DPR, 1.25);

  renderer.setPixelRatio(DPR);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 9);

  /* ---------- lighting: soft violet + cyan ---------- */
  scene.add(new THREE.AmbientLight(0x2a2d3a, 1.4));

  var violet = new THREE.PointLight(0xA78BFA, 2.2, 30);
  violet.position.set(-5, 3, 4);
  scene.add(violet);

  var cyan = new THREE.PointLight(0x67E8F9, 1.8, 30);
  cyan.position.set(5, -2, 4);
  scene.add(cyan);

  var rim = new THREE.DirectionalLight(0xffffff, 0.5);
  rim.position.set(0, 6, -4);
  scene.add(rim);

  /* ---------- the sculpture ---------- */
  var sculpture = new THREE.Group();

  // Glass torus knot — the hero piece
  var glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xcfd8ff,
    metalness: 0.1,
    roughness: 0.08,
    transparent: true,
    opacity: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  });
  var knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.7, 0.5, 220, 36), glassMat);
  sculpture.add(knot);

  // Chrome core
  var chromeMat = new THREE.MeshStandardMaterial({
    color: 0xdfe4f5, metalness: 1.0, roughness: 0.16
  });
  var core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 1), chromeMat);
  sculpture.add(core);

  // Orbiting translucent shards
  var shardMat = new THREE.MeshPhysicalMaterial({
    color: 0x9fd8ff, metalness: 0.3, roughness: 0.2,
    transparent: true, opacity: 0.5
  });
  var shards = [];
  for (var i = 0; i < 7; i++) {
    var s = new THREE.Mesh(new THREE.OctahedronGeometry(0.16 + Math.random() * 0.14, 0), shardMat);
    var a = (i / 7) * Math.PI * 2;
    s.userData = { angle: a, radius: 3.1 + Math.random() * 0.7, speed: 0.12 + Math.random() * 0.15, yOff: (Math.random() - 0.5) * 2.4 };
    shards.push(s);
    sculpture.add(s);
  }

  // Faint wireframe halo ring
  var halo = new THREE.Mesh(
    new THREE.TorusGeometry(3.4, 0.012, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0xA78BFA, transparent: true, opacity: 0.35 })
  );
  halo.rotation.x = Math.PI / 2.4;
  sculpture.add(halo);

  sculpture.position.set(2.6, 0.1, 0); // right of the centered headline
  scene.add(sculpture);

  /* ---------- cursor-responsive movement ---------- */
  var mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  window.addEventListener('pointermove', function (e) {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function resize() {
    var w = canvas.clientWidth || window.innerWidth;
    var h = canvas.clientHeight || window.innerHeight;
    // Keep sculpture clear of centered text on narrow screens
    var aspect = w / h;
    if (aspect < 1) { sculpture.position.x = 0; sculpture.position.y = -2.6; sculpture.scale.setScalar(0.72); }
    else { sculpture.position.x = 2.6; sculpture.position.y = 0.1; sculpture.scale.setScalar(1); }
    renderer.setSize(w, h, false);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  /* ---------- entrance ---------- */
  sculpture.scale.multiplyScalar(0.001);
  var introT = 0;

  var clock = new THREE.Clock();
  var running = true;

  function tick() {
    if (!running) return;
    var t = clock.getElapsedTime();

    // idle motion
    knot.rotation.x = t * 0.12;
    knot.rotation.y = t * 0.16;
    core.rotation.y = -t * 0.35;
    core.rotation.z = t * 0.2;
    halo.rotation.z = t * 0.05;

    for (var i = 0; i < shards.length; i++) {
      var sh = shards[i], u = sh.userData;
      u.angle += 0.0035 * u.speed * 10 * 0.016;
      sh.position.set(Math.cos(u.angle) * u.radius, u.yOff + Math.sin(t * 0.6 + i) * 0.25, Math.sin(u.angle) * u.radius);
      sh.rotation.x = t * 0.5 + i;
      sh.rotation.y = t * 0.3;
    }

    // gentle cursor parallax
    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;
    camera.position.x = mouseX * 0.7;
    camera.position.y = 0.4 - mouseY * 0.5;
    camera.lookAt(sculpture.position.x * 0.4, 0, 0);

    // entrance scale-up
    if (introT < 1) {
      introT = Math.min(1, introT + 0.012);
      var e = 1 - Math.pow(1 - introT, 3);
      var base = (window.innerWidth / window.innerHeight < 1) ? 0.72 : 1;
      sculpture.scale.setScalar(Math.max(0.001, base * e));
    }

    renderer.render(scene, camera);

    if (!reduceMotion) requestAnimationFrame(tick);
  }

  // Pause when the hero is off-screen (saves battery/GPU)
  if ('IntersectionObserver' in window && !reduceMotion) {
    new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      if (visible && !running) { running = true; tick(); }
      else if (!visible) { running = false; }
    }, { threshold: 0 }).observe(document.getElementById('home'));
  }

  tick(); // renders at least one frame; loop continues unless reduced motion
})();

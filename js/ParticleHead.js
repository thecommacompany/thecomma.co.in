var Background = function() {
  var site = {};
  site.window = $(window);
  site.document = $(document);
  site.Width = site.window.width();
  site.Height = site.window.height();

  var mouseX = 0, mouseY = 0;
  var touchX = 0, touchY = 0;
  var windowHalfX = site.Width / 2;
  var windowHalfY = site.Height / 2;

  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  Background.camera = new THREE.PerspectiveCamera(35, site.Width / site.Height, 1, 2000);
  Background.camera.position.z = 300;

  Background.scene = new THREE.Scene();

  var p_geom = new THREE.Geometry();
  var p_material = new THREE.ParticleBasicMaterial({
    color: 0xFFFFFF,
    size: 1.9,
    transparent: true,
    opacity: 0.5 // Reduced opacity to 50%
  });

  var loader = new THREE.OBJLoader();
  loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/40480/head.obj', function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        var scale = 8;
        child.geometry.vertices.forEach(function(vertex) {
          p_geom.vertices.push(new THREE.Vector3(vertex.x * scale, vertex.y * scale, vertex.z * scale));
        });
      }
    });
    p = new THREE.ParticleSystem(p_geom, p_material);
    Background.scene.add(p);
  });

  Background.renderer = new THREE.WebGLRenderer({ alpha: true });
  Background.renderer.setSize(site.Width, site.Height);
  Background.renderer.setClearColor(0x000000, 0);

  $('.particlehead').append(Background.renderer.domElement);
  site.window.on('mousemove', onDocumentMouseMove);
  site.window.on('touchstart', onDocumentTouchStart);
  site.window.on('touchmove', onDocumentTouchMove);
  site.window.on('touchend', onDocumentTouchEnd);
  site.window.on('resize', onWindowResize);

  function onWindowResize() {
    site.Width = site.window.width();
    site.Height = site.window.height();
    windowHalfX = site.Width / 2;
    windowHalfY = site.Height / 2;
    Background.camera.aspect = site.Width / site.Height;
    Background.camera.updateProjectionMatrix();
    Background.renderer.setSize(site.Width, site.Height);
  }

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;
  }

  function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      touchX = event.touches[0].pageX - windowHalfX;
      touchY = event.touches[0].pageY - windowHalfY;
    }
  }

  function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      touchX = event.touches[0].pageX - windowHalfX;
      touchY = event.touches[0].pageY - windowHalfY;
    }
  }

  function onDocumentTouchEnd(event) {
    touchX = 0;
    touchY = 0;
  }

  function render() {
    Background.camera.position.x += ((isTouchDevice ? touchX : mouseX) * 0.5 - Background.camera.position.x) * 0.05;
    Background.camera.position.y += (-(isTouchDevice ? touchY : mouseY) * 0.5 - Background.camera.position.y) * 0.05;
    Background.camera.lookAt(Background.scene.position);
    Background.renderer.render(Background.scene, Background.camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  animate();
};

Background();

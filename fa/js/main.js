import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.166/build/three.module.js";
import {OBJLoader} from "https://cdn.jsdelivr.net/npm/three@0.166/examples/jsm/loaders/OBJLoader.js";
import {OrbitControls} from "https://cdn.jsdelivr.net/npm/three@0.166/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

// =========================================================
// Scene Container
// =========================================================

const sceneContainer = document.getElementById("scene");

if (!sceneContainer) {
  console.error("Three.js: #scene element not found.");
} else {
  // =======================================================
  // Camera
  // =======================================================

  const camera = new THREE.PerspectiveCamera(
    45,
    sceneContainer.clientWidth / Math.max(sceneContainer.clientHeight, 1),
    0.1,
    100,
  );

  camera.position.set(0, 1.5, 5.5);

  // =======================================================
  // Renderer
  // =======================================================

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  renderer.setSize(
    sceneContainer.clientWidth,
    sceneContainer.clientHeight,
    false,
  );

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  sceneContainer.appendChild(renderer.domElement);

  // =======================================================
  // Orbit Controls
  // =======================================================

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.06;

  controls.enablePan = false;

  // زوم محدود
  controls.minDistance = 5.0;
  controls.maxDistance = 6;

  // زاویه عمودی
  controls.minPolarAngle = 0.7;
  controls.maxPolarAngle = 1.45;

  controls.target.set(0, 1, 0);
  controls.update();

  // =======================================================
  // Lighting
  // =======================================================

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);

  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 2);

  mainLight.position.set(5, 7, 5);

  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);

  fillLight.position.set(-4, 3, 4);

  scene.add(fillLight);

  // =======================================================
  // Soldier Model
  // =======================================================

  let soldier = null;

  const loader = new OBJLoader();

  const modelPath = "assets/models/soldier-squidgame.obj";

  console.log("Three.js: loading model:", modelPath);

  loader.load(
    modelPath,

    // =====================================================
    // SUCCESS
    // =====================================================

    (object) => {
      console.log("Three.js: Soldier model loaded successfully.");

      soldier = object;

      // ---------------------------------------------------
      // Original Size
      // ---------------------------------------------------

      const box = new THREE.Box3().setFromObject(soldier);

      const size = new THREE.Vector3();

      box.getSize(size);

      const maxSize = Math.max(size.x, size.y, size.z);

      console.log("Model size:", size.x, size.y, size.z);

      // ---------------------------------------------------
      // Normalize Size
      // ---------------------------------------------------

      if (maxSize > 0) {
        const targetSize = 2.5;

        const scale = targetSize / maxSize;

        soldier.scale.setScalar(scale);
      }

      // ---------------------------------------------------
      // Recalculate Bounds
      // ---------------------------------------------------

      const newBox = new THREE.Box3().setFromObject(soldier);

      const center = new THREE.Vector3();

      newBox.getCenter(center);

      // ---------------------------------------------------
      // Center Model
      // ---------------------------------------------------

      soldier.position.x = -center.x - 0.08;

      soldier.position.z = -center.z;

      // کمی بالاتر
      soldier.position.y = -newBox.min.y - 0.05;

      // نمای شروع: بغل مدل
      const START_ROTATION = Math.PI;

      // نمای پایان: سمت صورت / گوش راست مدل
      const END_ROTATION = START_ROTATION + Math.PI / 2;

      // برای استفاده در پایان انیمیشن
      const FRONT_ROTATION = END_ROTATION;

      // نمای شروع انیمیشن
      const SIDE_ROTATION = START_ROTATION;

      // ===================================================
      // Materials
      // ===================================================

      soldier.traverse((child) => {
        if (!child.isMesh) {
          return;
        }

        child.castShadow = false;
        child.receiveShadow = false;

        if (!child.material) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.75,
            metalness: 0.05,
          });
        } else {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              material.roughness = 0.75;
              material.metalness = 0.05;
            });
          } else {
            child.material.roughness = 0.75;
            child.material.metalness = 0.05;
          }
        }
      });

      // ===================================================
      // Add Model
      // ===================================================

      scene.add(soldier);

      // ===================================================
      // Camera Target
      // ===================================================

      controls.target.set(0, 1, 0);

      controls.update();

      // ===================================================
      // INTRO ANIMATION
      // ===================================================

      /*
       * اول کنترل کاربر کاملاً بسته است.
       */

      controls.enabled = false;

      /*
       * مدل از نمای بغل شروع می‌شود.
       */

      soldier.rotation.y = START_ROTATION;

      /*
       * زمان شروع انیمیشن
       */

      const animationStart = performance.now();

      /*
       * مدت مکث اولیه:
       * 2.8 ثانیه
       */

      const sideHoldDuration = 2800;

      /*
       * مدت چرخش:
       * 4.2 ثانیه
       */

      const rotationDuration = 4200;

      /*
       * فاصله اولیه دوربین
       */

      const normalCameraZ = camera.position.z;

      /*
       * شروع خیلی نزدیک
       */

      const startCameraZ = 3.2;

      /*
       * کمی پایین‌تر و نزدیک‌تر
       * برای حس سینمایی
       */

      const startCameraY = 1.55;

      camera.position.set(0, startCameraY, startCameraZ);

      // ---------------------------------------------------
      // Easing
      // ---------------------------------------------------

      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      // ---------------------------------------------------
      // Animation
      // ---------------------------------------------------

      function introAnimation(now) {
        if (!soldier) {
          return;
        }

        const elapsed = now - animationStart;

        // =================================================
        // PHASE 1
        // ثابت از بغل
        // =================================================

        if (elapsed < sideHoldDuration) {
          soldier.rotation.y = SIDE_ROTATION;

          camera.position.z = startCameraZ;

          camera.position.y = startCameraY;

          camera.lookAt(controls.target);

          renderer.render(scene, camera);

          requestAnimationFrame(introAnimation);

          return;
        }

        // =================================================
        // PHASE 2
        // چرخش نرم
        // =================================================

        const rotationElapsed = elapsed - sideHoldDuration;

        let progress = rotationElapsed / rotationDuration;

        progress = Math.min(Math.max(progress, 0), 1);

        const eased = easeInOutCubic(progress);

        /*
         * چرخش از بغل
         * به نمای روبه‌رو
         */

        soldier.rotation.y =
          START_ROTATION + (END_ROTATION - START_ROTATION) * eased;

        /*
         * دوربین آرام از نزدیک
         * به فاصله عادی برمی‌گردد.
         */

        camera.position.z =
          startCameraZ +
          (normalCameraZ - startCameraZ) * easeInOutCubic(progress);

        camera.position.y = startCameraY + (1.5 - startCameraY) * eased;

        camera.lookAt(controls.target);

        renderer.render(scene, camera);

        // =================================================
        // FINISHED
        // =================================================

        if (progress >= 1) {
          soldier.rotation.y = END_ROTATION;

          camera.position.set(0, 1.5, normalCameraZ);

          camera.lookAt(controls.target);

          /*
           * حالا کاربر می‌تواند مدل را بچرخاند.
           */

          controls.enabled = true;

          controls.update();

          renderer.render(scene, camera);

          console.log("Three.js: Soldier intro animation finished.");

          return;
        }

        requestAnimationFrame(introAnimation);
      }

      // شروع انیمیشن
      requestAnimationFrame(introAnimation);
    },

    // =====================================================
    // PROGRESS
    // =====================================================

    (xhr) => {
      if (xhr.lengthComputable) {
        const percent = (xhr.loaded / xhr.total) * 100;

        console.log(`Soldier model: ${percent.toFixed(0)}%`);
      }
    },

    // =====================================================
    // ERROR
    // =====================================================

    (error) => {
      console.error("Three.js: FAILED TO LOAD SOLDIER MODEL.", error);

      console.error("Expected model path:", modelPath);
    },
  );

  // =======================================================
  // Responsive
  // =======================================================

  let resizeFrame = null;

  function resize() {
    if (resizeFrame) {
      cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = requestAnimationFrame(() => {
      const width = sceneContainer.clientWidth;

      const height = sceneContainer.clientHeight;

      if (!width || !height) {
        return;
      }

      camera.aspect = width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      renderer.render(scene, camera);
    });
  }

  window.addEventListener("resize", resize, {
    passive: true,
  });

  const resizeObserver = new ResizeObserver(resize);

  resizeObserver.observe(sceneContainer);

  resize();

  // =======================================================
  // Normal Interaction Render
  // =======================================================

  let renderRequested = false;

  function requestRender() {
    if (!controls.enabled) {
      return;
    }

    if (renderRequested) {
      return;
    }

    renderRequested = true;

    requestAnimationFrame(() => {
      controls.update();

      renderer.render(scene, camera);

      renderRequested = false;
    });
  }

  controls.addEventListener("change", requestRender);

  // =======================================================
  // Initial Render
  // =======================================================

  renderer.render(scene, camera);
}

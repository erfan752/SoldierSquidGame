import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.166/build/three.module.js";
import {OBJLoader} from "https://cdn.jsdelivr.net/npm/three@0.166/examples/jsm/loaders/OBJLoader.js";
import {OrbitControls} from "https://cdn.jsdelivr.net/npm/three@0.166/examples/jsm/controls/OrbitControls.js";

// =========================================================
// Background Image Behind Soldier
// =========================================================

const textureLoader = new THREE.TextureLoader();

textureLoader.load(
  "../assets/images/background/background-soldierProfile.png",
  (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;

    const backgroundGeometry = new THREE.PlaneGeometry(3.5, 3.5);

    const backgroundMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const backgroundImage = new THREE.Mesh(
      backgroundGeometry,
      backgroundMaterial,
    );

    // پشت مدل
    backgroundImage.position.set(0, 1, -0.8);

    // عکس عمودی و ثابت
    backgroundImage.rotation.set(0, 0, 0);

    // همیشه پشت مدل رندر شود
    backgroundImage.renderOrder = -1;

    scene.add(backgroundImage);
  },
  undefined,
  (error) => {
    console.error("Background image failed to load:", error);
  },
);

/* =========================================================
   Soldier 3D Model
   Optimized Version
========================================================= */

const sceneContainer = document.getElementById("scene");

if (!sceneContainer) {
  console.error("Three.js: #scene element not found.");
} else {
  /* =======================================================
     Scene
  ======================================================= */

  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0x050505);

  /* =======================================================
     Camera
  ======================================================= */

  const camera = new THREE.PerspectiveCamera(
    45,
    sceneContainer.clientWidth / Math.max(sceneContainer.clientHeight, 1),
    0.1,
    100,
  );

  // کمی دورتر از قبل
  camera.position.set(0, 1.5, 5.5);

  /* =======================================================
     Renderer
  ======================================================= */

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });

  // محدود کردن فشار GPU
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

  /* =======================================================
     Controls
  ======================================================= */

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = 0.06;

  // جلوگیری از جابه‌جایی مدل
  controls.enablePan = false;

  // محدود کردن زوم
  controls.minDistance = 4;
  controls.maxDistance = 8;

  /*
    محدود کردن زاویه عمودی:

    0       = بالا
    PI / 2  = روبه‌رو
    PI      = پایین

    بنابراین کاربر نمی‌تواند زیر مدل را ببیند.
  */

  controls.minPolarAngle = 0.7;
  controls.maxPolarAngle = 1.45;

  controls.target.set(0, 1, 0);

  controls.update();

  /* =======================================================
     Lighting
  ======================================================= */

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);

  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 2);

  mainLight.position.set(5, 7, 5);

  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);

  fillLight.position.set(-4, 3, 4);

  scene.add(fillLight);

  /* =======================================================
     Model
  ======================================================= */

  let soldier = null;

  const loader = new OBJLoader();

  const modelPath = "../assets/models/soldier-squidgame.obj";

  console.log("Three.js: loading model:", modelPath);

  loader.load(
    modelPath,

    /* =====================================================
       SUCCESS
    ===================================================== */

    (object) => {
      console.log("Three.js: Soldier model loaded successfully.");

      soldier = object;

      /* ---------------------------------------------------
         Calculate original size
      --------------------------------------------------- */

      const box = new THREE.Box3().setFromObject(soldier);

      const size = new THREE.Vector3();

      box.getSize(size);

      const maxSize = Math.max(size.x, size.y, size.z);

      console.log("Model size:", size.x, size.y, size.z);

      /* ---------------------------------------------------
         Normalize model size
      --------------------------------------------------- */

      if (maxSize > 0) {
        const targetSize = 3.2;

        const scale = targetSize / maxSize;

        soldier.scale.setScalar(scale);
      }

      /* ---------------------------------------------------
         Recalculate bounds
      --------------------------------------------------- */

      const newBox = new THREE.Box3().setFromObject(soldier);

      const center = new THREE.Vector3();

      newBox.getCenter(center);

      /* ---------------------------------------------------
         Center model
      --------------------------------------------------- */

      soldier.position.x = -center.x;

      soldier.position.z = -center.z;

      /* ---------------------------------------------------
         Put feet at bottom
      --------------------------------------------------- */

      soldier.position.y = -newBox.min.y - 1.01;

      /* ===================================================
         FRONT FACE
      =================================================== */

      /*
        مدل از ابتدا روبه‌روی کاربر قرار می‌گیرد.

        اگر در مدل فعلی صورت به سمت پشت بود،
        Math.PI آن را 180 درجه می‌چرخاند.
      */

      soldier.rotation.y = Math.PI;

      /* ---------------------------------------------------
         Materials
      --------------------------------------------------- */

      soldier.traverse((child) => {
        if (!child.isMesh) {
          return;
        }

        // Shadow کاملاً خاموش
        child.castShadow = false;
        child.receiveShadow = false;

        if (!child.material) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.75,
            metalness: 0.05,
          });
        } else {
          /*
            تنظیمات سبک‌تر متریال
          */

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

      /* ---------------------------------------------------
         Add model
      --------------------------------------------------- */

      scene.add(soldier);

      /* ---------------------------------------------------
         Camera target
      --------------------------------------------------- */

      controls.target.set(0, Math.max(size.y * 0.45, 0.8), 0);

      controls.update();

      console.log("Three.js: Soldier ready.");

      /*
        اولین رندر بعد از لود مدل
      */

      renderer.render(scene, camera);
    },

    /* =====================================================
       PROGRESS
    ===================================================== */

    (xhr) => {
      if (xhr.lengthComputable) {
        const percent = (xhr.loaded / xhr.total) * 100;

        console.log(`Soldier model: ${percent.toFixed(0)}%`);
      }
    },

    /* =====================================================
       ERROR
    ===================================================== */

    (error) => {
      console.error("Three.js: FAILED TO LOAD SOLDIER MODEL.", error);

      console.error("Expected model path:", modelPath);
    },
  );

  /* =======================================================
     Responsive
  ======================================================= */

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

  /* =======================================================
     Render Loop
  ======================================================= */

  /*
    چون مدل دیگر انیمیشن ندارد،
    نیازی نیست در هر فریم رندر کنیم.

    Three.js فقط هنگام تعامل کاربر
    با مدل رندر می‌شود.
  */

  let renderRequested = false;

  function requestRender() {
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

  /* -------------------------------------------------------
     Mouse / Touch interaction
  ------------------------------------------------------- */

  controls.addEventListener("change", requestRender);

  /* -------------------------------------------------------
     Initial render
  ------------------------------------------------------- */

  renderer.render(scene, camera);
}

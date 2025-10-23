import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { rtdb, auth } from './firebaseConfig.js';
import { ref, set, onValue, onDisconnect } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js';

// Scene setup
const container = document.getElementById('sceneContainer');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,10,7.5);
scene.add(light);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,1,0);
controls.update();

const loader = new GLTFLoader();
const assetsMap = {};

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// -------------------------
// Firebase Realtime Database integration
// -------------------------
auth.onAuthStateChanged(user => {
  if (!user) return window.location.href = 'index.html';

  const projectId = localStorage.getItem('projectId');
  if (!projectId) return;

  const sessionId = projectId;
  const userId = user.uid;

  // Track presence
  const userRef = ref(rtdb, `sessions/${sessionId}/usersPresent/${userId}`);
  set(userRef, { name: user.email, lastActive: Date.now() });
  onDisconnect(userRef).remove();

  // Listen for live asset updates
  const liveRef = ref(rtdb, `sessions/${sessionId}/liveChanges`);
  onValue(liveRef, snapshot => {
    const data = snapshot.val();
    if (!data) return;

    for (const assetId in data) {
      const obj = assetsMap[assetId];
      if (!obj) continue;
      const d = data[assetId];
      obj.position.set(...d.position);
      obj.rotation.set(...d.rotation);
    }
  });

  // Asset selection
  const assetSelector = document.getElementById("assetSelector");
  let selectedAssetId = null;

  assetSelector.addEventListener("change", e => selectedAssetId = e.target.value);

  // Move asset with arrow keys
  window.addEventListener('keydown', e => {
    if (!selectedAssetId || !assetsMap[selectedAssetId]) return;
    const asset = assetsMap[selectedAssetId];

    switch(e.key) {
      case 'ArrowUp': asset.position.z -= 0.1; break;
      case 'ArrowDown': asset.position.z += 0.1; break;
      case 'ArrowLeft': asset.position.x -= 0.1; break;
      case 'ArrowRight': asset.position.x += 0.1; break;
    }

    const assetRef = ref(rtdb, `sessions/${sessionId}/liveChanges/${selectedAssetId}`);
    set(assetRef, {
      position: [asset.position.x, asset.position.y, asset.position.z],
      rotation: [asset.rotation.x, asset.rotation.y, asset.rotation.z],
      lastModifiedBy: userId
    });
  });

  // Listen for asset load
  window.addEventListener("loadAssets", e => {
    const assets = e.detail || [];
    loadAssets(assets);
  });
});

// -------------------------
// Load assets
// -------------------------
function loadAssets(assets) {
  for (const key in assetsMap) scene.remove(assetsMap[key]);
  Object.keys(assetsMap).forEach(k => delete assetsMap[k]);

  const assetSelector = document.getElementById("assetSelector");
  assetSelector.innerHTML = `<option value="">--Select an asset--</option>`;

  assets.forEach(assetData => {
    loader.load(assetData.gltfPath,
      gltf => {
        const obj = gltf.scene;
        obj.position.set(...assetData.position);
        obj.rotation.set(...assetData.rotation);
        scene.add(obj);
        assetsMap[assetData.id] = obj;

        const option = document.createElement("option");
        option.value = assetData.id;
        option.textContent = assetData.id;
        assetSelector.appendChild(option);
      },
      undefined,
      err => console.error("Error loading asset:", assetData.id, err)
    );
  });
}

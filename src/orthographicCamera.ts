import "./style.css";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "dat.gui";

const scene = new THREE.Scene();
scene.add(new THREE.GridHelper());

// Main Camera (Orthographic)
const mainCamera = new THREE.OrthographicCamera(-4, 4, 4, -4, -5, 10);
mainCamera.position.set(1, 1, 1);
mainCamera.lookAt(0, 0.5, 0);

// Debug Camera (Perspective, to view the scene)
const debugCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
debugCamera.position.set(10, 10, 10);
debugCamera.lookAt(0, 0, 0);

// Create helper for orthographic camera
let cameraHelper = new THREE.CameraHelper(mainCamera);
scene.add(cameraHelper);

// Function to update camera helper
const updateCameraHelper = () => {
  scene.remove(cameraHelper);
  const newHelper = new THREE.CameraHelper(mainCamera);
  scene.add(newHelper);
  cameraHelper = newHelper;
};

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  //camera.aspect = window.innerWidth / window.innerHeight
  mainCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial({ wireframe: true });

const cube = new THREE.Mesh(geometry, material);
cube.position.y = 0.5;
scene.add(cube);

const stats = new Stats();
document.body.appendChild(stats.dom);

const gui = new GUI();

// Main Camera Controls (Orthographic)
const mainCameraFolder = gui.addFolder("Orthographic Camera");
mainCameraFolder.add(mainCamera, "left", -10, 0).onChange(() => {
  mainCamera.updateProjectionMatrix();
  updateCameraHelper();
});
mainCameraFolder.add(mainCamera, "right", 0, 10).onChange(() => {
  mainCamera.updateProjectionMatrix();
  updateCameraHelper();
});
mainCameraFolder.add(mainCamera, "top", 0, 10).onChange(() => {
  mainCamera.updateProjectionMatrix();
  updateCameraHelper();
});
mainCameraFolder.add(mainCamera, "bottom", -10, 0).onChange(() => {
  mainCamera.updateProjectionMatrix();
  updateCameraHelper();
});
mainCameraFolder.add(mainCamera, "near", -5, 5).onChange(() => {
  mainCamera.updateProjectionMatrix();
  updateCameraHelper();
});
mainCameraFolder.add(mainCamera, "far", 0, 10).onChange(() => {
  mainCamera.updateProjectionMatrix();
  updateCameraHelper();
});
mainCameraFolder.open();

// Debug Camera Controls
const debugCameraFolder = gui.addFolder("Debug Camera");
debugCameraFolder.add(debugCamera.position, "x", -20, 20);
debugCameraFolder.add(debugCamera.position, "y", -20, 20);
debugCameraFolder.add(debugCamera.position, "z", -20, 20);
debugCameraFolder.open();
// Add camera switch control
const params = {
  activeCamera: "debug",
};

gui.add(params, "activeCamera", ["main", "debug"]).onChange((value) => {
  cameraHelper.visible = value === "debug";
});

function animate() {
  requestAnimationFrame(animate);

  // Use the selected camera
  const activeCamera =
    params.activeCamera === "main" ? mainCamera : debugCamera;
  renderer.render(scene, activeCamera);

  stats.update();
}

animate();

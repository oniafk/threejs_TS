import "./style.css";
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "dat.gui";

const scene = new THREE.Scene();
scene.add(new THREE.GridHelper());

//? Rename your existing camera to mainCamera
const mainCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
mainCamera.position.set(0, 2, 5);
mainCamera.lookAt(0, 1, 0);

//? Create debug camera

const debugCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
debugCamera.position.set(10, 10, 10); //? Position it far enough to see the scene
debugCamera.lookAt(0, 0, 0);

//? Create helper for main camera
let cameraHelper = new THREE.CameraHelper(mainCamera);
scene.add(cameraHelper);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//? Update resize handler
window.addEventListener("resize", () => {
  //adding resize event listener to update the camera aspect ratio
  const aspect = window.innerWidth / window.innerHeight;
  mainCamera.aspect = aspect;
  debugCamera.aspect = aspect;
  mainCamera.updateProjectionMatrix();
  debugCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//? Function to update camera helper
const updateCameraHelper = () => {
  scene.remove(cameraHelper);
  const newHelper = new THREE.CameraHelper(mainCamera);
  scene.add(newHelper);
  cameraHelper = newHelper;
};

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial({ wireframe: true });

const cube = new THREE.Mesh(geometry, material);
cube.position.y = 0.5;
scene.add(cube);

const stats = new Stats();
document.body.appendChild(stats.dom);

const gui = new GUI();

//? Main Camera Controls
const mainCameraFolder = gui.addFolder("Main Camera");
mainCameraFolder
  .add(mainCamera.position, "x", -10, 10)
  .onChange(updateCameraHelper);
mainCameraFolder
  .add(mainCamera.position, "y", -10, 10)
  .onChange(updateCameraHelper);
mainCameraFolder
  .add(mainCamera.position, "z", -10, 10)
  .onChange(updateCameraHelper);
mainCameraFolder.add(mainCamera, "fov", 0, 180, 0.01).onChange(() => {
  mainCamera.updateProjectionMatrix();
  updateCameraHelper();
});
mainCameraFolder.add(mainCamera, "aspect", 0.00001, 10).onChange(() => {
  mainCamera.updateProjectionMatrix();
  updateCameraHelper();
});
mainCameraFolder.add(mainCamera, "near", 0.01, 10).onChange(() => {
  mainCamera.updateProjectionMatrix();
  updateCameraHelper();
});
mainCameraFolder.add(mainCamera, "far", 0.01, 10).onChange(() => {
  mainCamera.updateProjectionMatrix();
  updateCameraHelper();
});
mainCameraFolder.open();

// Debug Camera Controls
const debugCameraFolder = gui.addFolder("Debug Camera");
debugCameraFolder.add(debugCamera.position, "x", -20, 20);
debugCameraFolder.add(debugCamera.position, "y", -20, 20);
debugCameraFolder.add(debugCamera.position, "z", -20, 20);
debugCameraFolder.add(debugCamera, "fov", 0, 180, 0.01).onChange(() => {
  debugCamera.updateProjectionMatrix();
});
debugCameraFolder.add(debugCamera, "aspect", 0.00001, 10).onChange(() => {
  debugCamera.updateProjectionMatrix();
});
debugCameraFolder.add(debugCamera, "near", 0.01, 10).onChange(() => {
  debugCamera.updateProjectionMatrix();
});
debugCameraFolder.add(debugCamera, "far", 0.01, 10).onChange(() => {
  debugCamera.updateProjectionMatrix();
});
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
  mainCamera.lookAt(0, 0.5, 0);
  // Use the selected camera
  const activeCamera =
    params.activeCamera === "main" ? mainCamera : debugCamera;
  renderer.render(scene, activeCamera);

  stats.update();
}

animate();

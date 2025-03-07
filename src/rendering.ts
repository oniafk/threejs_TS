import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 1000);
camera.position.z = 3;

const canvas = document.querySelector("#cube") as HTMLCanvasElement;
const container = canvas.parentElement as HTMLElement;
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, // transparent background
  antialias: true, // smooth edges, pixel ratio, consumes more resources
});

// Function to handle responsive sizing
const updateSize = () => {
  // Get current container dimensions
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // Update camera aspect ratio to match container dimensions
  camera.aspect = containerWidth / containerHeight;
  // Recalculate camera projection matrix with new aspect ratio
  camera.updateProjectionMatrix();

  // Set renderer size and pixel ratio for sharp rendering
  // Math.min(window.devicePixelRatio, 2) prevents performance issues on high-DPI displays
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // false parameter prevents renderer from setting canvas CSS style
  renderer.setSize(containerWidth, containerHeight, false);
};

// Initialize sizes on load
updateSize();

//! we dont need to append the renderer to the body we can append it to the canvas
// document.body.appendChild(renderer.domElement);

updateSize();

//! we now have stop the resize event listener and use the updateSize function
//! if we dont stop it the canvas will resize to the window size and not the container size

// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial({ wireframe: true });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();

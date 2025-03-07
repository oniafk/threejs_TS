import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 1.5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

// we can add a function to just render the scene on the moment we want
// we can use the orbit controls to move the camera and the cube will be rendered when we want and avoid the performance issues calling an animation all the time

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener("change", function () {
  renderer.render(scene, camera);
});

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial({ wireframe: true });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const stats = new Stats();
document.body.appendChild(stats.dom);

const clock = new THREE.Clock();
let delta;

function animate() {
  // frameRequestCallback comes from the window object (browser)
  // the refresh rate depends on the browser and the device we need to think
  // about the performance of the device and the browser from the user

  //   delta = clock.getDelta(); // seconds. Time since the last call to this method. and it doesnt depend on the frame rate

  //   requestAnimationFrame(animate);

  //   cube.rotation.x += 0.01 * delta;
  //   cube.rotation.y += 0.01 * delta;

  //we dont need an animation all the time, we can show the cube and still use the orbit controls

  //   renderer.render(scene, camera);

  stats.update();
}

animate();

renderer.render(scene, camera);

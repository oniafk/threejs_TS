import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "dat.gui";

const basePath = "/penguins-skybox-pack/penguins/";

const sceneA = new THREE.Scene();
sceneA.background = new THREE.Color(0x135462); // background color can be color or image with the TextureLoader

const sceneB = new THREE.Scene();
sceneB.background = new THREE.CubeTextureLoader()
  .setPath(basePath)
  .load([
    "arid_ft.jpg",
    "arid_bk.jpg",
    "arid_up.jpg",
    "arid_dn.jpg",
    "arid_rt.jpg",
    "arid_lf.jpg",
  ]);

// sceneB.backgroundBlurriness = 0.2; // the higher the value the more blurry the background will be

//? the order for the images is the same as the order of the faces of the cube
//? the order is: right, left, top, bottom, front, back

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x2a2d43);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x7f2ccb,
  transparent: true,
  opacity: 1,
  wireframe: true,
});

const cube = new THREE.Mesh(geometry, material);
sceneA.add(cube);

const stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const gui = new GUI();

const cubeFolder = gui.addFolder("Cube");
cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2);
cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2);
cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2);
cubeFolder.open();

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "z", 0, 20);
cameraFolder.open();

let activeScene = sceneA;
const setScene = {
  sceneA: () => {
    activeScene = sceneA;
  },
  sceneB: () => {
    activeScene = sceneB;
  },
};

gui.add(setScene, "sceneA").name("Scene A");
gui.add(setScene, "sceneB").name("Scene B");

function animate() {
  requestAnimationFrame(animate);

  stats.begin(); // we can now measure the time it takes to render the scene starting from here
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.005;
  stats.end(); // we can now measure the time it takes to render the scene up to here
  // this means that stats will measure the performance of the code between stats.begin() and stats.end() just the animation code in this case

  renderer.render(activeScene, camera);

  stats.update();
}

animate();

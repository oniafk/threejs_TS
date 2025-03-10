import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";

const scene = new THREE.Scene();

const gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);

const hdr = "https://sbcode.net/img/venice_sunset_1k.hdr";

new RGBELoader().load(hdr, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
  scene.backgroundBlurriness = 1;
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(3, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.75, 0);

const stats = new Stats();
document.body.appendChild(stats.dom);

function lerp(from: number, to: number, speed: number) {
  const amount = (1 - speed) * from + speed * to;
  return Math.abs(from - to) < 0.001 ? to : amount;
}

let mixer: THREE.AnimationMixer;
let animationActions: { [key: string]: THREE.AnimationAction } = {};
let activeAction: THREE.AnimationAction;
let speed = 0,
  toSpeed = 0;

// new GLTFLoader().load("models/queen$@thinking.glb", (gltf) => {
//   mixer = new THREE.AnimationMixer(gltf.scene);
//   //   console.log(gltf);

//   mixer.clipAction(gltf.animations[0]).play();

//   scene.add(gltf.scene);
// });

async function loadEve() {
  const loader = new GLTFLoader();
  const [eve, yelling, run] = await Promise.all([
    loader.loadAsync("models/queen$@thinking.glb"),
    loader.loadAsync("models/queen@yelling.glb"),
    loader.loadAsync("models/queen@run.glb"),
  ]);

  mixer = new THREE.AnimationMixer(eve.scene);

  // mixer.clipAction(yelling.animations[0]).play();

  animationActions["yelling"] = mixer.clipAction(yelling.animations[0]);
  animationActions["thinking"] = mixer.clipAction(eve.animations[0]);
  animationActions["run"] = mixer.clipAction(run.animations[0]);

  animationActions["thinking"].play();
  activeAction = animationActions["thinking"];

  scene.add(eve.scene);
}
await loadEve();

const keyMap: { [key: string]: boolean } = {};

const onDocumentKey = (e: KeyboardEvent) => {
  keyMap[e.code] = e.type === "keydown";
};
document.addEventListener("keydown", onDocumentKey, false);
document.addEventListener("keyup", onDocumentKey, false);

const clock = new THREE.Clock();
let delta = 0;

function animate() {
  requestAnimationFrame(animate);

  delta = clock.getDelta();

  controls.update();

  mixer.update(delta);

  if (keyMap["KeyR"]) {
    //walk
    if (activeAction != animationActions["run"]) {
      activeAction.fadeOut(1);
      animationActions["run"].reset().fadeIn(0.5).play();
      activeAction = animationActions["run"];
      toSpeed = 20;
    }
  } else if (keyMap["KeyY"]) {
    if (activeAction != animationActions["yelling"]) {
      activeAction.fadeOut(0.5);
      animationActions["yelling"].reset().fadeIn(0.25).play();
      activeAction = animationActions["yelling"];
      toSpeed = 0;
    }
  } else {
    //idle
    if (activeAction != animationActions["thinking"]) {
      activeAction.fadeOut(0.5);
      animationActions["thinking"].reset().fadeIn(0.25).play();
      activeAction = animationActions["thinking"];
      toSpeed = 0;
    }
  }

  speed = lerp(speed, toSpeed, delta * 10);
  gridHelper.position.z -= speed * delta;
  gridHelper.position.z = gridHelper.position.z % 10;

  renderer.render(scene, camera);

  stats.update();
}

animate();

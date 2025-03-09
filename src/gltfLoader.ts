import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import Stats from "three/addons/libs/stats.module.js";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";

const scene = new THREE.Scene();

const light = new THREE.SpotLight(undefined, Math.PI * 1000);
light.position.set(5, 5, 5);
light.angle = Math.PI / 16;
light.castShadow = true;
scene.add(light);

const helper = new THREE.SpotLightHelper(light);
scene.add(helper);

const hdr = "https://sbcode.net/img/venice_sunset_1k.hdr";

new RGBELoader().load(hdr, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1.5, 0.75, 2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.1;
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const textureLoader = new THREE.TextureLoader();
const textureFlare0 = textureLoader.load(
  "https://cdn.jsdelivr.net/gh/Sean-Bradley/First-Car-Shooter@main/dist/client/img/lensflare0.png"
);

const lensflare = new Lensflare();
lensflare.addElement(new LensflareElement(textureFlare0, 1000, 0));
light.add(lensflare);

new GLTFLoader().load("models/suzanne_scene.glb", (gltf) => {
  console.log(gltf);

  const suzanne = gltf.scene.getObjectByName("Suzanne") as THREE.Mesh;
  suzanne.castShadow = true;

  const plane = gltf.scene.getObjectByName("Plane") as THREE.Mesh;
  plane.receiveShadow = true;

  scene.add(gltf.scene);
});

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);

  stats.update();
}

animate();

//? Understanding Lensflare in Three.js
//? The lensflare effect is making your SpotLight appear more like a bright PointLight for several reasons:

//? What Lensflare Does
//? Visual Enhancement: Lensflare creates bright streaks and hexagonal patterns that mimic how cameras react to intense light sources.

//? Visual Dominance: The high intensity value (1000 in your code) makes the flare visually dominant, drawing attention away from the actual cone shape of your SpotLight.

//? Point-like Appearance: The LensflareElement is positioned at the light source itself, creating a bright point of light that overwhelms the directional nature of the SpotLight.

//? Technical Details
//? Let's break down your code:

//? new LensflareElement(textureFlare0, 1000, 0) creates a lens flare element with:
//? textureFlare0: The texture image for the flare
//? 1000: The size/intensity of the flare (very high value)
//? 0: The distance from the light source (0 means at the exact light position)
//? Why It Appears Like a PointLight
//? Occlusion of Direction: The intense flare at the light source visually overwhelms the directionality of the SpotLight.

//? Missing Visual Cues: Without seeing the actual light cone clearly, viewers naturally interpret it as an omnidirectional point source.

//? Missing Second Parameter: You're not adding additional flare elements at different distances that would help visualize the light direction.

//? To Make It Look More Like a SpotLight
//? This creates a more directional flare effect by adding smaller elements along the light's direction, better representing the SpotLight's cone nature.

//? The lensflare effect is primarily aesthetic and doesn't affect the actual light behavior in terms of illumination—just how the light source itself appears visually to the viewer.

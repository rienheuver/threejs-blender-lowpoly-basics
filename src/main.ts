import {
  Color,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "three";

import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import "./styles.css";

const scene = new Scene();
scene.background = new Color(0x87ceeb);
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
);
const renderer = new WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const loader = new GLTFLoader();
loader.load("./experiment1.glb", (glb) => {
  scene.add(glb.scene);
  glb.scene.traverse((node) => {
    if (node instanceof Mesh) {
      const standardMat = node.material;

      node.material = new MeshPhongMaterial({ color: standardMat.color });
      node.castShadow = true;
      node.receiveShadow = true;
    }
    if (node instanceof PointLight) {
      node.intensity = node.intensity / 1000;
      node.castShadow = true;
    }
    if (node instanceof DirectionalLight) {
      node.intensity = node.intensity / 10000;
    }
  });
});

camera.position.z = 5;
camera.position.y = 2;

const stats = new Stats();
document.body.appendChild(stats.dom);
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  stats.update();

  renderer.render(scene, camera);
}
animate();

// Debugging
// scene.add(new CameraHelper(lantern.shadow.camera));

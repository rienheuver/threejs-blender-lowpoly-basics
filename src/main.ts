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
    console.log(node);
  });
  scene.add(glb.scene);
});

camera.position.z = 5;
camera.position.y = 2;

// Non-shadow lighting
// scene.add(new HemisphereLight(0x87ceeb, 0xccffcc, 0.3));

// Sun
const sun = new DirectionalLight(0xffffff, 0.1);
sun.position.set(30, 70, 30);
// sun.castShadow = true;
sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;
sun.shadow.camera.near = 0.01;
// scene.add(sun);

// Point (like a lantern)
for (let i = 0; i < 3; i++) {
  const lantern = new PointLight(0xffffff, 20);
  lantern.position.set(i * 10, 3, 0);
  lantern.castShadow = true;
  // scene.add(lantern);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // cube.rotation.x += 0.01;
  // cube.rotation.z += 0.01;

  renderer.render(scene, camera);
}
animate();

// Debugging
// scene.add(new CameraHelper(lantern.shadow.camera));

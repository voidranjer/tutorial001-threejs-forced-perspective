import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls";

// three.js objects (https://threejs.org/docs/#manual/en/introduction/Creating-a-scene)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
);
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const pointerLockControls = new PointerLockControls(camera, document.body);

// state variables
const state = {
  keyboard: {
    forward: false,
    backward: false,
    left: false,
    right: false,
  },
};

// setup function: we call this function only once at the beginning of the program to setup the scene
function setup() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  document.body.addEventListener("click", (e) => pointerLockControls.lock());

  // add objects to the scene
  scene.add(plane);
  scene.add(sphere);

  // move camera backwards so we can see the objects
  camera.position.z = 5;
}

// define the animation loop function which will run ones per frame (typically 60fps)
function animate() {
  renderer.render(scene, camera);
}

setup(); // setup the scene
renderer.setAnimationLoop(animate); // start the animation loop

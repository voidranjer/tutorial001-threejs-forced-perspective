import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls";
import { onKeyDown, onKeyUp, onMouseDown, onMouseUp } from "./eventListeners";
import { updateCameraPosition } from "./camera";
import { PivotPoint } from "./PivotPoint";

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
const pivotParent = new PivotPoint(scene, sphere, camera);
const raycaster = new THREE.Raycaster();

// state variables
const state = {
  keyboard: {
    forward: false,
    backward: false,
    left: false,
    right: false,
  },
  mouse: {
    isMouseDown: false,
    prevIsMouseDown: false,
  },
};

// setup function: we call this function only once at the beginning of the program to setup the scene
function setup() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  document.body.addEventListener("click", (e) => pointerLockControls.lock());
  document.body.addEventListener("keydown", (e) => onKeyDown(e, state));
  document.body.addEventListener("keyup", (e) => onKeyUp(e, state));
  document.body.addEventListener("mousedown", () => onMouseDown(state));
  document.body.addEventListener("mouseup", () => onMouseUp(state));

  // add objects to the scene
  scene.add(plane);
  scene.add(sphere);

  // move camera backwards so we can see the objects
  camera.position.z = 5;
}

// define the animation loop function which will run ones per frame (typically 60fps)
function animate() {
  const cameraDir = updateCameraPosition(camera, state);
  const oneUnitFromCamera = camera.position.clone().add(cameraDir);

  // shoot a ray from the camera to the center of the screen
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);
  const intersects = raycaster.intersectObject(sphere);

  // CASE: mousedown
  if (state.mouse.isMouseDown) {
    if (intersects.length > 0) {
      // Only set the pivot point if this is the first frame the mouse is held down
      if (!state.mouse.prevIsMouseDown) pivotParent.anchor(intersects[0].point);
    }

    pivotParent.setPos(oneUnitFromCamera);
    document.getElementById("crosshair").style.borderColor = "blue";
  }

  // CASE: mouseup
  else if (!state.mouse.isMouseDown) {
    // let go of ball: detach it from pivotParent (reattaches it to the scene directly)
    pivotParent.detach();

    document.getElementById("crosshair").style.borderColor = "white";
  }

  // remember current state to be used in next frame
  state.mouse.prevIsMouseDown = state.mouse.isMouseDown;

  renderer.render(scene, camera);
}

setup(); // setup the scene
renderer.setAnimationLoop(animate); // start the animation loop

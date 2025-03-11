import * as THREE from "three";

// constants
const SPEED = 0.05;

export function updateCameraPosition(camera, state) {
  const cameraDir = new THREE.Vector3();

  /* Another instance of pass-by-reference: Object3D.getWorldDirection() will copy
  the value of the Object's world direction into the Vector3 object we pass in. */
  camera.getWorldDirection(cameraDir);

  /* We normalize the vector (convert it to a unit vector of magnitude '1').
  This is so that we can reliably scale the vector by a constant value (SPEED)
  without worrying about the existing magnitude of the vector. */
  cameraDir.normalize();

  /* Clone the vector so it doesn't affect the original. */
  const cameraDirWithoutY = cameraDir.clone();

  /* We are getting rid of the 'y' component. We don't want to move up and down when the 
  camera direction is even slightly inclined. This simulates walking on 'flat ground'.
  Also, this is known as 'projection'. */
  cameraDirWithoutY.y = 0;

  const cameraDirLeft = new THREE.Vector3();

  /* The Cross Product gives us the vector which represents the left direction of the camera.
  Continue reading for a more detailed explanation. */
  cameraDirLeft.crossVectors(camera.up, cameraDir);

  if (state.keyboard.forward) {
    // 'forward' means to move toward the direction that the camera is facing
    // this is equiv to saying `cameraPos = cameraPos + cameraDir * SPEED`
    camera.position.addScaledVector(cameraDirWithoutY, SPEED);
  }
  if (state.keyboard.backward) {
    camera.position.addScaledVector(cameraDirWithoutY, -SPEED);
  }
  if (state.keyboard.left) {
    camera.position.addScaledVector(cameraDirLeft, SPEED);
  }
  if (state.keyboard.right) {
    camera.position.addScaledVector(cameraDirLeft, -SPEED);
  }

  return cameraDir;
}

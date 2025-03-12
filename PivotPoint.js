import * as THREE from "three";

export class PivotPoint {
  constructor(scene, targetObj, camera) {
    this.scene = scene;
    this.targetObj = targetObj;
    this.camera = camera;

    this.obj = new THREE.Object3D();
    scene.add(this.obj);

    // Rotation
    this.capturedObjQuaternion = new THREE.Quaternion();
    this.capturedCameraQuaternion = new THREE.Quaternion();
  }

  detach() {
    /**
     * Attaching an object to another new object in Three.js will detach it from its current parent.
     */
    this.scene.attach(this.targetObj);
  }

  anchor(from) {
    /*
     * Detach the sphere from the pivotParent by attaching it to the scene (using `.attach` instead of `.add` to preserve world transform)
     * Recommmendation: Experiment with and/or study the difference between `.add` and `.attach` in Three.js
     * In other words: we are preparing to move the pivotParent to the target start location, while keeping the object in place.
     */
    this.detach();

    /*
     * We move the pivotParent object to the target start location.
     * Because the object is now attached to the scene, it will not move along with the pivotParent, but instead remain in place.
     */
    this.obj.position.copy(from);

    /**
     * Now that we've moved our pivotParent to the target anchor point, we can reattach the object to the pivotParent.
     * Any future movement of the pivotParent will now affect the object as well.
     */
    this.obj.attach(this.targetObj);

    /**
     * Capture the current rotations.
     */
    this.capturedObjQuaternion.copy(this.obj.quaternion);
    this.capturedCameraQuaternion.copy(this.camera.quaternion);
  }

  setPos(to) {
    /**
     * We make changes to the pivotParent's position, and the object will follow along.
     * Example: Moving the pivotParent 5 units backwards will result in the object moving 5 units backwards as well.
     * Crucially, the relative transforms will be preserved, meaning that the object will not be centered at the target location,
     * but instead move 5 units backwards relative from its current position.
     */
    this.obj.position.copy(to);

    /**
     * Rotate the object by as much as the camera has rotated since the pivotParent was anchored.
     * Check out https://jamesyap.org/home/tutorials/superliminal#4-rotation-on-the-object for a comprehensive explanation.
     * Keep in mind the usage of `.clone()` to prevent modifying the original quaternions.
     */
    const rotationTransformation = this.camera.quaternion
      .clone()
      .multiply(this.capturedCameraQuaternion.clone().invert());
    this.obj.quaternion.copy(
      rotationTransformation.multiply(this.capturedObjQuaternion)
    );
  }
}

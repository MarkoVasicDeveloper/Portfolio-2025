import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export class FirstPersonController {
    private controls: PointerLockControls;
    private velocity: THREE.Vector3;
    private direction: THREE.Vector3;
    private keys: { forward: boolean, backward: boolean, left: boolean, right: boolean };
    private clock: THREE.Clock;
    private previousCamPosition: THREE.Vector3;
    public isLocked: boolean;

    constructor (camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
        this.controls = new PointerLockControls(camera, domElement);
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.keys = { forward: false, backward: false, left: false, right: false };
        this.clock = new THREE.Clock();
        this.previousCamPosition = camera.position.clone();
        this.isLocked = false;

        this.initEventListeners();
    };

    public unlock () {
        this.controls.unlock();
        this.isLocked = false;
    };

    public lock () {
        this.controls.lock();
        this.isLocked = true;
    };

    private initEventListeners () {
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyW':
                    this.keys.forward = true;
                    break;
                case 'KeyS':
                    this.keys.backward = true;
                    break;
                case 'KeyA':
                    this.keys.left = true;
                    break;
                case 'KeyD':
                    this.keys.right = true;
                    break;
            };
        });

        document.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyW':
                    this.keys.forward = false;
                    break;
                case 'KeyS':
                    this.keys.backward = false;
                    break;
                case 'KeyA':
                    this.keys.left = false;
                    break;
                case 'KeyD':
                    this.keys.right = false;
                    break;
            };
        });
    };

    public update () {
        if(!this.isLocked) return;

        const delta = this.clock.getDelta();

        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;

        this.direction.z = Number(this.keys.forward) - Number(this.keys.backward);
        this.direction.x = Number(this.keys.right) - Number(this.keys.left);
        this.direction.normalize();

        if (this.keys.forward || this.keys.backward) {
            this.velocity.z -= this.direction.z * 100.0 * delta;
        };

        if (this.keys.left || this.keys.right) {
            this.velocity.x -= this.direction.x * 100.0 * delta;
        };

        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);
    };

    public focusOnObject(target: THREE.Object3D, camera: THREE.PerspectiveCamera) {
        this.previousCamPosition = camera.position.clone();
        this.unlock();
    
        const boundingBox = new THREE.Box3().setFromObject(target);
        const center = boundingBox.getCenter(new THREE.Vector3());
    
        const offset = new THREE.Vector3(0, 0, 0.65);
        target.localToWorld(offset);
    
        const startPosition = camera.position.clone();
        const finalPosition = offset;
    
        const duration = 1.0;
        let elapsedTime = 0;
    
        const animateFocus = () => {
            const delta = this.clock.getDelta();
            elapsedTime += delta;
    
            const progress = Math.min(elapsedTime / duration, 1);
    
            camera.position.lerpVectors(startPosition, finalPosition, progress);
    
            camera.lookAt(center);
    
            if (progress < 1) requestAnimationFrame(animateFocus);
        };
    
        animateFocus();
    }

    public returnToPreviousPosition (camera: THREE.PerspectiveCamera) {
        camera.position.copy(this.previousCamPosition);
        this.lock();
    };
};
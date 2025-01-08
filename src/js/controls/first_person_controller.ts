import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export class FirstPersonController {
    private controls: PointerLockControls;
    private velocity: THREE.Vector3;
    private direction: THREE.Vector3;
    private keys: { forward: boolean, backward: boolean, left: boolean, right: boolean };
    private clock: THREE.Clock;

    constructor (camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
        this.controls = new PointerLockControls(camera, domElement);
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.keys = { forward: false, backward: false, left: false, right: false };
        this.clock = new THREE.Clock();

        console.log("Camera position at initialization:", camera.position);

        this.initEventListeners();
    };

    public isLocked (): boolean {
        return this.controls.isLocked;
    };

    public lock (): void {
        this.controls.lock();
    };

    private initEventListeners () {
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyW':
                    console.log(event.code); 
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
        if(!this.isLocked()) return;

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
};
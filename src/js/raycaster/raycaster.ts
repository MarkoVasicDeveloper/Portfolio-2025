import * as THREE from 'three';
import { FirstPersonController } from '../controls/first_person_controller';

export class Raycaster {
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private intersectedObject: THREE.Object3D | null;

    constructor () {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2;
        this.intersectedObject = null;
        this.initEventListener();
    };

    private initEventListener() {
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        })
    };

    public castRay (camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
        this.raycaster.setFromCamera(this.mouse, camera);

        const intersects = this.raycaster.intersectObjects(scene.children, true);

        if(intersects.length > 0) {
            this.intersectedObject = intersects[0].object;
            return;
        };

        this.intersectedObject = null;
    };

    public onClick(controller: FirstPersonController, camera: THREE.PerspectiveCamera) {
        if(this.intersectedObject) {
            if(this.intersectedObject.name == 'tv_screen') {
                controller.focusOnObject(this.intersectedObject, camera);
            };
        };
    };
};
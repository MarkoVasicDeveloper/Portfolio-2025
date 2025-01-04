import { objectLoader } from "..";
import room from '../../../static/scene6.glb';

import * as THREE from 'three';

export class Room {
    monitor_material: THREE.Material | undefined;
    tv_screen_material: THREE.Material | undefined;

    constructor() {
        this.monitor_material = undefined;
        this.tv_screen_material = undefined;
        objectLoader.loadModel(room, this.onLoad, (error) => console.log(error));
    };

    onLoad = (model: THREE.Group) => {
        model.position.set(0, -19, -1);
        model.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                switch (child.userData.name) {
                    case 'tv_screen':
                        this.tv_screen_material = child.material;
                        child.userData.position = this.calculatePosition(child.position, { y: -19, z: -1 });
                        break;
                    case 'Plane008_1':
                        this.monitor_material = child.material;
                        child.userData.position = this.calculatePosition(child.position, { y: -19, z: -1 });
                        break;
                };
            };
        });
        console.log(model)
    };

    calculatePosition = (position: THREE.Vector3, offsets: Partial<{ x: number; y: number; z: number }>) => {
        return {
            x: position.x + (offsets.x || 0),
            y: position.y + (offsets.y || 0),
            z: position.z + (offsets.z || 0),
        };
    };
};
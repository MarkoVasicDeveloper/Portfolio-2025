import * as THREE from 'three';
import { SceneManager } from './scene_manager';
import { ObjectLoader } from './object_loader';
import { Room } from './model/room';

export const manager = new SceneManager();
export const objectLoader = new ObjectLoader(manager);

new Room();

function animate() {
	requestAnimationFrame(animate);

    manager.render();
};

animate();

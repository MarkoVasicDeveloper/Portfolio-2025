import * as THREE from 'three';
import { SceneManager } from './scene_manager';

export const manager = new SceneManager();

function animate() {
	requestAnimationFrame(animate);

    manager.render();
};

animate();

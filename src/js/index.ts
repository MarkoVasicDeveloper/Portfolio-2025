import * as THREE from 'three';
import { SceneManager } from './sceen_manager';

export const manager = new SceneManager();

function animate() {
	requestAnimationFrame(animate);

    manager.render();
};

animate();

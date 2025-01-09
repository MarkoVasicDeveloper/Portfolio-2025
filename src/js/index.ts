import { SceneManager } from './scene_manager';
import { ObjectLoader } from './object_loader';
import { Room } from './model/room';
import { FirstPersonController } from './controls/first_person_controller';
import { Raycaster } from './raycaster/raycaster';

export const manager = new SceneManager();
export const objectLoader = new ObjectLoader(manager);
const controller = new FirstPersonController(manager.camera, manager.renderer.domElement);
const ray = new Raycaster();

document.addEventListener('click', () => {
    if (!controller.isLocked) controller.lock();
    ray.onClick(controller, manager.camera);
});

new Room();

function animate() {
	requestAnimationFrame(animate);

    ray.castRay(manager.camera, manager.scene);
    controller.update();
    manager.render();
};

animate();

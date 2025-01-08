import { SceneManager } from './scene_manager';
import { ObjectLoader } from './object_loader';
import { Room } from './model/room';
import { FirstPersonController } from './controls/first_person_controller';

export const manager = new SceneManager();
export const objectLoader = new ObjectLoader(manager);
const controller = new FirstPersonController(manager.camera, manager.renderer.domElement);

document.addEventListener('click', () => {
    controller.lock();
});

new Room();

function animate() {
	requestAnimationFrame(animate);

    controller.update();
    manager.render();
};

animate();

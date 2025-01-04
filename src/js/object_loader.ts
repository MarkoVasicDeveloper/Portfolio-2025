import * as THREE from 'three';

import { IDBPDatabase, openDB } from 'idb';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface Manager {
    scene: THREE.Scene
};
 
export class ObjectLoader {
    manager: Manager;
    loader: GLTFLoader;
    dbPromise: Promise<IDBPDatabase>;

    constructor(manager: Manager) {
        this.manager = manager;
        this.loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('examples/js/libs/draco/');
        this.loader.setDRACOLoader(dracoLoader);
        
        this.dbPromise = openDB('model-cache', 1, {
            upgrade(db) {
                db.createObjectStore('models');
            }
        });
    };

    async loadModel(path: IDBKeyRange | IDBValidKey, onLoad?: (model: THREE.Group) => void, onError?: (error: ErrorEvent) => void) {
        const db = await this.dbPromise;

        const cachedData = await db.get('models', path);
        if(cachedData) {
            const blob = new Blob([cachedData], { type: 'application/octet-stream'});

            this.loader.parse( await blob.arrayBuffer(), '', (gltf) => {
                const model = gltf.scene;
                this.manager.scene.add(model);
                if (onLoad) onLoad(model);
            }, (error) => {
                if(onError) onError(error)
            });
            return;
        };

        this.loader.load(
            path.toString(), 
            async (gltf) => {
                const model = gltf.scene;
                this.manager.scene.add(model);
                if(onLoad) onLoad(model);

                const exporter = new GLTFExporter();
                exporter.parse(model, 
                    (gltfData) => {
                        db.put('models', gltfData, path);
                    },
                    (error) => {
                        console.error('GLTFExporter encountered an error:', error);
                    },
                    { binary: true }
                );
            },
            undefined,
            (error) => { if(onError && error instanceof ErrorEvent) onError(error) }
        )
    };
};
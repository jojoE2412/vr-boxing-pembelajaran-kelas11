import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import leftGloveUrl from '../assets/models/boxing_glove_left.glb?url';
import rightGloveUrl from '../assets/models/boxing_glove_right.glb?url';
import ringUrl from '../assets/models/boxing_ring.glb?url';
import dummyUrl from '../assets/models/training_dummy.glb?url';
import gymUrl from '../assets/models/gym.glb?url';
import { placeGlove, placeGym, placeRing } from './assetPositions.js';

const loader = new GLTFLoader();

function loadModel(url) {
    return new Promise((resolve, reject) => {
        loader.load(url, gltf => resolve(gltf.scene), undefined, reject);
    });
}

export async function loadAssets(scene, controllers, target, playerAnchor) {
    const results = {};
    const loadAndAttach = async (key, url, setup) => {
        try {
            const model = await loadModel(url);
            setup(model);
            results[key] = model;
            console.log(`[A3D] ${key.toUpperCase()} LOADED`);
            return model;
        } catch (error) {
            console.error(`[A3D] ${key.toUpperCase()} LOAD ERROR`, error);
            results[key] = null;
            return null;
        }
    };

    await Promise.all([
        loadAndAttach('gym', gymUrl, model => { placeGym(model); scene.add(model); }),
        loadAndAttach('ring', ringUrl, model => { placeRing(model); scene.add(model); }),
        loadAndAttach('dummy', dummyUrl, model => {
            model.scale.setScalar(0.77);
            model.rotation.set(0, 0, 0);
            model.visible = false;
            scene.add(model);
        }),
        loadAndAttach('leftGlove', leftGloveUrl, model => {
            placeGlove(model, 'left');
            controllers.left.add(model);
            controllers.leftFist.visible = false;
        }),
        loadAndAttach('rightGlove', rightGloveUrl, model => {
            placeGlove(model, 'right');
            controllers.right.add(model);
            controllers.rightFist.visible = false;
        })
    ]);

    return { ...results, target, playerAnchor };
}


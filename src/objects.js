import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { opts } from './gui';
import { getPerlin2D, getPerlin3D } from './noise';

async function spawnObject(path, x, y, z, size, colour, noisySize, noisyPos) {
    let loader = new FBXLoader();
    let obj = await loader.loadAsync(path);
    let child = obj.children[0];

    child.castShadow = true;
    child.receiveShadow = true;
    child.material.color = colour ?? new THREE.Color(1, 1, 1);

    child.position.x = x;
    child.position.y = y;
    child.position.z = z;

    if (noisyPos ?? true) {
        child.position.x += getPerlin3D(new THREE.Vector3(x, 0, z)) * 0.5 - 0.25;
        child.position.z += getPerlin3D(new THREE.Vector3(x, 100, z)) * 0.5 - 0.25;
    }

    if (noisySize ?? true)
        size *= 0.75 + Math.random() * 0.5;

    child.scale.x = (size ?? 1) * 0.001;
    child.scale.y = (size ?? 1) * 0.001;
    child.scale.z = (size ?? 1) * 0.001;

    opts.scene.add(child);
    opts.world.objects[[x, z]] = child;
    return child;
}

export async function spawnTree(x, y, z, size) {
    return await spawnObject(
        'models/PineTree.fbx',
        x, y, z, size,
        new THREE.Color(0, 1, 1),
    );
}

export async function spawnTent1(x, y, z, size) {
    return await spawnObject(
        'models/Tent1.fbx',
        x, y, z, size,
        new THREE.Color(1, 0, 0),
    );
}

export async function spawnTent2(x, y, z, size) {
    return await spawnObject(
        'models/Tent2.fbx',
        x, y, z, size,
        new THREE.Color(1, 0, 0),
    );
}

export async function spawnSheep(x, y, z, size) {
    return await spawnObject(
        'models/Sheep.fbx',
        x, y, z, size,
        new THREE.Color(1, 0, 0),
    );
}

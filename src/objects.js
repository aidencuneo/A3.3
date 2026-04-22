import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { opts } from './gui';
import { getPerlin2D, getPerlin3D } from './noise';

const loader = new FBXLoader();

async function spawnObject(path, x, y, z, size, colour, noisySize, noisyPos) {
    size ??= 1;
    colour ??= new THREE.Color(1, 1, 1);
    noisySize ??= true;
    noisyPos ??= true;

    let obj = await loader.loadAsync(path);
    let child = null;
    for (child of obj.children)
        if (child instanceof THREE.Mesh)
            break;

    child.castShadow = true;
    child.receiveShadow = true;
    child.material.color = colour;

    child.position.x = x;
    child.position.y = y;
    child.position.z = z;

    if (noisyPos) {
        child.position.x += Math.random() * 0.5 - 0.25;
        child.position.z += Math.random() * 0.5 - 0.25;
    }

    if (noisySize)
        size *= 0.75 + Math.random() * 0.5;

    child.scale.x = size * 0.002;
    child.scale.y = size * 0.002;
    child.scale.z = size * 0.002;

    opts.scene.add(child);
    opts.world.objects[[x, z]] = child;
    return child;
}

export async function spawnTree(x, y, z, size) {
    size ??= 1;

    return await spawnObject(
        'models/Tree.fbx',
        x, y, z, 1.5 * size,
        new THREE.Color(0, 0, 1),
    );
}

export async function spawnTent1(x, y, z, size) {
    size ??= 1;

    let obj = await spawnObject(
        'models/Tent1.fbx',
        x, y, z, 3 * size,
        new THREE.Color(1, 0, 0),
    );

    obj.position.z -= 0.25;
    return obj;
}

export async function spawnTent2(x, y, z, size) {
    size ??= 1;

    let obj = await spawnObject(
        'models/Tent2.fbx',
        x, y, z, 3 * size,
        new THREE.Color(1, 0, 0),
    );

    obj.position.z -= 0.25;
    return obj;
}

export async function spawnFence(x, y, z, size) {
    size ??= 1;

    return await spawnObject(
        'models/Fence.fbx',
        x, y, z, size,
        new THREE.Color(1, 0, 0),
    );
}

export async function spawnSheep(x, y, z, size) {
    size ??= 1;

    let obj = await spawnObject(
        'models/Sheep.fbx',
        x, y, z, 50 * size,
        new THREE.Color(1, 0, 0),
    );

    obj.position.y += 0.5;
    return obj;
}

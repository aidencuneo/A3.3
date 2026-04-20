import { Vector2, Vector3 } from 'three';
import { FBM, Perlin } from 'three-noise';
import { opts } from './gui';

const startTime = Date.now();
// const perlin = new Perlin(Math.random());

function timeElapsed() {
    return Date.now() - startTime;
}

export function getPerlin2D(vec) {
    return opts.noiseScale * (opts.perlin.get2(new Vector2(
        vec.x / opts.noiseSize + opts.speed * timeElapsed(),
        vec.y / opts.noiseSize + opts.speed * timeElapsed(),
    )) + 1);
}

export function getPerlin3D(vec) {
    return opts.noiseScale * (opts.perlin.get3(new Vector3(
        vec.x / opts.noiseSize + opts.speed * timeElapsed(),
        vec.y / opts.noiseSize + opts.speed * timeElapsed(),
        vec.z / opts.noiseSize + opts.speed * timeElapsed(),
    )) + 1);
}

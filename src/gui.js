import * as THREE from 'three';
import GUI from 'lil-gui';
import { Perlin } from 'three-noise';
import { resetWorld } from './world';

const gui = new GUI();

// Options for use in other scripts
export const opts = {
    seed: 0, // 0
    noiseSize: 1, // 1
    noiseScale: 1, // 1

    world: null,
    perlin: new Perlin(Math.random()),
};

function addTo(folder, name, value, onChange, ...props) {
    return folder.add({ [name]: value }, name, ...props).name(name).onChange(onChange);
}

function make(...props) {
    return addTo(gui, props);
}

export function createGUI() {
    const noiseFolder = gui.addFolder('Noise');
    addTo(noiseFolder, 'Seed', 0, v => opts.perlin = new Perlin(v), 0, 1);
    addTo(noiseFolder, 'Noise Size', 1, v => opts.noiseSize = v, 0.15, 5);
    addTo(noiseFolder, 'Noise Scale', 1, v => opts.noiseScale = v, 0.2, 5);
}

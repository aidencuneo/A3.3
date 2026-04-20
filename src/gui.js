import * as THREE from 'three';
import GUI from 'lil-gui';
import { Perlin } from 'three-noise';
import { resetWorld } from './world';

const gui = new GUI();

// Options for use in other scripts
export const opts = {
    speed: 2 / 10000, // 9
    seed: 0, // 0
    noiseSize: 1, // 1
    noiseScale: 1, // 1

    greyscale: false,
    colourNoiseScale: 1,

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
    addTo(noiseFolder, 'Speed', 2, v => opts.speed = v / 10000, 0, 10);
    addTo(noiseFolder, 'Seed', 0, v => opts.perlin = new Perlin(v), 0, 1);
    addTo(noiseFolder, 'Noise Size', 1, v => opts.noiseSize = v, 0, 5);
    addTo(noiseFolder, 'Noise Scale', 1, v => opts.noiseScale = v, 0, 5);

    const cellFolder = gui.addFolder('Cells');
    addTo(cellFolder, 'Cells Face Centre', true, v => opts.cellsFaceCentre = v);
    addTo(cellFolder, 'Cell Size', 2, v => opts.cellSize = v, 0, 20);
    addTo(cellFolder, 'Cell Noise Size', 1, v => opts.cellNoiseSize = v, 0, 5);
    addTo(cellFolder, 'Cell Noise Scale', 1, v => opts.cellNoiseScale = v, 0, 5);
    addTo(cellFolder, 'Cell X Segments', 100, () => {}, 1, 300).onFinishChange(v => { opts.xSegments = v; resetPlanet(); }).step(1);
    addTo(cellFolder, 'Cell Y Segments', 100, () => {}, 1, 300).onFinishChange(v => { opts.ySegments = v; resetPlanet(); }).step(1);

    const colourFolder = gui.addFolder('Colour');
    addTo(colourFolder, 'Greyscale', false, v => opts.greyscale = v);
    addTo(colourFolder, 'Colour Noise Scale', 1, v => opts.colourNoiseScale = v, 0, 5);
}

// noise
// seed
// size
// scale

// cells
// cells face centre ?
// cell size
// cell noise size
// cell noise scale

// colour
// greyscale ?
// colour noise scale

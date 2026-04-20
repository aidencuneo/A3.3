import * as THREE from 'three';
import { getPerlin2D, getPerlin3D } from './noise';
import { opts } from './gui';

export default class World {
    constructor() {
        this.cubes = {};
        this.heights = {};
        this.size = 24;
        this.radius = this.size / 2;
    }

    create(scene) {
        this.cubes = {};
        let r = this.radius;

        for (let y = -r; y < r; y++) {
            for (let x = -r; x < r; x++) {
                if (x * x + y * y >= r * r)
                    continue;

                let cube = this.spawnCube(x, y);
                scene.add(cube);
                this.cubes[[x, y]] = cube;
                // this.heights[[x, y]] = Math.random() * 2;
            }
        }
    }

    spawnCube(x, y) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const material = new THREE.MeshStandardMaterial({
            flatShading: true,
            color: (getPerlin2D(new THREE.Vector2(x / 20, y / 20))) > 1 ? 0xa9d4ff : 0xaa99dd,
            // color: Math.random() * 0xffffff,
        });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = x;
        mesh.position.y = 0;
        mesh.position.z = y;

        return mesh;
    }

    animate() {
        Object.values(this.cubes).forEach(cube => {
            let pos = cube.position;
            let [x, y] = [pos.x, pos.z];
            let desiredHeight = this.heights[[x, y]] ? this.heights[[x, y]] : 1;
            // console.log(this.heights);

            let desiredScale = 0.95 * cube.scale.y + 0.05 * desiredHeight;
            cube.scale.y = desiredScale;
            cube.position.y = desiredScale / 2;

            // let heightNoise = getPerlin2D(new THREE.Vector2(pos.x / 10, pos.z / 10));
            // cube.scale.y = heightNoise * 4;
            // cube.position.y = heightNoise * 2;
        });
    }

    clear() {
        for (let i = 0; i < this.cubes.length; i++)
            opts.scene.remove(this.cubes[i]);
    }
}

export function resetWorld() {
    if (opts.world)
        opts.world.clear();

    opts.world = new World({
        cellSize: opts.cellSize,
        segments: [opts.xSegments, opts.ySegments],
    });

    opts.world.create(opts.scene);
}

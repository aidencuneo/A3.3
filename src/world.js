import * as THREE from 'three';
import { getPerlin2D, getPerlin3D } from './noise';
import { opts } from './gui';
import { spawnFence, spawnSheep, spawnTent1, spawnTent2, spawnTree } from './objects';
import { weightedRand } from './util';

export default class World {
    constructor() {
        this.cubes = {};
        this.objects = {};
        this.heights = {};
        this.hoverHeights = {};
        this.size = 24;
        this.radius = this.size / 2;
    }

    async create(scene) {
        this.cubes = {};
        let r = this.radius;

        for (let y = -r; y < r; y++) {
            for (let x = -r; x < r; x++) {
                if (x * x + y * y >= r * r)
                    continue;

                let cube = this.spawnCube(x, y);
                scene.add(cube);
                this.cubes[[x, y]] = cube;
                await this.refreshObject(x, y);
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
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.position.x = x;
        mesh.position.y = 0;
        mesh.position.z = y;

        return mesh;
    }

    async refreshObject(x, y) {
        // height < 2:
        //  10% tent (1 and 2)
        //  70% tree
        //  20% air
        // height < 4:
        //  5% tent
        //  10% fence
        //  50% tree
        //  35% air
        // height < 6:
        //  5% sheep
        //  20% fence
        //  30% tree
        //  50% air
        // height < 8:
        //  10% sheep
        //  5% fence
        //  15% tree
        //  70% air
        // height < 10:
        //  15% sheep
        //  5% tree
        //  80% air
        // height < 12:
        //  15% sheep
        //  0.5% tent
        //  1.5% tree
        //  83% air
        // height < 16:
        //  5% sheep
        //  0.5% tree
        //  94.5% air
        // height >= 16:
        //  1% sheep
        //  99% air

        if (!this.cubes[[x, y]])
            return;

        let h = this.heights[[x, y]] ? this.heights[[x, y]] : 1;
        let chance = {};

        if (h < 2)
            chance = {
                tent1: 0.05,
                tent2: 0.05,
                tree: 0.7,
            };

        else if (h < 4)
            chance = {
                tent1: 0.025,
                tent2: 0.025,
                fence: 0.1,
                tree: 0.5,
            };

        else if (h < 6)
            chance = {
                sheep: 0.05,
                fence: 0.2,
                tree: 0.3,
            };

        else if (h < 8)
            chance = {
                sheep: 0.1,
                fence: 0.05,
                tree: 0.15,
            };

        else if (h < 10)
            chance = {
                sheep: 0.15,
                tree: 0.05,
            };

        else if (h < 12)
            chance = {
                sheep: 0.15,
                tent2: 0.005,
                tree: 0.015,
            };

        else if (h < 16)
            chance = {
                sheep: 0.05,
                tree: 0.005,
            };

        else
            chance = {
                sheep: 0.01,
            };

        // Clear previous object
        if (this.objects[[x, y]])
            opts.scene.remove(this.objects[[x, y]]);

        let choice = weightedRand(chance);
        let obj = null;

        if (choice == 'tent1')
            obj = await spawnTent1(x, 1, y);
        else if (choice == 'tent2')
            obj = await spawnTent2(x, 1, y);
        else if (choice == 'fence')
            obj = await spawnFence(x, 1, y);
        else if (choice == 'tree')
            obj = await spawnTree(x, 1, y);
        else if (choice == 'sheep')
            obj = await spawnSheep(x, 1, y);

        return obj;
    }

    animate() {
        Object.values(this.cubes).forEach(cube => {
            let pos = cube.position;
            let [x, y] = [pos.x, pos.z];
            let height = 1;

            if (this.heights[[x, y]])
                height = this.heights[[x, y]];
            if (this.hoverHeights[[x, y]])
                height += this.hoverHeights[[x, y]];

            if (height < 1)
                height = 1;

            let noiseHeight = getPerlin2D(new THREE.Vector2(x / 10, y / 10));
            // console.log(this.heights);

            let desiredScale = 0.95 * cube.scale.y + 0.05 * height * noiseHeight;
            cube.scale.y = desiredScale;
            cube.position.y = desiredScale / 2;

            let n = cube.scale.y / 20;
            let r = 0.1 + 0.9 * n;
            let g = 0.5 + 0.5 * n;
            let b = 0.1 + 0.9 * n;
            cube.material.color.r = r > 1 ? 1 : r;
            cube.material.color.g = g > 1 ? 1 : g;
            cube.material.color.b = b > 1 ? 1 : b;

            // Objects
            let obj = this.objects[[x, y]];

            if (!obj)
                return;

            obj.position.y = desiredScale;

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

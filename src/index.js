import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import World, { resetWorld } from './world.js';
import { createGUI, opts } from './gui.js';
import { getPerlin2D } from './noise.js';

// Set up camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.x = 20;
camera.position.y = 10;
camera.position.z = 0;
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Set up scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa9 / 255, 0xd4 / 255, 0xff / 255);

// Add objects to scene
const pointLight1 = new THREE.DirectionalLight(0xffffff, 3);
pointLight1.castShadow = true;
pointLight1.position.set(10, 10, 10);
pointLight1.shadow.camera.left = -12;
pointLight1.shadow.camera.right = 12;
pointLight1.shadow.camera.top = 12;
pointLight1.shadow.camera.bottom = -12;
pointLight1.shadow.mapSize.width = 2048;
pointLight1.shadow.mapSize.height = 2048;
scene.add(pointLight1);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
// ambientLight.castShadow = true;
ambientLight.position.set(100, 100, 100);
scene.add(ambientLight);

// const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
// pointLight2.position.set(-500, -500, -500);
// scene.add(pointLight2);

opts.scene = scene;
resetWorld();

// Set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Set up controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Add raycaster
const raycaster = new THREE.Raycaster();

// Controls
const mouse = new THREE.Vector2(-100, -100);
let holdingShift = false;

window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    let objs = raycaster.intersectObjects(scene.children, false);

    if (objs.length == 0)
        return;

    let obj = objs[0].object;
    let pos = obj.position;

    console.log(obj);
    console.log(obj.material);
    // opts.world.heights[[pos.x, pos.z]] = 10;
    // obj.position.x = 1;

    for (let y = -5; y <= 5; ++y)
        for (let x = -5; x <= 5; ++x)
            if (x * x + y * y < 5 * 5) {
                let h = Math.cos(x / 2.5) * Math.cos(y / 2.5) + 1;

                if (holdingShift)
                    h = -h;

                if (opts.world.heights[[pos.x + x, pos.z + y]])
                    opts.world.heights[[pos.x + x, pos.z + y]] += h;
                else
                    opts.world.heights[[pos.x + x, pos.z + y]] = h;

                if (opts.world.heights[[pos.x + x, pos.z + y]] < 0)
                    opts.world.heights[[pos.x + x, pos.z + y]] = 0;
            }
});

window.addEventListener('keydown', e => {
    if (e.key == 'Shift')
        holdingShift = true;
});

window.addEventListener('keyup', e => {
    if (e.key == 'Shift')
        holdingShift = false;
})

setInterval(() => {
    raycaster.setFromCamera(mouse, camera);
    let objs = raycaster.intersectObjects(scene.children, false);

    opts.world.hoverHeights = {};

    if (objs.length == 0)
        return;

    let obj = objs[0].object;
    let pos = obj.position;

    for (let y = -5; y <= 5; ++y)
        for (let x = -5; x <= 5; ++x)
            if (x * x + y * y < 5 * 5) {
                let h = Math.cos(x / 2.5) * Math.cos(y / 2.5) + 1;

                if (holdingShift)
                    h = -h;

                opts.world.hoverHeights[[pos.x + x, pos.z + y]] = h;
            }
}, 1 / 30);

function animate() {
    controls.update();
    opts.world.animate();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    pointLight1.shadow.camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add debug GUI
createGUI();

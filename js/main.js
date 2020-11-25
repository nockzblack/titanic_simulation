import _ from 'lodash';

import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let renderer = null,
  scene = null,
  camera = null,
  light = null,
  cube = null;


let water = null;
let sun = null;
let pmremGenerator = null;
let sky = null;
let controls;

let container, stats, titanic;
let line;
let gui, timer;


const loaderGLTF = new GLTFLoader();


const parameters = {
  inclination: 0.3717,
  azimuth: 0.0486
};



function createScene() {

  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  // Set the viewport size
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Adding the camera 
  let aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(55, aspectRatio, 1, 2000000);
  camera.position.set(30, 30, 100);
  scene.add(camera);

  // Adding the light
  light = new THREE.PointLight(0xffffff, 1);
  light.position.set(1, 1, 1.3);
  scene.add(light);



  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('red') });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0, 0);
  scene.add(cube);

  sun = new THREE.Vector3();
  pmremGenerator = new THREE.PMREMGenerator(renderer);

  // Adding Stats
  stats = new Stats();
  container.appendChild(stats.dom);

  titanic = new THREE.Group();

  initWater();
  initSkybox();
  updateSun();
  initControls();
  initGUI();
  loadGLTF();
  scene.add(titanic);
  loadRoute();

  window.addEventListener('resize', onWindowResize, false);

}


function initGUI() {
  gui = new GUI({ name: 'My GUI' });

  const folderSky = gui.addFolder('Sky');


  folderSky.add(parameters, 'inclination', 0, 0.5, 0.0001);
  folderSky.add(parameters, 'azimuth', 0, 1, 0.0001)
  folderSky.open();


  const folderTimer = gui.addFolder('Timer');
  timer = folderTimer.add({ time: 0 }, 'time', 0, 240, 1).name('Seconds:');
  folderTimer.open();

}


// Orbit Controls
function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set(0, 30, 0);
  controls.minDistance = 10.0;
  controls.maxDistance = 200000.0;
  controls.update();
}


function initCube() {
  const geometry = new THREE.BoxBufferGeometry(30, 30, 30);
  const material = new THREE.MeshStandardMaterial({ roughness: 0, color: new THREE.Color('red') });

  cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0, 0);
  scene.add(cube);

}

// Water
function initWater() {
  const waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000);

  water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('./textures/waternormals.jpg', function (texture) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      }),
      alpha: 1.0,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    }
  );

  water.rotation.x = - Math.PI / 2;

  scene.add(water);
}


// Skybox
function initSkybox() {
  sky = new Sky();

  sky.scale.setScalar(10000);
  scene.add(sky);


  const skyUniforms = sky.material.uniforms;

  skyUniforms['turbidity'].value = 10;
  skyUniforms['rayleigh'].value = 2;
  skyUniforms['mieCoefficient'].value = 0.005;
  skyUniforms['mieDirectionalG'].value = 0.8;
}

// Sun
function updateSun() {
  const theta = Math.PI * (parameters.inclination - 0.5);
  const phi = 2 * Math.PI * (parameters.azimuth - 0.5);

  sun.x = Math.cos(phi);
  sun.y = Math.sin(phi) * Math.sin(theta);
  sun.z = Math.sin(phi) * Math.cos(theta);

  sky.material.uniforms['sunPosition'].value.copy(sun);
  water.material.uniforms['sunDirection'].value.copy(sun).normalize();

  scene.environment = pmremGenerator.fromScene(sky).texture;

}


function loadRoute() {
  const material2 = new THREE.LineBasicMaterial({ color: new THREE.Color('green') });
  const points = [];
  points.push(new THREE.Vector3(-88, 0, 0));
  points.push(new THREE.Vector3(82, 0, 0));
  const geometry2 = new THREE.BufferGeometry().setFromPoints(points);
  line = new THREE.Line(geometry2, material2);
  line.position.x = 10;
  line.position.y = 31;
  line.position.z = 118;


  let line2 = new THREE.Line(geometry2, material2);
  line2.position.x = 10;
  line2.position.y = 31;
  line2.position.z = 82;

  titanic.add(line);
  titanic.add(line2);
}


// Titanic 3D Render
function loadGLTF() {
  loaderGLTF.load(
    // resource URL
    'models/titanic/scene.gltf',
    // called when the resource is loaded
    function (gltf) {

      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
      gltf.scene.position.set(0, 1, 100);

      titanic.add(gltf.scene);

    },
    // called while loading is progressing
    function (xhr) {

      console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    },
    // called when loading has errors
    function (error) {
      console.log('An error happened');
      console.log(error)

    }
  );
}




function render() {

  const time = performance.now() * 0.001;

  timer.setValue(time);

  if (titanic != null) {
    //titanic.position.y -= 0.0025;
  }

  // cube.position.y = Math.sin(time) * 20 + 5;
  // cube.rotation.x = time * 0.5;
  // cube.rotation.z = time * 0.51;

  water.material.uniforms['time'].value += 1.0 / 60.0;
  renderer.render(scene, camera);

}


// 2 h 40 min = 160 min = 9,600 s
// 10x => 960
// 40x -> 240
// 75s to sink

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}




function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}


function load() {
  // when the dom is ready start graphics
  $(document).ready(function () {
    container = document.getElementById('container');
    // firts create the scene
    createScene();
    // then the run loop
    animate();
  });
}

load();


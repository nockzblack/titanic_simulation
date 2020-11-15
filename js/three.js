import _ from 'lodash';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

let renderer = null,
  scene = null,
  camera = null,
  light = null,
  cube = null;


let water = null;
let sun = null;
let pmremGenerator = null;
let sky = null;
const parameters = {
  inclination: 0.49,
  azimuth: 0.205
};


function createScene(canvas) {
  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  // Set the viewport size
  renderer.setSize(canvas.width, canvas.height);
  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Adding the camera 
  let aspectRatio = canvas.width / canvas.height;
  camera = new THREE.PerspectiveCamera(60, aspectRatio, 1, 1000);
  camera.position.set(1, 1, 5);
  scene.add(camera);

  // Adding the light
  light = new THREE.PointLight(0xffffff, 1);
  light.position.set(1, 1, 1.3);
  scene.add(light);



  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  sun = new THREE.Vector3();
  pmremGenerator = new THREE.PMREMGenerator(renderer);

  initWater();
  initSkybox();
  updateSun();

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



function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}


function load() {
  // when the dom is ready start graphics
  $(document).ready(function () {
    let canvas = document.getElementById("webglcanvas");
    // firts create the scene
    createScene(canvas);
    // then the run loop
    animate();
  });
}

load();


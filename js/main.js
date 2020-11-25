import _, { startCase } from 'lodash';


import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

const data = require('../dataset/csvjson.json');
//import { model } from './titanic2.js';
//console.log(model.survive(23, "female", 2));

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
let simulation = false;


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

  console.log(surive(12, "male", 3));

}


function initGUI() {
  gui = new GUI({ name: 'My GUI' });

  //const folderSky = gui.addFolder('Sky');
  //folderSky.add(parameters, 'inclination', 0, 0.5, 0.0001);
  //folderSky.add(parameters, 'azimuth', 0, 1, 0.0001)
  //folderSky.open();


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

//const delta;
function render() {

  const time = performance.now() * 0.001;



  if (titanic != null && simulation) {
    titanic.position.y -= 0.0025;

    timer.setValue(time);
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


    document.getElementById('button-start').addEventListener("click", () => {
      simulation = true;
    });


    // firts create the scene
    createScene();
    // then the run loop
    animate();
  });
}

load();




//document.getElementById("start").addEventListener("click", function () {

//});


function surive(edad, sexo, clase) {

  //Calculo de probabilidades dada la clase

  var clases = data.map(function (cl) {
    return [cl.Pclass, cl.Survived];
  });

  var countClassSurvivor1 = 0;
  var countClassDeath1 = 0;
  var countClassSurvivor2 = 0;
  var countClassDeath2 = 0;
  var countClassSurvivor3 = 0;
  var countClassDeath3 = 0;

  for (var i = 0; i < clases.length; i++) {
    if (clases[i][0] === 3) {
      if (clases[i][1] === 1) {
        countClassSurvivor3++;
      } else {
        countClassDeath3++;
      }
    } else if (clases[i][0] === 2) {
      if (clases[i][1] === 1) {
        countClassSurvivor2++;
      } else {
        countClassDeath2++;
      }
    } else {
      if (clases[i][1] === 1) {
        countClassSurvivor1++;
      } else {
        countClassDeath1++;
      }
    }

  }

  var probClase1 = countClassSurvivor1 / (countClassDeath1 + countClassSurvivor1);
  var probClase2 = countClassSurvivor2 / (countClassDeath2 + countClassSurvivor2);
  var probClase3 = countClassSurvivor3 / (countClassDeath3 + countClassSurvivor3);

  //console.log("Clase 1: " + probClase1);
  //console.log("Clase 2: " + probClase2);
  //console.log("Clase 3: " + probClase3);

  //Calculo de probabilidades dado el sexo

  var countMaleSurvivor = 0;
  var countMaleDeath = 0;
  var countFemaleSurvivor = 0;
  var countFemaleDeath = 0;

  var sexos = data.map(function (cl) {
    return [cl.Sex, cl.Survived];
  });

  for (var i = 0; i < sexos.length; i++) {
    if (sexos[i][0] === "male") {
      if (sexos[i][1] === 1) {
        countMaleSurvivor++;
      } else {
        countMaleDeath++;
      }
    } else {
      if (sexos[i][1] === 1) {
        countFemaleSurvivor++;
      } else {
        countFemaleDeath++;
      }
    }
  }

  var probMale = countMaleSurvivor / (countMaleSurvivor + countMaleDeath);
  var probFemale = countFemaleSurvivor / (countFemaleSurvivor + countFemaleDeath);

  var sobrevivientesT = (countMaleSurvivor + countFemaleSurvivor) / 891;

  //console.log("Male : " + probMale);
  //console.log("Female: " + probFemale);

  //Calculo probabilidades edad
  var rangos = data.map(function (cl) {
    if (cl.Age.split("-")[0] <= 20) {
      return [20, cl.Survived];
    } else if (20 < cl.Age.split("-")[0] && cl.Age.split("-")[0] <= 40) {
      return [40, cl.Survived];
    } else if (40 < cl.Age.split("-")[0]) {
      return [60, cl.Survived];
    }
  });

  var survivorsRange1 = 0;
  var deathRange1 = 0;
  var survivorsRange2 = 0;
  var deathRange2 = 0;
  var survivorsRange3 = 0;
  var deathRange3 = 0;


  for (var i = 0; i < rangos.length; i++) {
    if (rangos[i][0] === 20) {
      if (rangos[i][1] === 1) {
        survivorsRange1++;
      } else {
        deathRange1++;
      }
    } else if (rangos[i][0] === 40) {
      if (rangos[i][1] === 1) {
        survivorsRange2++;
      } else deathRange2++;
    } else {
      if (rangos[i][1] === 1) {
        survivorsRange3++;
      } else {
        deathRange3++;
      }
    }
  }

  var prob20 = survivorsRange1 / (survivorsRange1 + deathRange1);
  var prob40 = survivorsRange2 / (survivorsRange2 + deathRange2);
  var prob60 = survivorsRange3 / (survivorsRange3 + deathRange3);

  //console.log("20 : " + prob20);
  //console.log("40: " + prob40);
  //console.log("60: " + prob60);

  var sobrevivir = Math.ceil(prob40 * probMale * probClase3 * 100);
  var sobrevivir2 = Math.ceil(prob40 * probFemale * probClase1 * 100);

  var personas = data.map(function (cl) {
    return [cl.Sex, cl.Pclass, cl.Age, cl.Survived];
  });

  var porcentaje = 1;
  var porcentajes = [];

  for (var i = 0; i < personas.length; i++) {
    porcentaje = 1;
    if (personas[i][0] === "female") {
      porcentaje *= probFemale;
      if (personas[i][1] === 1) {
        porcentaje *= probClase1;
        if (personas[i][2].split("-") <= 20) {
          porcentaje *= prob20;
        } else if (personas[i][2].split("-") <= 40) {
          porcentaje *= prob40;
        } else if (personas[i][2].split("-") <= 60) {
          porcentaje *= prob60;
        }
      } else if (personas[i][1] === 2) {
        porcentaje *= probClase2;
        if (personas[i][2].split("-") <= 20) {
          porcentaje *= prob20;
        } else if (personas[i][2].split("-") <= 40) {
          porcentaje *= prob40;
        } else if (personas[i][2].split("-") <= 60) {
          porcentaje *= prob60;
        }
      } else if (personas[i][1] === 3) {
        porcentaje *= probClase3;
        if (personas[i][2].split("-") <= 20) {
          porcentaje *= prob20;
        } else if (personas[i][2].split("-") <= 40) {
          porcentaje *= prob40;
        } else if (personas[i][2].split("-") <= 60) {
          porcentaje *= prob60;
        }
      }
    } else {
      porcentaje *= probMale;
      if (personas[i][1] === 1) {
        porcentaje *= probClase1;
        if (personas[i][2].split("-") <= 20) {
          porcentaje *= prob20;
        } else if (personas[i][2].split("-") <= 40) {
          porcentaje *= prob40;
        } else if (personas[i][2].split("-") <= 60) {
          porcentaje *= prob60;
        }
      } else if (personas[i][1] === 2) {
        porcentaje *= probClase2;
        if (personas[i][2].split("-") <= 20) {
          porcentaje *= prob20;
        } else if (personas[i][2].split("-") <= 40) {
          porcentaje *= prob40;
        } else if (personas[i][2].split("-") <= 60) {
          porcentaje *= prob60;
        }
      } else if (personas[i][1] === 3) {
        porcentaje *= probClase3;
        if (personas[i][2].split("-") <= 20) {
          porcentaje *= prob20;
        } else if (personas[i][2].split("-") <= 40) {
          porcentaje *= prob40;
        } else if (personas[i][2].split("-") <= 60) {
          porcentaje *= prob60;
        }
      }
    }
    porcentajes.push([Math.ceil(porcentaje * 100), personas[i][3]]);
  }

  var vivosPorPorc = new Array(100);
  var muertosPorPorc = new Array(100);
  var probabilidades = new Array(100);

  for (var i = 0; i < vivosPorPorc.length; i++) {
    vivosPorPorc[i] = 0;
    muertosPorPorc[i] = 0;
    probabilidades[i] = 0;
  }

  for (var i = 0; i < porcentajes.length; i++) {
    if (porcentajes[i][1] === 1) {
      vivosPorPorc[porcentajes[i][0] - 1]++;
    } else {
      muertosPorPorc[porcentajes[i][0] - 1]++;
    }
  }

  for (var i = 0; i < vivosPorPorc.length; i++) {
    if ((vivosPorPorc[i] + muertosPorPorc[i]) === 0) {
      probabilidades[i] = 0;
    } else {
      probabilidades[i] = Math.ceil((vivosPorPorc[i] / (vivosPorPorc[i] + muertosPorPorc[i])) * 100)
    }

  }

  var sobreviviria = []
  var asertividad = 0;

  for (var i = 0; i < porcentajes.length; i++) {
    if (Math.floor(Math.random() * (101)) < probabilidades[porcentajes[i][0] - 1]) {
      sobreviviria.push([1, porcentajes[i][1]])
    } else {
      sobreviviria.push([0, porcentajes[i][1]])
    }
    if (sobreviviria[i][0] === sobreviviria[i][1]) {
      asertividad++;
    }
  }

  var porcentajeFinal = 1;

  if (sexo === "female") {
    porcentajeFinal *= probFemale;
    if (clase === 1) {
      porcentajeFinal *= probClase1;
      if (edad <= 20) {
        porcentajeFinal *= prob20;
      } else if (edad <= 40) {
        porcentajeFinal *= prob40;
      } else if (edad <= 60) {
        porcentajeFinal *= prob60;
      }
    } else if (clase === 2) {
      porcentajeFinal *= probClase2;
      if (edad <= 20) {
        porcentajeFinal *= prob20;
      } else if (edad <= 40) {
        porcentajeFinal *= prob40;
      } else if (edad <= 60) {
        porcentajeFinal *= prob60;
      }
    } else if (clase === 3) {
      porcentajeFinal *= probClase3;
      if (edad <= 20) {
        porcentajeFinal *= prob20;
      } else if (edad <= 40) {
        porcentajeFinal *= prob40;
      } else if (edad <= 60) {
        porcentajeFinal *= prob60;
      }
    }
  } else {
    porcentajeFinal *= probMale;
    if (clase === 1) {
      porcentajeFinal *= probClase1;
      if (edad <= 20) {
        porcentajeFinal *= prob20;
      } else if (edad <= 40) {
        porcentajeFinal *= prob40;
      } else if (edad <= 60) {
        porcentajeFinal *= prob60;
      }
    } else if (clase === 2) {
      porcentajeFinal *= probClase2;
      if (edad <= 20) {
        porcentajeFinal *= prob20;
      } else if (edad <= 40) {
        porcentajeFinal *= prob40;
      } else if (edad <= 60) {
        porcentajeFinal *= prob60;
      }
    } else if (clase === 3) {
      porcentajeFinal *= probClase3;
      if (edad <= 20) {
        porcentajeFinal *= prob20;
      } else if (edad <= 40) {
        porcentajeFinal *= prob40;
      } else if (edad <= 60) {
        porcentajeFinal *= prob60;
      }
    }
  }
  porcentajeFinal = Math.ceil(porcentajeFinal * 100);

  var viveono = "";
  var i = porcentajeFinal - 1;
  var j = i;
  var correcto = i;
  while (probabilidades[i] === 0 && probabilidades[j] === 0) {
    if (i < 99) {
      i++;
      if (probabilidades[i] != 0) {
        correcto = i;
      }
    }
    if (j > 0) {
      j--;
      if (probabilidades[j] != 0) {
        correcto = j;
      }
    }
  }
  var ran = Math.floor(Math.random() * (51));
  if (ran <= probabilidades[correcto]) {
    viveono = "Sobrevive";
  } else {
    viveono = "No sobrevive";
  }

  return (viveono);
}
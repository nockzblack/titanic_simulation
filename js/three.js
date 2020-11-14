let renderer = null,
  scene = null,
  camera = null,
  light = null,
  cube = null;





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
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );


}



function animate() {
    requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}


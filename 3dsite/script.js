let scene, camera, renderer, cube;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry(2, 2, 2);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "Anonymous";
    const myTexture = textureLoader.load(
        "https://image.shutterstock.com/image-photo/beautiful-water-drop-on-dandelion-260nw-789676552.jpg"
    );
    const material = new THREE.MeshBasicMaterial({ map: myTexture });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 10;
}

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

init();
animate();

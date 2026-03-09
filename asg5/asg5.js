
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

function main() {

	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas,
		logarithmicDepthBuffer: true,
	});

	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 150;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 10, 20);

	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 5, 0);
	controls.update();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color('black');
	/*
	{

		const planeSize = 100;

		const loader = new THREE.TextureLoader();
		const texture = loader.load('resources/images/checker.png');
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		texture.colorSpace = THREE.SRGBColorSpace;
		const repeats = planeSize / 5;
		texture.repeat.set(repeats, repeats);

		const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
		const planeMat = new THREE.MeshPhongMaterial({
			map: texture,
			side: THREE.DoubleSide,
		});
		const mesh = new THREE.Mesh(planeGeo, planeMat);
		mesh.rotation.x = Math.PI * - .5;
		scene.add(mesh);

	}
		*/

	{
		const loader = new THREE.TextureLoader();
		const texture = loader.load(
			'resources/images/Panorama.png',
			() => {
				texture.mapping = THREE.EquirectangularReflectionMapping;
				texture.colorSpace = THREE.SRGBColorSpace;
				scene.background = texture;
			});
	}

	{

		const cubeSize = 4;
		const cubeGeo = new THREE.BoxGeometry(cubeSize, 5, cubeSize);
		const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
		const mesh = new THREE.Mesh(cubeGeo, cubeMat);
		mesh.position.set(-30, 2.5, -2);
		scene.add(mesh);

		const mesh2 = new THREE.Mesh(cubeGeo, cubeMat);
		mesh2.position.set(30, 2.5, -2);
		scene.add(mesh2);

	}

	{
		const objLoader = new OBJLoader();
		const mtlLoader = new MTLLoader();
		mtlLoader.load('resources/models/Lowpoly_tree_sample.mtl', (mtl) => {
			mtl.preload();
			objLoader.setMaterials(mtl);
			objLoader.load('resources/models/Lowpoly_tree_sample.obj', (root) => {
				root.translateX(30);
				root.translateZ(30);
				root.rotation.set(0, 45, 0);
				root.scale.set(0.5, 0.5, 0.5);
				scene.add(root);
			});
			objLoader.load('resources/models/Lowpoly_tree_sample.obj', (root) => {
				root.translateX(-30);
				root.translateZ(30);
				root.rotation.set(0, 45, 0);
				root.scale.set(0.5, 0.5, 0.5);
				scene.add(root);
			});
			objLoader.load('resources/models/Lowpoly_tree_sample.obj', (root) => {
				root.translateX(30);
				root.translateZ(10);
				root.rotation.set(0, 45, 0);
				root.scale.set(0.5, 0.5, 0.5);
				scene.add(root);
			});
			objLoader.load('resources/models/Lowpoly_tree_sample.obj', (root) => {
				root.translateX(-30);
				root.translateZ(10);
				root.rotation.set(0, 45, 0);
				root.scale.set(0.5, 0.5, 0.5);
				scene.add(root);
			});
			objLoader.load('resources/models/Lowpoly_tree_sample.obj', (root) => {
				root.translateX(30);
				root.translateZ(-30);
				root.rotation.set(0, 45, 0);
				root.scale.set(0.5, 0.5, 0.5);
				scene.add(root);
			});
			objLoader.load('resources/models/Lowpoly_tree_sample.obj', (root) => {
				root.translateX(-30);
				root.translateZ(-30);
				root.rotation.set(0, 45, 0);
				root.scale.set(0.5, 0.5, 0.5);
				scene.add(root);
			});
			objLoader.load('resources/models/Lowpoly_tree_sample.obj', (root) => {
				root.translateX(30);
				root.translateZ(-10);
				root.rotation.set(0, 45, 0);
				root.scale.set(0.5, 0.5, 0.5);
				scene.add(root);
			});
			objLoader.load('resources/models/Lowpoly_tree_sample.obj', (root) => {
				root.translateX(-30);
				root.translateZ(-10);
				root.rotation.set(0, 45, 0);
				root.scale.set(0.5, 0.5, 0.5);
				scene.add(root);
			});
		});
	}

	{
		const objLoader = new OBJLoader();
		const mtlLoader = new MTLLoader();
		mtlLoader.load('resources/models/bench.mtl', (mtl) => {
			mtl.preload();
			objLoader.setMaterials(mtl);
			objLoader.load('resources/models/bench.obj', (root) => {
				root.translateZ(-20);
				root.translateX(-25);
				root.rotation.set(0, Math.PI / 2, 0);
				root.scale.set(4, 4, 4);
				scene.add(root);
			});
			objLoader.load('resources/models/bench.obj', (root) => {
				root.translateZ(20);
				root.translateX(-25);
				root.rotation.set(0, Math.PI / 2, 0);
				root.scale.set(4, 4, 4);
				scene.add(root);
			});
			objLoader.load('resources/models/bench.obj', (root) => {
				root.translateZ(-20);
				root.translateX(25);
				root.rotation.set(0, -Math.PI / 2, 0);
				root.scale.set(4, 4, 4);
				scene.add(root);
			});
			objLoader.load('resources/models/bench.obj', (root) => {
				root.translateZ(20);
				root.translateX(25);
				root.rotation.set(0, -Math.PI / 2, 0);
				root.scale.set(4, 4, 4);
				scene.add(root);
			});
		});
	}

	{
		const objLoader = new OBJLoader();
		const mtlLoader = new MTLLoader();
		mtlLoader.load('resources/models/StreetLamp.mtl', (mtl) => {
			mtl.preload();
			objLoader.setMaterials(mtl);
			objLoader.load('resources/models/StreetLamp.obj', (root) => {
				root.translateY(-0.4);
				root.translateZ(-20);
				root.translateX(-32);
				scene.add(root);
			});
			objLoader.load('resources/models/StreetLamp.obj', (root) => {
				root.translateY(-0.2);
				root.translateZ(-20);
				root.translateX(32);
				root.rotation.set(0, Math.PI, 0);
				scene.add(root);
			});
			objLoader.load('resources/models/StreetLamp.obj', (root) => {
				root.translateY(-0.2);
				root.translateZ(20);
				root.translateX(-32);
				scene.add(root);
			});
			objLoader.load('resources/models/StreetLamp.obj', (root) => {
				root.translateY(-0.4);
				root.translateZ(20);
				root.translateX(32);
				root.rotation.set(0, Math.PI, 0);
				scene.add(root);
			});
		});
	}

	{
		const objLoader = new OBJLoader();
		const mtlLoader = new MTLLoader();
		mtlLoader.load('resources/models/10450_Rectangular_Grass_Patch_v1_iterations-2.mtl', (mtl) => {
			mtl.preload();
			objLoader.setMaterials(mtl);
			objLoader.load('resources/models/10450_Rectangular_Grass_Patch_v1_iterations-2.obj', (root) => {	
				root.translateY(-0.83);
				root.rotation.set(-Math.PI / 2, 0, 0);
				root.scale.set(0.5, 0.5, 0.1);
				scene.add(root);
			});
		});
	}

	{
		const objLoader = new OBJLoader();
		const mtlLoader = new MTLLoader();
		mtlLoader.load('resources/models/book.mtl', (mtl) => {
			mtl.preload();
			objLoader.setMaterials(mtl);
			objLoader.load('resources/models/book.obj', (root) => {	
				root.translateX(-25.5);
				root.translateY(2.2);
				root.translateZ(-22);
				root.rotation.set(0, Math.PI / 3, 0);
				root.scale.set(0.3, 0.3, 0.3);
				scene.add(root);
			});
		});
	}

	{
		const color = 0x404040;
		const intensity = 1;
		const light = new THREE.AmbientLight(color, intensity);
		scene.add(light);
	}

	{
		const color = 0xFFFFFF;
		const intensity = 0.3;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(0, 40, 70);
		light.target.position.set(0, 0, 0);
		scene.add(light);
		scene.add(light.target);

		//const helper = new THREE.DirectionalLightHelper(light);
		//scene.add(helper);
	}

	{
		const color = 0xFFBF00;
		const intensity = 500;
		const spot = new THREE.SpotLight(color, intensity);
		spot.position.set(-25, 13, -20);
		spot.target.position.set(-25, 0, -20);
		spot.angle = 45;
		spot.penumbra = 1;
		scene.add(spot);
		scene.add(spot.target);

		//const helper = new THREE.SpotLightHelper(spot);
		//scene.add(helper);
	}

	{
		const color = 0xFFBF00;
		const intensity = 500;
		const spot = new THREE.SpotLight(color, intensity);
		spot.position.set(25, 13, -20);
		spot.target.position.set(25, 0, -20);
		spot.angle = 45;
		spot.penumbra = 1;
		scene.add(spot);
		scene.add(spot.target);

		//const helper = new THREE.SpotLightHelper(spot);
		//scene.add(helper);
	}

	{
		const color = 0xFFBF00;
		const intensity = 500;
		const spot = new THREE.SpotLight(color, intensity);
		spot.position.set(-25, 13, 20);
		spot.target.position.set(-25, 0, 20);
		spot.angle = 45;
		spot.penumbra = 1;
		scene.add(spot);
		scene.add(spot.target);

		//const helper = new THREE.SpotLightHelper(spot);
		//scene.add(helper);
	}

	{
		const color = 0xFFBF00;
		const intensity = 500;
		const spot = new THREE.SpotLight(color, intensity);
		spot.position.set(25, 13, 20);
		spot.target.position.set(25, 0, 20);
		spot.angle = 45;
		spot.penumbra = 1;
		scene.add(spot);
		scene.add(spot.target);

		//const helper = new THREE.SpotLightHelper(spot);
		//scene.add(helper);
	}

	function resizeRendererToDisplaySize(renderer) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {

			renderer.setSize(width, height, false);

		}

		return needResize;

	}

	function render() {

		if (resizeRendererToDisplaySize(renderer)) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		renderer.render(scene, camera);

		requestAnimationFrame(render);

	}

	requestAnimationFrame(render);

}

main();

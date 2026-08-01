import * as THREE from 'three';

// -----------------------------------------------------------------------------
// Scene, Camera & Renderer Initialization
// -----------------------------------------------------------------------------
const canvas = document.querySelector<HTMLCanvasElement>('#bg');
if (!canvas) {
	throw new Error('Canvas element #bg not found');
}

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0f172a, 0.022); // Match Tailwind slate-900 atmosphere

const camera = new THREE.PerspectiveCamera(
	60,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true,
	powerPreference: 'high-performance',
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// -----------------------------------------------------------------------------
// Lighting System
// -----------------------------------------------------------------------------
const ambientLight = new THREE.AmbientLight(0x1e293b, 2.0);
scene.add(ambientLight);

// Sunlight / Moonlight through foliage
const sunLight = new THREE.DirectionalLight(0xfef08a, 2.5); // Warm golden tint
sunLight.position.set(20, 40, 10);
scene.add(sunLight);

// Soft glowing accent point lights along garden path
const pointLightColors = [0x34d399, 0xa78bfa, 0xfbbf24]; // Emerald, Lavender, Amber
const pointLights: THREE.PointLight[] = [];

pointLightColors.forEach((color, i) => {
	const light = new THREE.PointLight(color, 3, 25);
	light.position.set((i % 2 === 0 ? 1 : -1) * 4, 2, -i * 35 - 10);
	scene.add(light);
	pointLights.push(light);
});

// -----------------------------------------------------------------------------
// Procedural Garden World Construction
// -----------------------------------------------------------------------------

// Ground Terrain
const groundGeo = new THREE.PlaneGeometry(80, 100, 30, 30);
groundGeo.rotateX(-Math.PI / 2);

// Add subtle height variations to ground
const posAttr = groundGeo.attributes.position;
for (let i = 0; i < posAttr.count; i++) {
	const x = posAttr.getX(i);
	const z = posAttr.getZ(i);
	const distFromCenter = Math.abs(x);
	const height = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 1.2 + (distFromCenter > 5 ? (distFromCenter - 5) * 0.15 : 0);
	posAttr.setY(i, height);
}
groundGeo.computeVertexNormals();

const groundMat = new THREE.MeshStandardMaterial({
	color: 0x14532d, // Deep forest grass
	roughness: 0.85,
	metalness: 0.1,
	flatShading: true,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.set(0, -1, -20);
scene.add(ground);

// Winding Stone Garden Path (Shorter & Intimate Garden)
const pathCurve = new THREE.CatmullRomCurve3([
	new THREE.Vector3(0, -0.9, 15),
	new THREE.Vector3(1.8, -0.9, -5),
	new THREE.Vector3(-1.8, -0.9, -20),
	new THREE.Vector3(1.2, -0.9, -35),
	new THREE.Vector3(0, -0.9, -45),
]);

const pathPoints = pathCurve.getPoints(80);
const stoneGeo = new THREE.DodecahedronGeometry(0.5, 1);
const stoneMat = new THREE.MeshStandardMaterial({
	color: 0x64748b,
	roughness: 0.9,
	flatShading: true,
});

const stoneInstanced = new THREE.InstancedMesh(stoneGeo, stoneMat, pathPoints.length * 3);
const dummy = new THREE.Object3D();

pathPoints.forEach((pt, idx) => {
	// Center stone
	dummy.position.set(pt.x + (Math.random() - 0.5) * 0.4, pt.y, pt.z + (Math.random() - 0.5) * 0.4);
	dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
	dummy.scale.set(1 + Math.random() * 0.3, 0.25, 1 + Math.random() * 0.3);
	dummy.updateMatrix();
	stoneInstanced.setMatrixAt(idx * 3, dummy.matrix);

	// Side stones along path
	dummy.position.set(pt.x + 1.0 + Math.random() * 0.3, pt.y, pt.z);
	dummy.updateMatrix();
	stoneInstanced.setMatrixAt(idx * 3 + 1, dummy.matrix);

	dummy.position.set(pt.x - 1.0 - Math.random() * 0.3, pt.y, pt.z);
	dummy.updateMatrix();
	stoneInstanced.setMatrixAt(idx * 3 + 2, dummy.matrix);
});
scene.add(stoneInstanced);

// Procedural Low-Poly Trees
function createTree(x: number, z: number, scale: number = 1) {
	const treeGroup = new THREE.Group();

	// Trunk
	const trunkGeo = new THREE.CylinderGeometry(0.3 * scale, 0.5 * scale, 3 * scale, 6);
	const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9, flatShading: true });
	const trunk = new THREE.Mesh(trunkGeo, trunkMat);
	trunk.position.y = 1.5 * scale;
	treeGroup.add(trunk);

	// Foliage (Tiered Icosahedrons)
	const foliageColors = [0x059669, 0x10b981, 0x047857];
	const tiers = 3;
	for (let i = 0; i < tiers; i++) {
		const foliageGeo = new THREE.IcosahedronGeometry((1.8 - i * 0.4) * scale, 1);
		const foliageMat = new THREE.MeshStandardMaterial({
			color: foliageColors[i % foliageColors.length],
			roughness: 0.7,
			flatShading: true,
		});
		const foliage = new THREE.Mesh(foliageGeo, foliageMat);
		foliage.position.y = (3 + i * 1.2) * scale;
		treeGroup.add(foliage);
	}

	treeGroup.position.set(x, -0.9, z);
	return treeGroup;
}

// Populate trees along sides of the shorter path
for (let z = 12; z > -55; z -= 5) {
	const pathPt = pathCurve.getPointAt(Math.min(1, Math.max(0, (15 - z) / 60)));
	const sideOffset = 3.5 + Math.random() * 5;

	// Left tree
	scene.add(createTree(pathPt.x - sideOffset, z + (Math.random() - 0.5) * 2, 0.8 + Math.random() * 0.4));
	// Right tree
	scene.add(createTree(pathPt.x + sideOffset, z + (Math.random() - 0.5) * 2, 0.8 + Math.random() * 0.4));
}

// Glowing Firefly / Pollen Particles
const particleCount = 350;
const particleGeo = new THREE.BufferGeometry();
const particlePos = new Float32Array(particleCount * 3);
const particleSpeeds = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
	particlePos[i * 3] = (Math.random() - 0.5) * 25;
	particlePos[i * 3 + 1] = Math.random() * 7;
	particlePos[i * 3 + 2] = (Math.random() - 0.5) * 70 - 15;
	particleSpeeds[i] = 0.2 + Math.random() * 0.8;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

const particleMat = new THREE.PointsMaterial({
	color: 0xfef08a,
	size: 0.15,
	transparent: true,
	opacity: 0.85,
	blending: THREE.AdditiveBlending,
});

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// -----------------------------------------------------------------------------
// Scroll Camera Movement Dynamics (Ultra-Smooth & Gentle)
// -----------------------------------------------------------------------------
let targetScrollProgress = 0;
let currentScrollProgress = 0;

function updateScroll() {
	const docHeight = document.documentElement.scrollHeight - window.innerHeight;
	const scrollY = window.scrollY || window.pageYOffset;
	targetScrollProgress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
}

window.addEventListener('scroll', updateScroll, { passive: true });

// Mouse Parallax with Damping
let rawMouseX = 0;
let rawMouseY = 0;
let smoothMouseX = 0;
let smoothMouseY = 0;

window.addEventListener('mousemove', (e) => {
	rawMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
	rawMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Resize Listener
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

// -----------------------------------------------------------------------------
// Animation Loop
// -----------------------------------------------------------------------------
const clock = new THREE.Clock();
const currentCamPos = new THREE.Vector3(0, 2.5, 15);
const currentLookTarget = new THREE.Vector3(0, 1.8, 0);

function animate() {
	requestAnimationFrame(animate);
	const elapsedTime = clock.getElapsedTime();

	// Ultra-smooth progress interpolation (0.018 factor for ultra-peaceful glide)
	currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.018;

	// Gentle mouse parallax smoothing
	smoothMouseX += (rawMouseX - smoothMouseX) * 0.03;
	smoothMouseY += (rawMouseY - smoothMouseY) * 0.03;

	// Calculate 3D camera path point & look-ahead point
	const progressClamped = Math.min(0.99, Math.max(0, currentScrollProgress));
	const lookAheadProgress = Math.min(1.0, progressClamped + 0.08);

	const pathPoint = pathCurve.getPointAt(progressClamped);
	const lookAheadPoint = pathCurve.getPointAt(lookAheadProgress);

	// Target camera position elevated above garden path + gentle mouse parallax
	const targetCamX = pathPoint.x + smoothMouseX * 0.3;
	const targetCamY = pathPoint.y + 2.0 - smoothMouseY * 0.15;
	const targetCamZ = pathPoint.z;

	// Ultra-smooth vector position lerp
	currentCamPos.x += (targetCamX - currentCamPos.x) * 0.025;
	currentCamPos.y += (targetCamY - currentCamPos.y) * 0.025;
	currentCamPos.z += (targetCamZ - currentCamPos.z) * 0.025;
	camera.position.copy(currentCamPos);

	// Ultra-smooth vector look-at lerp
	const targetLook = new THREE.Vector3(lookAheadPoint.x, lookAheadPoint.y + 1.5, lookAheadPoint.z);
	currentLookTarget.lerp(targetLook, 0.025);
	camera.lookAt(currentLookTarget);

	// Animate Firefly Particles
	const positions = particleGeo.attributes.position.array as Float32Array;
	for (let i = 0; i < particleCount; i++) {
		positions[i * 3 + 1] += Math.sin(elapsedTime * particleSpeeds[i] + i) * 0.005;
		positions[i * 3] += Math.cos(elapsedTime * 0.3 + i) * 0.002;
	}
	particleGeo.attributes.position.needsUpdate = true;

	// Soft pulse point lights
	pointLights.forEach((light, i) => {
		light.intensity = 2.0 + Math.sin(elapsedTime * 1.2 + i) * 0.6;
	});

	renderer.render(scene, camera);
}

// Start animation loop
updateScroll();
animate();

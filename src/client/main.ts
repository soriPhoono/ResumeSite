import * as THREE from 'three';

// -----------------------------------------------------------------------------
// Scene, Camera & Renderer Initialization
// -----------------------------------------------------------------------------
const canvas = document.querySelector<HTMLCanvasElement>('#bg');
if (!canvas) {
	throw new Error('Canvas element #bg not found');
}

const scene = new THREE.Scene();
const skyColor = new THREE.Color(0x38bdf8); // Rich Caribbean baby blue sky
scene.background = skyColor;
scene.fog = new THREE.FogExp2(0x38bdf8, 0.014); // Soft tropical sky haze

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
renderer.toneMappingExposure = 0.92; // Balanced exposure to avoid harsh glare

// -----------------------------------------------------------------------------
// Caribbean Daytime Lighting System
// -----------------------------------------------------------------------------
// Soft ambient daylight
const ambientLight = new THREE.AmbientLight(0xe0f2fe, 1.4);
scene.add(ambientLight);

// Sky / Ground Hemisphere Light (Caribbean baby blue sky above, lush green grass below)
const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x15803d, 1.3);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

// Sun Direct Light
const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
sunLight.position.set(25, 45, 15);
scene.add(sunLight);

// Warm sunbeam point light accents along garden path
const pointLightColors = [0xfde047, 0x86efac, 0xf472b6]; // Sun yellow, Spring green, Bloom pink
const pointLights: THREE.PointLight[] = [];

pointLightColors.forEach((color, i) => {
	const light = new THREE.PointLight(color, 2.5, 20);
	light.position.set((i % 2 === 0 ? 1 : -1) * 3.5, 2, -i * 18 - 5);
	scene.add(light);
	pointLights.push(light);
});

// -----------------------------------------------------------------------------
// Procedural Clouds
// -----------------------------------------------------------------------------
const cloudsGroup = new THREE.Group();

function createCloud(x: number, y: number, z: number, scale: number = 1) {
	const cloud = new THREE.Group();
	const cloudMat = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		roughness: 0.95,
		metalness: 0.05,
		flatShading: true,
		transparent: true,
		opacity: 0.92,
	});

	const puffs = 5 + Math.floor(Math.random() * 3);
	for (let i = 0; i < puffs; i++) {
		const radius = (1.5 + Math.random() * 1.5) * scale;
		const puffGeo = new THREE.IcosahedronGeometry(radius, 1);
		const puff = new THREE.Mesh(puffGeo, cloudMat);

		puff.position.set(
			(i === 0 ? 0 : (Math.random() - 0.5) * 3) * scale,
			(Math.random() * 0.8) * scale,
			(Math.random() - 0.5) * 2 * scale
		);
		cloud.add(puff);
	}

	cloud.position.set(x, y, z);
	return cloud;
}

// Generate clouds over the garden sky
const cloudInstances: THREE.Group[] = [];
for (let i = 0; i < 16; i++) {
	const cloudX = (Math.random() - 0.5) * 60;
	const cloudY = 12 + Math.random() * 8;
	const cloudZ = 20 - Math.random() * 80;
	const c = createCloud(cloudX, cloudY, cloudZ, 0.9 + Math.random() * 0.6);
	cloudsGroup.add(c);
	cloudInstances.push(c);
}
scene.add(cloudsGroup);

// -----------------------------------------------------------------------------
// Procedural Garden World Construction
// -----------------------------------------------------------------------------

// Ground Terrain
const groundGeo = new THREE.PlaneGeometry(80, 100, 30, 30);
groundGeo.rotateX(-Math.PI / 2);

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
	color: 0x16a34a, // Vibrant lush summer green
	roughness: 0.8,
	metalness: 0.05,
	flatShading: true,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.set(0, -1, -20);
scene.add(ground);

// Winding Stone Garden Path
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
	color: 0x94a3b8, // Slate stone
	roughness: 0.85,
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

	// Side stones
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
	const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9, flatShading: true });
	const trunk = new THREE.Mesh(trunkGeo, trunkMat);
	trunk.position.y = 1.5 * scale;
	treeGroup.add(trunk);

	// Foliage (Vibrant daytime palette)
	const foliageColors = [0x22c55e, 0x16a34a, 0x15803d, 0x10b981];
	const tiers = 3;
	for (let i = 0; i < tiers; i++) {
		const foliageGeo = new THREE.IcosahedronGeometry((1.8 - i * 0.4) * scale, 1);
		const foliageMat = new THREE.MeshStandardMaterial({
			color: foliageColors[i % foliageColors.length],
			roughness: 0.65,
			flatShading: true,
		});
		const foliage = new THREE.Mesh(foliageGeo, foliageMat);
		foliage.position.y = (3 + i * 1.2) * scale;
		treeGroup.add(foliage);
	}

	treeGroup.position.set(x, -0.9, z);
	return treeGroup;
}

// Populate trees along sides of path
for (let z = 12; z > -42; z -= 5) {
	const pathPt = pathCurve.getPointAt(Math.min(1, Math.max(0, (15 - z) / 60)));
	const sideOffset = 3.5 + Math.random() * 4;

	scene.add(createTree(pathPt.x - sideOffset, z + (Math.random() - 0.5) * 2, 0.8 + Math.random() * 0.4));
	scene.add(createTree(pathPt.x + sideOffset, z + (Math.random() - 0.5) * 2, 0.8 + Math.random() * 0.4));
}

// -----------------------------------------------------------------------------
// 3D Procedural Water Fountain & Surrounding Trees
// -----------------------------------------------------------------------------
const fountainGroup = new THREE.Group();
const fountainStoneMat = new THREE.MeshStandardMaterial({
	color: 0x94a3b8, // Slate stone
	roughness: 0.75,
	metalness: 0.1,
	flatShading: true,
});

// Outer Basin Wall
const outerBasinWallGeo = new THREE.CylinderGeometry(3.5, 3.7, 0.8, 24);
const outerBasinWall = new THREE.Mesh(outerBasinWallGeo, fountainStoneMat);
outerBasinWall.position.y = 0.4;
fountainGroup.add(outerBasinWall);

// Outer Basin Rim
const outerBasinRimGeo = new THREE.TorusGeometry(3.5, 0.4, 8, 24);
outerBasinRimGeo.rotateX(Math.PI / 2);
const outerBasinRim = new THREE.Mesh(outerBasinRimGeo, fountainStoneMat);
outerBasinRim.position.y = 0.8;
fountainGroup.add(outerBasinRim);

// Translucent Water Pool
const waterMat = new THREE.MeshStandardMaterial({
	color: 0x38bdf8,
	roughness: 0.1,
	metalness: 0.85,
	transparent: true,
	opacity: 0.85,
});
const poolWaterGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.2, 24);
const poolWater = new THREE.Mesh(poolWaterGeo, waterMat);
poolWater.position.y = 0.6;
fountainGroup.add(poolWater);

// Center Pillar
const pillarGeo = new THREE.CylinderGeometry(0.6, 0.8, 2.0, 12);
const pillar = new THREE.Mesh(pillarGeo, fountainStoneMat);
pillar.position.y = 1.4;
fountainGroup.add(pillar);

// Upper Basin Bowl
const upperBasinGeo = new THREE.CylinderGeometry(1.6, 0.8, 0.5, 16);
const upperBasin = new THREE.Mesh(upperBasinGeo, fountainStoneMat);
upperBasin.position.y = 2.4;
fountainGroup.add(upperBasin);

// Upper Basin Water
const upperWaterGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 16);
const upperWater = new THREE.Mesh(upperWaterGeo, waterMat);
upperWater.position.y = 2.65;
fountainGroup.add(upperWater);

fountainGroup.position.set(0, -0.9, -48);
scene.add(fountainGroup);

// Semicircle Tree Ring Surrounding Fountain Background
const treeRingCount = 9;
for (let i = 0; i < treeRingCount; i++) {
	const angle = (i / (treeRingCount - 1)) * Math.PI - Math.PI / 2; // Semicircle behind fountain
	const radius = 7.5 + Math.random() * 2.5;
	const treeX = Math.sin(angle) * radius;
	const treeZ = -48 - Math.cos(angle) * radius;
	scene.add(createTree(treeX, treeZ, 1.1 + Math.random() * 0.4));
}

// Water Spray Particle System
const sprayCount = 140;
const sprayGeo = new THREE.BufferGeometry();
const sprayPos = new Float32Array(sprayCount * 3);
const sprayVelocities: { x: number; y: number; z: number; life: number }[] = [];

for (let i = 0; i < sprayCount; i++) {
	const angle = Math.random() * Math.PI * 2;
	const speed = 0.015 + Math.random() * 0.025;
	sprayPos[i * 3] = 0;
	sprayPos[i * 3 + 1] = 1.7; // Spout from upper basin top
	sprayPos[i * 3 + 2] = -48;
	sprayVelocities.push({
		x: Math.cos(angle) * speed,
		y: 0.07 + Math.random() * 0.05,
		z: Math.sin(angle) * speed,
		life: Math.random() * 1.0,
	});
}

sprayGeo.setAttribute('position', new THREE.BufferAttribute(sprayPos, 3));
const sprayMat = new THREE.PointsMaterial({
	color: 0xe0f2fe,
	size: 0.16,
	transparent: true,
	opacity: 0.85,
});
const sprayParticles = new THREE.Points(sprayGeo, sprayMat);
scene.add(sprayParticles);

// Sunbeam Pollen Particles
const particleCount = 300;
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
	size: 0.12,
	transparent: true,
	opacity: 0.65,
});

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// -----------------------------------------------------------------------------
// Scroll Camera Movement Dynamics (Ultra-Smooth)
// -----------------------------------------------------------------------------
let targetScrollProgress = 0;
let currentScrollProgress = 0;

function updateScroll() {
	const docHeight = document.documentElement.scrollHeight - window.innerHeight;
	const scrollY = window.scrollY || window.pageYOffset;
	targetScrollProgress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
}

window.addEventListener('scroll', updateScroll, { passive: true });

// Mouse Parallax
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

	// Smooth scroll progress interpolation
	currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.018;

	// Mouse parallax smoothing
	smoothMouseX += (rawMouseX - smoothMouseX) * 0.03;
	smoothMouseY += (rawMouseY - smoothMouseY) * 0.03;

	// Map full page scroll (0.0 -> 1.0) linearly to path progression (0.0 -> 0.80) so camera movement is fluid all the way to the footer
	const normalizedScroll = Math.min(1.0, Math.max(0, currentScrollProgress));
	const cameraProgress = normalizedScroll * 0.8;
	const lookAheadProgress = Math.min(0.98, cameraProgress + 0.12);

	const pathPoint = pathCurve.getPointAt(cameraProgress);
	const curveLookPoint = pathCurve.getPointAt(lookAheadProgress);

	// Target camera position elevated above path with soft mouse parallax
	const targetCamX = pathPoint.x + smoothMouseX * 0.3;
	const targetCamY = pathPoint.y + 2.4 - smoothMouseY * 0.15;
	const targetCamZ = pathPoint.z;

	currentCamPos.x += (targetCamX - currentCamPos.x) * 0.025;
	currentCamPos.y += (targetCamY - currentCamPos.y) * 0.025;
	currentCamPos.z += (targetCamZ - currentCamPos.z) * 0.025;
	camera.position.copy(currentCamPos);

	// Smoothly focus lookAt target towards fountain center (0, 1.2, -48) as scroll reaches the footer
	const fountainTarget = new THREE.Vector3(0, 1.2, -48);
	const fountainFocusBlend = normalizedScroll; // Reaches 1.0 exactly at footer

	const targetLook = new THREE.Vector3().lerpVectors(
		new THREE.Vector3(curveLookPoint.x, curveLookPoint.y + 1.6, curveLookPoint.z),
		fountainTarget,
		fountainFocusBlend
	);
	currentLookTarget.lerp(targetLook, 0.03);
	camera.lookAt(currentLookTarget);

	// Animate 3D fountain water spray droplets
	const sprayPositions = sprayGeo.attributes.position.array as Float32Array;
	for (let i = 0; i < sprayCount; i++) {
		const vel = sprayVelocities[i];
		vel.life += 0.025;

		sprayPositions[i * 3] += vel.x;
		sprayPositions[i * 3 + 1] += vel.y - vel.life * 0.009;
		sprayPositions[i * 3 + 2] += vel.z;

		// Reset droplet when it lands back in the basin
		if (sprayPositions[i * 3 + 1] < 0.6 || vel.life > 1.2) {
			const angle = Math.random() * Math.PI * 2;
			const speed = 0.015 + Math.random() * 0.025;
			sprayPositions[i * 3] = 0;
			sprayPositions[i * 3 + 1] = 1.7;
			sprayPositions[i * 3 + 2] = -48;
			vel.x = Math.cos(angle) * speed;
			vel.y = 0.07 + Math.random() * 0.05;
			vel.z = Math.sin(angle) * speed;
			vel.life = 0;
		}
	}
	sprayGeo.attributes.position.needsUpdate = true;

	// Gently drift clouds horizontally across sky
	cloudInstances.forEach((cloud, idx) => {
		cloud.position.x += Math.sin(elapsedTime * 0.2 + idx) * 0.003 + 0.002;
		if (cloud.position.x > 35) cloud.position.x = -35;
	});

	// Animate sunbeam pollen particles
	const positions = particleGeo.attributes.position.array as Float32Array;
	for (let i = 0; i < particleCount; i++) {
		positions[i * 3 + 1] += Math.sin(elapsedTime * particleSpeeds[i] + i) * 0.004;
		positions[i * 3] += Math.cos(elapsedTime * 0.3 + i) * 0.002;
	}
	particleGeo.attributes.position.needsUpdate = true;

	// Soft pulse point lights
	pointLights.forEach((light, i) => {
		light.intensity = 1.8 + Math.sin(elapsedTime * 1.2 + i) * 0.5;
	});

	renderer.render(scene, camera);
}

// Start animation loop
updateScroll();
animate();

// -----------------------------------------------------------------------------
// Web Audio API Natural Songbird & Garden Ambiance Synthesizer
// -----------------------------------------------------------------------------
let audioCtx: AudioContext | null = null;
let isAudioActive = true; // Enabled by default!
let chirpTimer: number | null = null;

interface BirdCallParams {
	pan: number; // -0.75 (left) to +0.75 (right)
	volume: number; // Distance simulation
	birdType: number; // 0: Warbler trill, 1: Robin double chirp, 2: Finch high peep
}

function playSingleChirpNote(ctx: AudioContext, params: BirdCallParams, delayMs: number = 0) {
	if (!isAudioActive) return;

	setTimeout(() => {
		if (!isAudioActive) return;
		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		// Connect Oscillator -> Gain
		osc.connect(gain);

		// Spatial Stereo Panning (Gain -> Panner -> Destination)
		if (typeof ctx.createStereoPanner === 'function') {
			const panner = ctx.createStereoPanner();
			panner.pan.setValueAtTime(params.pan, now);
			gain.connect(panner);
			panner.connect(ctx.destination);
		} else {
			gain.connect(ctx.destination);
		}

		osc.type = 'sine';

		if (params.birdType === 0) {
			// Warbler / Thrush: Rising trill with rapid pitch modulation
			const startFreq = 2500 + Math.random() * 500;
			const midFreq = startFreq + 1000 + Math.random() * 400;
			const endFreq = startFreq - 200;

			osc.frequency.setValueAtTime(startFreq, now);
			osc.frequency.exponentialRampToValueAtTime(midFreq, now + 0.05);
			osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.12);

			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(params.volume, now + 0.015);
			gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.14);

			osc.start(now);
			osc.stop(now + 0.15);
		} else if (params.birdType === 1) {
			// Robin: Crisp double chirp
			const freq1 = 3100 + Math.random() * 400;
			const freq2 = freq1 - 400;

			osc.frequency.setValueAtTime(freq1, now);
			osc.frequency.exponentialRampToValueAtTime(freq2, now + 0.08);

			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(params.volume * 0.9, now + 0.01);
			gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.09);

			osc.start(now);
			osc.stop(now + 0.1);
		} else {
			// Finch: High delicate sweet chirp
			const highFreq = 3800 + Math.random() * 600;
			osc.frequency.setValueAtTime(highFreq, now);
			osc.frequency.exponentialRampToValueAtTime(highFreq + 500, now + 0.04);

			gain.gain.setValueAtTime(0, now);
			gain.gain.linearRampToValueAtTime(params.volume * 0.7, now + 0.01);
			gain.gain.exponentialRampToValueAtTime(0.0003, now + 0.07);

			osc.start(now);
			osc.stop(now + 0.08);
		}
	}, delayMs);
}

function triggerBirdPhrase(ctx: AudioContext) {
	if (!isAudioActive) return;

	// Pick a bird call profile for this phrase
	const birdType = Math.floor(Math.random() * 3);
	const pan = (Math.random() - 0.5) * 1.4; // Spatial stereo pan (-0.7 to +0.7)
	const volume = 0.08 + Math.random() * 0.08; // Crisp audible volume
	const params: BirdCallParams = { pan, volume, birdType };

	// Natural phrase pattern: 2 to 4 notes in a musical call phrase
	const noteCount = Math.floor(2 + Math.random() * 3);
	let phraseTime = 0;

	for (let n = 0; n < noteCount; n++) {
		playSingleChirpNote(ctx, params, phraseTime);
		phraseTime += 100 + Math.random() * 100;
	}

	// 40% chance of a "distant answering call" from another tree across the garden
	if (Math.random() < 0.4) {
		const answerParams: BirdCallParams = {
			pan: -pan * 0.8, // Opposite side of garden
			volume: volume * 0.5, // Distant answer
			birdType: (birdType + 1) % 3,
		};
		playSingleChirpNote(ctx, answerParams, phraseTime + 300 + Math.random() * 200);
	}
}

function scheduleNextChirps(ctx: AudioContext) {
	if (!isAudioActive) return;

	triggerBirdPhrase(ctx);

	// Natural songbird silence intervals between phrases (2.5s to 6.0s)
	const pauseInterval = 2500 + Math.random() * 3500;
	chirpTimer = window.setTimeout(() => scheduleNextChirps(ctx), pauseInterval);
}

function ensureAudioStarted() {
	if (!isAudioActive) return;

	if (!audioCtx) {
		const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
		audioCtx = new AudioCtx();
	}

	if (audioCtx.state === 'suspended') {
		audioCtx
			.resume()
			.then(() => {
				if (audioCtx?.state === 'running' && isAudioActive) {
					if (chirpTimer === null) scheduleNextChirps(audioCtx);
					startAmbientMusic(audioCtx);
				}
			})
			.catch(() => {});
	} else if (audioCtx.state === 'running' && isAudioActive) {
		if (chirpTimer === null) scheduleNextChirps(audioCtx);
		startAmbientMusic(audioCtx);
	}
}

// -----------------------------------------------------------------------------
// Procedural Ambient Music Drone Pad & Chime Swells
// -----------------------------------------------------------------------------
let ambientGainNode: GainNode | null = null;
let ambientOscillators: OscillatorNode[] = [];
let chimeTimer: number | null = null;

function startAmbientMusic(ctx: AudioContext) {
	if (ambientGainNode) return; // Already running

	// Master Gain for Ambient Music
	ambientGainNode = ctx.createGain();
	ambientGainNode.gain.setValueAtTime(0, ctx.currentTime);
	ambientGainNode.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 3.0); // Soft 3s fade in

	// Low pass filter with subtle breathing LFO cutoff modulation
	const filter = ctx.createBiquadFilter();
	filter.type = 'lowpass';
	filter.frequency.setValueAtTime(550, ctx.currentTime);

	// LFO for filter breathing (slow 0.06Hz modulation)
	const lfo = ctx.createOscillator();
	const lfoGain = ctx.createGain();
	lfo.frequency.setValueAtTime(0.06, ctx.currentTime);
	lfoGain.gain.setValueAtTime(150, ctx.currentTime);
	lfo.connect(lfoGain);
	lfoGain.connect(filter.frequency);
	lfo.start();
	ambientOscillators.push(lfo);

	filter.connect(ambientGainNode);
	ambientGainNode.connect(ctx.destination);

	// Warm C-Major Pentatonic Drone Chord: C3 (130.81Hz), G3 (196.00Hz), C4 (261.63Hz), E4 (329.63Hz)
	const chordFreqs = [130.81, 196.0, 261.63, 329.63];
	chordFreqs.forEach((freq) => {
		const osc = ctx.createOscillator();
		osc.type = 'sine';
		osc.frequency.setValueAtTime(freq, ctx.currentTime);

		// Subtle detuning for warm analog texture
		osc.detune.setValueAtTime((Math.random() - 0.5) * 8, ctx.currentTime);

		const oscGain = ctx.createGain();
		oscGain.gain.setValueAtTime(0.2, ctx.currentTime);

		osc.connect(oscGain);
		oscGain.connect(filter);
		osc.start();
		ambientOscillators.push(osc);
	});

	scheduleAmbientChimeSwell(ctx);
}

function playAmbientChime(ctx: AudioContext) {
	if (!isAudioActive || !ambientGainNode) return;
	const now = ctx.currentTime;
	const chimeOsc = ctx.createOscillator();
	const chimeGain = ctx.createGain();

	// Ethereal pentatonic notes: C4 (261.63), E4 (329.63), G4 (392.00), A4 (440.00), C5 (523.25)
	const pentatonicNotes = [261.63, 329.63, 392.0, 440.0, 523.25];
	const noteFreq = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];

	chimeOsc.type = 'sine';
	chimeOsc.frequency.setValueAtTime(noteFreq, now);

	chimeGain.gain.setValueAtTime(0, now);
	chimeGain.gain.linearRampToValueAtTime(0.015, now + 0.8); // Gentle 0.8s attack
	chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8); // Long 3s decay

	chimeOsc.connect(chimeGain);
	chimeGain.connect(ctx.destination);

	chimeOsc.start(now);
	chimeOsc.stop(now + 4.0);
}

function scheduleAmbientChimeSwell(ctx: AudioContext) {
	if (!isAudioActive) return;
	playAmbientChime(ctx);
	const nextChimeDelay = 4500 + Math.random() * 4500;
	chimeTimer = window.setTimeout(() => scheduleAmbientChimeSwell(ctx), nextChimeDelay);
}

function stopAmbientMusic(ctx: AudioContext) {
	if (ambientGainNode) {
		ambientGainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
		setTimeout(() => {
			ambientOscillators.forEach((osc) => {
				try {
					osc.stop();
				} catch {}
			});
			ambientOscillators = [];
			ambientGainNode = null;
		}, 600);
	}
	if (chimeTimer !== null) {
		clearTimeout(chimeTimer);
		chimeTimer = null;
	}
}

// Persistent interaction listeners across all scroll/input gestures until AudioContext is running
const interactionEvents = ['wheel', 'scroll', 'pointerdown', 'mousedown', 'touchstart', 'touchmove', 'keydown', 'click'];
function handleUserInteraction() {
	if (!isAudioActive) return;
	ensureAudioStarted();

	if (audioCtx && audioCtx.state === 'running') {
		interactionEvents.forEach((evt) => window.removeEventListener(evt, handleUserInteraction));
	}
}
interactionEvents.forEach((evt) => window.addEventListener(evt, handleUserInteraction, { passive: true }));

function toggleAudio() {
	isAudioActive = !isAudioActive;
	const btnIcon = document.getElementById('audio-icon');
	const btnLabel = document.getElementById('audio-label');

	if (isAudioActive) {
		if (btnIcon) btnIcon.textContent = '🔊';
		if (btnLabel) btnLabel.textContent = 'Sound On';
		ensureAudioStarted();
	} else {
		if (btnIcon) btnIcon.textContent = '🔇';
		if (btnLabel) btnLabel.textContent = 'Ambient Sound';
		if (chirpTimer !== null) {
			clearTimeout(chirpTimer);
			chirpTimer = null;
		}
		if (audioCtx) {
			stopAmbientMusic(audioCtx);
		}
	}
}

const audioBtn = document.getElementById('audio-toggle');
if (audioBtn) {
	audioBtn.addEventListener('click', toggleAudio);
}




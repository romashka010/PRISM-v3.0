function checkAndRedirectToDesktop() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || (window.innerWidth <= 768);

    if (!isMobile) {
        window.location.href = 'kosmos.html';
    }
}
checkAndRedirectToDesktop();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 15000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

function createGlowTexture(color) {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, color); grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

const starsGeom = new THREE.BufferGeometry();
const starsCount = 1000;
const starsPos = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i++) {
    starsPos[i] = (Math.random() - 0.5) * 8000;
}
starsGeom.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
const starsMat = new THREE.PointsMaterial({ size: 1.5, color: 0xffffff, transparent: true, opacity: 0.5 });
scene.add(new THREE.Points(starsGeom, starsMat));

const sunGroup = new THREE.Group();
scene.add(sunGroup);

const sun = new THREE.Mesh(new THREE.SphereGeometry(25, 32, 32), new THREE.MeshBasicMaterial({
    map: loader.load('textures/sun.jpg', undefined, undefined, () => {
        sun.material.color.setHex(0xffdd44);
    }),
    color: 0xffdd44
}));
sunGroup.add(sun);

const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: createGlowTexture('rgba(255, 180, 0, 0.6)'),
    blending: THREE.AdditiveBlending, transparent: true, depthWrite: false
}));
sunGlow.scale.set(130, 130, 1);
sunGroup.add(sunGlow);

scene.add(new THREE.PointLight(0xffffff, 1.8, 6000));
scene.add(new THREE.AmbientLight(0x0a0a0a));

const asteroidBeltGroup = new THREE.Group();
scene.add(asteroidBeltGroup);

const astTextures = [
    loader.load('textures/asteroid1.jpg'),
    loader.load('textures/asteroid2.jpg'),
    loader.load('textures/asteroid3.jpg')
];

const astGeometries = [
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.IcosahedronGeometry(1, 0)
];

const totalAsteroids = 300;

const asteroidHitboxGeo = new THREE.RingGeometry(370, 570, 32);
const asteroidHitboxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0, depthWrite: false });
const asteroidHitbox = new THREE.Mesh(asteroidHitboxGeo, asteroidHitboxMat);
asteroidHitbox.rotation.x = Math.PI / 2;
scene.add(asteroidHitbox);

for (let i = 0; i < totalAsteroids; i++) {
    const randomGeo = astGeometries[Math.floor(Math.random() * astGeometries.length)];
    const randomTex = astTextures[Math.floor(Math.random() * astTextures.length)];

    const material = new THREE.MeshStandardMaterial({ map: randomTex, roughness: 0.9, metalness: 0.1 });
    const asteroid = new THREE.Mesh(randomGeo, material);
    const angle = Math.random() * Math.PI * 2;
    const radius = 380 + Math.random() * 170;

    asteroid.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 20, Math.sin(angle) * radius);
    const scale = 0.8 + Math.random() * 1.2;
    asteroid.scale.set(scale, scale, scale);
    asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    asteroid.userData.rotationSpeed = (Math.random() - 0.5) * 0.01;
    asteroidBeltGroup.add(asteroid);
}

const earthShader = {
    uniforms: {
        dayTex: { value: loader.load('textures/earth_day.jpg') },
        nightTex: { value: loader.load('textures/earth_night.jpg') },
        sunPos: { value: new THREE.Vector3(0, 0, 0) }
    },
    vertexShader: `varying vec2 vUv; varying vec3 vWorldNormal; varying vec3 vWorldPosition; void main() { vUv = uv; vWorldNormal = normalize(vec3(modelMatrix * vec4(normal, 0.0))); vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform sampler2D dayTex; uniform sampler2D nightTex; uniform vec3 sunPos; varying vec2 vUv; varying vec3 vWorldNormal; varying vec3 vWorldPosition; void main() { vec3 lightDir = normalize(sunPos - vWorldPosition); float intensity = dot(vWorldNormal, lightDir); vec4 day = texture2D(dayTex, vUv); vec4 night = texture2D(nightTex, vUv); float mixStep = smoothstep(-0.15, 0.15, intensity); gl_FragColor = mix(night, day, mixStep); }`
};

const planets = [];
const configs = [
    { name: "Меркурий", size: 2, color: 0x999999, texture: 'textures/mercury.jpg', dist: 58, e: 0.205, speed: 0.005, desc: "Самая близкая к Солнцу планета. У него нет плотной атмосферы, поэтому на нем либо адская жара (днём +430 °C), либо космический холод (ночью -180 °C)." },
    { name: "Венера", size: 3.5, color: 0xe3bb76, texture: 'textures/venus_surface.jpg', dist: 108, e: 0.007, speed: 0.0035, hasAtmosphere: true, atmosphereTexture: 'textures/venus_atmosphere.jpg', desc: "Сестра Земли, скрытая под плотными облаками из серной кислоты. Создает сильнейший парниковый эффект (+460 °C)." },
    { name: "Земля", size: 3.8, dist: 150, e: 0.017, speed: 0.0025, isEarth: true, moons: [{ name: "Луна", size: 1, dist: 12, speed: 0.015, texture: 'textures/moon.jpg' }], desc: "Наш дом. Единственная известная планета во Вселенной с жидкой водой на поверхности и разнообразными биосферными экосистемами." },
    { name: "Марс", size: 2.8, color: 0xff4422, texture: 'textures/mars.jpg', dist: 228, e: 0.093, speed: 0.002, desc: "Красная планета. Характерный марсианский оттенок обусловлен высоким содержанием оксида железа (ржавчины) в пыли и почве." },
    { name: "Юпитер", size: 12, color: 0xd3a57c, texture: 'textures/jupiter.jpg', dist: 778, e: 0.048, speed: 0.0008, desc: "Крупнейший газовый гигант нашей системы, превосходящий по массе все остальные планеты вместе взятые." },
    { name: "Сатурн", size: 10, color: 0xead6b8, texture: 'textures/saturn.jpg', dist: 1429, e: 0.056, speed: 0.0006, hasRings: true, ringTexture: 'textures/saturn_ring.png', desc: "Властелин величественных колец, состоящих из миллиардов частиц космического льда, каменных обломков и силикатной пыли." },
    { name: "Уран", size: 6, color: 0x4fd0e7, texture: 'textures/uranus.jpg', dist: 2875, e: 0.047, speed: 0.0004, hasRings: true, ringTexture: 'textures/uranus_ring.png', isUranus: true, desc: "Ледяной гигант, уникальный тем, что вращается практически лежа на боку. Наклон его оси равен 98 градусам." },
    { name: "Нептун", size: 5.8, color: 0x3b5cc3, texture: 'textures/neptune.jpg', dist: 4497, e: 0.009, speed: 0.0003, desc: "Удаленный темно-синий ледяной гигант, где бушуют самые яростные ураганы и ветры в Солнечной системе." }
];

configs.forEach(data => {
    const a = data.dist;
    const b = a * Math.sqrt(1 - data.e * data.e);
    const focusDist = a * data.e;

    const curve = new THREE.EllipseCurve(-focusDist, 0, a, b, 0, 2 * Math.PI);
    const orbitLine = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)), new THREE.LineBasicMaterial({ color: 0xe0ffff, transparent: true, opacity: 0.1 }));
    orbitLine.rotation.x = Math.PI / 2;
    scene.add(orbitLine);

    let material;
    if (data.isEarth) {
        material = new THREE.ShaderMaterial(earthShader);
    } else {
        material = new THREE.MeshStandardMaterial({
            map: data.texture ? loader.load(data.texture, undefined, undefined, () => { material.color.setHex(data.color || 0x888888); }) : null,
            color: data.texture ? 0xffffff : data.color, roughness: 0.8
        });
    }

    const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.size, 32, 32), material);
    const pObj = { mesh, ...data, a, b, focusDist, angle: Math.random() * Math.PI * 2 };

    if (data.isEarth) {
        const clouds = new THREE.Mesh(new THREE.SphereGeometry(data.size + 0.1, 32, 32), new THREE.MeshStandardMaterial({ map: loader.load('textures/earth_clouds.jpg'), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
        mesh.add(clouds); pObj.clouds = clouds;
    }

    if (data.hasAtmosphere) {
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(data.size + 0.15, 32, 32), new THREE.MeshStandardMaterial({ map: loader.load(data.atmosphereTexture), transparent: true, opacity: 0.8, depthWrite: false }));
        mesh.add(atmosphere); pObj.atmosphere = atmosphere;
    }

    if (data.hasRings) {
        const innerR = data.isUranus ? data.size + 2 : data.size + 3;
        const outerR = data.isUranus ? data.size + 6 : data.size + 15;
        const rings = new THREE.Mesh(new THREE.RingGeometry(innerR, outerR, 64), new THREE.MeshStandardMaterial({ map: loader.load(data.ringTexture), side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
        rings.rotation.x = Math.PI / 2;
        if (data.isUranus) mesh.rotation.z = Math.PI / 2; else mesh.rotation.x = 0.3;
        mesh.add(rings);
    }

    if (data.moons) {
        pObj.moonObjects = [];
        data.moons.forEach(m => {
            const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(m.size, 16, 16), new THREE.MeshStandardMaterial({ map: m.texture ? loader.load(m.texture) : null, color: 0xaaaaaa, roughness: 1.0 }));
            scene.add(moonMesh);
            pObj.moonObjects.push({ mesh: moonMesh, ...m, angle: Math.random() * Math.PI * 2 });
        });
    }

    const selectRing = new THREE.Mesh(new THREE.RingGeometry(data.size + 1.5, data.size + 1.8, 32), new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0, side: THREE.DoubleSide }));
    if (data.isUranus) selectRing.rotation.y = Math.PI / 2;
    mesh.add(selectRing); pObj.selectRing = selectRing;

    const hitbox = new THREE.Mesh(new THREE.SphereGeometry(data.size * 3.5, 16, 16), new THREE.MeshBasicMaterial({ visible: false }));
    pObj.hitbox = hitbox;

    planets.push(pObj);
    scene.add(mesh, hitbox);
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 50;
controls.maxDistance = 6500;
camera.position.set(0, 800, 1500);

let cameraMode = 'FREE';
let selectedPlanet = null;
let transitionProgress = 0;
const transitionSpeed = 0.01;
const startPos = new THREE.Vector3();
const lastPlanetPos = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const asteroidTooltip = document.getElementById('asteroid-tooltip');

let pointerDownPos = { x: 0, y: 0 };
window.addEventListener('pointerdown', (e) => {
    pointerDownPos.x = e.clientX;
    pointerDownPos.y = e.clientY;
});

window.addEventListener('pointerup', (e) => {
    if (e.target.tagName !== 'CANVAS') return;

    const diffX = Math.abs(e.clientX - pointerDownPos.x);
    const diffY = Math.abs(e.clientY - pointerDownPos.y);
    if (diffX > 10 || diffY > 10) return; // Это был свайп, игнорируем клик

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const planetHits = raycaster.intersectObjects(planets.map(p => p.hitbox));
    const beltHit = raycaster.intersectObject(asteroidHitbox);

    planets.forEach(p => { p.selectRing.material.opacity = 0; });
    if(asteroidTooltip) asteroidTooltip.style.display = 'none';

    if (planetHits.length > 0) {
        const p = planets.find(pl => pl.hitbox === planetHits[0].object);
        if (p !== selectedPlanet) {
            p.selectRing.material.opacity = 0.8;
            selectedPlanet = p;
            startPos.copy(camera.position);
            transitionProgress = 0;
            cameraMode = 'TRANSITION';

            if (selectedPlanet.name === 'Нептун' && typeof unlockAchievement !== 'undefined') {
                unlockAchievement('FIND_NEPTUNE');
            }

            const infoPanel = document.getElementById('info-panel');
            if(infoPanel) {
                infoPanel.classList.add('active');
                document.getElementById('p-name').innerText = selectedPlanet.name;
                document.getElementById('p-dist').innerText = selectedPlanet.dist;
                document.getElementById('p-desc').innerText = selectedPlanet.desc;
            }
        }
    } else if (beltHit.length > 0 && asteroidTooltip) {
        asteroidTooltip.style.display = 'block';
        const infoPanel = document.getElementById('info-panel');
        if(infoPanel) infoPanel.classList.remove('active');
        selectedPlanet = null;
        cameraMode = 'FREE';
        planets.forEach(p => p.selectRing.material.opacity = 0);
    } else {
        const infoPanel = document.getElementById('info-panel');
        if(infoPanel) infoPanel.classList.remove('active');
        selectedPlanet = null;
        cameraMode = 'FREE';
        planets.forEach(p => p.selectRing.material.opacity = 0);
    }
});

let panelTouchStartY = 0;
const infoPanel = document.getElementById('info-panel');
if (infoPanel) {
    infoPanel.addEventListener('touchstart', e => {
        panelTouchStartY = e.touches[0].clientY;
    }, {passive: true});

    infoPanel.addEventListener('touchmove', e => {
        const diff = e.touches[0].clientY - panelTouchStartY;
        if (diff > 50) { // Свайп вниз
            infoPanel.classList.remove('active');
            selectedPlanet = null;
            cameraMode = 'FREE';
            planets.forEach(p => p.selectRing.material.opacity = 0);
        }
    }, {passive: true});
}

const resetBtn = document.getElementById('reset-btn');
if(resetBtn) {
    resetBtn.onclick = () => {
        selectedPlanet = null;
        transitionProgress = 0;
        startPos.copy(camera.position);
        cameraMode = 'RESETTING';
        if (infoPanel) infoPanel.classList.remove('active');
        planets.forEach(p => p.selectRing.material.opacity = 0);
        if (asteroidTooltip) asteroidTooltip.style.display = 'none';
    };
}

function animate() {
    requestAnimationFrame(animate);

    sunGroup.rotation.y += 0.001;

    asteroidBeltGroup.rotation.y -= 0.0002;
    asteroidBeltGroup.children.forEach(ast => {
        ast.rotation.x += ast.userData.rotationSpeed;
        ast.rotation.y += ast.userData.rotationSpeed;
    });

    planets.forEach(p => {
        p.angle += p.speed;
        const x = p.a * Math.cos(p.angle) - p.focusDist;
        const z = p.b * Math.sin(p.angle);
        p.mesh.position.set(x, 0, z);
        p.hitbox.position.copy(p.mesh.position);

        if (p.name === "Венера") { p.mesh.rotation.y -= 0.002; if (p.atmosphere) p.atmosphere.rotation.y -= 0.003; }
        else if (p.name === "Уран") p.mesh.rotation.x -= 0.005;
        else p.mesh.rotation.y += 0.002;

        if (p.clouds) p.clouds.rotation.y += 0.003;

        if (p.moonObjects) {
            p.moonObjects.forEach(m => {
                m.angle += m.speed;
                m.mesh.position.set(
                    p.mesh.position.x + Math.cos(m.angle) * m.dist,
                    Math.sin(m.angle) * m.dist * 0.1,
                    p.mesh.position.z + Math.sin(m.angle) * m.dist
                );
                m.mesh.rotation.y += 0.01;
            });
        }
    });

    if (cameraMode === 'TRANSITION') {
        transitionProgress += transitionSpeed;
        const pPos = selectedPlanet.mesh.position;
        const viewDist = selectedPlanet.size * 8;
        const targetPoint = new THREE.Vector3(pPos.x + viewDist, pPos.y + viewDist * 0.3, pPos.z + viewDist);

        camera.position.lerpVectors(startPos, targetPoint, transitionProgress);
        controls.target.lerp(pPos, transitionProgress);

        if (transitionProgress >= 1) { cameraMode = 'FOLLOW'; lastPlanetPos.copy(pPos); }
    } else if (cameraMode === 'FOLLOW') {
        const currentPos = selectedPlanet.mesh.position;
        const delta = new THREE.Vector3().subVectors(currentPos, lastPlanetPos);
        camera.position.add(delta);
        controls.target.copy(currentPos);
        lastPlanetPos.copy(currentPos);
    } else if (cameraMode === 'RESETTING') {
        transitionProgress += transitionSpeed;
        camera.position.lerpVectors(startPos, new THREE.Vector3(0, 800, 1500), transitionProgress);
        controls.target.lerp(new THREE.Vector3(0, 0, 0), transitionProgress);
        if (transitionProgress >= 1) cameraMode = 'FREE';
    }

    controls.update();
    renderer.render(scene, camera);
}

function startSimulationSafely() {
    animate();
    const overlay = document.getElementById('intro-transition-overlay');
    setTimeout(() => {
        if (overlay) overlay.classList.add('inactive');
        const uiElements = document.querySelectorAll('.fade-in-ui');
        uiElements.forEach(el => el.classList.add('visible'));
    }, 200);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSimulationSafely);
} else {
    startSimulationSafely();
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
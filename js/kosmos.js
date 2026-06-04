const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 15000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

function createGlowTexture(color) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

const starsGeom = new THREE.BufferGeometry();
const starsCount = 2500;
const starsPos = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i++) {
    starsPos[i] = (Math.random() - 0.5) * 8000;
}
starsGeom.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
const starsMat = new THREE.PointsMaterial({
    size: 1.0,
    color: 0xffffff,
    transparent: true,
    opacity: 0.35
});
scene.add(new THREE.Points(starsGeom, starsMat));

const sunGroup = new THREE.Group();
scene.add(sunGroup);

const sun = new THREE.Mesh(new THREE.SphereGeometry(25, 64, 64), new THREE.MeshBasicMaterial({
    map: loader.load('textures/sun.jpg', undefined, undefined, () => {
        sun.material.color.setHex(0xffdd44);
    }),
    color: 0xffdd44
}));
sunGroup.add(sun);

const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: createGlowTexture('rgba(255, 180, 0, 0.5)'),
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
}));
sunGlow.scale.set(130, 130, 1);
sunGroup.add(sunGlow);

sun.renderOrder = 1;
sunGlow.renderOrder = 2;

const sunHitbox = new THREE.Mesh(
    new THREE.SphereGeometry(30, 16, 16),
    new THREE.MeshBasicMaterial({ visible: false })
);
sunGroup.add(sunHitbox);

const sunData = {
    name: "Солнце",
    dist: 0,
    desc: "Центральная звезда нашей системы, желтый карлик. Её масса составляет 99,86% от суммарной массы всей Солнечной системы. Температура на поверхности достигает 5500 °C, а в ядре — около 15 миллионов градусов. Без энергии Солнца жизнь на Земле была бы невозможна.",
    mesh: sunGroup,
    size: 25
};

const flares = [];
for (let i = 0; i < 2; i++) {
    const flareSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: createGlowTexture('rgba(255, 80, 0, 0.9)'),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0,
        depthWrite: false
    }));
    sunGroup.add(flareSprite);

    const flareData = {
        sprite: flareSprite,
        life: Math.random(),
        speed: 0,
        maxSize: 0,
        reset: function() {
            this.life = 0;
            this.speed = 0.001 + Math.random() * 0.04;
            this.maxSize = 15 + Math.random() * 25;

            const phi = Math.acos((Math.random() * 2) - 1);
            const theta = Math.random() * Math.PI * 2;
            this.sprite.position.setFromSphericalCoords(25.2, phi, theta);
        }
    };
    flareData.reset();
    flareData.life = Math.random();
    flares.push(flareData);
}

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
    new THREE.DodecahedronGeometry(1, 1),
    new THREE.IcosahedronGeometry(1, 0)
];

const totalAsteroids = 800;

const asteroidHitboxGeo = new THREE.RingGeometry(370, 570, 64);
const asteroidHitboxMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
    depthWrite: false
});
const asteroidHitbox = new THREE.Mesh(asteroidHitboxGeo, asteroidHitboxMat);
asteroidHitbox.rotation.x = Math.PI / 2;
asteroidHitbox.name = "asteroid_belt_hitbox";
scene.add(asteroidHitbox);

for (let i = 0; i < totalAsteroids; i++) {
    const randomGeo = astGeometries[Math.floor(Math.random() * astGeometries.length)];
    const randomTex = astTextures[Math.floor(Math.random() * astTextures.length)];

    const material = new THREE.MeshStandardMaterial({
        map: randomTex,
        roughness: 0.9,
        metalness: 0.1
    });

    const asteroid = new THREE.Mesh(randomGeo, material);
    const angle = Math.random() * Math.PI * 2;
    const radius = 380 + Math.random() * 170;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (Math.random() - 0.5) * 20;

    asteroid.position.set(x, y, z);

    const scale = 0.5 + Math.random() * 1.5;
    asteroid.scale.set(scale, scale, scale);
    asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    asteroid.userData.rotationSpeed = (Math.random() - 0.5) * 0.01;

    asteroidBeltGroup.add(asteroid);
}

const cometGroup = new THREE.Group();
const cometCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
);
const cometGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: createGlowTexture('rgba(150, 200, 255, 0.9)'),
    blending: THREE.AdditiveBlending,
    transparent: true
}));
cometGroup.add(cometCore, cometGlow);
scene.add(cometGroup);

const cometConfig = {
    angle: Math.PI,
    speed: 0,
    radiusX: 0,
    radiusZ: 0,
    offsetY: 0,
    reset: function() {
        this.angle = Math.PI;
        this.speed = 0.001 + Math.random() * 0.006;
        this.radiusX = 5500 + Math.random() * 2500;
        this.radiusZ = 1500 + Math.random() * 2000;
        this.offsetY = (Math.random() - 0.5) * 1000;
        cometGlow.scale.set(15 + Math.random() * 20, 8 + Math.random() * 8, 1);
    }
};
cometConfig.reset();

const earthShader = {
    uniforms: {
        dayTex: { value: loader.load('textures/earth_day.jpg') },
        nightTex: { value: loader.load('textures/earth_night.jpg') },
        sunPos: { value: new THREE.Vector3(0, 0, 0) }
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        void main() {
            vUv = uv;
            vWorldNormal = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D dayTex;
        uniform sampler2D nightTex;
        uniform vec3 sunPos;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        void main() {
            vec3 lightDir = normalize(sunPos - vWorldPosition);
            float intensity = dot(vWorldNormal, lightDir);
            vec4 day = texture2D(dayTex, vUv);
            vec4 night = texture2D(nightTex, vUv);
            float mixStep = smoothstep(-0.15, 0.15, intensity);
            gl_FragColor = mix(night, day, mixStep);
        }
    `
};

const planets = [];
const configs = [
    { name: "Меркурий",
        size: 2,
        color: 0x999999,
        texture: 'textures/mercury.jpg',
        dist: 58,
        e: 0.205,
        speed: 0.005,
        desc: "Самая близкая к Солнцу планета. У него нет плотной атмосферы, поэтому на нем либо адская жара (днём +430 °C), либо космический холод (ночью -180 °C). Весь покрыт шрамами от столкновений с астероидами, из-за чего очень похож на нашу Луну. Год на Меркурии длится всего 88 дней, зато один день (оборот вокруг оси) тянется целых 59 земных суток."
    },
    { name: "Венера",
        size: 3.5,
        color: 0xe3bb76,
        texture: 'textures/venus_surface.jpg',
        dist: 108,
        e: 0.007,
        speed: 0.0035,
        hasAtmosphere: true,
        atmosphereTexture: 'textures/venus_atmosphere.jpg',
        desc: "Сестра Земли, скрытая под плотными облаками из серной кислоты. Хотя она не самая близкая к Солнцу, на ней жарче всего из-за плотных облаков (+460 °C), которые создают сильный парниковый эффект. Давление на поверхности настолько колоссальное, что человека расплющило бы как на глубине 900 метров под водой. Кроме того, она одна из немногих планет, вращающихся по часовой стрелке."
    },
    { name: "Земля",
        size: 3.8,
        dist: 150,
        e: 0.017,
        speed: 0.0025,
        isEarth: true,
        moons: [
            { name: "Луна",
            size: 1,
            dist: 12,
            speed: 0.015,
            texture: 'textures/moon.jpg' }],
        desc: "Наш дом. Единственная известная планета во Вселенной с жидкой водой на поверхности и разнообразными биосферными экосистемами. Её единственный естественный спутник — Луна, которая управляет океанскими приливами и стабилизирует климат Земли."
    },
    { name: "Марс",
        size: 2.8,
        color: 0xff4422,
        texture: 'textures/mars.jpg',
        dist: 228,
        e: 0.093,
        speed: 0.002,
        moons: [
            { name: "Фобос",
            size: 0.4,
            dist: 6,
            speed: 0.02,
            texture: 'textures/phobos.jpg' },
            { name: "Деймос",
            size: 0.3,
            dist: 8,
            speed: 0.012,
            texture: 'textures/deimos.jpg' }],
        desc: "Красная планета. Характерный оттенок обусловлен высоким содержанием оксида железа (ржавчины). Здесь находится самый высокий потухший вулкан в Солнечной системе — Олимп. У Марса есть два небольших спутника — Фобос и Деймос, которые, скорее всего, являются захваченными гравитацией астероидами.\\n\\n*У некоторых планет есть спутники, но нету текстур, это нормально, так как найти текстуры на спутники сложно."
    },
    { name: "Юпитер",
        size: 12,
        color: 0xd3a57c,
        texture: 'textures/jupiter.jpg',
        dist: 778,
        e: 0.048,
        speed: 0.0008,
        moons: [
            { name: "Европа",
            size: 1.5,
            dist: 20,
            speed: 0.01,
            texture: 'textures/europa.jpg' }],
        desc: "Крупнейший газовый гигант нашей системы. Знаменитое Большое Красное Пятно — это мегашторм-антициклон, бушующий как минимум 300 лет. Окружен десятками спутников, среди которых выделяется ледяная Европа — под её толстым льдом скрывается глобальный океан, где теоретически возможна жизнь.\\n\\n*У некоторых планет есть спутники, но нету текстур, это нормально, так как найти текстуры на спутники сложно."
    },
    { name: "Сатурн",
        size: 10,
        color: 0xead6b8,
        texture: 'textures/saturn.jpg',
        dist: 1429,
        e: 0.056,
        speed: 0.0006,
        hasRings: true,
        ringTexture: 'textures/saturn_ring.png',
        desc: "Властелин величественных колец, состоящих из миллиардов частиц космического льда, каменных обломков и силикатной пыли. Обладает крайне низкой средней плотностью — если бы во Вселенной существовал гигантский океан, Сатурн мог бы плавать на его поверхности."
    },
    { name: "Уран",
        size: 6,
        color: 0x4fd0e7,
        texture: 'textures/uranus.jpg',
        dist: 2875,
        e: 0.047,
        speed: 0.0004,
        hasRings: true,
        ringTexture: 'textures/uranus_ring.png',
        isUranus: true,
        desc: "Ледяной гигант, уникальный тем, что вращается практически лежа на боку. Наклон его оси равен 98 градусам. Имеет бледно-бирюзовый окрас из-за метана в верхних слоях атмосферы и является самой холодной планетой системы."
    },
    { name: "Нептун",
        size: 5.8,
        color: 0x3b5cc3,
        texture: 'textures/neptune.jpg',
        dist: 4497,
        e: 0.009,
        speed: 0.0003,
        moons: [
            { name: "Тритон",
            size: 0.8,
            dist: 12,
            speed: 0.008,
            texture: 'textures/triton.jpg' }],
        desc: "Удаленный темно-синий ледяной гигант, где бушуют самые яростные ураганы и ветры в Солнечной системе, скорость которых превосходит скорость звука (до 2000 км/ч). Из-за огромного расстояния солнечный свет добирается сюда более 4 часов.Его крупнейший спутник Тритон уникален тем, что вращается в обратном направлении, а на его поверхности извергаются ледяные гейзеры (криовулканы). \\n\\n*У некоторых планет есть спутники, но нету текстур, это нормально, так как найти текстуры на спутники сложно."
    }
];

configs.forEach(data => {
    const a = data.dist;
    const b = a * Math.sqrt(1 - data.e * data.e);
    const focusDist = a * data.e;

    const curve = new THREE.EllipseCurve(-focusDist, 0, a, b, 0, 2 * Math.PI);
    const points = curve.getPoints(128);
    const orbitGeom = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMat = new THREE.LineBasicMaterial({
        color: 0xe0ffff,
        transparent: true,
        opacity: 0.1
    });
    const orbitLine = new THREE.LineLoop(orbitGeom, orbitMat);
    orbitLine.rotation.x = Math.PI / 2;
    scene.add(orbitLine);

    let material;
    if (data.isEarth) {
        material = new THREE.ShaderMaterial(earthShader);
    } else {
        material = new THREE.MeshStandardMaterial({
            map: data.texture ? loader.load(data.texture, undefined, undefined, () => {
                material.color.setHex(data.color || 0x888888);
            }) : null,
            color: data.texture ? 0xffffff : data.color,
            roughness: 0.8
        });
    }

    const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.size, 32, 32), material);
    const pObj = { mesh, ...data, a, b, focusDist, angle: Math.random() * Math.PI * 2 };

    if (data.isEarth) {
        const cloudMat = new THREE.MeshStandardMaterial({
            map: loader.load('textures/earth_clouds.jpg'),
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const clouds = new THREE.Mesh(new THREE.SphereGeometry(data.size + 0.1, 32, 32), cloudMat);
        mesh.add(clouds);
        pObj.clouds = clouds;
    }

    if (data.hasAtmosphere) {
        const atmosMat = new THREE.MeshStandardMaterial({
            map: loader.load(data.atmosphereTexture),
            transparent: true,
            opacity: 0.8,
            depthWrite: false
        });
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(data.size + 0.15, 32, 32), atmosMat);
        mesh.add(atmosphere);
        pObj.atmosphere = atmosphere;
    }

    if (data.hasRings) {
        const innerR = data.isUranus ? data.size + 2 : data.size + 3;
        const outerR = data.isUranus ? data.size + 6 : data.size + 15;
        const ringGeom = new THREE.RingGeometry(innerR, outerR, 64);
        const ringMat = new THREE.MeshStandardMaterial({
            map: loader.load(data.ringTexture),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        const rings = new THREE.Mesh(ringGeom, ringMat);
        rings.rotation.x = Math.PI / 2;
        if (data.isUranus) {
            mesh.rotation.z = Math.PI / 2;
        } else {
            mesh.rotation.x = 0.3;
        }
        mesh.add(rings);
    }

    if (data.moons) {
        pObj.moonObjects = [];
        data.moons.forEach(m => {
            const moonMesh = new THREE.Mesh(
                new THREE.SphereGeometry(m.size, 16, 16),
                new THREE.MeshStandardMaterial({
                    map: m.texture ? loader.load(m.texture) : null,
                    color: 0xaaaaaa,
                    roughness: 1.0
                })
            );
            scene.add(moonMesh);
            pObj.moonObjects.push({ mesh: moonMesh, ...m, angle: Math.random() * Math.PI * 2 });
        });
    }

    const selectRing = new THREE.Mesh(
        new THREE.RingGeometry(data.size + 1.5, data.size + 1.8, 64),
        new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0, side: THREE.DoubleSide })
    );
    if (data.isUranus) {
        selectRing.rotation.y = Math.PI / 2;
    }
    mesh.add(selectRing);
    pObj.selectRing = selectRing;

    const hitbox = new THREE.Mesh(new THREE.SphereGeometry(data.size * 2.5, 16, 16), new THREE.MeshBasicMaterial({ visible: false }));
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
const transitionSpeed = 0.006;
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

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const allHitboxes = planets.map(p => p.hitbox);
    allHitboxes.push(sunHitbox);

    const planetHits = raycaster.intersectObjects(allHitboxes);
    const beltHit = raycaster.intersectObject(asteroidHitbox);

    planets.forEach(p => { p.selectRing.material.opacity = 0; });
    asteroidTooltip.style.display = 'none';
    document.body.style.cursor = 'default';

    if (planetHits.length > 0) {
        const hitObj = planetHits[0].object;

        if (hitObj === sunHitbox) {
            document.body.style.cursor = 'pointer';
        } else {
            const p = planets.find(pl => pl.hitbox === hitObj);
            if (p && p !== selectedPlanet) {
                p.selectRing.material.opacity = 0.7;
                document.body.style.cursor = 'pointer';
            }
        }
    } else if (beltHit.length > 0) {
        asteroidTooltip.style.display = 'block';
        asteroidTooltip.style.left = (e.clientX + 15) + 'px';
        asteroidTooltip.style.top = (e.clientY + 15) + 'px';
        document.body.style.cursor = 'help';
    }
});

window.addEventListener('pointerup', (e) => {
    if (e.target.tagName !== 'CANVAS') return;

    const diffX = Math.abs(e.clientX - pointerDownPos.x);
    const diffY = Math.abs(e.clientY - pointerDownPos.y);

    if (diffX > 6 || diffY > 6) return;

    raycaster.setFromCamera(mouse, camera);

    const allHitboxes = planets.map(p => p.hitbox);
    allHitboxes.push(sunHitbox);

    const hits = raycaster.intersectObjects(allHitboxes);

    if (hits.length > 0) {
        const hitObj = hits[0].object;
        let newSelected;

        if (hitObj === sunHitbox) {
            newSelected = sunData;

            if (typeof unlockAchievement === 'function') {
                unlockAchievement('SUN_EXPLORER');
            }
        } else {
            newSelected = planets.find(pl => pl.hitbox === hitObj);
        }

        if (newSelected === selectedPlanet) return;

        selectedPlanet = newSelected;
        startPos.copy(camera.position);
        transitionProgress = 0;
        cameraMode = 'TRANSITION';

        if (selectedPlanet.name === 'Нептун' && typeof unlockAchievement !== 'undefined') {
            unlockAchievement('FIND_NEPTUNE');
        }

        document.getElementById('info-panel').classList.add('active');
        document.getElementById('p-name').innerText = selectedPlanet.name;
        document.getElementById('p-dist').innerText = selectedPlanet.dist;
        document.getElementById('p-desc').innerText = selectedPlanet.desc;
    }
});

document.getElementById('ui-close-btn').onclick = () => {
    selectedPlanet = null;
    transitionProgress = 0;
    cameraMode = 'RESETTING';
    startPos.copy(camera.position);
    document.getElementById('info-panel').classList.remove('active');
};

document.getElementById('reset-btn').onclick = () => {
    selectedPlanet = null;
    transitionProgress = 0;
    startPos.copy(camera.position);
    cameraMode = 'RESETTING';
};

function animate() {
    requestAnimationFrame(animate);

    sunGroup.rotation.y += 0.001;
    flares.forEach(f => {
        f.life += f.speed;
        if (f.life >= 1.0) {
            f.reset();
        } else {
            const intensity = Math.sin(f.life * Math.PI);
            const scale = f.maxSize * intensity;
            f.sprite.scale.set(scale, scale, 1);
            f.sprite.material.opacity = intensity;
        }
    });

    cometConfig.angle += cometConfig.speed;
    if (cometConfig.angle > Math.PI * 3) {
        cometConfig.reset();
    }
    const cX = Math.cos(cometConfig.angle) * cometConfig.radiusX - (cometConfig.radiusX * 0.4);
    const cZ = Math.sin(cometConfig.angle) * cometConfig.radiusZ;
    const cY = Math.sin(cometConfig.angle) * cometConfig.offsetY;

    cometGroup.position.set(cX, cY, cZ);
    cometGroup.lookAt(0, 0, 0);

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

        if (p.name === "Венера") {
            p.mesh.rotation.y -= 0.002;
            if (p.atmosphere) p.atmosphere.rotation.y -= 0.003;
        } else if (p.name === "Уран") {
            p.mesh.rotation.x -= 0.005;
        } else {
            p.mesh.rotation.y += 0.002;
        }

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
        const viewDist = selectedPlanet.size * 6;
        const targetPoint = new THREE.Vector3(pPos.x + viewDist, pPos.y + viewDist * 0.4, pPos.z + viewDist);

        camera.position.lerpVectors(startPos, targetPoint, transitionProgress);
        camera.position.y += Math.sin(transitionProgress * Math.PI) * 50;
        controls.target.lerp(pPos, transitionProgress);

        if (transitionProgress >= 1) {
            cameraMode = 'FOLLOW';
            lastPlanetPos.copy(pPos);
        }
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
        if (transitionProgress >= 1) {
            cameraMode = 'FREE';
        }
    }

    if (cameraMode === 'FREE') {
        const panLimit = 7000;
        controls.target.x = THREE.MathUtils.clamp(controls.target.x, -panLimit, panLimit);
        controls.target.y = THREE.MathUtils.clamp(controls.target.y, -panLimit, panLimit);
        controls.target.z = THREE.MathUtils.clamp(controls.target.z, -panLimit, panLimit);
    }

    const panLimit = 6000;
    controls.target.x = THREE.MathUtils.clamp(controls.target.x, -panLimit, panLimit);
    controls.target.y = THREE.MathUtils.clamp(controls.target.y, -panLimit, panLimit);
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, -panLimit, panLimit);

    controls.update();
    renderer.render(scene, camera);
}

function startSimulationSafely() {
    animate();

    const overlay = document.getElementById('intro-transition-overlay');

    setTimeout(() => {
        if (overlay) {
            overlay.classList.add('inactive');
        }

        const uiElements = document.querySelectorAll('.fade-in-ui');
        uiElements.forEach(el => {
            el.classList.add('visible');
        });
    }, 300);
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

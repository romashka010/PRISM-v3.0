const pistonCanvas = document.getElementById('piston-canvas');
const pCtx = pistonCanvas.getContext('2d');
const pistonWrapper = document.getElementById('piston-wrapper');

const graphCanvas = document.getElementById('graph-canvas');
const gCtx = graphCanvas.getContext('2d');

const colors = {
    grid: 'rgba(255, 255, 255, 0.02)',
    axis: 'rgba(255, 255, 255, 0.15)',
    pistonWall: '#4e54c8',
    pistonFace: '#efefef',
    isotherm: '#a855f7',
    isobar: '#2ed573',
    isochore: '#ff4757',
    activePoint: '#00d2ff',
    dashedLines: 'rgba(0, 210, 255, 0.4)'
};

const inputs = {
    P: document.getElementById('input-P'),
    V: document.getElementById('input-V'),
    T: document.getElementById('input-T')
};

const nums = {
    P: document.getElementById('num-P'),
    V: document.getElementById('num-V'),
    T: document.getElementById('num-T')
};

const badges = {
    P: document.getElementById('badge-P'),
    V: document.getElementById('badge-V'),
    T: document.getElementById('badge-T')
};

const btnIsotherm = document.getElementById('btn-proc-isotherm');
const btnIsobar = document.getElementById('btn-proc-isobar');
const btnIsochore = document.getElementById('btn-proc-isochore');

const btnAxisPV = document.getElementById('btn-axis-pv');
const btnAxisVT = document.getElementById('btn-axis-vt');
const btnAxisPT = document.getElementById('btn-axis-pt');

const P_MIN = 10, P_MAX = 2000;
const V_MIN = 1, V_MAX = 100;
const T_MIN = 10, T_MAX = 10000;

let gas = {
    process: 'isotherm',
    P: 100,
    V: 10.0,
    T: 300,
    vR: 0,
    graphAxes: 'PV'
};

const NUM_MOLECULES = 120;
let molecules = [];
let collisionCount = 0;
let collisionRate = 0;
let lastCollisionCheckTime = 0;
let labels = {};

let inputDebounceTimers = {
    P: null,
    V: null,
    T: null
};

function initGasState() {
    gas.vR = (gas.P * gas.V) / gas.T;
}

function updateGasPhysics(changedParam) {
    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    if (gas.process === 'isotherm') {
        if (changedParam === 'V') {
            gas.P = (gas.vR * gas.T) / gas.V;
            if (gas.P > P_MAX) { gas.P = P_MAX; gas.V = (gas.vR * gas.T) / gas.P; }
            if (gas.P < P_MIN) { gas.P = P_MIN; gas.V = (gas.vR * gas.T) / gas.P; }
        } else if (changedParam === 'P') {
            gas.V = (gas.vR * gas.T) / gas.P;
            if (gas.V > V_MAX) { gas.V = V_MAX; gas.P = (gas.vR * gas.T) / gas.V; }
            if (gas.V < V_MIN) { gas.V = V_MIN; gas.P = (gas.vR * gas.T) / gas.V; }
        } else if (changedParam === 'T') {
            gas.T = clamp(gas.T, T_MIN, T_MAX);
            gas.P = (gas.vR * gas.T) / gas.V;
            if (gas.P > P_MAX) { gas.P = P_MAX; gas.T = (gas.P * gas.V) / gas.vR; }
            if (gas.P < P_MIN) { gas.P = P_MIN; gas.T = (gas.P * gas.V) / gas.vR; }
        }
    }
    else if (gas.process === 'isobar') {
        if (changedParam === 'V') {
            gas.T = (gas.P * gas.V) / gas.vR;
            if (gas.T > T_MAX) { gas.T = T_MAX; gas.V = (gas.vR * gas.T) / gas.P; }
            if (gas.T < T_MIN) { gas.T = T_MIN; gas.V = (gas.vR * gas.T) / gas.P; }
        } else if (changedParam === 'T') {
            gas.V = (gas.vR * gas.T) / gas.P;
            if (gas.V > V_MAX) { gas.V = V_MAX; gas.T = (gas.P * gas.V) / gas.vR; }
            if (gas.V < V_MIN) { gas.V = V_MIN; gas.T = (gas.P * gas.V) / gas.vR; }
        } else if (changedParam === 'P') {
            gas.P = clamp(gas.P, P_MIN, P_MAX);
            gas.T = (gas.P * gas.V) / gas.vR;
            if (gas.T > T_MAX) { gas.T = T_MAX; gas.V = (gas.vR * gas.T) / gas.P; }
            if (gas.T < T_MIN) { gas.T = T_MIN; gas.V = (gas.vR * gas.T) / gas.P; }
        }
    }
    else if (gas.process === 'isochore') {
        if (changedParam === 'P') {
            gas.T = (gas.P * gas.V) / gas.vR;
            if (gas.T > T_MAX) { gas.T = T_MAX; gas.P = (gas.vR * gas.T) / gas.V; }
            if (gas.T < T_MIN) { gas.T = T_MIN; gas.P = (gas.vR * gas.T) / gas.V; }
        } else if (changedParam === 'T') {
            gas.P = (gas.vR * gas.T) / gas.V;
            if (gas.P > P_MAX) { gas.P = P_MAX; gas.T = (gas.P * gas.V) / gas.vR; }
            if (gas.P < P_MIN) { gas.P = P_MIN; gas.T = (gas.P * gas.V) / gas.vR; }
        } else if (changedParam === 'V') {
            gas.V = clamp(gas.V, V_MIN, V_MAX);
            gas.P = (gas.vR * gas.T) / gas.V;
            if (gas.P > P_MAX) { gas.P = P_MAX; gas.T = (gas.P * gas.V) / gas.vR; }
            if (gas.P < P_MIN) { gas.P = P_MIN; gas.T = (gas.P * gas.V) / gas.vR; }
        }
    }

    updateControlInputs();
    renderTheoreticalLaTeX();
}

function updateControlInputs() {
    badges.P.style.display = gas.process === 'isobar' ? 'inline-block' : 'none';
    badges.V.style.display = gas.process === 'isochore' ? 'inline-block' : 'none';
    badges.T.style.display = gas.process === 'isotherm' ? 'inline-block' : 'none';

    const params = ['P', 'V', 'T'];
    params.forEach(param => {
        let input = inputs[param];
        let num = nums[param];

        if (input) input.value = gas[param];

        if (num && document.activeElement !== num) {
            num.value = gas[param].toFixed(param === 'V' ? 1 : 0);
        }
    });

    if (labels.T) labels.T.innerText = Math.round(gas.T) + ' K';
}

function renderTheoreticalLaTeX() {
    if (!labels.lawTitle || typeof katex === 'undefined') return;

    let lawTitle = "";
    let lawFormula = "";
    let stateFormula = `P \\cdot V = \\nu R T`;

    if (gas.process === 'isotherm') {
        lawTitle = "Закон Бойля-Мариотта (Изотерма)";
        lawFormula = `P \\cdot V = \\text{const}`;
    } else if (gas.process === 'isobar') {
        lawTitle = "Закон Гей-Люссака (Изобара)";
        lawFormula = `\\frac{V}{T} = \\text{const}`;
    } else if (gas.process === 'isochore') {
        lawTitle = "Закон Шарля (Изохора)";
        lawFormula = `\\frac{P}{T} = \\text{const}`;
    }

    labels.lawTitle.innerText = lawTitle;
    try {
        katex.render(lawFormula, labels.lawFormula, { throwOnError: false, displayMode: false });
        katex.render(stateFormula, labels.stateFormula, { throwOnError: false, displayMode: false });
    } catch (e) {
        labels.lawFormula.innerText = lawFormula;
        labels.stateFormula.innerText = stateFormula;
    }
}

function syncInputSlider(key, value) {
    let val = parseFloat(value);
    if (isNaN(val)) return;

    gas[key] = val;
    updateGasPhysics(key);
    drawGraphs();
}

function syncInputText(key, value) {
    if (inputDebounceTimers[key]) {
        clearTimeout(inputDebounceTimers[key]);
    }

    if (value === '') return;

    let val = parseFloat(value);
    if (isNaN(val)) return;

    inputDebounceTimers[key] = setTimeout(() => {
        applyCalculatedValue(key, val);
    }, 1000);
}

function forceApplyInputText(key, value) {
    if (inputDebounceTimers[key]) {
        clearTimeout(inputDebounceTimers[key]);
    }

    let val = parseFloat(value);
    const min = parseFloat(inputs[key].min);
    const max = parseFloat(inputs[key].max);

    if (isNaN(val) || val < min) val = min;
    if (val > max) val = max;

    applyCalculatedValue(key, val);
}

function applyCalculatedValue(key, val) {
    gas[key] = val;
    updateGasPhysics(key);
    drawGraphs();

    if (nums[key]) {
        nums[key].value = gas[key].toFixed(key === 'V' ? 1 : 0);
    }
}

for (let key in inputs) {
    inputs[key].addEventListener('input', (e) => syncInputSlider(key, e.target.value));
}

for (let key in nums) {
    nums[key].addEventListener('input', (e) => {
        syncInputText(key, e.target.value);
    });

    nums[key].addEventListener('blur', (e) => {
        forceApplyInputText(key, e.target.value);
    });

    nums[key].addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    });
}

const setupProcessButton = (btn, procName) => {
    btn.addEventListener('click', () => {
        [btnIsotherm, btnIsobar, btnIsochore].forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gas.process = procName;
        initGasState();
        updateControlInputs();
        renderTheoreticalLaTeX();
        drawGraphs();
    });
};
setupProcessButton(btnIsotherm, 'isotherm');
setupProcessButton(btnIsobar, 'isobar');
setupProcessButton(btnIsochore, 'isochore');

const setupAxesButton = (btn, axesName) => {
    btn.addEventListener('click', () => {
        [btnAxisPV, btnAxisVT, btnAxisPT].forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gas.graphAxes = axesName;
        drawGraphs();
    });
};
setupAxesButton(btnAxisPV, 'PV');
setupAxesButton(btnAxisVT, 'VT');
setupAxesButton(btnAxisPT, 'PT');

function resize() {
    if (!pistonWrapper || !graphCanvas.parentElement) return;

    const pRect = pistonWrapper.getBoundingClientRect();
    const gRect = graphCanvas.parentElement.getBoundingClientRect();

    if (pRect.height === 0 || gRect.height === 0) {
        setTimeout(resize, 50);
        return;
    }

    const dpr = window.devicePixelRatio || 1;

    pistonCanvas.width = pRect.width * dpr;
    pistonCanvas.height = pRect.height * dpr;
    pistonCanvas.style.width = pRect.width + 'px';
    pistonCanvas.style.height = pRect.height + 'px';
    pCtx.setTransform(1, 0, 0, 1, 0, 0);
    pCtx.scale(dpr, dpr);

    graphCanvas.width = gRect.width * dpr;
    graphCanvas.height = gRect.height * dpr;
    graphCanvas.style.width = gRect.width + 'px';
    graphCanvas.style.height = gRect.height + 'px';
    gCtx.setTransform(1, 0, 0, 1, 0, 0);
    gCtx.scale(dpr, dpr);

    drawGraphs();
}
window.addEventListener('resize', resize);


function initMolecules() {
    molecules = [];
    for (let i = 0; i < NUM_MOLECULES; i++) {
        molecules.push({
            x: 60 + Math.random() * 200,
            y: 40 + Math.random() * 100,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            radius: 3.5
        });
    }
}

function updateMolecules() {
    const w = pistonCanvas.width / (window.devicePixelRatio || 1);
    const h = pistonCanvas.height / (window.devicePixelRatio || 1);

    const volumeFactor = (gas.V - V_MIN) / (V_MAX - V_MIN);
    const pistonLeftBoundary = 40;
    const pistonRightBoundary = w - 80;
    const currentPistonX = pistonLeftBoundary + volumeFactor * (pistonRightBoundary - pistonLeftBoundary);

    const speedMultiplier = Math.sqrt(gas.T / 300);

    molecules.forEach(m => {
        m.x += m.vx * speedMultiplier;
        m.y += m.vy * speedMultiplier;

        if (m.x - m.radius < pistonLeftBoundary) {
            m.x = pistonLeftBoundary + m.radius;
            m.vx = -m.vx;
            collisionCount++;
        }
        if (m.x + m.radius > currentPistonX) {
            m.x = currentPistonX - m.radius;
            m.vx = -m.vx;
            collisionCount++;
        }
        if (m.y - m.radius < 20) {
            m.y = 20 + m.radius;
            m.vy = -m.vy;
            collisionCount++;
        }
        if (m.y + m.radius > h - 20) {
            m.y = h - 20 - m.radius;
            m.vy = -m.vy;
            collisionCount++;
        }
    });

    const now = performance.now();
    if (now - lastCollisionCheckTime > 1000) {
        collisionRate = collisionCount;
        collisionCount = 0;
        lastCollisionCheckTime = now;
        if (labels.collisions) labels.collisions.innerText = collisionRate;
    }
}

function draw() {
    const w = pistonCanvas.width / (window.devicePixelRatio || 1);
    const h = pistonCanvas.height / (window.devicePixelRatio || 1);

    pCtx.clearRect(0, 0, w, h);

    pCtx.strokeStyle = colors.grid;
    pCtx.lineWidth = 1;
    const gridStep = 40;
    for (let x = 0; x < w; x += gridStep) {
        pCtx.beginPath(); pCtx.moveTo(x, 0); pCtx.lineTo(x, h); pCtx.stroke();
    }
    for (let y = 0; y < h; y += gridStep) {
        pCtx.beginPath(); pCtx.moveTo(0, y); pCtx.lineTo(w, y); pCtx.stroke();
    }

    const pistonLeftBoundary = 40;
    const pistonRightBoundary = w - 80;
    const volumeFactor = (gas.V - V_MIN) / (V_MAX - V_MIN);
    const currentPistonX = pistonLeftBoundary + volumeFactor * (pistonRightBoundary - pistonLeftBoundary);

    pCtx.strokeStyle = colors.pistonWall;
    pCtx.lineWidth = 6;
    pCtx.lineJoin = 'round';

    pCtx.beginPath();
    pCtx.moveTo(pistonLeftBoundary - 10, 20);
    pCtx.lineTo(pistonRightBoundary + 40, 20);
    pCtx.moveTo(pistonLeftBoundary, 18);
    pCtx.lineTo(pistonLeftBoundary, h - 18);
    pCtx.moveTo(pistonLeftBoundary - 10, h - 20);
    pCtx.lineTo(pistonRightBoundary + 40, h - 20);
    pCtx.stroke();

    let tempColorRatio = (gas.T - T_MIN) / (T_MAX - T_MIN);
    let r = Math.round(100 + tempColorRatio * 155);
    let g = Math.round(100 - tempColorRatio * 50);
    let b = Math.round(255 - tempColorRatio * 200);

    pCtx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.05)`;
    pCtx.fillRect(pistonLeftBoundary, 23, currentPistonX - pistonLeftBoundary, h - 46);

    molecules.forEach(m => {
        pCtx.beginPath();
        pCtx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        pCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        pCtx.shadowBlur = 6;
        pCtx.shadowColor = pCtx.fillStyle;
        pCtx.fill();
        pCtx.shadowBlur = 0;
    });

    pCtx.strokeStyle = colors.pistonFace;
    pCtx.fillStyle = 'rgba(255,255,255,0.06)';
    pCtx.lineWidth = 4;

    pCtx.fillRect(currentPistonX, 23, 20, h - 46);
    pCtx.strokeRect(currentPistonX, 23, 20, h - 46);

    pCtx.beginPath();
    pCtx.moveTo(currentPistonX + 20, h / 2);
    pCtx.lineTo(w, h / 2);
    pCtx.lineWidth = 12;
    pCtx.strokeStyle = '#666';
    pCtx.stroke();

    pCtx.beginPath();
    pCtx.moveTo(currentPistonX + 20, h / 2);
    pCtx.lineTo(w, h / 2);
    pCtx.lineWidth = 4;
    pCtx.strokeStyle = colors.pistonFace;
    pCtx.stroke();
}

function drawGraphs() {
    const w = graphCanvas.width / (window.devicePixelRatio || 1);
    const h = graphCanvas.height / (window.devicePixelRatio || 1);

    if (w === 0 || h === 0) return;

    gCtx.clearRect(0, 0, w, h);

    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    gCtx.lineWidth = 1;
    const stepX = w / 10;
    const stepY = h / 6;
    for (let x = 0; x < w; x += stepX) {
        gCtx.beginPath(); gCtx.moveTo(x, 0); gCtx.lineTo(x, h); gCtx.stroke();
    }
    for (let y = 0; y < h; y += stepY) {
        gCtx.beginPath(); gCtx.moveTo(0, y); gCtx.lineTo(w, y); gCtx.stroke();
    }

    gCtx.strokeStyle = colors.axis;
    gCtx.lineWidth = 1.5;

    const chartLeft = 50;
    const chartBottom = h - 30;
    const chartRight = w - 20;
    const chartTop = 15;

    gCtx.beginPath();
    gCtx.moveTo(chartLeft, chartBottom);
    gCtx.lineTo(chartRight, chartBottom);
    gCtx.moveTo(chartLeft, chartTop);
    gCtx.lineTo(chartLeft, chartBottom);
    gCtx.stroke();

    gCtx.fillStyle = '#aaa';
    gCtx.font = 'bold 12px monospace';

    let xLabel = "";
    let yLabel = "";
    let getScreenCoords = () => ({ x: 0, y: 0 });

    if (gas.graphAxes === 'PV') {
        xLabel = "V, л";
        yLabel = "P, кПа";

        getScreenCoords = (P, V, T) => {
            const x = chartLeft + (V / V_MAX) * (chartRight - chartLeft);
            const y = chartBottom - (P / P_MAX) * (chartBottom - chartTop);
            return { x, y };
        };

        gCtx.beginPath();
        gCtx.lineWidth = 2.5;
        if (gas.process === 'isotherm') {
            gCtx.strokeStyle = colors.isotherm;
            for (let v_val = V_MIN; v_val <= V_MAX; v_val += 1) {
                let p_val = (gas.vR * gas.T) / v_val;
                let s = getScreenCoords(p_val, v_val, gas.T);
                if (v_val === V_MIN) gCtx.moveTo(s.x, s.y);
                else gCtx.lineTo(s.x, s.y);
            }
        } else if (gas.process === 'isobar') {
            gCtx.strokeStyle = colors.isobar;
            let s1 = getScreenCoords(gas.P, V_MIN, gas.T);
            let s2 = getScreenCoords(gas.P, V_MAX, gas.T);
            gCtx.moveTo(s1.x, s1.y);
            gCtx.lineTo(s2.x, s2.y);
        } else if (gas.process === 'isochore') {
            gCtx.strokeStyle = colors.isochore;
            let s1 = getScreenCoords(P_MIN, gas.V, gas.T);
            let s2 = getScreenCoords(P_MAX, gas.V, gas.T);
            gCtx.moveTo(s1.x, s1.y);
            gCtx.lineTo(s2.x, s2.y);
        }
        gCtx.stroke();

    } else if (gas.graphAxes === 'VT') {
        xLabel = "T, K";
        yLabel = "V, л";

        getScreenCoords = (P, V, T) => {
            const x = chartLeft + (T / T_MAX) * (chartRight - chartLeft);
            const y = chartBottom - (V / V_MAX) * (chartBottom - chartTop);
            return { x, y };
        };

        gCtx.beginPath();
        gCtx.lineWidth = 2.5;
        if (gas.process === 'isotherm') {
            gCtx.strokeStyle = colors.isotherm;
            let s1 = getScreenCoords(gas.P, V_MIN, gas.T);
            let s2 = getScreenCoords(gas.P, V_MAX, gas.T);
            gCtx.moveTo(s1.x, s1.y);
            gCtx.lineTo(s2.x, s2.y);
        } else if (gas.process === 'isobar') {
            gCtx.strokeStyle = colors.isobar;
            let s0 = getScreenCoords(gas.P, V_MIN, (gas.P * V_MIN) / gas.vR);
            let sMax = getScreenCoords(gas.P, V_MAX, (gas.P * V_MAX) / gas.vR);
            gCtx.moveTo(s0.x, s0.y);
            gCtx.lineTo(sMax.x, sMax.y);
        } else if (gas.process === 'isochore') {
            gCtx.strokeStyle = colors.isochore;
            let s1 = getScreenCoords(gas.P, gas.V, T_MIN);
            let s2 = getScreenCoords(gas.P, gas.V, T_MAX);
            gCtx.moveTo(s1.x, s1.y);
            gCtx.lineTo(s2.x, s2.y);
        }
        gCtx.stroke();

    } else if (gas.graphAxes === 'PT') {
        xLabel = "T, K";
        yLabel = "P, кПа";

        getScreenCoords = (P, V, T) => {
            const x = chartLeft + (T / T_MAX) * (chartRight - chartLeft);
            const y = chartBottom - (P / P_MAX) * (chartBottom - chartTop);
            return { x, y };
        };

        gCtx.beginPath();
        gCtx.lineWidth = 2.5;
        if (gas.process === 'isotherm') {
            gCtx.strokeStyle = colors.isotherm;
            let s1 = getScreenCoords(P_MIN, gas.V, gas.T);
            let s2 = getScreenCoords(P_MAX, gas.V, gas.T);
            gCtx.moveTo(s1.x, s1.y);
            gCtx.lineTo(s2.x, s2.y);
        } else if (gas.process === 'isobar') {
            gCtx.strokeStyle = colors.isobar;
            let s1 = getScreenCoords(gas.P, gas.V, T_MIN);
            let s2 = getScreenCoords(gas.P, gas.V, T_MAX);
            gCtx.moveTo(s1.x, s1.y);
            gCtx.lineTo(s2.x, s2.y);
        } else if (gas.process === 'isochore') {
            gCtx.strokeStyle = colors.isochore;
            let s0 = getScreenCoords(P_MIN, gas.V, (P_MIN * gas.V) / gas.vR);
            let sMax = getScreenCoords(P_MAX, gas.V, (P_MAX * gas.V) / gas.vR);
            gCtx.moveTo(s0.x, s0.y);
            gCtx.lineTo(sMax.x, sMax.y);
        }
        gCtx.stroke();
    }

    gCtx.fillText(xLabel, chartRight - 10, chartBottom + 20);
    gCtx.fillText(yLabel, chartLeft - 40, chartTop + 10);

    let activePos = getScreenCoords(gas.P, gas.V, gas.T);

    gCtx.beginPath();
    gCtx.setLineDash([4, 4]);
    gCtx.moveTo(activePos.x, chartBottom);
    gCtx.lineTo(activePos.x, activePos.y);
    gCtx.lineTo(chartLeft, activePos.y);
    gCtx.strokeStyle = colors.dashedLines;
    gCtx.lineWidth = 1;
    gCtx.stroke();
    gCtx.setLineDash([]);

    gCtx.beginPath();
    gCtx.arc(activePos.x, activePos.y, 7, 0, Math.PI * 2);
    gCtx.fillStyle = colors.activePoint;
    gCtx.shadowBlur = 15;
    gCtx.shadowColor = colors.activePoint;
    gCtx.fill();
    gCtx.shadowBlur = 0;

    gCtx.beginPath();
    gCtx.arc(activePos.x, activePos.y, 3, 0, Math.PI * 2);
    gCtx.fillStyle = '#ffffff';
    gCtx.fill();
}

function update() {
    updateMolecules();
    draw();
    requestAnimationFrame(update);
}

window.addEventListener('DOMContentLoaded', () => {
    labels = {
        T: document.getElementById('val-t-indicator'),
        collisions: document.getElementById('val-collisions-indicator'),
        lawTitle: document.getElementById('math-law-title'),
        lawFormula: document.getElementById('math-law-formula'),
        stateFormula: document.getElementById('math-state-formula')
    };

    initGasState();
    updateControlInputs();
    renderTheoreticalLaTeX();

    resize();
    setTimeout(resize, 100);
    initMolecules();

    update();
});
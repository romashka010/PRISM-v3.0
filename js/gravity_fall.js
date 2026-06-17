const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');
const wrapper = document.getElementById('canvas-wrapper');

const graphCanvas = document.getElementById('graph-canvas');
const graphCtx = graphCanvas.getContext('2d');

const colors = {
    purple: '#a855f7',
    cyan: '#00d2ff',
    green: '#2ed573',
    red: '#ff4757',
    orange: '#ff9f43',
    white: '#ffffff',
    grid: 'rgba(255, 255, 255, 0.04)'
};

const inputs = {
    h: document.getElementById('input-h'),
    v0: document.getElementById('input-v0'),
    g: document.getElementById('input-g'),
    m: document.getElementById('input-m'),
    k: document.getElementById('input-k')
};

const nums = {
    h: document.getElementById('num-h'),
    v0: document.getElementById('num-v0'),
    g: document.getElementById('num-g'),
    m: document.getElementById('num-m'),
    k: document.getElementById('num-k')
};

const stats = {
    time: document.getElementById('stat-time'),
    y: document.getElementById('stat-y'),
    v: document.getElementById('stat-v')
};

const bars = {
    ep: document.getElementById('bar-ep'),
    ek: document.getElementById('bar-ek'),
    q: document.getElementById('bar-q'),
    etotal: document.getElementById('bar-etotal')
};

const barVals = {
    ep: document.getElementById('val-ep'),
    ek: document.getElementById('val-ek'),
    q: document.getElementById('val-q'),
    etotal: document.getElementById('val-etotal')
};

const mathEpFormula = document.getElementById('math-ep-formula');
const mathEkFormula = document.getElementById('math-ek-formula');
const mathEfullFormula = document.getElementById('math-efull-formula');

const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');

let p = { h: 50, v0: 0, g: 9.8, m: 2, k: 0 };

let state = {
    isRunning: false,
    isPaused: false,
    isFinished: false,
    time: 0,
    y: 50,
    v: 0,
    heatLoss: 0,
    initialMechanicalEnergy: 0,
    history: []
};

let scale = 5;
let panX = 0;
let panY = 0;

function resize() {
    const dpr = window.devicePixelRatio || 1;

    const wWidth = wrapper.clientWidth;
    const wHeight = wrapper.clientHeight;

    canvas.width = wWidth * dpr;
    canvas.height = wHeight * dpr;
    canvas.style.width = wWidth + 'px';
    canvas.style.height = wHeight + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const gWidth = graphCanvas.parentElement.clientWidth;
    const gHeight = 140;

    graphCanvas.width = gWidth * dpr;
    graphCanvas.height = gHeight * dpr;
    graphCanvas.style.width = gWidth + 'px';
    graphCanvas.style.height = gHeight + 'px';

    graphCtx.setTransform(1, 0, 0, 1, 0, 0);
    graphCtx.scale(dpr, dpr);

    panX = wWidth / 2;
    panY = wHeight - 60;

    scale = (wHeight - 120) / p.h;

    draw();
    drawGraph();
}
window.addEventListener('resize', resize);

function syncInput(key, value, source) {
    let val = parseFloat(value);
    if (isNaN(val)) return;

    const min = parseFloat(inputs[key].min);
    const max = parseFloat(inputs[key].max);

    if (source === 'num') {
        if (val < min) val = min;
        if (val > max) val = max;
    }

    p[key] = val;

    if (source !== 'slider') {
        inputs[key].value = val;
    }
    if (source !== 'num') {
        nums[key].value = val.toFixed(key === 'g' || key === 'm' || key === 'k' ? 1 : 0);
    }

    if (!state.isRunning) {
        state.y = p.h;
        state.v = p.v0;
        state.time = 0;
        state.heatLoss = 0;
        state.history = [];
        state.isFinished = false;
        state.isPaused = false;

        // Локализация надписи на кнопке Старт/Сброс
        const activeLang = localStorage.getItem('prism_language') || 'ru';
        btnStart.innerText = activeLang === 'ru' ? "Старт" : "Start";
        btnPause.innerText = activeLang === 'ru' ? "Пауза" : "Pause";

        const initialEp = p.m * p.g * p.h;
        const initialEk = 0.5 * p.m * p.v0 * p.v0;
        state.initialMechanicalEnergy = initialEp + initialEk;
        scale = (canvas.height - 120) / p.h;
    }

    renderTheoreticalLaTeX();
    updateEnergyBars();
    if (!state.isRunning) {
        draw();
        drawGraph();
    }
}

for (let key in inputs) {
    inputs[key].addEventListener('input', (e) => syncInput(key, e.target.value, 'slider'));
    nums[key].addEventListener('input', (e) => {
        if (e.target.value === '') return;
        syncInput(key, e.target.value, 'num');
    });
    nums[key].addEventListener('blur', (e) => {
        let val = parseFloat(e.target.value);
        if (isNaN(val) || val < parseFloat(inputs[key].min)) val = parseFloat(inputs[key].min);
        if (val > parseFloat(inputs[key].max)) val = parseFloat(inputs[key].max);
        syncInput(key, val, 'num');
    });
}

function renderTheoreticalLaTeX() {
    if (typeof katex === 'undefined') return;

    const activeLang = localStorage.getItem('prism_language') || 'ru';
    const unitJ = activeLang === 'ru' ? '\\text{ Дж}' : '\\text{ J}';

    const ep = p.m * p.g * state.y;
    const ek = 0.5 * p.m * state.v * state.v;
    const eFull = ep + ek;

    const epStr = `E_p = mgh \\approx ${ep.toFixed(1)}${unitJ}`;
    const ekStr = `E_k = \\frac{mv^2}{2} \\approx ${ek.toFixed(1)}${unitJ}`;

    const eFullTerm = activeLang === 'ru' ? 'E_{\\text{полная}}' : 'E_{\\text{total}}';
    const efullStr = `${eFullTerm} = E_p + E_k + Q \\approx ${(eFull + state.heatLoss).toFixed(1)}${unitJ}`;

    try {
        katex.render(epStr, mathEpFormula, { throwOnError: false });
        katex.render(ekStr, mathEkFormula, { throwOnError: false });
        katex.render(efullStr, mathEfullFormula, { throwOnError: false });
    } catch (err) {
        console.error("Ошибка KaTeX:", err);
    }
}

function updateEnergyBars() {
    const Ep = p.m * p.g * state.y;
    const Ek = 0.5 * p.m * state.v * state.v;
    const Q = state.heatLoss;

    const maxVal = Math.max(state.initialMechanicalEnergy, 10);

    const epPercent = Math.max(0, Math.min(100, (Ep / maxVal) * 100));
    const ekPercent = Math.max(0, Math.min(100, (Ek / maxVal) * 100));
    const qPercent = Math.max(0, Math.min(100, (Q / maxVal) * 100));
    const etotalPercent = Math.max(0, Math.min(100, ((Ep + Ek) / maxVal) * 100));

    bars.ep.style.width = epPercent + '%';
    bars.ek.style.width = ekPercent + '%';
    bars.q.style.width = qPercent + '%';
    bars.etotal.style.width = etotalPercent + '%';

    const activeLang = localStorage.getItem('prism_language') || 'ru';
    const unitJ = activeLang === 'ru' ? ' Дж' : ' J';

    barVals.ep.innerText = Ep.toFixed(1) + unitJ;
    barVals.ek.innerText = Ek.toFixed(1) + unitJ;
    barVals.q.innerText = Q.toFixed(1) + unitJ;
    barVals.etotal.innerText = (Ep + Ek).toFixed(1) + unitJ;

    stats.time.innerText = state.time.toFixed(2);
    stats.y.innerText = state.y.toFixed(2);
    stats.v.innerText = state.v.toFixed(2);
}

function integrate(dt) {
    let forceDrag = -p.k * state.v;
    let acceleration = -p.g + (forceDrag / p.m);

    let workLoss = Math.abs(forceDrag * state.v * dt);
    state.heatLoss += workLoss;

    state.v += acceleration * dt;
    state.y += state.v * dt;
    state.time += dt;

    if (state.y <= 0) {
        state.y = 0;
        state.v = 0;
        state.isRunning = false;
        state.isFinished = true;

        const activeLang = localStorage.getItem('prism_language') || 'ru';
        btnStart.innerText = activeLang === 'ru' ? "Сброс" : "Reset";
        state.heatLoss = state.initialMechanicalEnergy;
    }
}

btnStart.addEventListener('click', () => {
    const activeLang = localStorage.getItem('prism_language') || 'ru';
    if (state.isRunning || state.isPaused || state.isFinished) {
        state.isRunning = false;
        state.isPaused = false;
        state.isFinished = false;
        btnPause.innerText = activeLang === 'ru' ? "Пауза" : "Pause";
        btnStart.innerText = activeLang === 'ru' ? "Старт" : "Start";
        state.time = 0;
        state.y = p.h;
        state.v = p.v0;
        state.heatLoss = 0;
        state.history = [];
        const initialEp = p.m * p.g * p.h;
        const initialEk = 0.5 * p.m * p.v0 * p.v0;
        state.initialMechanicalEnergy = initialEp + initialEk;
        updateEnergyBars();
        renderTheoreticalLaTeX();
        draw();
        drawGraph();
    } else {
        state.isRunning = true;
        state.isPaused = false;
        state.isFinished = false;
        btnStart.innerText = activeLang === 'ru' ? "Сброс" : "Reset";
        lastTime = performance.now();
        requestAnimationFrame(loop);
    }
});

btnPause.addEventListener('click', () => {
    if (!state.isRunning && !state.isPaused) return;
    const activeLang = localStorage.getItem('prism_language') || 'ru';

    if (state.isPaused) {
        state.isPaused = false;
        state.isRunning = true;
        btnPause.innerText = activeLang === 'ru' ? "Пауза" : "Pause";
        lastTime = performance.now();
        requestAnimationFrame(loop);
    } else {
        state.isPaused = true;
        state.isRunning = false;
        btnPause.innerText = activeLang === 'ru' ? "Продолжить" : "Resume";
    }
});

let lastTime = 0;
function loop(timestamp) {
    if (!state.isRunning) return;

    const dt = 0.016;
    integrate(dt);

    const Ep = p.m * p.g * state.y;
    const Ek = 0.5 * p.m * state.v * state.v;
    const Q = state.heatLoss;
    state.history.push({
        t: state.time,
        Ep: Ep,
        Ek: Ek,
        Q: Q,
        Etotal: Ep + Ek
    });

    updateEnergyBars();
    renderTheoreticalLaTeX();
    draw();
    drawGraph();

    if (state.isRunning) {
        requestAnimationFrame(loop);
    }
}

function draw() {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    const step = 20;
    for (let x = 0; x < w; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(panX - 100, panY);
    ctx.lineTo(panX + 100, panY);
    ctx.strokeStyle = colors.cyan;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(panX - 70, panY);
    ctx.lineTo(panX - 70, panY - p.h * scale);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';

    const activeLang = localStorage.getItem('prism_language') || 'ru';
    const unitM = activeLang === 'ru' ? 'м' : 'm';

    for (let hIndex = 0; hIndex <= p.h; hIndex += 10) {
        const yCoord = panY - hIndex * scale;
        ctx.beginPath();
        ctx.moveTo(panX - 73, yCoord);
        ctx.lineTo(panX - 67, yCoord);
        ctx.stroke();
        ctx.fillText(hIndex + unitM, panX - 78, yCoord + 3);
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(panX - 35, panY);
    ctx.lineTo(panX - 35, panY - p.h * scale);
    ctx.stroke();

    const ballY = panY - state.y * scale;
    ctx.beginPath();
    ctx.arc(panX, ballY, 12, 0, Math.PI * 2);
    ctx.fillStyle = colors.white;
    ctx.fill();

    ctx.shadowBlur = 15;
    ctx.shadowColor = colors.purple;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (Math.abs(state.v) > 0.1) {
        const arrowLength = state.v * 3;
        drawArrow(panX, ballY, panX, ballY - arrowLength, colors.red);
    }
}

function drawGraph() {
    const w = graphCanvas.width / (window.devicePixelRatio || 1);
    const h = graphCanvas.height / (window.devicePixelRatio || 1);

    graphCtx.clearRect(0, 0, w, h);

    graphCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    graphCtx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) {
        graphCtx.beginPath(); graphCtx.moveTo(i, 0); graphCtx.lineTo(i, h); graphCtx.stroke();
    }
    for (let j = 0; j < h; j += 30) {
        graphCtx.beginPath(); graphCtx.moveTo(0, j); graphCtx.lineTo(w, j); graphCtx.stroke();
    }

    if (state.history.length === 0) return;

    const maxEnergy = Math.max(state.initialMechanicalEnergy, 10);
    const maxT = Math.max(state.time, 1);

    const drawCurve = (prop, color) => {
        graphCtx.beginPath();
        graphCtx.lineCap = 'round';
        graphCtx.lineJoin = 'round';

        state.history.forEach((pt, index) => {
            const x = (pt.t / maxT) * (w - 20) + 10;
            const y = h - (pt[prop] / maxEnergy) * (h - 20) - 10;
            if (index === 0) graphCtx.moveTo(x, y);
            else graphCtx.lineTo(x, y);
        });
        graphCtx.strokeStyle = color;
        graphCtx.lineWidth = 1.5;
        graphCtx.stroke();
    };

    drawCurve('Ep', colors.orange);
    drawCurve('Ek', colors.green);
    drawCurve('Etotal', colors.cyan);
    if (p.k > 0) {
        drawCurve('Q', colors.red);
    }
}

function drawArrow(fromx, fromy, tox, toy, color) {
    const headlen = 8;
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
}

// Слушатель смены языка на лету
window.onLanguageChanged = function(lang) {
    const activeLang = lang || 'ru';

    // Обновляем статический текст кнопок
    if (state.isRunning) {
        btnStart.innerText = activeLang === 'ru' ? "Сброс" : "Reset";
    } else {
        btnStart.innerText = activeLang === 'ru' ? "Старт" : "Start";
    }

    if (state.isPaused) {
        btnPause.innerText = activeLang === 'ru' ? "Продолжить" : "Resume";
    } else {
        btnPause.innerText = activeLang === 'ru' ? "Пауза" : "Pause";
    }

    renderTheoreticalLaTeX();
    updateEnergyBars();
    draw();
    drawGraph();
};

window.addEventListener('DOMContentLoaded', () => {
    for (let key in p) {
        syncInput(key, p[key], 'init');
    }
    resize();
});

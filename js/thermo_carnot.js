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
    isothermHot: '#ff4757',
    isothermCold: '#00d2ff',
    adiabate: '#a855f7',
    activePoint: '#2ed573',
    dashedLines: 'rgba(255, 255, 255, 0.2)',
    workArea: 'rgba(46, 213, 115, 0.15)'
};

const inputs = {
    TH: document.getElementById('input-TH'),
    TC: document.getElementById('input-TC'),
    Vmin: document.getElementById('input-Vmin'),
    V2: document.getElementById('input-V2')
};

const nums = {
    TH: document.getElementById('num-TH'),
    TC: document.getElementById('num-TC'),
    Vmin: document.getElementById('num-Vmin'),
    V2: document.getElementById('num-V2')
};

const currentStats = {
    P: document.getElementById('val-p-indicator'),
    V: document.getElementById('val-v-indicator'),
    T: document.getElementById('val-t-indicator')
};

const resultStats = {
    Pmax: document.getElementById('val-pmax'),
    Pmin: document.getElementById('val-pmin'),
    Eta: document.getElementById('val-eta')
};

const R = 8.314; //универсальная газовая постоянная, дж/(моль*к)
const nu = 1.0;  //количество вещества, моль
const gamma = 1.67; //показатель адиабаты (для одноатомного газа)

let engine = {
    TH: 800,
    TC: 300,
    Vmin: 5,
    V2: 10,
    currentStage: '1',
    points: [],

    currP: 0,
    currV: 0,
    currT: 0,

    animTime: 0,
};

const NUM_MOLECULES = 100;
let molecules = [];
let labels = {};

let inputDebounceTimers = {};

function calculateCyclePoints() {
    const toKPa = (pPa) => pPa / 1000;
    const toM3 = (vL) => vL / 1000;

    const V1 = engine.Vmin;
    const V2 = Math.max(V1 + 0.5, engine.V2);
    engine.V2 = V2;

    const TH = engine.TH;
    const TC = engine.TC;

    const P1 = (nu * R * TH) / toM3(V1);

    const P2 = (nu * R * TH) / toM3(V2);

    const V3_M3 = toM3(V2) * Math.pow(TH / TC, 1 / (gamma - 1));
    const V3 = V3_M3 * 1000;
    const P3 = (nu * R * TC) / V3_M3;

    const V4_M3 = toM3(V1) * Math.pow(TH / TC, 1 / (gamma - 1));
    const V4 = V4_M3 * 1000;
    const P4 = (nu * R * TC) / V4_M3;

    engine.points = [
        {P: toKPa(P1), V: V1, T: TH, name: '1'},
        {P: toKPa(P2), V: V2, T: TH, name: '2'},
        {P: toKPa(P3), V: V3, T: TC, name: '3'},
        {P: toKPa(P4), V: V4, T: TC, name: '4'}
    ];

    updateResultUI();
}

function updateResultUI() {
    const P1 = engine.points[0].P;
    const P3 = engine.points[2].P;
    const eta = (1 - engine.TC / engine.TH) * 100;

    resultStats.Pmax.innerText = P1.toFixed(0) + ' кПа';
    resultStats.Pmin.innerText = P3.toFixed(0) + ' кПа';
    resultStats.Eta.innerText = eta.toFixed(1) + ' %';
}

function updateCurrentStateUI() {
    currentStats.P.innerText = Math.round(engine.currP) + ' кПа';
    currentStats.V.innerText = engine.currV.toFixed(1) + ' л';
    currentStats.T.innerText = Math.round(engine.currT) + ' K';
}

function renderTheoreticalLaTeX() {
    if (!labels.etaFormula || typeof katex === 'undefined') return;

    const etaFormula = `\\eta = 1 - \\frac{T_C}{T_H} = \\frac{${engine.TH} - ${engine.TC}}{${engine.TH}} \\approx ${(1 - engine.TC/engine.TH).toFixed(3)}`;

    const workFormula = `A_{цикла} = Q_H - Q_C = \\oint P dV`;

    try {
        katex.render(etaFormula, labels.etaFormula, { throwOnError: false, displayMode: false });
        katex.render(workFormula, labels.workFormula, { throwOnError: false, displayMode: false });
    } catch (e) {
        console.error("Katex error:", e);
    }
}

function syncInputSlider(key, value) {
    let val = parseFloat(value);
    if (isNaN(val)) return;

    if (key === 'Vmin' && val >= engine.V2) {
        val = engine.V2 - 0.5;
        inputs.Vmin.value = val;
    }
    if (key === 'V2' && val <= engine.Vmin) {
        val = engine.Vmin + 0.5;
        inputs.V2.value = val;
    }

    engine[key] = val;
    nums[key].value = (key === 'Vmin' || key === 'V2') ? val.toFixed(1) : Math.round(val);

    calculateCyclePoints();
    renderTheoreticalLaTeX();
    drawGraphs();
}

function syncInputText(key, value) {
    if (inputDebounceTimers[key]) clearTimeout(inputDebounceTimers[key]);

    if (value === '') return;
    let val = parseFloat(value);
    if (isNaN(val)) return;

    const min = parseFloat(inputs[key].min);
    const max = parseFloat(inputs[key].max);

    inputDebounceTimers[key] = setTimeout(() => {
        if (val < min) val = min;
        if (val > max) val = max;

        if (key === 'Vmin' && val >= engine.V2) {
            engine.V2 = val + 0.5;
            nums.V2.value = engine.V2.toFixed(1);
            inputs.V2.value = engine.V2;
        }
        if (key === 'V2' && val <= engine.Vmin) {
            engine.Vmin = val - 0.5;
            if (engine.Vmin < min) engine.Vmin = min;
            nums.Vmin.value = engine.Vmin.toFixed(1);
            inputs.Vmin.value = engine.Vmin;
        }

        engine[key] = val;
        inputs[key].value = val;
        nums[key].value = (key === 'Vmin' || key === 'V2') ? val.toFixed(1) : Math.round(val);

        calculateCyclePoints();
        renderTheoreticalLaTeX();
        drawGraphs();
    }, 1000);
}

for (let key in inputs) {
    inputs[key].addEventListener('input', (e) => syncInputSlider(key, e.target.value));
    nums[key].addEventListener('input', (e) => syncInputText(key, e.target.value));
}

document.querySelectorAll('.proc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.proc-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        engine.currentStage = btn.dataset.stage;
        engine.animTime = 0;
        drawGraphs();
    });
});

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

function getAdiabateState(V, V_start, P_start, T_start) {
    const P = P_start * Math.pow(V_start / V, gamma);
    const T = T_start * Math.pow(V_start / V, gamma - 1);
    return { P, T };
}

function updateMoleculesAndPiston() {
    const w = pistonCanvas.width / (window.devicePixelRatio || 1);
    const h = pistonCanvas.height / (window.devicePixelRatio || 1);

    const points = engine.points;
    if (!points || points.length === 0) return;

    if (engine.currentStage === 'full') {
        const speedFactor = 0.015;
        engine.animTime += speedFactor;

        const stageProgress = engine.animTime % 4;
        const stage = Math.floor(stageProgress);
        const tLinear = stageProgress - stage;

        const t = (1 - Math.cos(tLinear * Math.PI)) / 2;

        if (stage === 0) { //1-2
            engine.currV = points[0].V + t * (points[1].V - points[0].V);
            engine.currT = engine.TH;
            engine.currP = points[0].P * (points[0].V / engine.currV);
        } else if (stage === 1) { //2-3
            engine.currV = points[1].V + t * (points[2].V - points[1].V);
            const state = getAdiabateState(engine.currV, points[1].V, points[1].P, engine.TH);
            engine.currT = state.T;
            engine.currP = state.P;
        } else if (stage === 2) { //3-4
            engine.currV = points[2].V + t * (points[3].V - points[2].V);
            engine.currT = engine.TC;
            engine.currP = points[2].P * (points[2].V / engine.currV);
        } else { //4-1
            engine.currV = points[3].V + t * (points[0].V - points[3].V);
            const state = getAdiabateState(engine.currV, points[3].V, points[3].P, engine.TC);
            engine.currT = state.T;
            engine.currP = state.P;
        }
    } else {
        const speedFactor = 0.025;
        engine.animTime += speedFactor;
        const t = (1 - Math.cos(engine.animTime)) / 2;

        const stageIdx = parseInt(engine.currentStage) - 1;
        if (stageIdx === 0) {
            engine.currV = points[0].V + t * (points[1].V - points[0].V);
            engine.currT = engine.TH;
            engine.currP = points[0].P * (points[0].V / engine.currV);
        } else if (stageIdx === 1) {
            engine.currV = points[1].V + t * (points[2].V - points[1].V);
            const state = getAdiabateState(engine.currV, points[1].V, points[1].P, engine.TH);
            engine.currT = state.T;
            engine.currP = state.P;
        } else if (stageIdx === 2) {
            engine.currV = points[2].V + t * (points[3].V - points[2].V);
            engine.currT = engine.TC;
            engine.currP = points[2].P * (points[2].V / engine.currV);
        } else if (stageIdx === 3) {
            engine.currV = points[3].V + t * (points[0].V - points[3].V);
            const state = getAdiabateState(engine.currV, points[3].V, points[3].P, engine.TC);
            engine.currT = state.T;
            engine.currP = state.P;
        }
    }

    updateCurrentStateUI();

    const V_MAX_ABS = points[2].V;
    const pistonLeftBoundary = 40;
    const pistonRightBoundary = w - 80;
    const volumeFactor = (engine.currV - engine.Vmin) / (V_MAX_ABS - engine.Vmin);
    const currentPistonX = pistonLeftBoundary + volumeFactor * (pistonRightBoundary - pistonLeftBoundary);

    const speedMultiplier = Math.sqrt(engine.currT / 300);

    molecules.forEach(m => {
        m.x += m.vx * speedMultiplier;
        m.y += m.vy * speedMultiplier;

        if (m.x - m.radius < pistonLeftBoundary) {
            m.x = pistonLeftBoundary + m.radius; m.vx = -m.vx;
        }
        if (m.x + m.radius > currentPistonX) {
            m.x = currentPistonX - m.radius; m.vx = -m.vx;
        }
        if (m.y - m.radius < 20) {
            m.y = 20 + m.radius; m.vy = -m.vy;
        }
        if (m.y + m.radius > h - 20) {
            m.y = h - 20 - m.radius; m.vy = -m.vy;
        }
    });

    return currentPistonX;
}

function drawPiston(pistonX) {
    const w = pistonCanvas.width / (window.devicePixelRatio || 1);
    const h = pistonCanvas.height / (window.devicePixelRatio || 1);

    pCtx.clearRect(0, 0, w, h);

    pCtx.strokeStyle = colors.grid;
    pCtx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
        pCtx.beginPath(); pCtx.moveTo(x, 0); pCtx.lineTo(x, h); pCtx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
        pCtx.beginPath(); pCtx.moveTo(0, y); pCtx.lineTo(w, y); pCtx.stroke();
    }

    const pistonLeftBoundary = 40;
    const pistonRightBoundary = w - 80;

    pCtx.strokeStyle = colors.pistonWall;
    pCtx.lineWidth = 6;
    pCtx.lineJoin = 'round';
    pCtx.beginPath();
    pCtx.moveTo(pistonLeftBoundary - 10, 20); pCtx.lineTo(pistonRightBoundary + 40, 20);
    pCtx.moveTo(pistonLeftBoundary, 18); pCtx.lineTo(pistonLeftBoundary, h - 18);
    pCtx.moveTo(pistonLeftBoundary - 10, h - 20); pCtx.lineTo(pistonRightBoundary + 40, h - 20);
    pCtx.stroke();

    const T_MAX = engine.TH;
    const T_MIN = 100;
    let tempColorRatio = (engine.currT - T_MIN) / (T_MAX - T_MIN);
    if (tempColorRatio < 0) tempColorRatio = 0;
    if (tempColorRatio > 1) tempColorRatio = 1;
    let r = Math.round(50 + tempColorRatio * 205);
    let g = Math.round(50 + tempColorRatio * 100);
    let b = Math.round(255 - tempColorRatio * 200);

    pCtx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.05)`;
    pCtx.fillRect(pistonLeftBoundary, 23, pistonX - pistonLeftBoundary, h - 46);

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
    pCtx.fillRect(pistonX, 23, 20, h - 46);
    pCtx.strokeRect(pistonX, 23, 20, h - 46);

    pCtx.beginPath(); pCtx.moveTo(pistonX + 20, h / 2); pCtx.lineTo(w, h / 2);
    pCtx.lineWidth = 12; pCtx.strokeStyle = '#666'; pCtx.stroke();
    pCtx.lineWidth = 4; pCtx.strokeStyle = colors.pistonFace; pCtx.stroke();
}

function drawGraphs() {
    const w = graphCanvas.width / (window.devicePixelRatio || 1);
    const h = graphCanvas.height / (window.devicePixelRatio || 1);
    if (w === 0 || h === 0 || !engine.points.length) return;

    gCtx.clearRect(0, 0, w, h);

    drawWorkArea(w, h);

    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    gCtx.lineWidth = 1;
    const stepX = w / 10; const stepY = h / 6;
    for (let x = 0; x < w; x += stepX) { gCtx.beginPath(); gCtx.moveTo(x, 0); gCtx.lineTo(x, h); gCtx.stroke(); }
    for (let y = 0; y < h; y += stepY) { gCtx.beginPath(); gCtx.moveTo(0, y); gCtx.lineTo(w, y); gCtx.stroke(); }

    gCtx.strokeStyle = colors.axis;
    gCtx.lineWidth = 1.5;
    const chartLeft = 55; const chartBottom = h - 35; const chartRight = w - 20; const chartTop = 15;
    gCtx.beginPath(); gCtx.moveTo(chartLeft, chartBottom); gCtx.lineTo(chartRight, chartBottom);
    gCtx.moveTo(chartLeft, chartTop); gCtx.lineTo(chartLeft, chartBottom); gCtx.stroke();

    gCtx.fillStyle = '#aaa'; gCtx.font = 'bold 12px monospace';
    gCtx.fillText("V, л", chartRight - 10, chartBottom + 25);
    gCtx.fillText("P, кПа", chartLeft - 50, chartTop + 10);

    const P_MAX_PLOT = Math.max(engine.points[0].P * 1.1, 500);
    const V_MAX_PLOT = Math.max(engine.points[2].V * 1.1, 30);

    const getScreenCoords = (P, V) => {
        const x = chartLeft + (V / V_MAX_PLOT) * (chartRight - chartLeft);
        const y = chartBottom - (P / P_MAX_PLOT) * (chartBottom - chartTop);
        return { x, y };
    };

    drawFullCycle(getScreenCoords);

    if (engine.currP > 0) {
        let activePos = getScreenCoords(engine.currP, engine.currV);
        gCtx.beginPath(); gCtx.setLineDash([4, 4]);
        gCtx.moveTo(activePos.x, chartBottom); gCtx.lineTo(activePos.x, activePos.y);
        gCtx.lineTo(chartLeft, activePos.y);
        gCtx.strokeStyle = colors.dashedLines; gCtx.lineWidth = 1; gCtx.stroke();
        gCtx.setLineDash([]);

        gCtx.beginPath(); gCtx.arc(activePos.x, activePos.y, 7, 0, Math.PI * 2);
        gCtx.fillStyle = colors.activePoint; gCtx.shadowBlur = 15; gCtx.shadowColor = colors.activePoint;
        gCtx.fill(); gCtx.shadowBlur = 0;
        gCtx.beginPath(); gCtx.arc(activePos.x, activePos.y, 3, 0, Math.PI * 2);
        gCtx.fillStyle = '#ffffff'; gCtx.fill();
    }
}

function drawFullCycle(getScreenCoords) {
    const pts = engine.points;
    gCtx.lineWidth = 3;

    gCtx.beginPath(); gCtx.strokeStyle = colors.isothermHot;
    if (engine.currentStage !== '1' && engine.currentStage !== 'full') gCtx.lineWidth = 1.5; else gCtx.lineWidth = 4;
    for (let v = pts[0].V; v <= pts[1].V; v += 0.2) {
        let p = pts[0].P * (pts[0].V / v);
        let s = getScreenCoords(p, v);
        if (v === pts[0].V) gCtx.moveTo(s.x, s.y); else gCtx.lineTo(s.x, s.y);
    } gCtx.stroke();

    gCtx.beginPath(); gCtx.strokeStyle = colors.adiabate;
    if (engine.currentStage !== '2' && engine.currentStage !== 'full') gCtx.lineWidth = 1.5; else gCtx.lineWidth = 4;
    for (let v = pts[1].V; v <= pts[2].V; v += 0.2) {
        let state = getAdiabateState(v, pts[1].V, pts[1].P, engine.TH);
        let s = getScreenCoords(state.P, v);
        if (v === pts[1].V) gCtx.moveTo(s.x, s.y); else gCtx.lineTo(s.x, s.y);
    } gCtx.stroke();

    gCtx.beginPath(); gCtx.strokeStyle = colors.isothermCold;
    if (engine.currentStage !== '3' && engine.currentStage !== 'full') gCtx.lineWidth = 1.5; else gCtx.lineWidth = 4;
    for (let v = pts[3].V; v <= pts[2].V; v += 0.2) {
        let p = pts[2].P * (pts[2].V / v);
        let s = getScreenCoords(p, v);
        if (v === pts[3].V) gCtx.moveTo(s.x, s.y); else gCtx.lineTo(s.x, s.y);
    } gCtx.stroke();

    gCtx.beginPath(); gCtx.strokeStyle = colors.adiabate;
    if (engine.currentStage !== '4' && engine.currentStage !== 'full') gCtx.lineWidth = 1.5; else gCtx.lineWidth = 4;
    for (let v = pts[0].V; v <= pts[3].V; v += 0.2) {
        let state = getAdiabateState(v, pts[3].V, pts[3].P, engine.TC);
        let s = getScreenCoords(state.P, v);
        if (v === pts[0].V) gCtx.moveTo(s.x, s.y); else gCtx.lineTo(s.x, s.y);
    } gCtx.stroke();

    gCtx.fillStyle = '#fff'; gCtx.font = 'bold 12px Segoe UI';
    pts.forEach(p => {
        let s = getScreenCoords(p.P, p.V);
        gCtx.beginPath(); gCtx.arc(s.x, s.y, 4, 0, Math.PI * 2); gCtx.fill();
        gCtx.fillText(p.name, s.x + 8, s.y - 8);
    });
}

function drawWorkArea(w, h) {
    const pts = engine.points;
    const chartLeft = 55; const chartBottom = h - 35; const chartRight = w - 20; const chartTop = 15;
    const P_MAX_PLOT = Math.max(engine.points[0].P * 1.1, 500);
    const V_MAX_PLOT = Math.max(engine.points[2].V * 1.1, 30);
    const getScreenCoords = (P, V) => {
        const x = chartLeft + (V / V_MAX_PLOT) * (chartRight - chartLeft);
        const y = chartBottom - (P / P_MAX_PLOT) * (chartBottom - chartTop);
        return { x, y };
    };

    gCtx.beginPath();
    gCtx.fillStyle = colors.workArea;

    let s0 = getScreenCoords(pts[0].P, pts[0].V);
    gCtx.moveTo(s0.x, s0.y);
    for (let v = pts[0].V; v <= pts[1].V; v += 0.5) {
        let p = pts[0].P * (pts[0].V / v);
        let s = getScreenCoords(p, v); gCtx.lineTo(s.x, s.y);
    }
    for (let v = pts[1].V; v <= pts[2].V; v += 0.5) {
        let state = getAdiabateState(v, pts[1].V, pts[1].P, engine.TH);
        let s = getScreenCoords(state.P, v); gCtx.lineTo(s.x, s.y);
    }
    for (let v = pts[2].V; v >= pts[3].V; v -= 0.5) {
        let p = pts[2].P * (pts[2].V / v);
        let s = getScreenCoords(p, v); gCtx.lineTo(s.x, s.y);
    }
    for (let v = pts[3].V; v >= pts[0].V; v -= 0.5) {
        let state = getAdiabateState(v, pts[3].V, pts[3].P, engine.TC);
        let s = getScreenCoords(state.P, v); gCtx.lineTo(s.x, s.y);
    }
    gCtx.closePath();
    gCtx.fill();
}

function update() {
    const pistonX = updateMoleculesAndPiston();
    drawPiston(pistonX);
    drawGraphs();
    requestAnimationFrame(update);
}

window.addEventListener('DOMContentLoaded', () => {
    labels = {
        etaFormula: document.getElementById('math-eta-formula'),
        workFormula: document.getElementById('math-work-formula')
    };

    calculateCyclePoints();
    renderTheoreticalLaTeX();
    resize();
    setTimeout(resize, 100);
    initMolecules();
    update();
});
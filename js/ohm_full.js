const circuitCanvas = document.getElementById('circuit-canvas');
const cCtx = circuitCanvas.getContext('2d');
const circuitWrapper = document.getElementById('circuit-wrapper');

const graphCanvas = document.getElementById('graph-canvas');
const gCtx = graphCanvas.getContext('2d');

const colors = {
    grid: 'rgba(255, 255, 255, 0.02)',
    axis: 'rgba(255, 255, 255, 0.15)',
    wire: '#b2bec3',
    resistor: '#ff9f43',
    battery: '#ff4757',
    batteryGlow: 'rgba(255, 71, 87, 0.15)',
    ammeter: '#2ed573',
    voltmeter: '#00d2ff',
    switch: '#eccc68',
    electron: '#8ab4f8',
    activePoint: '#00d2ff',
    dashedLines: 'rgba(0, 210, 255, 0.4)',
    bg: '#050509'
};

const inputs = {
    E: document.getElementById('input-E'),
    r: document.getElementById('input-r'),
    R: document.getElementById('input-R')
};

const nums = {
    E: document.getElementById('num-E'),
    r: document.getElementById('num-r'),
    R: document.getElementById('num-R')
};

const stats = {
    I: document.getElementById('stat-I'),
    U: document.getElementById('stat-U'),
    Puse: document.getElementById('stat-P-use'),
    Ploss: document.getElementById('stat-P-loss'),
    eta: document.getElementById('stat-eta')
};

const mathLabels = {
    ohm: document.getElementById('math-ohm-law'),
    eta: document.getElementById('math-eta-law')
};

let sim = {
    E: 12.0,
    r: 1.5,
    R: 10.0,
    closed: true
};

let calculated = {
    I: 0,
    U: 0,
    Puse: 0,
    Ploss: 0,
    eta: 0
};

let electronOffset = 0;

function resize() {
    if (!circuitWrapper || !graphCanvas.parentElement) return;

    const cRect = circuitWrapper.getBoundingClientRect();
    const gRect = graphCanvas.parentElement.getBoundingClientRect();

    if (cRect.height === 0 || gRect.height === 0) {
        setTimeout(resize, 50);
        return;
    }

    const dpr = window.devicePixelRatio || 1;

    circuitCanvas.width = cRect.width * dpr;
    circuitCanvas.height = cRect.height * dpr;
    circuitCanvas.style.width = cRect.width + 'px';
    circuitCanvas.style.height = cRect.height + 'px';
    cCtx.setTransform(1, 0, 0, 1, 0, 0);
    cCtx.scale(dpr, dpr);

    graphCanvas.width = gRect.width * dpr;
    graphCanvas.height = gRect.height * dpr;
    graphCanvas.style.width = gRect.width + 'px';
    graphCanvas.style.height = gRect.height + 'px';
    gCtx.setTransform(1, 0, 0, 1, 0, 0);
    gCtx.scale(dpr, dpr);

    drawGraphs();
}
window.addEventListener('resize', resize);

function solvePhysics() {
    if (sim.closed) {
        calculated.I = sim.E / (sim.R + sim.r);
        calculated.U = calculated.I * sim.R;
        calculated.Puse = calculated.I * calculated.I * sim.R;
        calculated.Ploss = calculated.I * calculated.I * sim.r;
        calculated.eta = (sim.R / (sim.R + sim.r)) * 100;
    } else {
        calculated.I = 0;
        calculated.U = sim.E;
        calculated.Puse = 0;
        calculated.Ploss = 0;
        calculated.eta = 0;
    }

    updateUI();
    drawGraphs();
}

function updateUI() {
    if (stats.I) stats.I.innerText = calculated.I.toFixed(2) + " А";
    if (stats.U) stats.U.innerText = calculated.U.toFixed(2) + " В";
    if (stats.Puse) stats.Puse.innerText = calculated.Puse.toFixed(1) + " Вт";
    if (stats.Ploss) stats.Ploss.innerText = calculated.Ploss.toFixed(1) + " Вт";
    if (stats.eta) stats.eta.innerText = calculated.eta.toFixed(1) + " %";

    if (typeof katex !== 'undefined') {
        const formulaOhm = `I = \\frac{\\varepsilon}{R + r} = \\frac{${sim.E.toFixed(1)}}{${sim.R.toFixed(1)} + ${sim.r.toFixed(1)}} \\approx ${calculated.I.toFixed(2)}\\text{ А}`;
        const formulaEta = `\\eta = \\frac{R}{R + r} = \\frac{${sim.R.toFixed(1)}}{${sim.R.toFixed(1)} + ${sim.r.toFixed(1)}} \\approx ${calculated.eta.toFixed(1)}\\%`;

        try {
            if (mathLabels.ohm) katex.render(formulaOhm, mathLabels.ohm, { throwOnError: false });
            if (mathLabels.eta) katex.render(formulaEta, mathLabels.eta, { throwOnError: false });

            const inlineR = document.getElementById('math-r-inline');
            const inlineE = document.getElementById('math-e-inline');
            const inlineRint = document.getElementById('math-rint-inline');
            const statI = document.getElementById('math-i-stat');
            const statU = document.getElementById('math-u-stat');
            const statPuse = document.getElementById('math-puse-stat');
            const statPloss = document.getElementById('math-ploss-stat');
            const statEta = document.getElementById('math-eta-stat');

            if (inlineR) katex.render("R", inlineR, { throwOnError: false });
            if (inlineE) katex.render("\\varepsilon", inlineE, { throwOnError: false });
            if (inlineRint) katex.render("r", inlineRint, { throwOnError: false });
            if (statI) katex.render("I", statI, { throwOnError: false });
            if (statU) katex.render("U", statU, { throwOnError: false });
            if (statPuse) katex.render("P_{\\text{пол}}", statPuse, { throwOnError: false });
            if (statPloss) katex.render("P_{\\text{пот}}", statPloss, { throwOnError: false });
            if (statEta) katex.render("\\eta", statEta, { throwOnError: false });
        } catch (e) {
            console.error(e);
        }
    }
}

function syncInput(key, value, source) {
    let val = parseFloat(value);
    if (isNaN(val)) return;

    const min = parseFloat(inputs[key].min);
    const max = parseFloat(inputs[key].max);

    if (source === 'num') {
        if (val < min) val = min;
        if (val > max) val = max;
    }

    sim[key] = val;

    if (source !== 'slider') inputs[key].value = val;
    if (source !== 'num') nums[key].value = val.toFixed(key === 'r' ? 1 : 0);

    solvePhysics();
}

for (let key in inputs) {
    if (inputs[key]) {
        inputs[key].addEventListener('input', (e) => syncInput(key, e.target.value, 'slider'));
    }
}
for (let key in nums) {
    if (nums[key]) {
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
}

circuitCanvas.addEventListener('mousedown', (e) => {
    const rect = circuitCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const w = circuitCanvas.width / (window.devicePixelRatio || 1);
    const h = circuitCanvas.height / (window.devicePixelRatio || 1);
    const switchX = w / 2;
    const switchY = h / 2 + 80;

    if (Math.hypot(x - switchX, y - switchY) < 40) {
        sim.closed = !sim.closed;
        solvePhysics();
    }
});

function drawCircuit() {
    const w = circuitCanvas.width / (window.devicePixelRatio || 1);
    const h = circuitCanvas.height / (window.devicePixelRatio || 1);

    cCtx.clearRect(0, 0, w, h);

    cCtx.strokeStyle = colors.grid;
    cCtx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < w; x += step) {
        cCtx.beginPath(); cCtx.moveTo(x, 0); cCtx.lineTo(x, h); cCtx.stroke();
    }
    for (let y = 0; y < h; y += step) {
        cCtx.beginPath(); cCtx.moveTo(0, y); cCtx.lineTo(w, y); cCtx.stroke();
    }

    const leftX = w / 2 - 180;
    const rightX = w / 2 + 180;
    const topY = h / 2 - 80;
    const bottomY = h / 2 + 80;

    let wires = [
        { p1: {x: leftX, y: bottomY}, p2: {x: leftX, y: topY} },
        { p1: {x: leftX, y: topY}, p2: {x: w/2 - 30, y: topY} },
        { p1: {x: w/2 + 30, y: topY}, p2: {x: rightX - 25, y: topY} },
        { p1: {x: rightX, y: topY + 45}, p2: {x: rightX, y: bottomY} },
        { p1: {x: rightX, y: bottomY}, p2: {x: w/2 + 20, y: bottomY} },
        { p1: {x: w/2 - 20, y: bottomY}, p2: {x: leftX, y: bottomY} }
    ];

    cCtx.strokeStyle = colors.wire;
    cCtx.lineWidth = 4;
    cCtx.lineCap = 'round';
    wires.forEach(wire => {
        cCtx.beginPath();
        cCtx.moveTo(wire.p1.x, wire.p1.y);
        cCtx.lineTo(wire.p2.x, wire.p2.y);
        cCtx.stroke();
    });

    const batX = w / 2;
    const batY = topY;
    const batGap = 12;

    if (sim.closed && calculated.I > 0) {
        cCtx.save();
        cCtx.shadowBlur = 15;
        cCtx.shadowColor = colors.battery;
        cCtx.fillStyle = 'rgba(255, 71, 87, 0.05)';
        cCtx.beginPath(); cCtx.arc(batX, batY, 30, 0, Math.PI * 2); cCtx.fill();
        cCtx.restore();
    }

    cCtx.strokeStyle = colors.battery;
    cCtx.lineWidth = 4;
    cCtx.beginPath();
    cCtx.moveTo(batX - 30, batY); cCtx.lineTo(batX - batGap/2, batY);
    cCtx.moveTo(batX + batGap/2, batY); cCtx.lineTo(batX + 30, batY);
    cCtx.stroke();

    cCtx.lineWidth = 6;
    cCtx.beginPath(); cCtx.moveTo(batX - batGap/2, batY - 12); cCtx.lineTo(batX - batGap/2, batY + 12); cCtx.stroke();

    cCtx.lineWidth = 3;
    cCtx.beginPath(); cCtx.moveTo(batX + batGap/2, batY - 20); cCtx.lineTo(batX + batGap/2, batY + 20); cCtx.stroke();

    cCtx.fillStyle = colors.battery;
    cCtx.font = 'bold 16px sans-serif';
    cCtx.fillText('+', batX + batGap/2 + 10, batY - 10);
    cCtx.fillText('ε, r', batX - 15, batY - 25);

    const ampX = leftX;
    const ampY = h / 2;
    const r = 16;

    cCtx.strokeStyle = colors.ammeter;
    cCtx.lineWidth = 4;
    cCtx.beginPath();
    cCtx.moveTo(ampX, topY); cCtx.lineTo(ampX, ampY - r);
    cCtx.moveTo(ampX, ampY + r); cCtx.lineTo(ampX, bottomY);
    cCtx.stroke();

    cCtx.beginPath(); cCtx.arc(ampX, ampY, r, 0, Math.PI * 2);
    cCtx.fillStyle = colors.bg; cCtx.fill(); cCtx.stroke();

    cCtx.fillStyle = colors.ammeter;
    cCtx.font = 'bold 16px sans-serif';
    cCtx.textAlign = 'center'; cCtx.textBaseline = 'middle';
    cCtx.fillText('A', ampX, ampY);

    const voltY = topY - 50;
    cCtx.strokeStyle = colors.voltmeter;
    cCtx.lineWidth = 2.5;
    cCtx.setLineDash([5, 5]);
    cCtx.beginPath();
    cCtx.moveTo(batX - 45, topY); cCtx.lineTo(batX - 45, voltY);
    cCtx.lineTo(batX - r, voltY);
    cCtx.moveTo(batX + 45, topY); cCtx.lineTo(batX + 45, voltY);
    cCtx.lineTo(batX + r, voltY);
    cCtx.stroke();
    cCtx.setLineDash([]);

    cCtx.lineWidth = 4;
    cCtx.beginPath(); cCtx.arc(batX, voltY, r, 0, Math.PI * 2);
    cCtx.fillStyle = colors.bg; cCtx.fill(); cCtx.stroke();

    cCtx.fillStyle = colors.voltmeter;
    cCtx.font = 'bold 16px sans-serif';
    cCtx.fillText('V', batX, voltY);

    const rheoX = rightX;
    const rheoY = h / 2;
    const rHeight = 90;

    cCtx.strokeStyle = '#555';
    cCtx.lineWidth = 10;
    cCtx.lineCap = 'butt';
    cCtx.beginPath();
    cCtx.moveTo(rheoX, rheoY - rHeight/2);
    cCtx.lineTo(rheoX, rheoY + rHeight/2);
    cCtx.stroke();

    cCtx.strokeStyle = colors.resistor;
    cCtx.lineWidth = 2;
    for (let offset = -rHeight/2 + 4; offset <= rHeight/2 - 4; offset += 4) {
        cCtx.beginPath();
        cCtx.moveTo(rheoX - 6, rheoY + offset);
        cCtx.lineTo(rheoX + 6, rheoY + offset);
        cCtx.stroke();
    }

    cCtx.strokeStyle = colors.wire;
    cCtx.lineWidth = 4;
    cCtx.beginPath();
    cCtx.moveTo(rheoX, rheoY + rHeight/2);
    cCtx.lineTo(rheoX, bottomY);
    cCtx.stroke();

    const activeLengthRatio = (sim.R - 0.1) / 99.9;
    const sliderY = (rheoY + rHeight/2) - activeLengthRatio * rHeight;

    cCtx.strokeStyle = '#777';
    cCtx.lineWidth = 3;
    cCtx.beginPath();
    cCtx.moveTo(rheoX - 25, rheoY - rHeight/2 - 10);
    cCtx.lineTo(rheoX - 25, rheoY + rHeight/2 + 10);
    cCtx.stroke();

    cCtx.strokeStyle = colors.wire;
    cCtx.lineWidth = 4;
    cCtx.beginPath();
    cCtx.moveTo(rightX - 25, topY);
    cCtx.lineTo(rightX - 25, rheoY - rHeight/2 - 10);
    cCtx.stroke();

    cCtx.strokeStyle = colors.resistor;
    cCtx.lineWidth = 3.5;
    cCtx.beginPath();
    cCtx.moveTo(rheoX - 25, sliderY);
    cCtx.lineTo(rheoX - 8, sliderY);
    cCtx.stroke();

    cCtx.beginPath();
    cCtx.moveTo(rheoX - 8, sliderY - 5);
    cCtx.lineTo(rheoX, sliderY);
    cCtx.lineTo(rheoX - 8, sliderY + 5);
    cCtx.closePath();
    cCtx.fillStyle = colors.resistor;
    cCtx.fill();

    cCtx.fillStyle = colors.resistor;
    cCtx.font = 'bold 16px sans-serif';
    cCtx.textAlign = 'left';
    cCtx.fillText('R', rheoX + 18, rheoY);

    const swX = w / 2;
    const swY = bottomY;
    const swGap = 30;

    cCtx.strokeStyle = colors.switch;
    cCtx.lineWidth = 4;

    cCtx.beginPath();
    cCtx.arc(swX - swGap/2, swY, 4, 0, Math.PI * 2);
    cCtx.arc(swX + swGap/2, swY, 4, 0, Math.PI * 2);
    cCtx.fillStyle = colors.switch; cCtx.fill();

    cCtx.save();
    cCtx.translate(swX - swGap/2, swY);
    if (!sim.closed) {
        cCtx.rotate(-Math.PI / 4);
    }
    cCtx.beginPath();
    cCtx.moveTo(0, 0); cCtx.lineTo(swGap, 0);
    cCtx.stroke();
    cCtx.restore();

    cCtx.fillStyle = '#fff';
    cCtx.font = 'bold 12px sans-serif';
    cCtx.textAlign = 'center';
    cCtx.fillText('Ключ (Клик)', swX, swY + 25);

    if (sim.closed && calculated.I > 0) {
        cCtx.save();
        cCtx.fillStyle = colors.electron;
        cCtx.shadowBlur = 8; cCtx.shadowColor = colors.electron;

        const pulseSpeed = Math.min(10, calculated.I * 3);
        const electronStep = 30;

        let localOffset = (electronOffset * pulseSpeed) % electronStep;

        //позиции по контуру для бега электронов
        let path = [
            { x: leftX, y: bottomY },
            { x: leftX, y: topY },
            { x: w/2 - 30, y: topY },
            { x: w/2 + 30, y: topY },
            { x: rightX - 25, y: topY },
            { x: rightX - 25, y: sliderY },
            { x: rightX, y: sliderY },
            { x: rightX, y: bottomY },
            { x: leftX, y: bottomY }
        ];

        for (let s = 0; s < path.length - 1; s++) {
            let p1 = path[s];
            let p2 = path[s+1];
            let dx = p2.x - p1.x;
            let dy = p2.y - p1.y;
            let len = Math.hypot(dx, dy);

            for (let d = localOffset; d < len; d += electronStep) {
                let t = d / len;
                let px = p1.x + dx * t;
                let py = p1.y + dy * t;
                cCtx.beginPath(); cCtx.arc(px, py, 3, 0, Math.PI * 2); cCtx.fill();
            }
        }
        cCtx.restore();
    }
}

function drawGraphs() {
    const w = graphCanvas.width / (window.devicePixelRatio || 1);
    const h = graphCanvas.height / (window.devicePixelRatio || 1);

    if (w === 0 || h === 0) return;

    gCtx.clearRect(0, 0, w, h);

    gCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
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
    gCtx.moveTo(chartLeft, chartBottom); gCtx.lineTo(chartRight, chartBottom);
    gCtx.moveTo(chartLeft, chartTop); gCtx.lineTo(chartLeft, chartBottom);
    gCtx.stroke();

    gCtx.fillStyle = '#aaa';
    gCtx.font = 'bold 11px monospace';
    gCtx.fillText("I, А (Ток)", chartRight - 20, chartBottom + 20);
    gCtx.fillText("U, В (Напряжение)", chartLeft - 45, chartTop + 10);

    const I_kz = sim.E / sim.r;
    const maxI_axis = Math.max(I_kz * 1.2, 5);
    const maxU_axis = Math.max(sim.E * 1.2, 10);

    const getScreenCoords = (I, U) => {
        const x = chartLeft + (I / maxI_axis) * (chartRight - chartLeft);
        const y = chartBottom - (U / maxU_axis) * (chartBottom - chartTop);
        return { x, y };
    };

    gCtx.beginPath();
    gCtx.lineWidth = 2.5;
    gCtx.strokeStyle = colors.battery;

    let sStart = getScreenCoords(0, sim.E);
    let sEnd = getScreenCoords(I_kz, 0);
    gCtx.moveTo(sStart.x, sStart.y);
    gCtx.lineTo(sEnd.x, sEnd.y);
    gCtx.stroke();

    let activePos = getScreenCoords(calculated.I, calculated.U);

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
    gCtx.shadowBlur = 15; gCtx.shadowColor = colors.activePoint;
    gCtx.fill();
    gCtx.shadowBlur = 0;

    gCtx.beginPath();
    gCtx.arc(activePos.x, activePos.y, 3, 0, Math.PI * 2);
    gCtx.fillStyle = '#fff';
    gCtx.fill();
}

function update() {
    electronOffset += 0.5;
    drawCircuit();
    requestAnimationFrame(update);
}

window.addEventListener('DOMContentLoaded', () => {
    syncInput('E', sim.E, 'init');
    syncInput('r', sim.r, 'init');
    syncInput('R', sim.R, 'init');
    solvePhysics();

    resize();
    setTimeout(resize, 100);

    update();
});
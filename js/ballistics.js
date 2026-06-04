function tryUnlock(achKey) {
    if (typeof window.unlockAchievement === 'function') {
        window.unlockAchievement(achKey);
    } else if (typeof parent !== 'undefined' && typeof parent.unlockAchievement === 'function') {
        parent.unlockAchievement(achKey);
    } else if (typeof unlockAchievement === 'function') {
        unlockAchievement(achKey);
    }
}

const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');
const wrapper = document.getElementById('canvas-wrapper');

const colors = {
    purple: '#a855f7',
    cyan: '#00d2ff',
    green: '#2ed573',
    red: '#ff4757',
    orange: '#ff9f43',
    muted: '#777'
};

const inputs = {
    h0: document.getElementById('input-h0'),
    v0: document.getElementById('input-v0'),
    angle: document.getElementById('input-angle'),
    g: document.getElementById('input-g'),
    m: document.getElementById('input-m'),
    k: document.getElementById('input-k')
};

const nums = {
    h0: document.getElementById('num-h0'),
    v0: document.getElementById('num-v0'),
    angle: document.getElementById('num-angle'),
    g: document.getElementById('num-g'),
    m: document.getElementById('num-m'),
    k: document.getElementById('num-k')
};

const stats = {
    time: document.getElementById('stat-time'),
    y: document.getElementById('stat-y'),
    x: document.getElementById('stat-x')
};
const statusText = document.getElementById('status-text');

const mathHFormula = document.getElementById('math-h-formula');
const mathLFormula = document.getElementById('math-l-formula');

const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');
const btnCamera = document.getElementById('btn-camera');

let p = { h0: 0, v0: 20, angle: 45, g: 9.8, m: 5, k: 0 };

let state = {
    isRunning: false,
    time: 0,
    x: 0, y: 0,
    vx: 0, vy: 0,
    trajectory: [],
    flags: [],
    cameraLocked: false,
    apex: { x: 0, y: p.h0 }
};

let scale = 12;
let panX = 100;
let panY = 0;

function w2sX(x) { return panX + x * scale; }
function w2sY(y) { return panY - y * scale; }

function resize() {
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
    if (panY === 0) panY = canvas.height - 100;
    draw();
}
window.addEventListener('resize', resize);

let isDragging = false;
let dragStartX = 0, dragStartY = 0;

wrapper.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.clientX - panX;
    dragStartY = e.clientY - panY;
    wrapper.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', e => {
    if (isDragging && !state.cameraLocked) {
        panX = e.clientX - dragStartX;
        panY = e.clientY - dragStartY;
        if (!state.isRunning) requestAnimationFrame(draw);
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    wrapper.style.cursor = 'grab';
});

wrapper.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX - panX;
        dragStartY = e.touches[0].clientY - panY;
    }
});

wrapper.addEventListener('touchmove', e => {
    if (isDragging && !state.cameraLocked && e.touches.length === 1) {
        panX = e.touches[0].clientX - dragStartX;
        panY = e.touches[0].clientY - dragStartY;
        if (!state.isRunning) requestAnimationFrame(draw);
    }
});

wrapper.addEventListener('touchend', () => {
    isDragging = false;
});

wrapper.addEventListener('wheel', e => {
    e.preventDefault();
    if (state.cameraLocked) return;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;

    const mouseX = e.clientX - wrapper.getBoundingClientRect().left;
    const mouseY = e.clientY - wrapper.getBoundingClientRect().top;

    const worldX = (mouseX - panX) / scale;
    const worldY = (panY - mouseY) / scale;

    scale *= zoomFactor;
    scale = Math.max(2, Math.min(scale, 150));

    panX = mouseX - worldX * scale;
    panY = mouseY + worldY * scale;

    if (!state.isRunning) requestAnimationFrame(draw);
});

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
        nums[key].value = val.toFixed(key === 'k' || key === 'g' || key === 'm' || key === 'h0' ? 1 : 0);
    }

    calculateTheoreticalPrediction();
    if(!state.isRunning) requestAnimationFrame(draw);
}

for (let key in inputs) {
    inputs[key].addEventListener('input', (e) => syncInput(key, e.target.value, 'slider'));
}

for (let key in nums) {
    nums[key].addEventListener('input', (e) => {
        if (e.target.value === '') return;
        syncInput(key, e.target.value, 'num');
    });

    nums[key].addEventListener('blur', (e) => {
        let val = parseFloat(e.target.value);
        const min = parseFloat(inputs[key].min);
        const max = parseFloat(inputs[key].max);

        if (isNaN(val) || val < min) val = min;
        if (val > max) val = max;

        syncInput(key, val, 'num');
    });

    nums[key].addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
            btnStart.click();
        }
    });
}

function integrateStep(obj, dt) {
    let ax = -(p.k / p.m) * obj.vx;
    let ay = -p.g - (p.k / p.m) * obj.vy;

    obj.vx += ax * dt;
    obj.vy += ay * dt;
    obj.x += obj.vx * dt;
    obj.y += obj.vy * dt;
}

function calculateTheoreticalPrediction() {
    const rad = p.angle * Math.PI / 180;
    let simObj = {
        x: 0,
        y: p.h0,
        vx: p.v0 * Math.cos(rad),
        vy: p.v0 * Math.sin(rad)
    };

    let maxH = p.h0;
    const dt = 0.01;

    for (let i = 0; i < 6000; i++) {
        integrateStep(simObj, dt);
        if (simObj.y > maxH) {
            maxH = simObj.y;
        }
        if (simObj.y <= 0) {
            simObj.y = 0;
            break;
        }
    }

    renderTheoreticalLaTeX(maxH, simObj.x);
}

function renderTheoreticalLaTeX(hMax, lMax) {
    if (typeof katex === 'undefined') return;

    const hString = `H_{\\text{max}} = h_0 + \\frac{v_0^2 \\sin^2\\alpha}{2g} \\approx ${hMax.toFixed(2)}\\text{ м}`;
    const lString = `L_{\\text{max}} = \\frac{v_0 \\cos\\alpha}{g} \\left( v_0 \\sin\\alpha + \\sqrt{v_0^2 \\sin^2\\alpha + 2gh_0} \\right) \\approx ${lMax.toFixed(2)}\\text{ м}`;

    try {
        katex.render(hString, mathHFormula, { throwOnError: false });
        katex.render(lString, mathLFormula, { throwOnError: false });
    } catch (err) {
        console.error("Ошибка KaTeX:", err);
    }
}

btnStart.addEventListener('click', () => {
    state.time = 0;
    state.x = 0;
    state.y = p.h0;
    state.trajectory = [];
    state.apex = { x: 0, y: p.h0 };

    const rad = p.angle * Math.PI / 180;
    state.vx = p.v0 * Math.cos(rad);
    state.vy = p.v0 * Math.sin(rad);

    state.isRunning = true;
    statusText.innerText = "В ПОЛЕТЕ";

    tryUnlock('SNIPER');
    if (Math.abs(p.angle - 45) < 0.1) {
        tryUnlock('PERFECT_ANGLE');
    }

    lastTime = performance.now();
    requestAnimationFrame(loop);
});

btnReset.addEventListener('click', () => {
    state.isRunning = false;
    state.time = 0;
    state.x = 0;
    state.y = p.h0;
    state.trajectory = [];
    state.flags = [];
    state.apex = { x: 0, y: p.h0 };
    statusText.innerText = "ОЖИДАНИЕ ЗАПУСКА";
    updateStats();
    requestAnimationFrame(draw);
});

btnCamera.addEventListener('click', () => {
    state.cameraLocked = !state.cameraLocked;
    btnCamera.innerText = state.cameraLocked ? "Следить: ВКЛ" : "Следить: ВЫКЛ";
    btnCamera.classList.toggle('active', state.cameraLocked);
    if (!state.isRunning) requestAnimationFrame(draw);
});

let lastTime = 0;
function loop(timestamp) {
    if (!state.isRunning) return;

    const dt = 0.016;
    state.time += dt;

    integrateStep(state, dt);

    if (state.y > state.apex.y) {
        state.apex.x = state.x;
        state.apex.y = state.y;
    }

    if (Math.random() < 0.3) {
        state.trajectory.push({x: state.x, y: state.y});
    }

    if (state.y <= 0) {
        state.y = 0;
        state.isRunning = false;
        statusText.innerText = "ПРИЗЕМЛЕНИЕ";

        state.flags.push(state.x);
        if (state.flags.length > 3) state.flags.shift();
    }

    updateStats();
    draw();

    if (state.isRunning) {
        requestAnimationFrame(loop);
    }
}

function updateStats() {
    stats.time.innerText = state.time.toFixed(2);
    stats.y.innerText = state.y.toFixed(2);
    stats.x.innerText = state.x.toFixed(2);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (state.cameraLocked) {
        const targetPanX = canvas.width * 0.3 - state.x * scale;
        const targetPanY = canvas.height * 0.7 + state.y * scale;

        panX += (targetPanX - panX) * 0.1;
        panY += (targetPanY - panY) * 0.1;
    }

    drawGrid();

    ctx.beginPath();
    ctx.moveTo(0, w2sY(0));
    ctx.lineTo(canvas.width, w2sY(0));
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    state.flags.forEach((flagX, index) => {
        const px = w2sX(flagX);
        const py = w2sY(0);
        ctx.fillStyle = index === state.flags.length - 1 ? colors.cyan : colors.muted;

        ctx.fillRect(px, py - 40, 2, 40);
        ctx.beginPath();
        ctx.moveTo(px + 2, py - 40);
        ctx.lineTo(px + 20, py - 30);
        ctx.lineTo(px + 2, py - 20);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "10px sans-serif";
        ctx.fillText(flagX.toFixed(1) + "м", px - 10, py + 15);
    });

    if (!state.isRunning) {
        ctx.beginPath();
        const rad = p.angle * Math.PI / 180;
        let simObj = {
            x: 0,
            y: p.h0,
            vx: p.v0 * Math.cos(rad),
            vy: p.v0 * Math.sin(rad)
        };

        ctx.moveTo(w2sX(simObj.x), w2sY(simObj.y));

        for (let i = 0; i < 2000; i++) {
            integrateStep(simObj, 0.03);
            ctx.lineTo(w2sX(simObj.x), w2sY(simObj.y));
            if (simObj.y < 0) break;
        }

        ctx.strokeStyle = "rgba(0, 210, 255, 0.35)";
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
    }

    if (state.trajectory.length > 0) {
        ctx.beginPath();
        ctx.moveTo(w2sX(0), w2sY(p.h0));
        state.trajectory.forEach(pt => {
            ctx.lineTo(w2sX(pt.x), w2sY(pt.y));
        });
        ctx.lineTo(w2sX(state.x), w2sY(state.y));
        ctx.strokeStyle = colors.purple;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    if (state.apex.y > p.h0 || (p.h0 > 0 && state.apex.y > 0)) {
        const ax = w2sX(state.apex.x);
        const ay = w2sY(state.apex.y);
        const groundY = w2sY(0);

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax, groundY);
        ctx.strokeStyle = colors.orange;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(ax, ay, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors.orange;
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText(`H = ${state.apex.y.toFixed(2)}м (x: ${state.apex.x.toFixed(2)}м)`, ax + 8, ay - 4);
    }

    if (p.h0 > 0) {
        ctx.beginPath();
        ctx.moveTo(w2sX(0) - 15, w2sY(0));
        ctx.lineTo(w2sX(0) - 15, w2sY(p.h0));
        ctx.lineTo(w2sX(0), w2sY(p.h0));
        ctx.lineTo(w2sX(0), w2sY(0));
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    const bx = w2sX(state.isRunning ? state.x : 0);
    const by = w2sY(state.isRunning ? state.y : p.h0);

    ctx.beginPath();
    ctx.arc(bx, by, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors.purple;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (state.isRunning || (!state.isRunning && state.time === 0)) {
        let currentVx = state.isRunning ? state.vx : p.v0 * Math.cos(p.angle * Math.PI / 180);
        let currentVy = state.isRunning ? state.vy : p.v0 * Math.sin(p.angle * Math.PI / 180);
        const vScale = scale * 0.2;

        drawArrow(bx, by, bx + currentVx * vScale, by - currentVy * vScale, colors.red);
        drawArrow(bx, by, bx, by + p.g * scale * 0.4, colors.green);
    }
}

function drawGrid() {
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;

    const stepWorld = 10;
    const stepScreen = stepWorld * scale;

    const startX = panX % stepScreen;
    const startY = panY % stepScreen;

    ctx.beginPath();
    for (let x = startX - stepScreen; x < canvas.width; x += stepScreen) {
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
    }
    for (let y = startY - stepScreen; y < canvas.height; y += stepScreen) {
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
}

function drawArrow(fromx, fromy, tox, toy, color) {
    const headlen = 10;
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
    ctx.lineWidth = 2;
    ctx.stroke();
}

window.addEventListener('DOMContentLoaded', () => {
    for (let key in p) {
        syncInput(key, p[key], 'init');
    }
    resize();
});

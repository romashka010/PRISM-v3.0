const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');
const wrapper = document.getElementById('canvas-wrapper');

const colors = {
    pos: '#ff4757',
    neg: '#00d2ff',
    force: '#ff9f43',
    white: '#ffffff',
    grid: 'rgba(255, 255, 255, 0.03)',
    ruler: '#888'
};

const inputs = {
    q1: document.getElementById('input-q1'),
    q2: document.getElementById('input-q2')
};

const nums = {
    q1: document.getElementById('num-q1'),
    q2: document.getElementById('num-q2')
};

const statR = document.getElementById('stat-r');
const mathForceFormula = document.getElementById('math-force-formula');

const btnAddRecord = document.getElementById('btn-add-record');
const btnClearTable = document.getElementById('btn-clear-table');
const measurementsTable = document.getElementById('measurements-table').getElementsByTagName('tbody')[0];

const k_physical = 9;

let p = { q1: 20, q2: -20 };

let state = {
    q1_x: 0.30,
    q2_x: 0.80,
    isDraggingQ1: false,
    isDraggingQ2: false,
    records: []
};

let scaleX = 1;
let originX = 100;
let railY = 0;

function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = wrapper.clientWidth;
    const h = wrapper.clientHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    originX = 80;
    railY = h - 80;
    scaleX = w - 160;

    draw();
}
window.addEventListener('resize', resize);

function m2p(m) {
    return originX + m * scaleX;
}

function p2m(p) {
    let raw = (p - originX) / scaleX;
    return Math.max(0.1, Math.min(1.0, raw));
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

    p[key] = val;

    if (source !== 'slider') {
        inputs[key].value = val;
    }
    if (source !== 'num') {
        nums[key].value = val;
    }

    renderTheoreticalLaTeX();
    draw();
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

function getCoulombForce() {
    let r = Math.abs(state.q2_x - state.q1_x);
    let f_val = (k_physical * Math.abs(p.q1 * p.q2)) / (r * r);
    return { r, f_val };
}

function renderTheoreticalLaTeX() {
    if (typeof katex === 'undefined') return;

    const { r, f_val } = getCoulombForce();
    statR.innerText = r.toFixed(4);

    const directionStr = (p.q1 * p.q2 < 0) ? '\\text{ (притяжение)}' : '\\text{ (отталкивание)}';

    const forceStr = `F = k \\frac{|q_1 q_2|}{r^2} \\approx ${f_val.toFixed(2)}\\text{ нН}${directionStr}`;

    try {
        katex.render(forceStr, mathForceFormula, { throwOnError: false });
    } catch (err) {
        console.error("Ошибка KaTeX:", err);
    }
}

function renderAllMath() {
    if (typeof katex === 'undefined') return;

    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue;
            if (text.includes('$')) {
                const regex = /\$([^$]+)\$/g;
                let match;
                const parent = node.parentNode;

                if (parent && (
                    parent.tagName === 'SCRIPT' ||
                    parent.tagName === 'STYLE' ||
                    parent.classList.contains('katex') ||
                    parent.closest('.katex')
                )) {
                    return;
                }

                const fragments = [];
                let lastIndex = 0;

                while ((match = regex.exec(text)) !== null) {
                    if (match.index > lastIndex) {
                        fragments.push(document.createTextNode(text.substring(lastIndex, match.index)));
                    }

                    const span = document.createElement('span');
                    try {
                        katex.render(match[1], span, { throwOnError: false });
                    } catch (e) {
                        span.textContent = match[0];
                    }
                    fragments.push(span);
                    lastIndex = regex.lastIndex;
                }

                if (lastIndex < text.length) {
                    fragments.push(document.createTextNode(text.substring(lastIndex)));
                }

                if (fragments.length > 0) {
                    const nextSibling = node.nextSibling;
                    parent.removeChild(node);
                    fragments.forEach(frag => {
                        if (nextSibling) {
                            parent.insertBefore(frag, nextSibling);
                        } else {
                            parent.appendChild(frag);
                        }
                    });
                }
            }
        } else {
            const children = Array.from(node.childNodes);
            children.forEach(traverse);
        }
    }

    traverse(document.body);
}

btnAddRecord.addEventListener('click', () => {
    const { r, f_val } = getCoulombForce();
    const f_measured = f_val;

    const newRecord = {
        id: state.records.length + 1,
        q1: p.q1,
        q2: p.q2,
        r: r,
        invR2: 1.0 / (r * r),
        f_measured: f_measured,
        f_theoretical: f_val
    };

    state.records.push(newRecord);
    updateTable();
});

btnClearTable.addEventListener('click', () => {
    state.records = [];
    updateTable();
});

function updateTable() {
    if (state.records.length === 0) {
        measurementsTable.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">Журнал пуст. Настройте параметры и нажмите «Записать в журнал»</td>
            </tr>
        `;
        return;
    }

    measurementsTable.innerHTML = '';
    state.records.forEach(rec => {
        let row = measurementsTable.insertRow();
        row.innerHTML = `
            <td>${rec.id}</td>
            <td>${rec.q1 > 0 ? '+' : ''}${rec.q1}</td>
            <td>${rec.q2 > 0 ? '+' : ''}${rec.q2}</td>
            <td>${rec.r.toFixed(2)}</td>
            <td>${rec.invR2.toFixed(2)}</td>
            <td style="color: var(--accent-orange); font-weight: bold;">${rec.f_measured.toFixed(1)}</td>
            <td style="color: var(--accent-green);">${rec.f_theoretical.toFixed(1)}</td>
        `;
    });
}

function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }

    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function handleDown(e) {
    const pos = getPointerPos(e);

    const p1_x = m2p(state.q1_x);
    const p2_x = m2p(state.q2_x);

    let dist1 = Math.abs(pos.x - p1_x);
    let dist2 = Math.abs(pos.y - (railY - 40));

    if (dist1 < 25 && dist2 < 45) {
        state.isDraggingQ1 = true;
        canvas.style.cursor = 'ew-resize';
    } else {
        let dist3 = Math.abs(pos.x - p2_x);
        if (dist3 < 25 && dist2 < 45) {
            state.isDraggingQ2 = true;
            canvas.style.cursor = 'ew-resize';
        }
    }
}

function handleMove(e) {
    if (!state.isDraggingQ1 && !state.isDraggingQ2) return;
    if (e.type === 'touchmove') e.preventDefault();

    const pos = getPointerPos(e);
    let targetM = p2m(pos.x);

    if (state.isDraggingQ1) {
        state.q1_x = Math.min(state.q2_x - 0.1, targetM);
    } else if (state.isDraggingQ2) {
        state.q2_x = Math.max(state.q1_x + 0.1, targetM);
    }

    renderTheoreticalLaTeX();
    requestAnimationFrame(draw);
}

function handleUp() {
    state.isDraggingQ1 = false;
    state.isDraggingQ2 = false;
    canvas.style.cursor = 'default';
}

canvas.addEventListener('mousedown', handleDown);
window.addEventListener('mousemove', handleMove);
window.addEventListener('mouseup', handleUp);

canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) handleDown(e);
}, {passive: false});
window.addEventListener('touchmove', handleMove, {passive: false});
window.addEventListener('touchend', handleUp);

function draw() {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    const gridStep = 20;
    for (let x = 0; x < w; x += gridStep) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += gridStep) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(originX - 30, railY);
    ctx.lineTo(originX + scaleX + 30, railY);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(originX - 25, railY);
    ctx.lineTo(originX + scaleX + 25, railY);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.strokeStyle = colors.ruler;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(originX, railY + 20);
    ctx.lineTo(originX + scaleX, railY + 20);
    ctx.stroke();

    ctx.fillStyle = colors.ruler;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    for (let m = 0; m <= 1.0; m += 0.05) {
        let lx = m2p(m);
        let height = (m * 100) % 10 === 0 ? 12 : 6;

        ctx.beginPath();
        ctx.moveTo(lx, railY + 20);
        ctx.lineTo(lx, railY + 20 + height);
        ctx.stroke();

        if ((m * 100) % 10 === 0) {
            ctx.fillText(m.toFixed(1) + 'м', lx, railY + 45);
        }
    }

    const drawChargeUnit = (mx, q, isSelected) => {
        let cx = m2p(mx);
        let cy = railY - 40;

        ctx.beginPath();
        ctx.moveTo(cx, railY);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, railY - 15, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 210, 255, 0.3)';
        ctx.fill();

        ctx.fillStyle = '#444';
        ctx.fillRect(cx - 12, railY - 4, 24, 8);

        let radius = 18 + Math.sqrt(Math.abs(q)) * 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = q > 0 ? colors.pos : colors.neg;

        ctx.shadowBlur = 20;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#000';
        ctx.font = `bold ${radius * 1.1}px sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillText(q > 0 ? '+' : '−', cx, cy);

        if (isSelected) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    };

    drawChargeUnit(state.q1_x, p.q1, state.isDraggingQ1);
    drawChargeUnit(state.q2_x, p.q2, state.isDraggingQ2);

    const { r, f_val } = getCoulombForce();
    if (f_val > 0.1) {
        let p1_x = m2p(state.q1_x);
        let p2_x = m2p(state.q2_x);
        let cy = railY - 40;

        const isAttraction = p.q1 * p.q2 < 0;

        let arrowLen = Math.min(120, 15 + f_val * 0.4);

        ctx.strokeStyle = colors.force;
        ctx.fillStyle = colors.force;
        ctx.lineWidth = 3.5;

        if (isAttraction) {
            drawArrow(p1_x, cy, p1_x + arrowLen, cy);
            drawArrow(p2_x, cy, p2_x - arrowLen, cy);

            ctx.font = 'bold 12px sans-serif';
            ctx.fillText('F₁', p1_x + arrowLen/2, cy - 15);
            ctx.fillText('F₂', p2_x - arrowLen/2, cy - 15);
        } else {
            drawArrow(p1_x, cy, p1_x - arrowLen, cy);
            drawArrow(p2_x, cy, p2_x + arrowLen, cy);

            ctx.font = 'bold 12px sans-serif';
            ctx.fillText('F₁', p1_x - arrowLen/2, cy - 15);
            ctx.fillText('F₂', p2_x + arrowLen/2, cy - 15);
        }
    }
}

function drawArrow(fromx, fromy, tox, toy) {
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
    ctx.stroke();
}

window.addEventListener('DOMContentLoaded', () => {
    syncInput('q1', p.q1, 'init');
    syncInput('q2', p.q2, 'init');
    renderAllMath();
    resize();
});
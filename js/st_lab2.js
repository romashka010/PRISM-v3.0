const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');
const wrapper = document.getElementById('canvas-wrapper');

const graphCanvas = document.getElementById('graph-canvas');
const graphCtx = graphCanvas.getContext('2d');

const colors = {
    pos: '#ff4757',
    neg: '#00d2ff',
    probe: '#2ed573',
    potential: '#ff9f43',
    field: '#00d2ff',
    grid: 'rgba(255, 255, 255, 0.03)',
    text: '#ffffff',
    textMuted: '#666666'
};

const inputs = {
    Q: document.getElementById('input-Q'),
    r: document.getElementById('input-r')
};

const nums = {
    Q: document.getElementById('num-Q'),
    r: document.getElementById('num-r')
};

const statR = document.getElementById('stat-r');
const mathFieldFormula = document.getElementById('math-field-formula');
const mathPotentialFormula = document.getElementById('math-potential-formula');

const btnAddRecord = document.getElementById('btn-add-record');
const btnClearTable = document.getElementById('btn-clear-table');
const measurementsTable = document.getElementById('measurements-table').getElementsByTagName('tbody')[0];

const k_physical = 9;

let p = { Q: 15, r: 0.40 };

let state = {
    Q_pos: { x: 0, y: 0 },
    probe_pos: { x: 0, y: 0 },
    isDraggingProbe: false,
    records: []
};

const pixelsPerMeter = 350; //350 = 1 метр

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

    let current_r = p.r;
    if (state.Q_pos.x !== 0) {
        let dx = state.probe_pos.x - state.Q_pos.x;
        let dy = state.probe_pos.y - state.Q_pos.y;
        current_r = Math.sqrt(dx*dx + dy*dy) / pixelsPerMeter;
    }

    state.Q_pos = { x: w / 2, y: h / 2 };

    state.probe_pos = {
        x: state.Q_pos.x + current_r * pixelsPerMeter,
        y: state.Q_pos.y
    };

    const gw = graphCanvas.parentElement.clientWidth;
    const gh = graphCanvas.parentElement.clientHeight || 160;

    graphCanvas.width = gw * dpr;
    graphCanvas.height = gh * dpr;
    graphCanvas.style.width = gw + 'px';
    graphCanvas.style.height = gh + 'px';

    graphCtx.setTransform(1, 0, 0, 1, 0, 0);
    graphCtx.scale(dpr, dpr);

    draw();
    drawGraphs();
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
        if (inputs[key]) inputs[key].value = val;
    }
    if (source !== 'num') {
        if (nums[key]) nums[key].value = val;
    }

    if (key === 'r') {
        state.probe_pos.x = state.Q_pos.x + val * pixelsPerMeter;
        state.probe_pos.y = state.Q_pos.y;
    }

    renderTheoreticalLaTeX();
    draw();
    drawGraphs();
}

for (let key in inputs) {
    if (!inputs[key] || !nums[key]) continue;

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

function getFieldAtProbe() {
    let dx = state.probe_pos.x - state.Q_pos.x;
    let dy = state.probe_pos.y - state.Q_pos.y;
    let r_pixels = Math.sqrt(dx*dx + dy*dy);

    let r = r_pixels / pixelsPerMeter;
    if (r < 0.05) r = 0.05;

    let E = (k_physical * Math.abs(p.Q)) / (r * r);
    let phi = (k_physical * p.Q) / r;

    return { r, E, phi, dx, dy, r_pixels };
}

function renderTheoreticalLaTeX() {
    if (typeof katex === 'undefined') return;

    const { r, E, phi } = getFieldAtProbe();
    if (statR) statR.innerText = r.toFixed(2);

    const fieldStr = `E = k \\frac{|Q|}{r^2} \\approx ${E.toFixed(1)}\\text{ В/м}`;
    const potentialStr = `\\varphi = k \\frac{Q}{r} \\approx ${phi.toFixed(1)}\\text{ В}`;

    try {
        katex.render(fieldStr, mathFieldFormula, { throwOnError: false });
        katex.render(potentialStr, mathPotentialFormula, { throwOnError: false });
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
    const { r, E, phi } = getFieldAtProbe();

    const newRecord = {
        id: state.records.length + 1,
        Q: p.Q,
        r: r,
        phi: phi,
        E: E
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
                <td colspan="5">Журнал пуст. Переместите пробник и нажмите «Записать в журнал»</td>
            </tr>
        `;
        return;
    }

    measurementsTable.innerHTML = '';
    state.records.forEach(rec => {
        let row = measurementsTable.insertRow();
        row.innerHTML = `
            <td>${rec.id}</td>
            <td>${rec.Q > 0 ? '+' : ''}${rec.Q}</td>
            <td>${rec.r.toFixed(2)}</td>
            <td style="color: var(--accent-orange); font-weight: bold;">${rec.phi.toFixed(1)}</td>
            <td style="color: var(--accent-cyan); font-weight: bold;">${rec.E.toFixed(1)}</td>
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
    let dist = Math.sqrt((pos.x - state.probe_pos.x)**2 + (pos.y - state.probe_pos.y)**2);

    if (dist < 22) {
        state.isDraggingProbe = true;
        canvas.style.cursor = 'grabbing';
    }
}

function handleMove(e) {
    if (!state.isDraggingProbe) return;
    if (e.type === 'touchmove') e.preventDefault();

    const pos = getPointerPos(e);

    let dx = pos.x - state.Q_pos.x;
    let dy = pos.y - state.Q_pos.y;
    let r_pixels = Math.sqrt(dx*dx + dy*dy);

    const min_pixels = 0.05 * pixelsPerMeter;
    const max_pixels = 1.00 * pixelsPerMeter;

    if (r_pixels < min_pixels) {
        state.probe_pos.x = state.Q_pos.x + (dx / r_pixels) * min_pixels;
        state.probe_pos.y = state.Q_pos.y + (dy / r_pixels) * min_pixels;
        r_pixels = min_pixels;
    } else if (r_pixels > max_pixels) {
        state.probe_pos.x = state.Q_pos.x + (dx / r_pixels) * max_pixels;
        state.probe_pos.y = state.Q_pos.y + (dy / r_pixels) * max_pixels;
        r_pixels = max_pixels;
    } else {
        state.probe_pos = { x: pos.x, y: pos.y };
    }

    let r = r_pixels / pixelsPerMeter;
    p.r = r;

    if (inputs.r) inputs.r.value = r;
    if (nums.r) nums.r.value = r.toFixed(2);

    renderTheoreticalLaTeX();
    draw();
    drawGraphs();
}

function handleUp() {
    state.isDraggingProbe = false;
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
    const gridStep = 40;
    for (let x = 0; x < w; x += gridStep) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += gridStep) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    if (Math.abs(p.Q) > 1) {
        const numLines = 16;
        const radius = 25;
        ctx.lineWidth = 1;
        ctx.strokeStyle = p.Q > 0 ? 'rgba(255, 71, 87, 0.15)' : 'rgba(0, 210, 255, 0.15)';
        ctx.fillStyle = p.Q > 0 ? colors.pos : colors.neg;

        for (let i = 0; i < numLines; i++) {
            let angle = (i * Math.PI * 2) / numLines;
            let startX = state.Q_pos.x + Math.cos(angle) * radius;
            let startY = state.Q_pos.y + Math.sin(angle) * radius;

            ctx.beginPath();
            ctx.moveTo(startX, startY);

            let endX = state.Q_pos.x + Math.cos(angle) * Math.max(w, h);
            let endY = state.Q_pos.y + Math.sin(angle) * Math.max(w, h);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            for (let d = 80; d < Math.max(w, h); d += 120) {
                let ax = state.Q_pos.x + Math.cos(angle) * d;
                let ay = state.Q_pos.y + Math.sin(angle) * d;

                ctx.save();
                ctx.translate(ax, ay);
                ctx.rotate(p.Q > 0 ? angle : angle + Math.PI);

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-6, -4);
                ctx.lineTo(-6, 4);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        for (let r_m = 0.1; r_m <= 0.8; r_m += 0.1) {
            ctx.beginPath();
            ctx.arc(state.Q_pos.x, state.Q_pos.y, r_m * pixelsPerMeter, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.setLineDash([]);
    }

    let { r, E, phi, dx, dy, r_pixels } = getFieldAtProbe();

    ctx.beginPath();
    ctx.moveTo(state.Q_pos.x, state.Q_pos.y);
    ctx.lineTo(state.probe_pos.x, state.probe_pos.y);
    ctx.strokeStyle = 'rgba(46, 213, 115, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(state.probe_pos.x, state.probe_pos.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = colors.probe;
    ctx.shadowBlur = 12;
    ctx.shadowColor = colors.probe;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', state.probe_pos.x, state.probe_pos.y);

    if (E > 0.1 && Math.abs(p.Q) > 0) {
        let arrowLen = Math.min(100, 10 + E * 0.8);
        let angle = Math.atan2(dy, dx);
        if (p.Q < 0) angle += Math.PI;

        let tox = state.probe_pos.x + Math.cos(angle) * arrowLen;
        let toy = state.probe_pos.y + Math.sin(angle) * arrowLen;

        ctx.strokeStyle = colors.field;
        ctx.lineWidth = 2.5;
        drawArrow(state.probe_pos.x, state.probe_pos.y, tox, toy);

        ctx.fillStyle = colors.field;
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('E', tox + Math.cos(angle)*10, toy + Math.sin(angle)*10);
    }

    let qRadius = 16 + Math.sqrt(Math.abs(p.Q)) * 0.5;
    ctx.beginPath();
    ctx.arc(state.Q_pos.x, state.Q_pos.y, qRadius, 0, Math.PI * 2);
    ctx.fillStyle = p.Q > 0 ? colors.pos : (p.Q < 0 ? colors.neg : '#555');

    ctx.shadowBlur = 18;
    ctx.shadowColor = ctx.fillStyle;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#000000';
    ctx.font = `bold ${qRadius * 1.1}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.Q > 0 ? '+' : (p.Q < 0 ? '−' : ''), state.Q_pos.x, state.Q_pos.y);
}
//стрелка
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

function drawGraphs() {
    const w = graphCanvas.width / (window.devicePixelRatio || 1);
    const h = graphCanvas.height / (window.devicePixelRatio || 1);

    graphCtx.clearRect(0, 0, w, h);

    graphCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    graphCtx.lineWidth = 1;
    const stepX = w / 10;
    const stepY = h / 6;
    for (let x = 0; x < w; x += stepX) {
        graphCtx.beginPath(); graphCtx.moveTo(x, 0); graphCtx.lineTo(x, h); graphCtx.stroke();
    }
    for (let y = 0; y < h; y += stepY) {
        graphCtx.beginPath(); graphCtx.moveTo(0, y); graphCtx.lineTo(w, y); graphCtx.stroke();
    }

    graphCtx.strokeStyle = 'rgba(255,255,255,0.2)';
    graphCtx.lineWidth = 1;

    graphCtx.beginPath();
    graphCtx.moveTo(30, h - 20);
    graphCtx.lineTo(w - 10, h - 20);
    graphCtx.stroke();

    graphCtx.beginPath();
    graphCtx.moveTo(30, 10);
    graphCtx.lineTo(30, h - 20);
    graphCtx.stroke();

    graphCtx.fillStyle = '#888888';
    graphCtx.font = '9px monospace';
    graphCtx.fillText('r, м', w - 30, h - 5);

    for (let r_m = 0.1; r_m <= 0.9; r_m += 0.2) {
        let gx = 30 + r_m * (w - 50);
        graphCtx.beginPath();
        graphCtx.moveTo(gx, h - 20);
        graphCtx.lineTo(gx, h - 17);
        graphCtx.stroke();
        graphCtx.fillText(r_m.toFixed(1), gx - 5, h - 7);
    }

    if (Math.abs(p.Q) === 0) return;

    const maxE = (k_physical * Math.abs(p.Q)) / (0.1 * 0.1);
    const maxPhi = Math.abs((k_physical * p.Q) / 0.1);
    const plotH = h - 40;

    const getE_Y = (r_val) => {
        let E_val = (k_physical * Math.abs(p.Q)) / (r_val * r_val);
        return h - 20 - (E_val / maxE) * plotH;
    };

    const getPhi_Y = (r_val) => {
        let phi_val = (k_physical * p.Q) / r_val;
        let percent = phi_val / maxPhi;
        if (p.Q < 0) {
            return h - 20 - (Math.abs(phi_val) / maxPhi) * plotH * 0.5;
        }
        return h - 20 - percent * plotH;
    };

    graphCtx.beginPath();
    graphCtx.lineCap = 'round';
    graphCtx.lineJoin = 'round';
    for (let r_m = 0.05; r_m <= 1.0; r_m += 0.01) {
        let gx = 30 + r_m * (w - 50);
        let gy = getE_Y(r_m);
        if (gy < 10) gy = 10;
        if (r_m === 0.05) graphCtx.moveTo(gx, gy);
        else graphCtx.lineTo(gx, gy);
    }
    graphCtx.strokeStyle = colors.field;
    graphCtx.lineWidth = 1.5;
    graphCtx.stroke();

    graphCtx.beginPath();
    for (let r_m = 0.05; r_m <= 1.0; r_m += 0.01) {
        let gx = 30 + r_m * (w - 50);
        let gy = getPhi_Y(r_m);
        if (gy < 10) gy = 10;
        if (gy > h - 10) gy = h - 10;
        if (r_m === 0.05) graphCtx.moveTo(gx, gy);
        else graphCtx.lineTo(gx, gy);
    }
    graphCtx.strokeStyle = colors.potential;
    graphCtx.lineWidth = 1.5;
    graphCtx.stroke();

    let cur = getFieldAtProbe();
    if (cur.r <= 1.0) {
        let cx = 30 + cur.r * (w - 50);

        let cyE = getE_Y(cur.r);
        graphCtx.beginPath();
        graphCtx.arc(cx, cyE < 10 ? 10 : cyE, 4, 0, Math.PI * 2);
        graphCtx.fillStyle = colors.field;
        graphCtx.fill();

        let cyPhi = getPhi_Y(cur.r);
        graphCtx.beginPath();
        graphCtx.arc(cx, cyPhi < 10 ? 10 : (cyPhi > h-10 ? h-10 : cyPhi), 4, 0, Math.PI * 2);
        graphCtx.fillStyle = colors.potential;
        graphCtx.fill();
    }

    graphCtx.fillStyle = colors.field;
    graphCtx.font = 'bold 9px sans-serif';
    graphCtx.textAlign = 'left';
    graphCtx.fillText('— E(r) Напряженность', 50, 20);

    graphCtx.fillStyle = colors.potential;
    graphCtx.fillText('— φ(r) Потенциал', 50, 32);
}

window.addEventListener('DOMContentLoaded', () => {
    syncInput('Q', p.Q, 'init');
    syncInput('r', p.r, 'init');
    renderAllMath();
    resize();
});
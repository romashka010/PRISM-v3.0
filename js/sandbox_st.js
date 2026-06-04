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
    pos: '#ff4757',
    neg: '#00d2ff',
    field: 'rgba(255, 255, 255, 0.4)',
    force: '#ff9f43',
    bg: '#050509'
};

const tools = document.querySelectorAll('.tool-btn');
const editorPanel = document.getElementById('charge-editor');
const inputQ = document.getElementById('input-q');
const numQ = document.getElementById('num-q');

const toggles = {
    field: document.getElementById('toggle-field'),
    forces: document.getElementById('toggle-forces'),
    glow: document.getElementById('toggle-glow')
};

const btnClear = document.getElementById('btn-clear');

let charges = [
    { x: 300, y: 350, q: 15, id: 1 }
];

let plates = [
    { x1: 550, y1: 200, x2: 550, y2: 500, q: -30, id: 2, type: 'plate' }
];

let chargeCounter = 3;
const k = 8987.5;

let currentTool = 'add-pos';
let selectedCharge = null;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let dragOffsetX2 = 0;
let dragOffsetY2 = 0;

let isDrawingPlate = false;
let plateStartX = 0;
let plateStartY = 0;
let plateEndX = 0;
let plateEndY = 0;

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

    draw();
}
window.addEventListener('resize', resize);

tools.forEach(btn => {
    btn.addEventListener('click', () => {
        tools.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.tool;

        if (currentTool === 'delete') canvas.style.cursor = 'no-drop';
        else if (currentTool === 'move') canvas.style.cursor = 'grab';
        else canvas.style.cursor = 'crosshair';

        if (currentTool !== 'move') {
            selectedCharge = null;
            updateEditorPanel();
            draw();
        }
    });
});

function updateEditorPanel() {
    if (selectedCharge) {
        editorPanel.classList.remove('hidden');
        inputQ.value = selectedCharge.q;
        numQ.value = selectedCharge.q;
    } else {
        editorPanel.classList.add('hidden');
    }
}

function syncQ(val, source) {
    if (!selectedCharge) return;
    let num = parseFloat(val);
    if (isNaN(num)) return;

    if (num < -50) num = -50;
    if (num > 50) num = 50;

    selectedCharge.q = num;

    if (source === 'slider') numQ.value = num;
    if (source === 'num') inputQ.value = num;

    requestAnimationFrame(draw);
}

inputQ.addEventListener('input', (e) => syncQ(e.target.value, 'slider'));
numQ.addEventListener('input', (e) => {
    if (e.target.value === '') return;
    syncQ(e.target.value, 'num');
});
numQ.addEventListener('blur', (e) => syncQ(e.target.value, 'num'));

btnClear.addEventListener('click', () => {
    charges = [];
    plates = [];
    selectedCharge = null;
    updateEditorPanel();
    draw();
});

Object.values(toggles).forEach(t => {
    t.addEventListener('change', () => requestAnimationFrame(draw));
});

function getDistanceToSegment(px, py, x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    let l2 = dx*dx + dy*dy;
    if (l2 === 0) return Math.sqrt((px-x1)**2 + (py-y1)**2);
    let t = ((px - x1) * dx + (py - y1) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt((px - (x1 + t * dx))**2 + (py - (y1 + t * dy))**2);
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

function getInteractiveElementAt(x, y) {
    if (selectedCharge && selectedCharge.type === 'plate') {
        let d1 = Math.sqrt((selectedCharge.x1 - x)**2 + (selectedCharge.y1 - y)**2);
        if (d1 < 15) return { type: 'handle1', element: selectedCharge };
        let d2 = Math.sqrt((selectedCharge.x2 - x)**2 + (selectedCharge.y2 - y)**2);
        if (d2 < 15) return { type: 'handle2', element: selectedCharge };
    }

    for (let i = charges.length - 1; i >= 0; i--) {
        let c = charges[i];
        let dx = c.x - x;
        let dy = c.y - y;
        if (Math.sqrt(dx*dx + dy*dy) < 22) {
            return { type: 'charge', element: c };
        }
    }

    for (let i = plates.length - 1; i >= 0; i--) {
        let p = plates[i];
        let dist = getDistanceToSegment(x, y, p.x1, p.y1, p.x2, p.y2);
        if (dist < 15) {
            return { type: 'plate', element: p };
        }
    }

    return null;
}

function checkGravityMasterAchievement() {
    let hasPositive = charges.some(c => c.q > 0);
    let hasNegative = charges.some(c => c.q < 0);
    let hasPlate = plates.length > 0;

    if (hasPositive && hasNegative && hasPlate) {
        tryUnlock('GRAVITY_MASTER');
    }
}

function handleDown(e) {
    const pos = getPointerPos(e);
    const interact = getInteractiveElementAt(pos.x, pos.y);

    if (currentTool === 'add-pos') {
        charges.push({ x: pos.x, y: pos.y, q: 10, id: chargeCounter++ });
        checkGravityMasterAchievement();
        draw();
    }
    else if (currentTool === 'add-neg') {
        charges.push({ x: pos.x, y: pos.y, q: -10, id: chargeCounter++ });
        checkGravityMasterAchievement();
        draw();
    }
    else if (currentTool === 'add-plate-pos' || currentTool === 'add-plate-neg') {
        isDrawingPlate = true;
        plateStartX = pos.x;
        plateStartY = pos.y;
        plateEndX = pos.x;
        plateEndY = pos.y;
        draw();
    }
    else if (currentTool === 'delete') {
        if (interact) {
            if (interact.type === 'charge') {
                charges = charges.filter(c => c.id !== interact.element.id);
            } else {
                plates = plates.filter(p => p.id !== interact.element.id);
            }
            if (selectedCharge && selectedCharge.id === interact.element.id) {
                selectedCharge = null;
                updateEditorPanel();
            }
            draw();
        }
    }
    else if (currentTool === 'move') {
        if (interact) {
            selectedCharge = interact.element;
            selectedCharge.elementObjectType = interact.type;
            isDragging = true;

            if (interact.type === 'charge') {
                dragOffsetX = interact.element.x - pos.x;
                dragOffsetY = interact.element.y - pos.y;
            } else if (interact.type === 'plate') {
                dragOffsetX = interact.element.x1 - pos.x;
                dragOffsetY = interact.element.y1 - pos.y;
                dragOffsetX2 = interact.element.x2 - pos.x;
                dragOffsetY2 = interact.element.y2 - pos.y;
            } else if (interact.type === 'handle1') {
                dragOffsetX = interact.element.x1 - pos.x;
                dragOffsetY = interact.element.y1 - pos.y;
            } else if (interact.type === 'handle2') {
                dragOffsetX = interact.element.x2 - pos.x;
                dragOffsetY = interact.element.y2 - pos.y;
            }
            canvas.style.cursor = 'grabbing';
            updateEditorPanel();
            draw();
        } else {
            selectedCharge = null;
            updateEditorPanel();
            draw();
        }
    }
}

function handleMove(e) {
    const pos = getPointerPos(e);

    if (isDrawingPlate) {
        if (e.type === 'touchmove') e.preventDefault();
        plateEndX = pos.x;
        plateEndY = pos.y;
        requestAnimationFrame(draw);
        return;
    }

    if (!isDragging || !selectedCharge || currentTool !== 'move') return;
    if (e.type === 'touchmove') e.preventDefault();

    if (selectedCharge.elementObjectType === 'charge') {
        selectedCharge.x = pos.x + dragOffsetX;
        selectedCharge.y = pos.y + dragOffsetY;
    } else if (selectedCharge.elementObjectType === 'plate') {
        selectedCharge.x1 = pos.x + dragOffsetX;
        selectedCharge.y1 = pos.y + dragOffsetY;
        selectedCharge.x2 = pos.x + dragOffsetX2;
        selectedCharge.y2 = pos.y + dragOffsetY2;
    } else if (selectedCharge.elementObjectType === 'handle1') {
        selectedCharge.x1 = pos.x + dragOffsetX;
        selectedCharge.y1 = pos.y + dragOffsetY;
    } else if (selectedCharge.elementObjectType === 'handle2') {
        selectedCharge.x2 = pos.x + dragOffsetX;
        selectedCharge.y2 = pos.y + dragOffsetY;
    }

    requestAnimationFrame(draw);
}

function handleUp() {
    if (isDrawingPlate) {
        isDrawingPlate = false;
        let dist = Math.sqrt((plateEndX - plateStartX)**2 + (plateEndY - plateStartY)**2);
        if (dist > 15) {
            let chargeVal = (currentTool === 'add-plate-pos') ? 30 : -30;
            plates.push({
                x1: plateStartX,
                y1: plateStartY,
                x2: plateEndX,
                y2: plateEndY,
                q: chargeVal,
                id: chargeCounter++,
                type: 'plate'
            });
            checkGravityMasterAchievement();
        }
        draw();
    }
    isDragging = false;
    if (currentTool === 'move') {
        canvas.style.cursor = selectedCharge ? 'grab' : 'crosshair';
    }
}

canvas.addEventListener('mousedown', handleDown);
window.addEventListener('mousemove', handleMove);
window.addEventListener('mouseup', handleUp);

canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) handleDown(e);
}, {passive: false});
window.addEventListener('touchmove', handleMove, {passive: false});
window.addEventListener('touchend', handleUp);

function getEffectiveCharges() {
    let list = [];

    for (let c of charges) {
        list.push({ x: c.x, y: c.y, q: c.q });
    }

    for (let p of plates) {
        const N = 25;
        let dx = p.x2 - p.x1;
        let dy = p.y2 - p.y1;
        for (let i = 0; i < N; i++) {
            let t = (i + 0.5) / N;
            list.push({
                x: p.x1 + dx * t,
                y: p.y1 + dy * t,
                q: p.q / N
            });
        }
    }
    return list;
}

function getField(x, y) {
    let Ex = 0;
    let Ey = 0;
    let eff = getEffectiveCharges();

    for (let c of eff) {
        let dx = x - c.x;
        let dy = y - c.y;
        let r2 = dx*dx + dy*dy;

        if (r2 < 120) continue;

        let r = Math.sqrt(r2);
        let E_mag = (k * c.q) / r2;

        Ex += E_mag * (dx / r);
        Ey += E_mag * (dy / r);
    }

    let mag = Math.sqrt(Ex*Ex + Ey*Ey);
    return { Ex, Ey, mag };
}

function drawVectorField(w, h) {
    const step = 40;

    for (let x = step/2; x < w; x += step) {
        for (let y = step/2; y < h; y += step) {
            let field = getField(x, y);
            if (field.mag < 0.1) continue;

            let drawLen = Math.min(step * 0.45, 5 + Math.log(field.mag + 1) * 3);
            let angle = Math.atan2(field.Ey, field.Ex);
            let alpha = Math.min(0.7, field.mag / 20);
            if (alpha < 0.08) continue;

            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1.5;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            ctx.beginPath();
            ctx.moveTo(-drawLen/2, 0);
            ctx.lineTo(drawLen/2, 0);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(drawLen/2, 0);
            ctx.lineTo(drawLen/2 - 4, -3);
            ctx.lineTo(drawLen/2 - 4, 3);
            ctx.fill();

            ctx.restore();
        }
    }
}

function drawPotentialGlow(w, h) {
    ctx.globalCompositeOperation = 'screen';
    let eff = getEffectiveCharges();

    for (let c of eff) {
        let radius = 35 + Math.abs(c.q) * 8;
        let grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, radius);

        let baseColor = c.q > 0 ? '255, 71, 87' : '0, 210, 255';
        let intensity = Math.min(1.0, Math.abs(c.q) / 2);

        grad.addColorStop(0, `rgba(${baseColor}, ${0.15 * intensity})`);
        grad.addColorStop(1, `rgba(${baseColor}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
}

function drawCharges() {
    for (let c of charges) {
        ctx.beginPath();
        let r = 11 + Math.sqrt(Math.abs(c.q));
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2);

        ctx.fillStyle = c.q > 0 ? colors.pos : (c.q < 0 ? colors.neg : '#999');

        ctx.shadowBlur = 20;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#000';
        ctx.font = `bold ${r}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.q > 0 ? '+' : (c.q < 0 ? '−' : ''), c.x, c.y);

        if (selectedCharge && selectedCharge.id === c.id && selectedCharge.type !== 'plate') {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}

function drawPlates() {
    for (let p of plates) {
        ctx.beginPath();
        ctx.moveTo(p.x1, p.y1);
        ctx.lineTo(p.x2, p.y2);
        ctx.strokeStyle = p.q > 0 ? colors.pos : colors.neg;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';

        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.stroke();
        ctx.shadowBlur = 0;

        let dist = Math.sqrt((p.x2 - p.x1)**2 + (p.y2 - p.y1)**2);
        let step = 20;
        let numSigns = Math.max(2, Math.floor(dist / step));
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let dx = p.x2 - p.x1;
        let dy = p.y2 - p.y1;

        for (let i = 0; i < numSigns; i++) {
            let t = (i + 0.5) / numSigns;
            let sx = p.x1 + dx * t;
            let sy = p.y1 + dy * t;
            ctx.fillText(p.q > 0 ? '+' : '−', sx, sy);
        }

        if (selectedCharge && selectedCharge.id === p.id) {
            ctx.beginPath();
            ctx.arc(p.x1, p.y1, 6, 0, Math.PI * 2);
            ctx.arc(p.x2, p.y2, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#000';
            ctx.stroke();
        }
    }

    if (isDrawingPlate) {
        ctx.beginPath();
        ctx.moveTo(plateStartX, plateStartY);
        ctx.lineTo(plateEndX, plateEndY);
        ctx.strokeStyle = (currentTool === 'add-plate-pos') ? colors.pos : colors.neg;
        ctx.lineWidth = 6;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function drawForces() {
    for (let i = 0; i < charges.length; i++) {
        let c1 = charges[i];
        let Fx = 0;
        let Fy = 0;

        for (let j = 0; j < charges.length; j++) {
            if (i === j) continue;
            let c2 = charges[j];

            let dx = c1.x - c2.x;
            let dy = c1.y - c2.y;
            let r2 = dx*dx + dy*dy;
            if (r2 < 120) continue;

            let r = Math.sqrt(r2);
            let F_mag = (k * c1.q * c2.q) / r2;

            Fx += F_mag * (dx / r);
            Fy += F_mag * (dy / r);
        }

        let effPlates = [];
        for (let p of plates) {
            const N = 25;
            let pDx = p.x2 - p.x1;
            let pDy = p.y2 - p.y1;
            for (let s = 0; s < N; s++) {
                let t = (s + 0.5) / N;
                effPlates.push({
                    x: p.x1 + pDx * t,
                    y: p.y1 + pDy * t,
                    q: p.q / N
                });
            }
        }

        for (let s of effPlates) {
            let dx = c1.x - s.x;
            let dy = c1.y - s.y;
            let r2 = dx*dx + dy*dy;
            if (r2 < 120) continue;
            let r = Math.sqrt(r2);
            let F_mag = (k * c1.q * s.q) / r2;
            Fx += F_mag * (dx / r);
            Fy += F_mag * (dy / r);
        }

        drawForceArrow(c1.x, c1.y, Fx, Fy, 11 + Math.sqrt(Math.abs(c1.q)));
    }

    for (let p of plates) {
        let Fx = 0;
        let Fy = 0;
        const N = 25;
        let dx = p.x2 - p.x1;
        let dy = p.y2 - p.y1;
        let qSeg = p.q / N;

        for (let i = 0; i < N; i++) {
            let t = (i + 0.5) / N;
            let sx = p.x1 + dx * t;
            let sy = p.y1 + dy * t;

            for (let c of charges) {
                let rDx = sx - c.x;
                let rDy = sy - c.y;
                let r2 = rDx*rDx + rDy*rDy;
                if (r2 < 120) continue;
                let r = Math.sqrt(r2);
                let F_mag = (k * qSeg * c.q) / r2;
                Fx += F_mag * (rDx / r);
                Fy += F_mag * (rDy / r);
            }

            for (let other of plates) {
                if (other.id === p.id) continue;
                let oDx = other.x2 - other.x1;
                let oDy = other.y2 - other.y1;
                let oQSeg = other.q / N;

                for (let j = 0; j < N; j++) {
                    let oT = (j + 0.5) / N;
                    let oSx = other.x1 + oDx * oT;
                    let oSy = other.y1 + oDx * oT;

                    let rDx = sx - oSx;
                    let rDy = sy - oSy;
                    let r2 = rDx*rDx + rDy*rDy;
                    if (r2 < 120) continue;
                    let r = Math.sqrt(r2);
                    let F_mag = (k * qSeg * oQSeg) / r2;
                    Fx += F_mag * (rDx / r);
                    Fy += F_mag * (rDy / r);
                }
            }
        }

        let cx = (p.x1 + p.x2) / 2;
        let cy = (p.y1 + p.y2) / 2;
        drawForceArrow(cx, cy, Fx, Fy, 6);
    }
}

function drawForceArrow(cx, cy, Fx, Fy, offset) {
    let mag = Math.sqrt(Fx*Fx + Fy*Fy);
    if (mag > 0.15) {
        let drawLen = Math.min(150, 18 + mag * 1.8);
        let angle = Math.atan2(Fy, Fx);

        let startX = cx + Math.cos(angle) * offset;
        let startY = cy + Math.sin(angle) * offset;

        ctx.strokeStyle = colors.force;
        ctx.fillStyle = colors.force;
        ctx.lineWidth = 3;

        drawArrow(startX, startY, startX + Math.cos(angle) * drawLen, startY + Math.sin(angle) * drawLen, colors.force);

        if (toggles.forces.checked && mag > 4) {
            ctx.fillStyle = colors.force;
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText('F', startX + Math.cos(angle) * (drawLen + 10), startY + Math.sin(angle) * (drawLen + 10));
        }
    }
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
    ctx.lineWidth = 2.5;
    ctx.stroke();
}

function draw() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.clearRect(0, 0, w, h);

    if (toggles.glow.checked) drawPotentialGlow(w, h);
    if (toggles.field.checked) drawVectorField(w, h);
    if (toggles.forces.checked) drawForces();

    drawPlates();
    drawCharges();
}

window.addEventListener('DOMContentLoaded', () => {
    resize();
});

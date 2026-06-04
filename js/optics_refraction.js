function tryUnlock(achKey) {
    if (typeof window.unlockAchievement === 'function') {
        window.unlockAchievement(achKey);
    } else if (typeof parent !== 'undefined' && typeof parent.unlockAchievement === 'function') {
        parent.unlockAchievement(achKey);
    } else if (typeof unlockAchievement === 'function') {
        unlockAchievement(achKey);
    }
}

const COLOR_LASER = '#00e676';
const COLOR_REFRACT = '#81c995';
const COLOR_REFLECT = '#ba68c8';
const COLOR_NORMAL = 'rgba(255, 255, 255, 0.4)';
const COLOR_TEXT = '#ffffff';

let n1 = 1.00;
let n2 = 1.50;
let alphaDeg = 45;

let betaDeg = 0;
let isTIR = false;
let criticalAngle = 0;

const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');
const workspace = document.getElementById('workspace');

let scale = 1;
let cx = 0;
let cy = 0;

let offsetX = 0;
let offsetY = 0;

let isInitialized = false;
let laserRadiusBase = 250;

function resizeCanvas() {
    canvas.width = workspace.clientWidth;
    canvas.height = workspace.clientHeight;

    if (!isInitialized) {
        scale = Math.min(canvas.width, canvas.height) / 800;
        offsetX = 0;
        offsetY = 0;
        isInitialized = true;
    }

    cx = canvas.width / 2 + offsetX;
    cy = canvas.height / 2 + offsetY;

    draw();
}
window.addEventListener('resize', resizeCanvas);


function updatePhysics() {
    let alphaRad = alphaDeg * (Math.PI / 180);
    let sinBeta = (n1 / n2) * Math.sin(alphaRad);

    if (Math.abs(sinBeta) >= 1) {
        isTIR = true;
        betaDeg = 0;
        tryUnlock('TOTAL_REFLECTION');
    } else {
        isTIR = false;
        betaDeg = Math.asin(sinBeta) * (180 / Math.PI);
    }

    if (n1 > n2) {
        criticalAngle = Math.asin(n2 / n1) * (180 / Math.PI);
    } else {
        criticalAngle = 0;
    }

    updateUI();
}

function updateUI() {
    let typeEl = document.getElementById('stat-type');
    let critContainer = document.getElementById('math-critical-container');

    if (isTIR) {
        typeEl.innerText = "Полное внутреннее отражение!";
        typeEl.style.color = "#f28b82";
    } else {
        typeEl.innerText = `Преломление: β = ${betaDeg.toFixed(1)}°`;
        typeEl.style.color = "var(--accent-green)";
    }

    if (typeof katex !== 'undefined') {
        let angleVal = alphaDeg.toFixed(0);
        let refractVal = betaDeg.toFixed(1);

        let finalFormula = isTIR ?
            `n_1 \\sin(\\alpha) = n_2 \\sin(\\beta) \\implies \\text{ПВО}` :
            `n_1 \\sin(\\alpha) = n_2 \\sin(\\beta) \\implies \\beta \\approx ${refractVal}^\\circ`;

        let combinedFormula = `\\begin{gathered} \\gamma = \\alpha = ${angleVal}^\\circ \\\\[0.3em] ${finalFormula} \\end{gathered}`;

        katex.render(combinedFormula, document.getElementById('math-snell-formula'), { throwOnError: false });

        if (n1 > n2) {
            critContainer.style.display = "block";
            let critTex = `\\alpha_{\\text{кр}} = \\arcsin\\left(\\frac{n_2}{n_1}\\right) \\approx ${criticalAngle.toFixed(1)}^\\circ`;
            katex.render(critTex, document.getElementById('math-critical-formula'), { throwOnError: false });
        } else {
            critContainer.style.display = "none";
        }
    }
}

function drawLine(x1, y1, x2, y2, color, width, dashed = false) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (dashed) ctx.setLineDash([5, 5]);
    else ctx.setLineDash([]);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawAngleArc(x, y, radius, startAngle, endAngle, color, label) {
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, startAngle > endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    let midAngle = (startAngle + endAngle) / 2;
    let textX = x + (radius + 15) * Math.cos(midAngle);
    let textY = y + (radius + 15) * Math.sin(midAngle);

    ctx.fillStyle = color;
    ctx.font = "italic bold 16px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, textX, textY);
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let op1 = Math.min((n1 - 1) * 0.2, 0.5);
    let op2 = Math.min((n2 - 1) * 0.2, 0.5);

    ctx.fillStyle = `rgba(77, 208, 225, ${op1})`;
    ctx.fillRect(0, 0, canvas.width, cy);

    ctx.fillStyle = `rgba(100, 181, 246, ${op2})`;
    ctx.fillRect(0, cy, canvas.width, canvas.height - cy);

    drawLine(-canvas.width*5, cy, canvas.width*5, cy, '#ffffff', 2);
    drawLine(cx, -canvas.height*5, cx, canvas.height*5, COLOR_NORMAL, 1.5, true);

    let alphaRad = alphaDeg * (Math.PI / 180);
    let currentLaserRadius = laserRadiusBase * scale;

    let startX = cx - currentLaserRadius * Math.sin(alphaRad);
    let startY = cy - currentLaserRadius * Math.cos(alphaRad);


    drawLine(startX, startY, cx, cy, COLOR_LASER, 3);

    ctx.beginPath();
    ctx.arc(startX, startY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = COLOR_LASER;
    ctx.stroke();
    ctx.shadowColor = COLOR_LASER;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(startX, startY, 4, 0, Math.PI * 2);
    ctx.fillStyle = COLOR_LASER;
    ctx.fill();
    ctx.shadowBlur = 0;

    let reflectX = cx + canvas.width * Math.sin(alphaRad);
    let reflectY = cy - canvas.width * Math.cos(alphaRad);
    let reflectWidth = isTIR ? 3 : 1.5;
    let reflectColor = isTIR ? COLOR_LASER : COLOR_REFLECT;
    drawLine(cx, cy, reflectX, reflectY, reflectColor, reflectWidth);

    if (!isTIR) {
        let betaRad = betaDeg * (Math.PI / 180);
        let refractX = cx + canvas.width * Math.sin(betaRad);
        let refractY = cy + canvas.width * Math.cos(betaRad);
        drawLine(cx, cy, refractX, refractY, COLOR_REFRACT, 3);

        drawAngleArc(cx, cy, 60 * scale, Math.PI/2, Math.PI/2 - betaRad, COLOR_REFRACT, "β");
    }

    drawAngleArc(cx, cy, 50 * scale, -Math.PI/2, -Math.PI/2 - alphaRad, COLOR_LASER, "α");

    drawAngleArc(cx, cy, 40 * scale, -Math.PI/2, -Math.PI/2 + alphaRad, COLOR_REFLECT, "γ");
}


let isDraggingLaser = false;
let isPanning = false;
let lastMouseX = 0;
let lastMouseY = 0;

window.syncInputs = function(targetId, value) {
    let baseName = targetId.split('-')[1];

    let rangeInput = document.getElementById('input-' + baseName);
    let numInput = document.getElementById('num-' + baseName);

    if (rangeInput) rangeInput.value = value;
    if (numInput) numInput.value = value;

    if (baseName === 'n1') n1 = parseFloat(value);
    if (baseName === 'n2') n2 = parseFloat(value);
    if (baseName === 'alpha') alphaDeg = parseFloat(value);

    updatePhysics();
    draw();
}

function getMousePos(e) {
    let rect = canvas.getBoundingClientRect();
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
}

function checkHover(e) {
    if (isDraggingLaser || isPanning) return;
    let pos = getMousePos(e);

    let alphaRad = alphaDeg * (Math.PI / 180);
    let currentLaserRadius = laserRadiusBase * scale;
    let startX = cx - currentLaserRadius * Math.sin(alphaRad);
    let startY = cy - currentLaserRadius * Math.cos(alphaRad);

    if (Math.hypot(pos.x - startX, pos.y - startY) < 25) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'grab';
    }
}

function startDrag(e) {
    let pos = getMousePos(e);

    let alphaRad = alphaDeg * (Math.PI / 180);
    let currentLaserRadius = laserRadiusBase * scale;
    let startX = cx - currentLaserRadius * Math.sin(alphaRad);
    let startY = cy - currentLaserRadius * Math.cos(alphaRad);

    if (Math.hypot(pos.x - startX, pos.y - startY) < 30) {
        isDraggingLaser = true;
        canvas.style.cursor = 'grabbing';
    } else {
        isPanning = true;
        lastMouseX = pos.x;
        lastMouseY = pos.y;
        canvas.style.cursor = 'grabbing';
    }

    let hint = document.getElementById('hint');
    if (hint) hint.style.display = 'none';
}

function drag(e) {
    if (!isDraggingLaser && !isPanning) {
        checkHover(e);
        return;
    }
    let pos = getMousePos(e);

    if (isDraggingLaser) {
        let dx = cx - pos.x;
        let dy = cy - pos.y;

        let angleRad = Math.atan2(dx, dy);
        let angleDeg = angleRad * (180 / Math.PI);

        if (angleDeg < 0) angleDeg = 0;
        if (angleDeg > 89) angleDeg = 89;

        alphaDeg = angleDeg;
        document.getElementById('input-alpha').value = alphaDeg.toFixed(0);
        document.getElementById('num-alpha').value = alphaDeg.toFixed(0);

        updatePhysics();
        draw();
    } else if (isPanning) {
        let dx = pos.x - lastMouseX;
        let dy = pos.y - lastMouseY;

        offsetX += dx;
        offsetY += dy;
        cx += dx;
        cy += dy;

        lastMouseX = pos.x;
        lastMouseY = pos.y;
        draw();
    }
}

function endDrag() {
    isDraggingLaser = false;
    isPanning = false;
    canvas.style.cursor = 'grab';
}

canvas.addEventListener('mousedown', startDrag);
canvas.addEventListener('mousemove', drag);
canvas.addEventListener('mouseup', endDrag);
canvas.addEventListener('mouseleave', endDrag);

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrag(e); }, {passive: false});
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); drag(e); }, {passive: false});
canvas.addEventListener('touchend', endDrag);

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    let pos = getMousePos(e);

    let zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    let newScale = scale * zoomFactor;

    if (newScale < 0.3) newScale = 0.3;
    if (newScale > 5.0) newScale = 5.0;

    let cmX = (pos.x - cx) / scale;
    let cmY = (pos.y - cy) / scale;

    cx = pos.x - cmX * newScale;
    cy = pos.y - cmY * newScale;

    offsetX = cx - canvas.width / 2;
    offsetY = cy - canvas.height / 2;
    scale = newScale;

    draw();
}, { passive: false });

setTimeout(() => {
    resizeCanvas();
    updatePhysics();
    draw();
}, 100);

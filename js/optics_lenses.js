function tryUnlock(achKey) {
    if (typeof window.unlockAchievement === 'function') {
        window.unlockAchievement(achKey);
    } else if (typeof parent !== 'undefined' && typeof parent.unlockAchievement === 'function') {
        parent.unlockAchievement(achKey);
    } else if (typeof unlockAchievement === 'function') {
        unlockAchievement(achKey);
    }
}

const COLOR_BLUE = '#8ab4f8';
const COLOR_ORANGE = '#ffb74d';
const COLOR_GREEN = '#81c995';
const COLOR_RAY = 'rgba(255, 255, 255, 0.45)';

let lensSign = 1;
let F_cm = 20;
let d_cm = 40;
let h_cm = 15;

let f_cm = 0;
let H_cm = 0;

const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');
const workspace = document.getElementById('workspace');

let pixelsPerCm = 10;
let cx = 0;
let cy = 0;

let offsetX = 0;
let offsetY = 0;
let isInitialized = false;

function resizeCanvas() {
    canvas.width = workspace.clientWidth;
    canvas.height = workspace.clientHeight;

    if (!isInitialized) {
        pixelsPerCm = Math.max(canvas.width / 140, 5);
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
    let F_actual = F_cm * lensSign;

    if (Math.abs(d_cm - F_actual) < 0.1 && lensSign === 1) {
        f_cm = 99999;
        H_cm = 99999;
    } else {
        f_cm = (d_cm * F_actual) / (d_cm - F_actual);
        H_cm = -h_cm * (f_cm / d_cm);
    }

    updateUI();
}

function updateUI() {
    document.getElementById('stat-d').innerText = d_cm.toFixed(1) + " см";

    let f_text = (f_cm > 10000) ? "∞" : Math.abs(f_cm).toFixed(1) + " см";
    document.getElementById('stat-f').innerText = f_text;

    let typeEl = document.getElementById('stat-type');
    if (f_cm > 10000) {
        typeEl.innerText = "Изображение уходит в бесконечность";
        typeEl.style.color = "var(--text-muted)";
    } else {
        let isReal = f_cm > 0;
        let isInverted = H_cm < 0;
        let sizeStr = Math.abs(H_cm) > h_cm ? "увеличенное" : (Math.abs(H_cm) < h_cm ? "уменьшенное" : "равное по величине");

        typeEl.innerText = `${isReal ? "Действительное" : "Мнимое"}, ${isInverted ? "перевернутое" : "прямое"}, ${sizeStr}`;
        typeEl.style.color = isReal ? "var(--accent-green)" : "#e8eaed";
    }

    if (typeof katex !== 'undefined') {
        let F_str = lensSign === 1 ? F_cm : `-${F_cm}`;
        let sign_f = f_cm > 0 ? "+" : "-";
        let val_f = f_cm > 10000 ? "\\infty" : Math.abs(f_cm).toFixed(1);

        let texFormula = `\\frac{1}{F} = \\frac{1}{d} + \\frac{1}{f} \\implies \\frac{1}{${F_str}} = \\frac{1}{${d_cm.toFixed(1)}} ${sign_f} \\frac{1}{${val_f}}`;
        katex.render(texFormula, document.getElementById('math-lens-formula'), { throwOnError: false });

        let Gamma = Math.abs(f_cm / d_cm);
        let texGamma = `\\Gamma = \\frac{|f|}{d} = \\frac{${val_f}}{${d_cm.toFixed(1)}} \\approx ${Gamma > 1000 ? "\\infty" : Gamma.toFixed(2)}`;
        katex.render(texGamma, document.getElementById('math-magnification-formula'), { throwOnError: false });
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

function drawArrowLine(x1, y1, x2, y2, color, width, dashed = false, doubleEnded = false) {
    drawLine(x1, y1, x2, y2, color, width, dashed);

    let angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 10 * Math.cos(angle - Math.PI / 6), y2 - 10 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - 10 * Math.cos(angle + Math.PI / 6), y2 - 10 * Math.sin(angle + Math.PI / 6));
    ctx.fillStyle = color;
    ctx.fill();

    if (doubleEnded) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + 10 * Math.cos(angle - Math.PI / 6), y1 + 10 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x1 + 10 * Math.cos(angle + Math.PI / 6), y1 + 10 * Math.sin(angle + Math.PI / 6));
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function drawDimension(xStart, xEnd, yOffset, text, color) {
    let y = cy + yOffset;

    drawLine(xStart, cy, xStart, y + (yOffset > 0 ? 5 : -5), 'rgba(255,255,255,0.15)', 1);
    drawLine(xEnd, cy, xEnd, y + (yOffset > 0 ? 5 : -5), 'rgba(255,255,255,0.15)', 1);

    drawArrowLine(xStart + 2, y, xEnd - 2, y, color, 1.5, false, true);

    ctx.fillStyle = color;
    ctx.font = "italic bold 18px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, (xStart + xEnd) / 2, y + (yOffset > 0 ? 20 : -10));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLine(-canvas.width * 5, cy, canvas.width * 5, cy, '#555', 2);

    let lensHeight = Math.max(Math.abs(h_cm), Math.abs(H_cm)) * pixelsPerCm + 40;
    lensHeight = Math.min(lensHeight, canvas.height / 2 - 20);
    drawLine(cx, cy - lensHeight, cx, cy + lensHeight, '#ccc', 3);

    let lY = cy - lensHeight;
    let dir = lensSign;

    ctx.beginPath();
    ctx.moveTo(cx, lY); ctx.lineTo(cx - 8, lY + 12 * dir);
    ctx.moveTo(cx, lY); ctx.lineTo(cx + 8, lY + 12 * dir);

    lY = cy + lensHeight;
    ctx.moveTo(cx, lY); ctx.lineTo(cx - 8, lY - 12 * dir);
    ctx.moveTo(cx, lY); ctx.lineTo(cx + 8, lY - 12 * dir);
    ctx.strokeStyle = '#ccc'; ctx.lineWidth = 3; ctx.stroke();

    let F_px = F_cm * pixelsPerCm;
    ctx.fillStyle = COLOR_BLUE;
    ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";

    ctx.beginPath(); ctx.arc(cx - F_px, cy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillText("F", cx - F_px, cy + 22);

    ctx.beginPath(); ctx.arc(cx - 2 * F_px, cy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillText("2F", cx - 2 * F_px, cy + 22);

    ctx.beginPath(); ctx.arc(cx + F_px, cy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillText("F", cx + F_px, cy + 22);

    ctx.beginPath(); ctx.arc(cx + 2 * F_px, cy, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillText("2F", cx + 2 * F_px, cy + 22);

    let objX = cx - d_cm * pixelsPerCm;
    let objY = cy - h_cm * pixelsPerCm;
    drawArrowLine(objX, cy, objX, objY, COLOR_ORANGE, 4);

    ctx.fillStyle = COLOR_ORANGE;
    ctx.font = "italic bold 18px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("h", objX - 12, cy - (h_cm * pixelsPerCm) / 2 + 6);

    if (f_cm < 10000) {
        let imgX = cx + f_cm * pixelsPerCm;
        let imgY = cy - H_cm * pixelsPerCm;

        drawArrowLine(imgX, cy, imgX, imgY, COLOR_GREEN, 4, f_cm < 0);

        ctx.fillStyle = COLOR_GREEN;
        ctx.font = "italic bold 18px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("H", imgX + 12, cy - (H_cm * pixelsPerCm) / 2 + 6);
    }

    if (f_cm < 10000) {
        let imgX = cx + f_cm * pixelsPerCm;
        let imgY = cy - H_cm * pixelsPerCm;

        drawLine(objX, objY, cx, objY, COLOR_RAY, 1.5);

        if (lensSign === 1) {
            if (f_cm > 0) {
                drawArrowLine(cx, objY, imgX, imgY, COLOR_RAY, 1.5);
                drawLine(imgX, imgY, cx + (imgX - cx) * 5, cy - (H_cm * pixelsPerCm) * 5, COLOR_RAY, 1.5);
            } else {
                drawLine(cx, objY, cx + F_px * 5, cy + (cx + F_px * 5 - cx) * (cy - objY) / F_px, COLOR_RAY, 1.5);
                drawLine(cx, objY, imgX, imgY, COLOR_RAY, 1.5, true);
            }
        } else {
            let angle = Math.atan2(objY - cy, cx - (cx - F_px));
            let rayLength = canvas.width * 5;
            drawArrowLine(cx, objY, cx + rayLength * Math.cos(angle), objY + rayLength * Math.sin(angle), COLOR_RAY, 1.5);
            drawLine(cx, objY, imgX, imgY, COLOR_RAY, 1.5, true);
        }

        if (f_cm > 0) {
            drawArrowLine(objX, objY, imgX, imgY, COLOR_RAY, 1.5);
        } else {
            drawLine(objX, objY, cx + (cx - objX), cy + (cy - objY), COLOR_RAY, 1.5);
            drawLine(objX, objY, imgX, imgY, COLOR_RAY, 1.5, true);
        }
    }

    drawDimension(objX, cx, -40, "d", COLOR_ORANGE);
    drawDimension(cx - F_px, cx, 40, "F", COLOR_BLUE);

    if (f_cm < 10000 && Math.abs(f_cm) > 1) {
        let imgX = cx + f_cm * pixelsPerCm;
        let fOffset = (f_cm < 0 && Math.abs(f_cm) <= F_cm) ? 75 : 40;
        drawDimension(cx, imgX, fOffset, "f", COLOR_GREEN);
    }
}

let isDragging = false;
let isPanning = false;
let lastMouseX = 0;
let lastMouseY = 0;

function syncInputs(targetId, value) {
    document.getElementById(targetId).value = value;
    if (targetId.includes('F')) {
        F_cm = parseFloat(value);
        tryUnlock('LENS_FOCUS');
    }
    if (targetId.includes('h')) h_cm = parseFloat(value);

    updatePhysics();
    draw();
}

function setLensType(sign) {
    lensSign = sign;
    document.getElementById('btn-lens-converge').classList.toggle('active', sign === 1);
    document.getElementById('btn-lens-diverge').classList.toggle('active', sign === -1);

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
    if (isDragging || isPanning) return;
    let pos = getMousePos(e);
    let objX = cx - d_cm * pixelsPerCm;

    if (Math.abs(pos.x - objX) < 20) {
        canvas.style.cursor = 'ew-resize';
    } else {
        canvas.style.cursor = 'grab';
    }
}

function startDrag(e) {
    let pos = getMousePos(e);
    let objX = cx - d_cm * pixelsPerCm;

    if (Math.abs(pos.x - objX) < 30) {
        isDragging = true;
        canvas.style.cursor = 'ew-resize';
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
    if (!isDragging && !isPanning) {
        checkHover(e);
        return;
    }
    let pos = getMousePos(e);

    if (isDragging) {
        let new_d = (cx - pos.x) / pixelsPerCm;

        if (new_d < 5) new_d = 5;
        if (new_d > 100) new_d = 100;

        d_cm = new_d;
        updatePhysics();
        draw();

        tryUnlock('LENS_FOCUS');
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
    isDragging = false;
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
    let newPixelsPerCm = pixelsPerCm * zoomFactor;

    if (newPixelsPerCm < 2) newPixelsPerCm = 2;
    if (newPixelsPerCm > 150) newPixelsPerCm = 150;

    let cmX = (pos.x - cx) / pixelsPerCm;
    let cmY = (pos.y - cy) / pixelsPerCm;

    cx = pos.x - cmX * newPixelsPerCm;
    cy = pos.y - cmY * newPixelsPerCm;

    offsetX = cx - canvas.width / 2;
    offsetY = cy - canvas.height / 2;
    pixelsPerCm = newPixelsPerCm;

    draw();
}, { passive: false });

setTimeout(() => {
    resizeCanvas();
    updatePhysics();
    draw();
}, 100);

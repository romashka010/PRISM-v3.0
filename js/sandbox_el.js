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
const tooltip = document.getElementById('tooltip');

const colors = {
    grid: 'rgba(255, 255, 255, 0.03)',
    wire: '#b2bec3',
    switch: '#eccc68',
    lamp: '#ffbe0b',
    resistor: '#ff9f43',
    rheostat: '#a855f7',
    fuse: '#d1ccc0',
    fuseBurnt: '#ff4757',
    battery: '#ff4757',
    batteryDamaged: '#d63031',
    ammeter: '#2ed573',
    voltmeter: '#00d2ff',
    node: '#ffffff',
    electron: '#8ab4f8',
    highlight: '#ffffff',
    bg: '#050509'
};

let currentTool = 'wire';
let components = [];
let nextCompId = 1;

let isDrawing = false;
let drawStartPoint = null;
let currentMousePos = { x: 0, y: 0 };

let selectedComponent = null;
let isDraggingComp = false;
let dragType = null;
let dragOffset = { x: 0, y: 0 };

let electronOffset = 0;
let shortCircuitState = false;

let circuitState = {
    totalR_ext: 0,
    rInt: 0
};

const editorPanel = document.getElementById('editor-panel');
const editorTitle = document.getElementById('editor-title');
const editorInfo = document.getElementById('editor-info');
const gR = document.getElementById('editor-R');
const gE = document.getElementById('editor-E');
const gRInt = document.getElementById('editor-r-int');
const gImax = document.getElementById('editor-Imax');

const inputs = {
    R: document.getElementById('input-R'),
    E: document.getElementById('input-E'),
    rInt: document.getElementById('input-r-int'),
    Imax: document.getElementById('input-Imax')
};
const nums = {
    R: document.getElementById('num-R'),
    E: document.getElementById('num-E'),
    rInt: document.getElementById('num-r-int'),
    Imax: document.getElementById('num-Imax')
};

document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.tool;

        selectedComponent = null;
        updateEditorPanel();

        if (currentTool === 'move') canvas.style.cursor = 'grab';
        else if (currentTool === 'delete') canvas.style.cursor = 'crosshair';
        else canvas.style.cursor = 'crosshair';

        draw();
    });
});

document.getElementById('btn-clear').addEventListener('click', () => {
    components = [];
    selectedComponent = null;
    shortCircuitState = false;
    updateEditorPanel();
    solveCircuit();
});

function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = wrapper.getBoundingClientRect();
    if (rect.width === 0) { setTimeout(resize, 50); return; }

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    draw();
}
window.addEventListener('resize', resize);

function syncEditor(key, value, source) {
    if (!selectedComponent) return;
    let val = parseFloat(value);
    if (isNaN(val)) return;

    if (key === 'R') selectedComponent.R = val;
    if (key === 'E') selectedComponent.E = val;
    if (key === 'rInt') selectedComponent.rInt = val;
    if (key === 'Imax') selectedComponent.Imax = val;

    if (source !== 'slider') inputs[key].value = val;
    if (source !== 'num') nums[key].value = val;

    solveCircuit();
}

for (let key in inputs) {
    inputs[key].addEventListener('input', (e) => syncEditor(key, e.target.value, 'slider'));
    nums[key].addEventListener('input', (e) => {
        if (e.target.value !== '') syncEditor(key, e.target.value, 'num');
    });
}

function updateEditorPanel() {
    if (!selectedComponent) {
        editorPanel.classList.add('hidden');
        return;
    }

    editorPanel.classList.remove('hidden');
    gR.classList.add('hidden');
    gE.classList.add('hidden');
    gRInt.classList.add('hidden');
    gImax.classList.add('hidden');
    editorInfo.innerText = "";

    let c = selectedComponent;
    if (c.type === 'resistor') {
        editorTitle.innerText = "⚙️ РЕЗИСТОР";
        editorPanel.style.borderLeftColor = colors.resistor;
        gR.classList.remove('hidden');
        inputs.R.value = c.R; nums.R.value = c.R;
        editorInfo.innerText = "Ограничивает силу тока в цепи, преобразуя электроэнергию в тепло.";
    } else if (c.type === 'rheostat') {
        editorTitle.innerText = "⚙️ РЕОСТАТ";
        editorPanel.style.borderLeftColor = colors.rheostat;
        gR.classList.remove('hidden');
        inputs.R.value = c.R; nums.R.value = c.R;
        editorInfo.innerText = "Переменный резистор. Позволяет вручную плавно регулировать сопротивление и силу тока.";
    } else if (c.type === 'switch') {
        editorTitle.innerText = "⚙️ КЛЮЧ";
        editorPanel.style.borderLeftColor = colors.switch;
        editorInfo.innerText = `Электрический выключатель. Состояние: ${c.closed ? 'ЗАМКНУТ (Проводит)' : 'РАЗОМКНУТ (Разрыв)'}. Кликните на него в режиме Перемещение, чтобы переключить.`;
    } else if (c.type === 'lamp') {
        editorTitle.innerText = "⚙️ ЛАМПА";
        editorPanel.style.borderLeftColor = colors.lamp;
        gR.classList.remove('hidden');
        inputs.R.value = c.R; nums.R.value = c.R;
        editorInfo.innerText = `Лампа накаливания. Светится тем ярче, чем больший ток через неё протекает. Сопротивление нити: ${c.R} Ом.`;
    } else if (c.type === 'fuse') {
        editorTitle.innerText = "⚙️ ПРЕДОХРАНИТЕЛЬ";
        editorPanel.style.borderLeftColor = c.burnt ? colors.fuseBurnt : colors.fuse;
        gImax.classList.remove('hidden');
        inputs.Imax.value = c.Imax; nums.Imax.value = c.Imax;
        editorInfo.innerText = c.burnt
            ? "ПЕРЕГОРЕЛ! Ток превысил лимит. Кликните по нему в режиме Перемещение, чтобы восстановить плавкую вставку."
            : `Защищает цепь. Расплавляется и разрывает контакт при превышении тока ${c.Imax} А.`;
    } else if (c.type === 'battery') {
        editorTitle.innerText = "⚙️ ИСТОЧНИК ЭДС";
        editorPanel.style.borderLeftColor = c.damaged ? colors.batteryDamaged : colors.battery;
        gE.classList.remove('hidden');
        gRInt.classList.remove('hidden');
        inputs.E.value = c.E; nums.E.value = c.E;
        inputs.rInt.value = c.rInt; nums.rInt.value = c.rInt;

        if (c.damaged) {
            editorInfo.innerText = "КОРОТКОЕ ЗАМЫКАНИЕ! Источник питания перегружен и заблокирован. Устраните причину КЗ (уберите лишний провод) и кликните на батарею, чтобы сбросить защиту.";
        } else {
            editorInfo.innerText = "Создает разность потенциалов. Длинная линия — плюс, короткая — минус.";
        }
    } else if (c.type === 'ammeter') {
        editorTitle.innerText = "⚙️ АМПЕРМЕТР";
        editorPanel.style.borderLeftColor = colors.ammeter;
        editorInfo.innerText = "Идеальный амперметр (R = 0 Ом). Подключается последовательно для измерения силы тока.";
    } else if (c.type === 'voltmeter') {
        editorTitle.innerText = "⚙️ ВОЛЬТМЕТР";
        editorPanel.style.borderLeftColor = colors.voltmeter;
        editorInfo.innerText = "Идеальный вольтметр (R = ∞). Подключается параллельно для измерения напряжения.";
    } else if (c.type === 'wire') {
        editorTitle.innerText = "⚙️ ПРОВОДНИК";
        editorPanel.style.borderLeftColor = colors.wire;
        editorInfo.innerText = "Идеальный провод. Соединяет узлы цепи без сопротивления.";
    }
}

function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
}

function snapToNode(pos, excludeCompId = null) {
    let snapRadius = 25;
    for (let c of components) {
        if (c.id === excludeCompId) continue;
        let d1 = Math.hypot(c.p1.x - pos.x, c.p1.y - pos.y);
        if (d1 < snapRadius) return { x: c.p1.x, y: c.p1.y };
        let d2 = Math.hypot(c.p2.x - pos.x, c.p2.y - pos.y);
        if (d2 < snapRadius) return { x: c.p2.x, y: c.p2.y };
    }
    return { x: pos.x, y: pos.y };
}

function distToSegment(p, v, w) {
    let l2 = (w.x - v.x)**2 + (w.y - v.y)**2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = Math.max(0, Math.min(1, ((p.x - v.x)*(w.x - v.x) + (p.y - v.y)*(w.y - v.y)) / l2));
    let proj = { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
    return Math.hypot(p.x - proj.x, p.y - proj.y);
}

function getComponentUnderCursor(pos) {
    for (let i = components.length - 1; i >= 0; i--) {
        let c = components[i];
        if (Math.hypot(c.p1.x - pos.x, c.p1.y - pos.y) < 15) return { comp: c, part: 'p1' };
        if (Math.hypot(c.p2.x - pos.x, c.p2.y - pos.y) < 15) return { comp: c, part: 'p2' };
        if (distToSegment(pos, c.p1, c.p2) < 15) return { comp: c, part: 'body' };
    }
    return null;
}

canvas.addEventListener('mousedown', (e) => {
    let pos = getPointerPos(e);
    let hit = getComponentUnderCursor(pos);

    if (currentTool === 'delete') {
        if (hit) {
            components = components.filter(c => c.id !== hit.comp.id);
            if (selectedComponent && selectedComponent.id === hit.comp.id) {
                selectedComponent = null;
                updateEditorPanel();
            }
            solveCircuit();
        }
        return;
    }

    if (currentTool === 'move') {
        if (hit) {
            selectedComponent = hit.comp;

            if (hit.part === 'body') {
                if (selectedComponent.type === 'switch') {
                    selectedComponent.closed = !selectedComponent.closed;
                    solveCircuit();
                } else if (selectedComponent.type === 'fuse' && selectedComponent.burnt) {
                    selectedComponent.burnt = false;
                    solveCircuit();
                } else if (selectedComponent.type === 'battery' && selectedComponent.damaged) {
                    selectedComponent.damaged = false;
                    shortCircuitState = false;
                    solveCircuit();
                }
            }

            updateEditorPanel();
            isDraggingComp = true;
            dragType = hit.part;
            if (dragType === 'body') {
                dragOffset.x = pos.x; dragOffset.y = pos.y;
            }
            canvas.style.cursor = 'grabbing';
        } else {
            selectedComponent = null;
            updateEditorPanel();
        }
        draw();
        return;
    }

    isDrawing = true;
    let startP = snapToNode(pos);
    drawStartPoint = startP;
    currentMousePos = pos;
});

window.addEventListener('mousemove', (e) => {
    let pos = getPointerPos(e);
    currentMousePos = pos;

    if (!isDrawing && !isDraggingComp && currentTool === 'move') {
        let hit = getComponentUnderCursor(pos);
        if (hit && hit.part === 'body') {
            tooltip.classList.remove('hidden');
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';

            let c = hit.comp;
            if (c.type === 'wire') tooltip.innerText = "Провод";
            else if (c.type === 'switch') tooltip.innerText = `Ключ: ${c.closed ? 'Замкнут' : 'Разомкнут'} (Кликни)`;
            else if (c.type === 'lamp') tooltip.innerText = `Лампа: ${c.R} Ом (Ток: ${Math.abs(c.current || 0).toFixed(2)} А)`;
            else if (c.type === 'resistor') tooltip.innerText = `Резистор: ${c.R} Ом`;
            else if (c.type === 'rheostat') tooltip.innerText = `Реостат: ${c.R} Ом`;
            else if (c.type === 'fuse') tooltip.innerText = c.burnt ? "Предохранитель: Перегорел! (Кликни)" : `Предохранитель: ${c.Imax} А`;
            else if (c.type === 'battery') {
                if (c.damaged) tooltip.innerText = "ИСТОЧНИК: КОРОТКОЕ ЗАМЫКАНИЕ! (Кликни для ремонта)";
                else tooltip.innerText = `ЭДС: ${c.E} В, r: ${c.rInt} Ом`;
            }
            else if (c.type === 'ammeter') tooltip.innerText = `Амперметр: ${c.current !== undefined ? Math.abs(c.current).toFixed(2) + ' А' : '0.00 А'}`;
            else if (c.type === 'voltmeter') tooltip.innerText = `Вольтметр: ${c.voltage !== undefined ? Math.abs(c.voltage).toFixed(2) + ' В' : '0.00 В'}`;
        } else {
            tooltip.classList.add('hidden');
        }
    } else {
        tooltip.classList.add('hidden');
    }

    if (isDrawing) {
        requestAnimationFrame(draw);
    } else if (isDraggingComp && selectedComponent) {
        if (dragType === 'p1') {
            selectedComponent.p1 = snapToNode(pos, selectedComponent.id);
        } else if (dragType === 'p2') {
            selectedComponent.p2 = snapToNode(pos, selectedComponent.id);
        } else if (dragType === 'body') {
            let dx = pos.x - dragOffset.x;
            let dy = pos.y - dragOffset.y;
            selectedComponent.p1.x += dx; selectedComponent.p1.y += dy;
            selectedComponent.p2.x += dx; selectedComponent.p2.y += dy;
            dragOffset.x = pos.x; dragOffset.y = pos.y;
        }
        solveCircuit();
    }
});

window.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        let endP = snapToNode(currentMousePos);
        if (Math.hypot(endP.x - drawStartPoint.x, endP.y - drawStartPoint.y) > 10) {
            let newComp = {
                id: nextCompId++,
                type: currentTool,
                p1: { x: drawStartPoint.x, y: drawStartPoint.y },
                p2: { x: endP.x, y: endP.y },
                current: 0,
                voltage: 0
            };
            if (currentTool === 'resistor' || currentTool === 'rheostat' || currentTool === 'lamp') newComp.R = 10;
            if (currentTool === 'battery') { newComp.E = 12; newComp.rInt = 1; newComp.damaged = false; }
            if (currentTool === 'switch') { newComp.closed = false; }
            if (currentTool === 'fuse') { newComp.Imax = 4.0; newComp.burnt = false; }

            components.push(newComp);
            solveCircuit();
        }
        isDrawing = false;
        drawStartPoint = null;
        draw();
    }

    if (isDraggingComp) {
        if (dragType === 'body') {
            selectedComponent.p1 = snapToNode(selectedComponent.p1, selectedComponent.id);
            selectedComponent.p2 = snapToNode(selectedComponent.p2, selectedComponent.id);
        }
        isDraggingComp = false;
        dragType = null;
        solveCircuit();
        canvas.style.cursor = 'grab';
    }
});

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); canvas.dispatchEvent(new MouseEvent('mousedown', {clientX: e.touches[0].clientX, clientY: e.touches[0].clientY})); }, {passive: false});
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); window.dispatchEvent(new MouseEvent('mousemove', {clientX: e.touches[0].clientX, clientY: e.touches[0].clientY})); }, {passive: false});
canvas.addEventListener('touchend', (e) => { e.preventDefault(); window.dispatchEvent(new MouseEvent('mouseup')); }, {passive: false});


function solveCircuit() {
    let nodes = [];
    let tolerance = 5;

    components.forEach(c => {
        let n1 = nodes.findIndex(n => Math.hypot(n.x - c.p1.x, n.y - c.p1.y) < tolerance);
        if (n1 === -1) { nodes.push({x: c.p1.x, y: c.p1.y}); n1 = nodes.length - 1; }
        c.node1 = n1;

        let n2 = nodes.findIndex(n => Math.hypot(n.x - c.p2.x, n.y - c.p2.y) < tolerance);
        if (n2 === -1) { nodes.push({x: c.p2.x, y: c.p2.y}); n2 = nodes.length - 1; }
        c.node2 = n2;
    });

    let N = nodes.length;
    const statusEl = document.getElementById('circuit-status');

    if (N < 2) {
        components.forEach(c => { c.current = 0; c.voltage = 0; });
        if (statusEl) {
            statusEl.innerText = "Ожидание сборки замкнутой цепи...";
            statusEl.style.color = "#888";
        }
        circuitState.totalR_ext = 0;
        circuitState.rInt = 0;
        renderTheoreticalLaTeX();
        return;
    }

    let size = N;
    let A = Array(size).fill(0).map(() => Array(size).fill(0));
    let Z = Array(size).fill(0);

    for (let i = 0; i < size; i++) A[i][i] = 1e-9;

    components.forEach(c => {
        let n1 = c.node1;
        let n2 = c.node2;
        let g = 0;
        let I_eq = 0;

        if (c.type === 'wire' || c.type === 'ammeter') {
            g = 10000;
        } else if (c.type === 'switch') {
            g = c.closed ? 10000 : 1e-9;
        } else if (c.type === 'fuse') {
            g = c.burnt ? 1e-9 : 10000;
        } else if (c.type === 'voltmeter') {
            g = 1e-6;
        } else if (c.type === 'resistor' || c.type === 'rheostat' || c.type === 'lamp') {
            g = 1 / (c.R || 1e-4);
        } else if (c.type === 'battery') {
            let r = c.rInt > 0 ? c.rInt : 1e-4;
            g = 1 / r;
            I_eq = c.damaged ? 0 : (c.E / r);
        }

        A[n1][n1] += g;
        A[n2][n2] += g;
        A[n1][n2] -= g;
        A[n2][n1] -= g;

        if (c.type === 'battery' && !c.damaged) {
            Z[n1] -= I_eq;
            Z[n2] += I_eq;
        }
    });

    for (let i = 0; i < size; i++) { A[0][i] = 0; A[i][0] = 0; }
    A[0][0] = 1;
    Z[0] = 0;

    let V = solveGaussian(A, Z);

    if (!V) {
        if (statusEl) {
            statusEl.innerText = "Ошибка вычислений (короткое замыкание / разрыв)";
            statusEl.style.color = 'var(--accent-red)';
        }
        circuitState.totalR_ext = 0;
        circuitState.rInt = 0;
        renderTheoreticalLaTeX();
        return;
    }

    let isClosedLoop = false;
    let fuseTriggered = false;
    let shortCircuitTriggered = false;

    components.forEach(c => {
        let v1 = V[c.node1];
        let v2 = V[c.node2];

        let i = 0;
        if (c.type === 'battery') {
            let dV = v2 - v1;
            let r = c.rInt > 0 ? c.rInt : 1e-4;
            i = c.damaged ? 0 : ((c.E - dV) / r);
            c.voltage = c.damaged ? 0 : dV;
        } else {
            let dV = v1 - v2;
            let g = 0;
            if (c.type === 'wire' || c.type === 'ammeter') g = 10000;
            else if (c.type === 'switch') g = c.closed ? 10000 : 1e-9;
            else if (c.type === 'fuse') g = c.burnt ? 1e-9 : 10000;
            else if (c.type === 'voltmeter') g = 1e-6;
            else if (c.type === 'resistor' || c.type === 'rheostat' || c.type === 'lamp') g = 1 / (c.R || 1e-4);

            i = dV * g;
            c.voltage = Math.abs(dV);
        }

        if (Math.abs(i) < 1e-3) i = 0;
        if (Math.abs(c.voltage) < 1e-3) c.voltage = 0;

        c.current = i;

        if (Math.abs(i) > 0.01) isClosedLoop = true;

        if (c.type === 'fuse' && !c.burnt && Math.abs(i) > c.Imax) {
            c.burnt = true;
            fuseTriggered = true;
            tryUnlock('FUSE_BURNT');
        }
    });

    let mainBattery = components.find(c => c.type === 'battery');
    if (mainBattery && !mainBattery.damaged && isClosedLoop) {
        let currentAbs = Math.abs(mainBattery.current);
        let totalR_ext = (mainBattery.E / currentAbs) - mainBattery.rInt;

        if (totalR_ext < 0.15 && currentAbs > 1.0) {
            mainBattery.damaged = true;
            shortCircuitState = true;
            shortCircuitTriggered = true;
            tryUnlock('SHORT_CIRCUIT');
        }
    }

    if (fuseTriggered || shortCircuitTriggered) {
        solveCircuit();
        updateEditorPanel();
        return;
    }

    let totalR_ext = 0;
    if (mainBattery && !mainBattery.damaged && Math.abs(mainBattery.current) > 0.005) {
        let currentAbs = Math.abs(mainBattery.current);
        totalR_ext = (mainBattery.E / currentAbs) - mainBattery.rInt;
        if (totalR_ext < 0) totalR_ext = 0;
    }

    if (statusEl) {
        if (shortCircuitState) {
            statusEl.innerText = "КОРОТКОЕ ЗАМЫКАНИЕ! НАЖМИТЕ НА ИСТОЧНИК ЧТОБЫ ВОССТАНОВИТЬ";
            statusEl.style.color = colors.batteryDamaged;
        } else if (isClosedLoop) {
            statusEl.innerText = "Цепь замкнута. Ток течет!";
            statusEl.style.color = colors.ammeter;
        } else {
            statusEl.innerText = "Цепь разорвана.";
            statusEl.style.color = colors.resistor;
        }
    }

    circuitState.totalR_ext = shortCircuitState ? 0 : totalR_ext;
    circuitState.rInt = mainBattery ? mainBattery.rInt : 0;
    renderTheoreticalLaTeX();
}

function solveGaussian(A, b) {
    let n = A.length;
    for (let i = 0; i < n; i++) {
        let maxEl = Math.abs(A[i][i]);
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > maxEl) {
                maxEl = Math.abs(A[k][i]);
                maxRow = k;
            }
        }

        let tmp = A[maxRow]; A[maxRow] = A[i]; A[i] = tmp;
        let tmpB = b[maxRow]; b[maxRow] = b[i]; b[i] = tmpB;

        if (Math.abs(A[i][i]) < 1e-10) continue;

        for (let k = i + 1; k < n; k++) {
            let c = -A[k][i] / A[i][i];
            for (let j = i; j < n; j++) {
                if (i === j) A[k][j] = 0;
                else A[k][j] += c * A[i][j];
            }
            b[k] += c * b[i];
        }
    }

    let x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        if (Math.abs(A[i][i]) < 1e-10) { x[i] = 0; continue; }
        x[i] = b[i] / A[i][i];
        for (let k = i - 1; k >= 0; k--) {
            b[k] -= A[k][i] * x[i];
        }
    }
    return x;
}


function drawComponent(c) {
    let dx = c.p2.x - c.p1.x;
    let dy = c.p2.y - c.p1.y;
    let angle = Math.atan2(dy, dx);
    let len = Math.hypot(dx, dy);

    let isSelected = (selectedComponent && selectedComponent.id === c.id);
    let glowColor = isSelected ? colors.highlight : null;
    let baseColor = colors[c.type];

    if (c.type === 'battery' && c.damaged) {
        baseColor = colors.batteryDamaged;
    }

    if (c.type === 'lamp' && c.current && Math.abs(c.current) > 0.02) {
        let intensity = Math.min(30, Math.abs(c.current) * 8);
        ctx.save();
        ctx.translate(c.p1.x, c.p1.y);
        ctx.rotate(angle);
        ctx.shadowBlur = intensity;
        ctx.shadowColor = colors.lamp;
        ctx.fillStyle = `rgba(255, 190, 11, ${Math.min(0.3, Math.abs(c.current) * 0.1)})`;
        ctx.beginPath();
        ctx.arc(len / 2, 0, 20 + intensity / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    if (c.type === 'battery' && c.damaged) {
        ctx.save();
        ctx.translate(c.p1.x, c.p1.y);
        ctx.rotate(angle);
        ctx.shadowBlur = 15 + Math.sin(electronOffset * 0.2) * 5;
        ctx.shadowColor = colors.batteryDamaged;
        ctx.fillStyle = 'rgba(214, 48, 49, 0.08)';
        ctx.beginPath();
        ctx.rect((len - 50)/2, -25, 50, 50);
        ctx.fill();
        ctx.restore();
    }

    ctx.save();
    ctx.translate(c.p1.x, c.p1.y);
    ctx.rotate(angle);

    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (glowColor) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = glowColor;
    }

    if (c.type === 'wire') {
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(len, 0);
        ctx.stroke();
    }
    else if (c.type === 'switch') {
        let gap = 30;
        let startX = (len - gap) / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(startX, 0);
        ctx.moveTo(startX + gap, 0); ctx.lineTo(len, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(startX, 0, 4, 0, Math.PI * 2);
        ctx.arc(startX + gap, 0, 4, 0, Math.PI * 2);
        ctx.fillStyle = colors.switch;
        ctx.fill();

        ctx.save();
        ctx.translate(startX, 0);
        if (!c.closed) {
            ctx.rotate(-Math.PI / 4);
        }
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(gap, 0);
        ctx.strokeStyle = colors.switch;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
    }
    else if (c.type === 'lamp') {
        let r = 16;
        let midX = len / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(midX - r, 0);
        ctx.moveTo(midX + r, 0); ctx.lineTo(len, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(midX, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = colors.bg;
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = colors.lamp;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(midX - 10, -10); ctx.lineTo(midX + 10, 10);
        ctx.moveTo(midX - 10, 10); ctx.lineTo(midX + 10, -10);
        ctx.stroke();
    }
    else if (c.type === 'resistor') {
        let zLen = 40;
        let startX = (len - zLen) / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(startX, 0);
        ctx.moveTo(startX + zLen, 0); ctx.lineTo(len, 0);
        ctx.stroke();

        ctx.fillStyle = colors.bg;
        ctx.fillRect(startX, -10, zLen, 20);
        ctx.strokeRect(startX, -10, zLen, 20);
    }
    else if (c.type === 'rheostat') {
        let zLen = 40;
        let startX = (len - zLen) / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(startX, 0);
        ctx.moveTo(startX + zLen, 0); ctx.lineTo(len, 0);
        ctx.stroke();

        ctx.fillStyle = colors.bg;
        ctx.fillRect(startX, -10, zLen, 20);
        ctx.strokeRect(startX, -10, zLen, 20);

        ctx.beginPath();
        ctx.moveTo(startX + zLen / 2, -22);
        ctx.lineTo(startX + zLen / 2, -10);
        ctx.strokeStyle = colors.rheostat;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(startX + 10, -22);
        ctx.lineTo(startX + zLen / 2, -22);
        ctx.stroke();
    }
    else if (c.type === 'fuse') {
        let zLen = 44;
        let startX = (len - zLen) / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(startX, 0);
        ctx.moveTo(startX + zLen, 0); ctx.lineTo(len, 0);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(startX, -8, zLen, 16);
        ctx.strokeRect(startX, -8, zLen, 16);

        if (!c.burnt) {
            ctx.beginPath();
            ctx.moveTo(startX, 0);
            ctx.quadraticCurveTo(startX + zLen/2, -4, startX + zLen, 0);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        } else {
            ctx.strokeStyle = colors.fuseBurnt;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(startX, 0); ctx.lineTo(startX + 10, -2);
            ctx.moveTo(startX + zLen, 0); ctx.lineTo(startX + zLen - 10, 2);
            ctx.stroke();
        }
    }
    else if (c.type === 'battery') {
        let gap = 12;
        let startX = (len - gap) / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(startX, 0);
        ctx.moveTo(startX, -15); ctx.lineTo(startX, 15);
        ctx.stroke();

        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(startX, -10); ctx.lineTo(startX, 10);
        ctx.stroke();

        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startX + gap, -20); ctx.lineTo(startX + gap, 20);
        ctx.moveTo(startX + gap, 0); ctx.lineTo(len, 0);
        ctx.stroke();

        ctx.fillStyle = baseColor;
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', startX + gap + 15, -15);
    }
    else if (c.type === 'ammeter' || c.type === 'voltmeter') {
        let r = 16;
        let midX = len / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(midX - r, 0);
        ctx.moveTo(midX + r, 0); ctx.lineTo(len, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(midX, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = colors.bg;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = baseColor;
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.type === 'ammeter' ? 'A' : 'V', midX, 0);
    }

    ctx.restore();

    let midX = (c.p1.x + c.p2.x) / 2;
    let midY = (c.p1.y + c.p2.y) / 2;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';

    let textOffset = 25;
    let nx = -dy / len;
    let ny = dx / len;

    let tX = midX + nx * textOffset;
    let tY = midY + ny * textOffset;

    if (c.type === 'resistor' || c.type === 'rheostat' || c.type === 'lamp') {
        ctx.fillText(`${c.R} Ом`, tX, tY);
    } else if (c.type === 'battery') {
        if (c.damaged) {
            ctx.fillStyle = colors.batteryBurnt;
            ctx.fillText("КЗ!", tX, tY);
        } else {
            ctx.fillText(`${c.E} В`, tX, tY);
        }
    } else if (c.type === 'fuse') {
        ctx.fillStyle = c.burnt ? colors.fuseBurnt : '#fff';
        ctx.fillText(c.burnt ? "FUSE" : `${c.Imax} A`, tX, tY);
    } else if (c.type === 'ammeter' && c.current !== undefined) {
        ctx.fillStyle = colors.ammeter;
        ctx.fillText(`${Math.abs(c.current).toFixed(2)} A`, tX, tY);
    } else if (c.type === 'voltmeter' && c.voltage !== undefined) {
        ctx.fillStyle = colors.voltmeter;
        ctx.fillText(`${Math.abs(c.voltage).toFixed(2)} В`, tX, tY);
    }

    ctx.fillStyle = colors.node;
    ctx.beginPath(); ctx.arc(c.p1.x, c.p1.y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(c.p2.x, c.p2.y, 4, 0, Math.PI * 2); ctx.fill();

    if (c.current && Math.abs(c.current) > 0.01 && c.type !== 'voltmeter' && !shortCircuitState) {
        ctx.save();
        ctx.fillStyle = colors.electron;
        ctx.shadowBlur = 8;
        ctx.shadowColor = colors.electron;

        let currentMag = Math.min(10, Math.abs(c.current));
        let step = 30;

        let direction = c.current > 0 ? 1 : -1;

        let localOffset = (electronOffset * currentMag * direction) % step;
        if (localOffset < 0) localOffset += step;

        for (let dist = localOffset; dist < len; dist += step) {
            let px = c.p1.x + (dx / len) * dist;
            let py = c.p1.y + (dy / len) * dist;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

function draw() {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    const gridStep = 40;
    for (let x = 0; x < w; x += gridStep) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += gridStep) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    components.forEach(c => drawComponent(c));

    if (isDrawing && drawStartPoint) {
        let snapP = snapToNode(currentMousePos);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(drawStartPoint.x, drawStartPoint.y);
        ctx.lineTo(snapP.x, snapP.y);
        ctx.stroke();
        ctx.setLineDash([]);

        if (snapP.x !== currentMousePos.x || snapP.y !== currentMousePos.y) {
            ctx.beginPath();
            ctx.arc(snapP.x, snapP.y, 8, 0, Math.PI * 2);
            ctx.strokeStyle = colors.highlight;
            ctx.stroke();
        }
    }
}

function animate() {
    electronOffset += 0.5;
    draw();
    requestAnimationFrame(animate);
}

function renderTheoreticalLaTeX() {
    if (typeof katex === 'undefined') return;

    const ohmFormulaEl = document.getElementById('math-ohm-formula');
    if (ohmFormulaEl) {
        katex.render("I = \\frac{\\varepsilon}{R_{\\text{внеш}} + r}", ohmFormulaEl, { throwOnError: false });
    }

    const rEqFormulaEl = document.getElementById('math-r-eq-formula');
    if (rEqFormulaEl) {
        let calculatedText = circuitState.totalR_ext > 0
            ? `R_{\\text{внеш}} \\approx ${circuitState.totalR_ext.toFixed(1)}\\text{ Ом}`
            : `R_{\\text{внеш}} = 0\\text{ Ом (цепь разорвана)}`;
        katex.render(calculatedText, rEqFormulaEl, { throwOnError: false });
    }

    const seriesFormulaEl = document.getElementById('math-series-formula');
    if (seriesFormulaEl) {
        katex.render("R_{\\text{послед}} = R_1 + R_2 + \\dots", seriesFormulaEl, { throwOnError: false });
    }

    const parallelFormulaEl = document.getElementById('math-parallel-formula');
    if (parallelFormulaEl) {
        katex.render("\\frac{1}{R_{\\text{пар}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots", parallelFormulaEl, { throwOnError: false });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    resize();
    setTimeout(resize, 100);

    components = [
        { id: 1, type: 'battery', p1: {x: 100, y: 300}, p2: {x: 100, y: 150}, E: 12, rInt: 1, damaged: false },
        { id: 2, type: 'switch', p1: {x: 100, y: 150}, p2: {x: 280, y: 150}, closed: true },
        { id: 3, type: 'fuse', p1: {x: 280, y: 150}, p2: {x: 440, y: 150}, Imax: 3.5, burnt: false },
        { id: 4, type: 'lamp', p1: {x: 440, y: 150}, p2: {x: 440, y: 300}, R: 8 },
        { id: 5, type: 'ammeter', p1: {x: 440, y: 300}, p2: {x: 100, y: 300} }
    ];
    nextCompId = 6;

    setTimeout(() => {
        solveCircuit();
    }, 150);

    animate();
});

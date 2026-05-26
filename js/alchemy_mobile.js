let savedProgress = localStorage.getItem('prismAlchemyProgress');
let inventory = savedProgress ? JSON.parse(savedProgress) : ['water', 'fire', 'earth', 'air','time'];

let slot1 = null;
let slot2 = null;
let currentFilter = 'all';
let isSynthesizing = false;

let slot1Element, slot2Element, reactionMessage, reactionPanel;
let inventoryElement, totalItemsElement, counterElement;
let infoIcon, infoName, infoDesc;

function initializeDOMElements() {
    slot1Element = document.getElementById('slot-1');
    slot2Element = document.getElementById('slot-2');
    reactionMessage = document.getElementById('reaction-message');
    reactionPanel = document.getElementById('reaction-panel');
    inventoryElement = document.getElementById('inventory');
    totalItemsElement = document.getElementById('total-items');
    counterElement = document.getElementById('counter');
    infoIcon = document.getElementById('info-icon');
    infoName = document.getElementById('info-name');
    infoDesc = document.getElementById('info-desc');
}

function renderInventory() {
    inventoryElement.innerHTML = '';
    totalItemsElement.innerText = Object.keys(db).length;
    counterElement.innerText = inventory.length;

    const filtered = inventory.filter(id => {
        if (!db[id]) return false;
        if (currentFilter === 'all') return true;
        if (currentFilter === 'tier1') return db[id].tier === 1;
        if (currentFilter === 'tier2') return db[id].tier === 2;
        if (currentFilter === 'tier3') return db[id].tier >= 3;
        return true;
    });

    filtered.sort((a, b) => db[a].name.localeCompare(db[b].name));

    filtered.forEach(id => {
        const element = db[id];
        const card = document.createElement('div');
        card.className = "flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-900/50 border border-white/5 active:border-emerald-500/50 active:scale-95 cursor-pointer transition-all text-center";
        card.onclick = () => selectElement(id);

        card.innerHTML = `
            <span class="text-3xl mb-1.5">${element.icon}</span>
            <span class="text-[10px] font-mono tracking-wider uppercase text-white font-bold block max-w-full truncate">${element.name}</span>
        `;
        inventoryElement.appendChild(card);
    });
}

function selectElement(id) {
    if (isSynthesizing) return;
    inspectElement(id);

    if (!slot1) {
        slot1 = id;
    } else if (!slot2) {
        slot2 = id;
    } else {
        slot1 = id;
        slot2 = null;
    }
    updateSlots();
}

function inspectElement(id) {
    if (!db[id]) return;
    const element = db[id];
    infoIcon.innerText = element.icon;
    infoName.innerText = `${element.name} (Уровень ${element.tier})`;
    infoDesc.innerText = element.desc;
}

function updateSlots() {
    if (slot1) {
        slot1Element.innerHTML = `
            <div class="reactor-ring absolute inset-0 rounded-full"></div>
            <span class="text-4xl z-10">${db[slot1].icon}</span>
            <span class="absolute -bottom-2.5 text-[9px] font-mono uppercase bg-neutral-950 px-2 py-0.5 rounded text-emerald-300 z-10 border border-white/5 font-bold">${db[slot1].name}</span>
        `;
        slot1Element.classList.remove('slot-float');
    } else {
        slot1Element.innerHTML = `
            <span class="text-[9px] font-mono text-neutral-500 uppercase font-bold">Слот 1</span>
        `;
        slot1Element.classList.add('slot-float');
    }

    if (slot2) {
        slot2Element.innerHTML = `
            <div class="reactor-ring absolute inset-0 rounded-full"></div>
            <span class="text-4xl z-10">${db[slot2].icon}</span>
            <span class="absolute -bottom-2.5 text-[9px] font-mono uppercase bg-neutral-950 px-2 py-0.5 rounded text-emerald-300 z-10 border border-white/5 font-bold">${db[slot2].name}</span>
        `;
        slot2Element.classList.remove('slot-float');
    } else {
        slot2Element.innerHTML = `
            <span class="text-[9px] font-mono text-neutral-500 uppercase font-bold">Слот 2</span>
        `;
        slot2Element.classList.add('slot-float');
    }

    if (!isSynthesizing && !reactionMessage.hasAttribute('data-locked')) {
        reactionPanel.className = "w-full py-3.5 mt-2 rounded-2xl bg-neutral-900/40 border border-white/5 flex items-center justify-center px-4 text-center";

        if (slot1 && slot2) {
            synthesize();
        } else if (slot1 || slot2) {
            reactionMessage.innerHTML = '<span class="text-emerald-400 font-bold animate-pulse text-[10px]">ОЖИДАНИЕ ВТОРОГО ЭЛЕМЕНТА...</span>';
        } else {
            reactionMessage.innerHTML = '<span class="text-neutral-400 text-[10px]">ВЫБЕРИТЕ ДВА ЭЛЕМЕНТА НИЖЕ</span>';
        }
    }
}

function resetSlot(num) {
    if (isSynthesizing) return;
    if (num === 1) slot1 = null;
    if (num === 2) slot2 = null;
    updateSlots();
}

function clearReactor() {
    if (isSynthesizing) return;
    slot1 = null;
    slot2 = null;
    reactionMessage.removeAttribute('data-locked');
    updateSlots();
}

function synthesize() {
    if (!slot1 || !slot2) return;
    isSynthesizing = true;

    const combination1 = `${slot1}+${slot2}`;
    const combination2 = `${slot2}+${slot1}`;
    const resultId = recipes[combination1] || recipes[combination2];

    reactionMessage.setAttribute('data-locked', 'true');
    reactionPanel.className = "w-full py-3.5 mt-2 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center px-4 text-center";
    reactionMessage.innerHTML = '<span class="text-emerald-400 animate-pulse text-[10px] tracking-widest font-bold">СИНТЕЗ...</span>';

    if ((combination1 === 'obsidian+water' || combination2 === 'obsidian+water') && typeof unlockAchievement !== 'undefined') {
        unlockAchievement('ALMOST_HELL');
    }

    setTimeout(() => {
        if (resultId) {
            const newElement = db[resultId];

            if (!inventory.includes(resultId)) {
                inventory.push(resultId);
                localStorage.setItem('prismAlchemyProgress', JSON.stringify(inventory));
                if (typeof showToast === 'function') {
                    showToast(newElement.icon, `Создан новый элемент: ${newElement.name}`);
                }

                if (typeof unlockAchievement !== 'undefined') {
                    unlockAchievement('FIRST_SYNTHESIS');
                    if (resultId === 'human') unlockAchievement('EVOLUTION_PEAK');
                    if (inventory.length === Object.keys(db).length) unlockAchievement('ALCHEMY_MASTER');
                }
            }

            inspectElement(resultId);
            reactionPanel.className = "w-full py-3.5 mt-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center px-4 text-center";
            reactionMessage.innerHTML = `<span class="text-white text-[10px] font-bold">ПОЛУЧЕН: <span class="text-emerald-400 font-extrabold">${newElement.name.toUpperCase()}</span></span>`;

            slot1 = resultId;
            slot2 = null;
        } else {
            reactionPanel.className = "w-full py-3.5 mt-2 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-center px-4 text-center";
            reactionMessage.innerHTML = '<span class="text-rose-400 font-bold text-[10px] tracking-widest">ЭЛЕМЕНТЫ НЕСОВМЕСТИМЫ</span>';
            slot1 = null;
            slot2 = null;
        }

        isSynthesizing = false;
        updateSlots();
        renderInventory();

        setTimeout(() => {
            if (!isSynthesizing) {
                reactionMessage.removeAttribute('data-locked');
                updateSlots();
            }
        }, 1500);

    }, 1000);
}

function filterInventory(filterType) {
    currentFilter = filterType;
    updateFilterButtonsUI();
    renderInventory();
}

function updateFilterButtonsUI() {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.className = "tab-btn px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-neutral-500 shrink-0";
    });

    const activeBtn = document.getElementById(`filter-${currentFilter}`);
    if (activeBtn) {
        activeBtn.className = "tab-btn px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-black bg-white shrink-0";
    }
}

let canvas, ctx, bubbles = [];
function initMobileBubbles() {
    canvas = document.getElementById('bubble-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Bubble {
        constructor() {
            this.reset();
            this.y = Math.random() * height;
        }
        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.radius = Math.random() * 1.5 + 0.3;
            this.speed = Math.random() * 0.35 + 0.1;
            this.opacity = Math.random() * 0.15 + 0.05;
            this.swing = Math.random() * 0.2 - 0.1;
            this.swingSpeed = Math.random() * 0.008 + 0.001;
            this.angle = Math.random() * Math.PI;
        }
        update() {
            this.y -= this.speed;
            this.angle += this.swingSpeed;
            this.x += Math.sin(this.angle) * this.swing;
            if (this.y < -15) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity})`;
            ctx.fill();
        }
    }

    bubbles = Array.from({ length: 25 }, () => new Bubble());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        bubbles.forEach(b => { b.update(); b.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

window.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    initMobileBubbles();
    renderInventory();
    updateSlots();
    updateFilterButtonsUI();
});

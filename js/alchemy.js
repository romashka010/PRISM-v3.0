let savedProgress = localStorage.getItem('prismAlchemyProgress');
let inventory = savedProgress ? JSON.parse(savedProgress) : ['water', 'fire', 'earth', 'air', 'time', 'void'];

let slot1 = null;
let slot2 = null;
let currentFilter = 'all';
let isSynthesizing = false;
let isLightMode = localStorage.getItem('prismAlchemyTheme') === 'light';

let themeToggleBtn, themeIcon, sunPath, moonPath;
let slot1Element, slot2Element, reactionMessage, reactionPanel;
let inventoryElement, totalItemsElement, counterElement;
let infoIcon, infoName, infoDesc;

function initializeDOMElements() {
    themeToggleBtn = document.getElementById('themeToggleBtn');
    themeIcon = document.getElementById('themeIcon');
    sunPath = document.getElementById('sun-path');
    moonPath = document.getElementById('moon-path');
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

function applyTheme() {
    if (isLightMode) {
        document.body.classList.add('light-theme');
        if (sunPath) sunPath.classList.remove('hidden');
        if (moonPath) moonPath.classList.add('hidden');
    } else {
        document.body.classList.remove('light-theme');
        if (sunPath) sunPath.classList.add('hidden');
        if (moonPath) moonPath.classList.remove('hidden');
    }
}

function handleThemeToggle() {
    isLightMode = !isLightMode;
    localStorage.setItem('prismAlchemyTheme', isLightMode ? 'light' : 'dark');
    applyTheme();
    updateFilterButtonsUI();
}

function renderInventory() {
    if (!inventoryElement) return;
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

    const activeLang = localStorage.getItem('prism_language') || 'ru';

    filtered.sort((a, b) => {
        const nameA = activeLang === 'ru' ? db[a].name : (db[a].nameEn || db[a].name);
        const nameB = activeLang === 'ru' ? db[b].name : (db[b].nameEn || db[b].name);
        return nameA.localeCompare(nameB);
    });

    filtered.forEach(id => {
        const element = db[id];
        const card = document.createElement('div');
        card.className = "flex flex-col items-center justify-center p-5 rounded-3xl theme-slot border-2 theme-border hover:border-emerald-500/50 cursor-pointer transition-all duration-300 relative group text-center selection:bg-transparent shadow-sm";
        card.onclick = () => selectElement(id);
        card.addEventListener('mouseenter', () => inspectElement(id));

        const elName = activeLang === 'ru' ? element.name : (element.nameEn || element.name);
        const tierText = 'T';

        card.innerHTML = `
            <span class="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110">${element.icon}</span>
            <span class="text-xs font-mono tracking-widest uppercase theme-text group-hover:text-emerald-500 transition-colors font-bold">${elName}</span>
            <span class="absolute top-2.5 right-4 text-[10px] font-mono theme-text-muted group-hover:text-emerald-500/50 font-bold">${tierText}${element.tier}</span>
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

    const activeLang = localStorage.getItem('prism_language') || 'ru';
    const elName = activeLang === 'ru' ? element.name : (element.nameEn || element.name);
    const elDesc = activeLang === 'ru' ? element.desc : (element.descEn || element.desc);
    const tierText = activeLang === 'ru' ? 'Уровень' : 'Tier';

    infoIcon.innerText = element.icon;
    infoName.innerText = `${elName} (${tierText} ${element.tier})`;
    infoDesc.innerText = elDesc;
}

function updateSlots() {
    const activeLang = localStorage.getItem('prism_language') || 'ru';
    const s1Title = 'SLOT_1';
    const s2Title = 'SLOT_2';
    const emptyTxt = 'EMPTY';

    if (slot1) {
        const elName = activeLang === 'ru' ? db[slot1].name : (db[slot1].nameEn || db[slot1].name);
        slot1Element.innerHTML = `
            <div class="reactor-ring absolute inset-0 rounded-full border-emerald-500/50"></div>
            <span class="text-5xl z-10 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">${db[slot1].icon}</span>
            <span class="absolute bottom-2 text-xs font-mono uppercase theme-bg px-3 py-1 rounded text-emerald-300 z-10 border theme-border font-bold">${elName}</span>
        `;
        slot1Element.classList.remove('slot-float');
    } else {
        slot1Element.innerHTML = `
            <div class="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest theme-text-muted group-hover:text-emerald-400 transition-colors uppercase font-bold">${s1Title}</div>
            <div class="text-xs font-mono tracking-widest theme-text-muted group-hover:text-emerald-500 transition-colors">${emptyTxt}</div>
        `;
        slot1Element.classList.add('slot-float');
    }

    if (slot2) {
        const elName = activeLang === 'ru' ? db[slot2].name : (db[slot2].nameEn || db[slot2].name);
        slot2Element.innerHTML = `
            <div class="reactor-ring absolute inset-0 rounded-full border-emerald-500/50"></div>
            <span class="text-5xl z-10 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">${db[slot2].icon}</span>
            <span class="absolute bottom-2 text-xs font-mono uppercase theme-bg px-3 py-1 rounded text-emerald-300 z-10 border theme-border font-bold">${elName}</span>
        `;
        slot2Element.classList.remove('slot-float');
    } else {
        slot2Element.innerHTML = `
            <div class="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest theme-text-muted group-hover:text-emerald-400 transition-colors uppercase font-bold">${s2Title}</div>
            <div class="text-xs font-mono tracking-widest theme-text-muted group-hover:text-emerald-500 transition-colors">${emptyTxt}</div>
        `;
        slot2Element.classList.add('slot-float');
    }

    if (!isSynthesizing && !reactionMessage.hasAttribute('data-locked')) {
        reactionPanel.className = "w-full h-16 rounded-full theme-slot border flex items-center justify-center px-6 transition-all duration-300 shadow-inner";

        const msgReady = activeLang === 'ru' ? 'Система готова. Загрузите элементы.' : 'System ready. Load elements.';
        const msgWait = activeLang === 'ru' ? 'Ожидание второго элемента...' : 'Waiting for second element...';

        if (slot1 && slot2) {
            synthesize();
        } else if (slot1 || slot2) {
            reactionMessage.innerHTML = `<span class="theme-text font-bold opacity-80">${msgWait}</span>`;
        } else {
            reactionMessage.innerHTML = `<span class="theme-text-muted font-bold">${msgReady}</span>`;
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

    const activeLang = localStorage.getItem('prism_language') || 'ru';

    if (typeof unlockAchievement !== 'undefined') unlockAchievement('FIRST_SYNTHESIS');
    if (inventory.length === Object.keys(db).length && typeof unlockAchievement !== 'undefined') {
        unlockAchievement('ALCHEMY_MASTER');
    }

    const combination1 = `${slot1}+${slot2}`;
    const combination2 = `${slot2}+${slot1}`;
    const resultId = recipes[combination1] || recipes[combination2];

    const msgInit = activeLang === 'ru' ? 'Инициализация синтеза...' : 'Initializing synthesis...';

    reactionMessage.setAttribute('data-locked', 'true');
    reactionPanel.className = "w-full h-16 rounded-full bg-emerald-950/20 border-2 border-emerald-500/50 flex items-center justify-center px-6 transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.2)]";
    reactionMessage.innerHTML = `<span class="text-emerald-400 animate-pulse tracking-[0.3em] font-bold">${msgInit}</span>`;

    slot1Element.classList.add('animate-pulse');
    slot2Element.classList.add('animate-pulse');

    if ((combination1 === 'obsidian+water' || combination2 === 'obsidian+water') && typeof unlockAchievement !== 'undefined') {
        unlockAchievement('ALMOST_HELL');
    }

    setTimeout(() => {
        if (!slot1Element || !slot2Element) return;
        slot1Element.classList.remove('animate-pulse');
        slot2Element.classList.remove('animate-pulse');

        if (resultId) {
            const newElement = db[resultId];

            if (!inventory.includes(resultId)) {
                inventory.push(resultId);
                localStorage.setItem('prismAlchemyProgress', JSON.stringify(inventory));

                const discName = activeLang === 'ru' ? newElement.name : (newElement.nameEn || newElement.name);
                const toastMsg = activeLang === 'ru' ? `Открыт новый элемент: ${discName}` : `New element discovered: ${discName}`;
                if (typeof showToast === 'function') {
                    showToast(newElement.icon, toastMsg);
                }

                if (resultId === 'human' && typeof unlockAchievement !== 'undefined') {
                    unlockAchievement('EVOLUTION_PEAK');
                }
            }

            inspectElement(resultId);

            const msgSucc = activeLang === 'ru' ? 'Синтез успешен:' : 'Synthesis successful:';
            const elName = activeLang === 'ru' ? newElement.name : (newElement.nameEn || newElement.name);

            reactionPanel.className = "w-full h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center px-6 transition-all duration-300 shadow-[0_0_35px_rgba(16,185,129,0.4)]";
            reactionMessage.innerHTML = `<span class="theme-text font-bold">${msgSucc} <span class="text-emerald-400 font-extrabold text-sm">${elName}</span></span>`;

            slot1 = resultId;
            slot2 = null;
        } else {
            const msgErr = activeLang === 'ru' ? 'Ошибка: Элементы несовместимы' : 'Error: Elements incompatible';
            reactionPanel.className = "w-full h-16 rounded-full bg-rose-950/20 border-2 border-rose-500/60 flex items-center justify-center px-6 transition-all duration-300 shadow-[0_0_25px_rgba(244,63,94,0.2)]";
            reactionMessage.innerHTML = `<span class="text-rose-400 font-bold text-xs">${msgErr}</span>`;
            slot1 = null;
            slot2 = null;
        }

        isSynthesizing = false;
        updateSlots();
        renderInventory();

        setTimeout(() => {
            if (!isSynthesizing && reactionMessage) {
                reactionMessage.removeAttribute('data-locked');
                updateSlots();
            }
        }, 2000);

    }, 1200);
}

function filterInventory(filterType) {
    currentFilter = filterType;
    updateFilterButtonsUI();
    renderInventory();
}

function updateFilterButtonsUI() {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.className = "tab-btn px-5 py-2 rounded-full theme-text-muted hover:text-emerald-500 font-bold transition-all";
    });

    const activeBtn = document.getElementById(`filter-${currentFilter}`);
    if (activeBtn) {
        if (isLightMode) {
            activeBtn.className = "tab-btn px-5 py-2 rounded-full bg-emerald-500 text-white font-bold transition-all shadow-md";
        } else {
            activeBtn.className = "tab-btn px-5 py-2 rounded-full bg-white text-black font-bold transition-all";
        }
    }
}

function exitToMain(event) {
    event.preventDefault();
    if (isSynthesizing) return;

    const screen = document.getElementById('transition-screen');
    if (!screen) {
        window.location.href = "index.html";
        return;
    }

    screen.style.background = '#020202';
    screen.style.backgroundColor = '#020202';
    screen.style.transition = 'none';
    screen.classList.remove('slide-up');
    screen.style.transform = 'translateY(100%)';

    void screen.offsetWidth;

    screen.style.transition = 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
    screen.style.transform = 'translateY(0)';

    setTimeout(() => {
        window.location.href = "index.html";
    }, 800);
}

window.onLanguageChanged = function(lang) {
    updateFilterButtonsUI();
    renderInventory();
    updateSlots();

    if (!slot1 && !slot2) {
        infoIcon.innerText = '🧬';
        infoName.innerText = lang === 'ru' ? 'Панель мониторинга' : 'Monitoring Panel';
        infoDesc.innerText = lang === 'ru'
            ? 'Выберите элемент из хранилища для анализа его молекулярного строения.'
            : 'Select an element from the storage to analyze its molecular structure.';
    } else {
        inspectElement(slot1 || slot2);
    }
};

let canvas, ctx, bubbles = [];
function initBubbles() {
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
            this.radius = Math.random() * 2.2 + 0.5;
            this.speed = Math.random() * 0.5 + 0.15;
            this.opacity = Math.random() * 0.2 + 0.05;
            this.swing = Math.random() * 0.2 - 0.1;
            this.swingSpeed = Math.random() * 0.01 + 0.002;
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
            if (isLightMode) {
                ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity * 5})`;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            }
            ctx.fill();
        }
    }

    bubbles = Array.from({ length: 50 }, () => new Bubble());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        bubbles.forEach(b => {
            b.update();
            b.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function removeTransitionScreen() {
    const transScreen = document.getElementById('transition-screen');
    if (transScreen) {
        setTimeout(() => {
            transScreen.classList.add('slide-up');
        }, 150);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    applyTheme();
    initBubbles();
    renderInventory();
    updateSlots();
    updateFilterButtonsUI();

    if (themeToggleBtn) {
        themeToggleBtn.onclick = handleThemeToggle;
    }

    removeTransitionScreen();
});

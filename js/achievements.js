const ACHIEVEMENTS = {
    ALCHEMY_MASTER: { id: 'alc_master', title: 'Великий Алхимик', desc: 'Открыть все элементы на складе алхимии', icon: '🏆' },
    FIRST_SYNTHESIS: { id: 'first_synth', title: 'Первая Искра', desc: 'Создать свой самый первый химический элемент', icon: '✨' },
    EVOLUTION_PEAK: { id: 'evo_peak', title: 'Высшая степень эволюции', desc: 'Синтезировать человека в реакторе слияния', icon: '👤' },
    ALMOST_HELL: { id: 'almost_hell', title: 'До ада осталось немного', desc: 'Попытаться соединить обсидиан с водой в реакторе', icon: '🌋' },

    GLOSSARY_SAGE: { id: 'glo_sage', title: 'Вечный Студент', desc: 'Провести суммарно 30 минут в глоссарии', icon: '📜' },
    QUIZ_HERO: { id: 'quiz_hero', title: 'Интеллектуал', desc: 'Набрать 5 очков в интерактивной викторине глоссария', icon: '🧠' },
    QUIZ_STREAKER: { id: 'quiz_streaker', title: 'Эрудит в ударе', desc: 'Дать 5 правильных ответов подряд в викторине', icon: '🔥' },
    TERM_COLLECTOR: { id: 'term_collector', title: 'Жажда знаний', desc: 'Изучить подробное описание 8 различных терминов', icon: '📚' },

    FIND_NEPTUNE: { id: 'neptune', title: 'Это конец..?', desc: 'Запустить подробное сканирование ледяного гиганта Нептуна', icon: '❄️' },
    SUN_EXPLORER: { id: 'sun_explorer', title: 'Прикосновение к звезде', desc: 'Нажать на Солнце и изучить его характеристики', icon: '☀️' },

    EXPLORER: { id: 'explorer', title: 'Первооткрыватель', desc: 'Посетить все 4 научных сектора Prism', icon: '🧭' },
    LET_THERE_BE_LIGHT: { id: 'light', title: 'Да будет свет', desc: 'Сменить тему интерфейса со светлой на тёмную', icon: '🌓' },

    PHYS_WELCOME: { id: 'phys_welcome', title: 'Теория и практика', desc: 'Впервые зайти в раздел физических симуляций', icon: '🍎' },
    PHYS_EXPERIMENTER: { id: 'phys_experimenter', title: 'Заслуженный Экспериментатор', desc: 'Изучить все 5 физических направлений', icon: '🧪' },
    DESKTOP_CHAD: { id: 'desktop_chad', title: 'ПК Боярин', desc: 'Запустить физику на полноценном мониторе без мобильных предупреждений', icon: '🖥️' },
    EINSTEIN_BRAIN: { id: 'einstein_brain', title: 'Теория Относительности', desc: 'Секрет: Постучать по вывеске физических модулей', icon: '🧠' },
    TESLA_DISCIPLE: { id: 'tesla_disciple', title: 'Искры Теслы', desc: 'Секрет: Пощелкать по иконке молнии электрических цепей', icon: '🔌' },
    PERPETUUM_MOBILE: { id: 'perpetuum_mobile', title: 'Вечный Двигатель', desc: 'Провести на странице физики более 5 минут', icon: '⏳' },

    SHORT_CIRCUIT: { id: 'short_circuit', title: 'Короткое замыкание', desc: 'Перегрузить и заблокировать источник питания высоким током', icon: '💥' },
    FUSE_BURNT: { id: 'fuse_burnt', title: 'Огнеупорный', desc: 'Сжечь плавкий предохранитель высоким током в цепи', icon: '🛡️' },
    SNIPER: { id: 'sniper', title: 'Снайпер', desc: 'Запустить снаряд в баллистическом симуляторе', icon: '🎯' },
    PERFECT_ANGLE: { id: 'perfect_angle', title: 'Идеальный угол', desc: 'Выстрелить под углом 45° для достижения максимальной дальности', icon: '📐' },
    GRAVITY_MASTER: { id: 'gravity_master', title: 'Повелитель притяжения', desc: 'Добавить на электростатический стенд разноименные заряды и пластины', icon: '🌌' },
    TOTAL_REFLECTION: { id: 'total_reflection', title: 'Мираж', desc: 'Добиться полного внутреннего отражения на границе двух сред', icon: '🌈' },
    LENS_FOCUS: { id: 'lens_focus', title: 'Фокусировка', desc: 'Изменить фокусное расстояние или положение предмета у линзы', icon: '🔎' }
};

function isUnlocked(achId) {
    const unlocked = JSON.parse(localStorage.getItem('prism_achievements') || '[]');
    return unlocked.includes(achId);
}

function unlockAchievement(achKey) {
    const ach = ACHIEVEMENTS[achKey];
    if (!ach || isUnlocked(ach.id)) return;

    const unlocked = JSON.parse(localStorage.getItem('prism_achievements') || '[]');
    unlocked.push(ach.id);
    localStorage.setItem('prism_achievements', JSON.stringify(unlocked));

    showAchievementToast(ach);
    renderAchievementsModal();
}

function showAchievementToast(ach) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <div class="ach-toast-icon">${ach.icon}</div>
        <div class="ach-toast-info">
            <div class="ach-toast-header">ДОСТИЖЕНИЕ ПОЛУЧЕНО</div>
            <div class="ach-toast-title">${ach.title}</div>
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 5000);
}

function initAchievementsUI() {
    if (document.getElementById('prism-ach-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'prism-ach-btn';
    btn.innerHTML = '🏆';
    btn.title = 'Достижения';
    btn.onclick = toggleAchievementsModal;
    document.body.appendChild(btn);

    const modal = document.createElement('div');
    modal.id = 'prism-ach-modal';
    modal.innerHTML = `
        <div class="ach-modal-content">
            <div class="ach-modal-header">
                <h2>Ваши Достижения</h2>
                <button onclick="toggleAchievementsModal()" class="ach-close-btn">✕</button>
            </div>
            <div class="ach-modal-stats">Разблокировано: <span id="ach-stats-count">0</span> / ${Object.keys(ACHIEVEMENTS).length}. ДОСТИЖЕНИЯ МОГУТ ПРИХОДИТЬ С ЗАДЕРЖКОЙ</div>
            <div class="ach-list" id="ach-list-container"></div>
        </div>
    `;
    document.body.appendChild(modal);

    renderAchievementsModal();
}

function toggleAchievementsModal() {
    const modal = document.getElementById('prism-ach-modal');
    modal.classList.toggle('active');
    renderAchievementsModal();
}

function renderAchievementsModal() {
    const container = document.getElementById('ach-list-container');
    const countSpan = document.getElementById('ach-stats-count');
    if (!container) return;

    container.innerHTML = '';
    let unlockedCount = 0;

    Object.values(ACHIEVEMENTS).forEach(ach => {
        const unlocked = isUnlocked(ach.id);
        if (unlocked) unlockedCount++;

        const item = document.createElement('div');
        item.className = `ach-item ${unlocked ? 'unlocked' : 'locked'}`;
        item.innerHTML = `
            <div class="ach-item-icon">${unlocked ? ach.icon : '🔒'}</div>
            <div class="ach-item-info">
                <div class="ach-item-title">${unlocked ? ach.title : 'Скрытое достижение'}</div>
                <div class="ach-item-desc">${unlocked ? ach.desc : 'Условия получения скрыты'}</div>
            </div>
        `;
        container.appendChild(item);
    });

    if (countSpan) countSpan.textContent = unlockedCount;
}

window.addEventListener('DOMContentLoaded', () => {
    initAchievementsUI();

    const path = window.location.pathname.toLowerCase();

    let visits = JSON.parse(localStorage.getItem('prism_visits') || '[]');
    if (path.includes('alchemy') && !visits.includes('alc')) visits.push('alc');
    if (path.includes('kosmos') && !visits.includes('kos')) visits.push('kos');
    if (path.includes('physics') && !visits.includes('phys')) visits.push('phys');
    if (path.includes('glossary') && !visits.includes('glo')) visits.push('glo');
    localStorage.setItem('prism_visits', JSON.stringify(visits));

    if (visits.length >= 4) unlockAchievement('EXPLORER');

    if (path.includes('glossary')) {
        let secondsSpent = parseInt(localStorage.getItem('time_in_glossary') || '0');
        setInterval(() => {
            secondsSpent++;
            localStorage.setItem('time_in_glossary', secondsSpent);
            if (secondsSpent >= 1800) unlockAchievement('GLOSSARY_SAGE');
        }, 1000);
    }

    // Слушатель глобального изменения тем
    document.addEventListener('click', (e) => {
        if (e.target.closest('#themeToggleBtn') || e.target.closest('.theme-switcher')) {
            unlockAchievement('LET_THERE_BE_LIGHT');
        }
    });
});

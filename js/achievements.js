const ACHIEVEMENTS = {
    //алхимия
    ALCHEMY_MASTER: { id: 'alc_master', title: 'Великий Алхимик', desc: 'Открыть все элементы', icon: '🏆' },
    FIRST_SYNTHESIS: { id: 'first_synth', title: 'Первая Искра', desc: 'Создать первый элемент', icon: '✨' },
    EVOLUTION_PEAK: { id: 'evo_peak', title: 'Высшая степень эволюции', desc: 'Синтезировать человека', icon: '👤' },
    ALMOST_HELL: { id: 'almost_hell', title: 'До ада осталось немного', desc: 'Попытаться смешать обсидиан с водой', icon: '🌋' },

    //глоссарий
    GLOSSARY_SAGE: { id: 'glo_sage', title: 'Вечный Студент', desc: 'Провести суммарно 30 минут в глоссарии', icon: '📜' },
    QUIZ_HERO: { id: 'quiz_hero', title: 'Интеллектуал', desc: 'Набрать 5 очков в интерактивной викторине', icon: '🧠' },
    QUIZ_STREAKER: { id: 'quiz_streaker', title: 'Эрудит в ударе', desc: 'Дать 5 правильных ответов подряд в викторине', icon: '🔥' },
    TERM_COLLECTOR: { id: 'term_collector', title: 'Жажда знаний', desc: 'Изучить подробное описание 8 терминов в глоссарии', icon: '📚' },

    //космос
    FIND_NEPTUNE: { id: 'neptune', title: 'Это конец..?', desc: 'Исследовать Нептун', icon: '❄️' },
    SUN_EXPLORER: { id: 'sun_explorer', title: 'Прикосновение к звезде', desc: 'Нажать на Солнце', icon: '☀️' },

    //глобальные
    EXPLORER: { id: 'explorer', title: 'Первооткрыватель', desc: 'Посетить все 4 научных сектора Prism', icon: '🧭' },
    LET_THERE_BE_LIGHT: { id: 'light', title: 'Да будет свет', desc: 'Сменить тему интерфейса', icon: '🌓' }
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
                <div class="ach-item-title">${ach.title}</div>
                <div class="ach-item-desc">${unlocked ? ach.desc : 'Скрытое достижение (или еще не получено)'}</div>
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

    document.addEventListener('click', (e) => {
        if (e.target.closest('#themeToggleBtn') || e.target.closest('.theme-switcher')) {
            unlockAchievement('LET_THERE_BE_LIGHT');
        }
    });
});

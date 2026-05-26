const ACHIEVEMENTS = {
    ALCHEMY_MASTER: { id: 'alc_master', title: 'Великий Алхимик', desc: 'Открыть все элементы', icon: '🏆' },
    GLOSSARY_SAGE: { id: 'glo_sage', title: 'Вечный Студент', desc: 'Провести 30 минут в глоссарии', icon: '📜' },
    FIRST_SYNTHESIS: { id: 'first_synth', title: 'Первая Искра', desc: 'Создать первый элемент', icon: '✨' }
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
}

function showAchievementToast(ach) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <div class="ach-icon">${ach.icon}</div>
        <div class="ach-info">
            <div class="ach-title">${ach.title}</div>
            <div class="ach-desc">${ach.desc}</div>
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 5000);
}

if (window.location.pathname.includes('glossary.html')) {
    let secondsSpent = parseInt(localStorage.getItem('time_in_glossary') || '0');

    setInterval(() => {
        secondsSpent++;
        localStorage.setItem('time_in_glossary', secondsSpent);

        if (secondsSpent >= 1800) { //30 минут = 1800 секунд
            unlockAchievement('GLOSSARY_SAGE');
        }
    }, 1000);
}
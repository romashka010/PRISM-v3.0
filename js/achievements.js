const ACHIEVEMENTS = {
    ALCHEMY_MASTER: { id: 'alc_master', key: 'alc_master', icon: '🏆' },
    FIRST_SYNTHESIS: { id: 'first_synth', key: 'first_synth', icon: '✨' },
    EVOLUTION_PEAK: { id: 'evo_peak', key: 'evo_peak', icon: '👤' },
    ALMOST_HELL: { id: 'almost_hell', key: 'almost_hell', icon: '🌋' },

    GLOSSARY_SAGE: { id: 'glo_sage', key: 'glo_sage', icon: '📜' },
    QUIZ_HERO: { id: 'quiz_hero', key: 'quiz_hero', icon: '🧠' },
    QUIZ_STREAKER: { id: 'quiz_streaker', key: 'quiz_streaker', icon: '🔥' },
    TERM_COLLECTOR: { id: 'term_collector', key: 'term_collector', icon: '📚' },

    FIND_NEPTUNE: { id: 'neptune', key: 'neptune', icon: '❄️' },
    SUN_EXPLORER: { id: 'sun_explorer', key: 'sun_explorer', icon: '☀️' },

    EXPLORER: { id: 'explorer', key: 'explorer', icon: '🧭' },
    LET_THERE_BE_LIGHT: { id: 'light', key: 'light', icon: '🌓' },

    PHYS_WELCOME: { id: 'phys_welcome', key: 'phys_welcome', icon: '🍎' },
    PHYS_EXPERIMENTER: { id: 'phys_experimenter', key: 'phys_experimenter', icon: '🧪' },
    DESKTOP_CHAD: { id: 'desktop_chad', key: 'desktop_chad', icon: '🖥️' },
    EINSTEIN_BRAIN: { id: 'einstein_brain', key: 'einstein_brain', icon: '🧠' },
    TESLA_DISCIPLE: { id: 'tesla_disciple', key: 'tesla_disciple', icon: '🔌' },
    PERPETUUM_MOBILE: { id: 'perpetuum_mobile', key: 'perpetuum_mobile', icon: '⏳' },

    SHORT_CIRCUIT: { id: 'short_circuit', key: 'short_circuit', icon: '💥' },
    FUSE_BURNT: { id: 'fuse_burnt', key: 'fuse_burnt', icon: '🛡️' },
    SNIPER: { id: 'sniper', key: 'sniper', icon: '🎯' },
    PERFECT_ANGLE: { id: 'perfect_angle', key: 'perfect_angle', icon: '📐' },
    GRAVITY_MASTER: { id: 'gravity_master', key: 'gravity_master', icon: '🌌' },
    TOTAL_REFLECTION: { id: 'total_reflection', key: 'total_reflection', icon: '🌈' },
    LENS_FOCUS: { id: 'lens_focus', key: 'lens_focus', icon: '🔎' }
};

function isUnlocked(achId) {
    const unlocked = JSON.parse(localStorage.getItem('prism_achievements') || '[]');
    return unlocked.includes(achId);
}

function getLocalizedAchData(achKey) {
    const ach = ACHIEVEMENTS[achKey];
    if (!ach) return null;

    const activeLang = localStorage.getItem('prism_language') || 'ru';

    const titleKey = `ach_title_${ach.key}`;
    const descKey = `ach_desc_${ach.key}`;

    let title = "Achievement";
    let desc = "Condition locked";

    if (typeof translations !== 'undefined' && translations[activeLang]) {
        if (translations[activeLang][titleKey] !== undefined) title = translations[activeLang][titleKey];
        if (translations[activeLang][descKey] !== undefined) desc = translations[activeLang][descKey];
    } else {
        title = achKey;
        desc = "Locked";
    }

    return {
        id: ach.id,
        icon: ach.icon,
        title: title,
        desc: desc
    };
}

function unlockAchievement(achKey) {
    const ach = ACHIEVEMENTS[achKey];
    if (!ach || isUnlocked(ach.id)) return;

    const unlocked = JSON.parse(localStorage.getItem('prism_achievements') || '[]');
    unlocked.push(ach.id);
    localStorage.setItem('prism_achievements', JSON.stringify(unlocked));

    const localizedData = getLocalizedAchData(achKey);
    if (localizedData) {
        showAchievementToast(localizedData);
    }
    renderAchievementsModal();
}

function showAchievementToast(achData) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';

    const activeLang = localStorage.getItem('prism_language') || 'ru';
    const toastHeader = (typeof translations !== 'undefined' && translations[activeLang] && translations[activeLang]["ach_toast_header"])
        ? translations[activeLang]["ach_toast_header"]
        : "ACHIEVEMENT UNLOCKED";

    toast.innerHTML = `
        <div class="ach-toast-icon">${achData.icon}</div>
        <div class="ach-toast-info">
            <div class="ach-toast-header">${toastHeader}</div>
            <div class="ach-toast-title">${achData.title}</div>
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
    btn.title = 'Achievements';
    btn.onclick = toggleAchievementsModal;
    document.body.appendChild(btn);

    const modal = document.createElement('div');
    modal.id = 'prism-ach-modal';

    const activeLang = localStorage.getItem('prism_language') || 'ru';
    const mTitle = (typeof translations !== 'undefined' && translations[activeLang] && translations[activeLang]["ach_title"]) ? translations[activeLang]["ach_title"] : "Achievements";
    const mStats = (typeof translations !== 'undefined' && translations[activeLang] && translations[activeLang]["ach_stats"]) ? translations[activeLang]["ach_stats"] : "Unlocked: <span id=\"ach-stats-count\">0</span>";

    modal.innerHTML = `
        <div class="ach-modal-content">
            <div class="ach-modal-header">
                <h2 id="ach-modal-title-text">${mTitle}</h2>
                <button onclick="toggleAchievementsModal()" class="ach-close-btn">✕</button>
            </div>
            <div class="ach-modal-stats" id="ach-modal-stats-text">${mStats}</div>
            <div class="ach-list" id="ach-list-container"></div>
        </div>
    `;
    document.body.appendChild(modal);

    renderAchievementsModal();
}

function toggleAchievementsModal() {
    const modal = document.getElementById('prism-ach-modal');
    if (!modal) return;
    modal.classList.toggle('active');
    renderAchievementsModal();
}

function renderAchievementsModal() {
    const container = document.getElementById('ach-list-container');
    const countSpan = document.getElementById('ach-stats-count');
    if (!container) return;

    const activeLang = localStorage.getItem('prism_language') || 'ru';
    const mTitleText = document.getElementById('ach-modal-title-text');
    const mStatsText = document.getElementById('ach-modal-stats-text');

    if (mTitleText && typeof translations !== 'undefined' && translations[activeLang]) {
        mTitleText.innerText = translations[activeLang]["ach_title"] || "Achievements";
    }
    if (mStatsText && typeof translations !== 'undefined' && translations[activeLang]) {
        mStatsText.innerHTML = translations[activeLang]["ach_stats"] || "Unlocked: <span id=\"ach-stats-count\">0</span>";
    }

    container.innerHTML = '';
    let unlockedCount = 0;

    Object.keys(ACHIEVEMENTS).forEach(achKey => {
        const rawAch = ACHIEVEMENTS[achKey];
        const unlocked = isUnlocked(rawAch.id);
        if (unlocked) unlockedCount++;

        const data = getLocalizedAchData(achKey);
        const item = document.createElement('div');
        item.className = `ach-item ${unlocked ? 'unlocked' : 'locked'}`;

        const hiddenTitle = (typeof translations !== 'undefined' && translations[activeLang] && translations[activeLang]["ach_hidden_title"]) ? translations[activeLang]["ach_hidden_title"] : "Hidden";
        const hiddenDesc = (typeof translations !== 'undefined' && translations[activeLang] && translations[activeLang]["ach_hidden_desc"]) ? translations[activeLang]["ach_hidden_desc"] : "Locked";

        item.innerHTML = `
            <div class="ach-item-icon">${unlocked ? data.icon : '🔒'}</div>
            <div class="ach-item-info">
                <div class="ach-item-title">${unlocked ? data.title : hiddenTitle}</div>
                <div class="ach-item-desc">${unlocked ? data.desc : hiddenDesc}</div>
            </div>
        `;
        container.appendChild(item);
    });

    const freshCountSpan = document.getElementById('ach-stats-count');
    if (freshCountSpan) freshCountSpan.textContent = unlockedCount;
}

window.onLanguageChanged = function(lang) {
    renderAchievementsModal();
};

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

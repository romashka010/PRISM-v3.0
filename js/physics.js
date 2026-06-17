window.onload = function() {
    const overlay = document.getElementById('intro-transition-overlay');

    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('inactive');
        }, 300);
    }

    checkDevice();

    if (typeof unlockAchievement === 'function') {
        unlockAchievement('PHYS_WELCOME');
    }

    let physicsSeconds = 0;
    setInterval(() => {
        physicsSeconds++;
        if (physicsSeconds >= 300 && typeof unlockAchievement === 'function') {
            unlockAchievement('PERPETUUM_MOBILE');
        }
    }, 1000);

    const mainTitle = document.getElementById('physics-main-title');
    if (mainTitle) {
        let titleClicks = 0;
        mainTitle.addEventListener('click', () => {
            titleClicks++;
            if (titleClicks >= 7 && typeof unlockAchievement === 'function') {
                unlockAchievement('EINSTEIN_BRAIN');
            }
        });
    }

    const teslaIcon = document.getElementById('tesla-icon');
    if (teslaIcon) {
        let teslaClicks = 0;
        teslaIcon.addEventListener('click', () => {
            teslaClicks++;
            if (teslaClicks >= 10 && typeof unlockAchievement === 'function') {
                unlockAchievement('TESLA_DISCIPLE');
            }
        });
    }
};

function checkDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;
    const warning = document.getElementById('mobile-warning-overlay');
    if (warning) {
        if (isMobile) {
            warning.classList.remove('hidden');
        } else {
            warning.classList.add('hidden');
            if (typeof unlockAchievement === 'function') {
                unlockAchievement('DESKTOP_CHAD');
            }
        }
    }
}

window.addEventListener('resize', checkDevice);

let openedSubs = JSON.parse(localStorage.getItem('prism_phys_subs') || '[]');

function showSub(id) {
    const mainMenu = document.getElementById('main-menu');
    const targetSub = document.getElementById(id);

    if (mainMenu) {
        mainMenu.classList.add('hidden');
    }
    if (targetSub) {
        targetSub.classList.remove('hidden');
    }

    if (typeof unlockAchievement === 'function') {
        if (id === 'sub-mechanics' && !openedSubs.includes('mech')) openedSubs.push('mech');
        if (id === 'sub-coulomb' && !openedSubs.includes('coul')) openedSubs.push('coul');
        if (id === 'sub-circuits' && !openedSubs.includes('circ')) openedSubs.push('circ');
        if (id === 'sub-optics' && !openedSubs.includes('opt')) openedSubs.push('opt');
        if (id === 'sub-thermo' && !openedSubs.includes('thermo')) openedSubs.push('thermo');

        localStorage.setItem('prism_phys_subs', JSON.stringify(openedSubs));

        if (openedSubs.length >= 5) {
            unlockAchievement('PHYS_EXPERIMENTER');
        }
    }
}

function hideAll() {
    const containers = document.querySelectorAll('.container');
    containers.forEach(c => {
        c.classList.add('hidden');
    });

    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) {
        mainMenu.classList.remove('hidden');
    }
}

window.onLanguageChanged = function(lang) {
};

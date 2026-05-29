window.onload = function() {
    const overlay = document.getElementById('intro-transition-overlay');

    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('inactive');
        }, 300);
    }

    checkDevice();
};

function checkDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;
    const warning = document.getElementById('mobile-warning-overlay');
    if (warning) {
        if (isMobile) {
            warning.classList.remove('hidden');
        } else {
            warning.classList.add('hidden');
        }
    }
}

window.addEventListener('resize', checkDevice);

function showSub(id) {
    const mainMenu = document.getElementById('main-menu');
    const targetSub = document.getElementById(id);

    if (mainMenu) {
        mainMenu.classList.add('hidden');
    }
    if (targetSub) {
        targetSub.classList.remove('hidden');
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

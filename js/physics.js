window.onload = function() {
    const overlay = document.getElementById('intro-transition-overlay');

    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('inactive');
        }, 300);
    }
};

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

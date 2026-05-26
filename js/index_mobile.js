function checkAndRedirectToDesktop() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || (window.innerWidth <= 768);

    if (!isMobile) {
        window.location.href = 'index.html';
    }
}
checkAndRedirectToDesktop();

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
            this.radius = Math.random() * 1.8 + 0.4; // Чуть меньше для оптимизации на мобильных
            this.speed = Math.random() * 0.4 + 0.1;
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
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    bubbles = Array.from({ length: 30 }, () => new Bubble());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        bubbles.forEach(b => { b.update(); b.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileBubbles);
} else {
    initMobileBubbles();
}

function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    document.getElementById('contact-form-container').classList.remove('hidden');
    document.getElementById('contact-success-container').classList.add('hidden');
    document.getElementById('prism-contact-form').reset();
    modal.classList.add('active');
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.remove('active');
}

function handleFormSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('form-submit-btn');
    const name = document.getElementById('form-name').value.trim();
    const emailInput = document.getElementById('form-email');
    const email = emailInput.value.trim();
    const message = document.getElementById('form-message').value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailInput.classList.add('border-rose-500');
        if (typeof showToast === 'function') showToast('⚠️', 'Пожалуйста, введите корректный адрес почты.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "ПОДГОТОВКА...";

    setTimeout(() => {
        const recipientEmail = "prismlabsedu@gmail.com";
        const emailSubject = `Prism | Мобильный запрос от ${name}`;
        const emailBody = `Приветствую, команда Prism!\n\nМеня зовут ${name}(${email}).\n\nСообщение:\n\n${message}`;

        // На мобильных устройствах mailto работает надежнее всплывающих вкладок
        window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

        document.getElementById('contact-form-container').classList.add('hidden');
        document.getElementById('contact-success-container').classList.remove('hidden');

        submitBtn.disabled = false;
        submitBtn.textContent = "Готово";
    }, 800);
}

function triggerTransition(name, url, color) {
    const screen = document.getElementById('transition-screen');
    const content = document.getElementById('transition-content');
    if (!screen) return;

    screen.style.background = color;
    screen.classList.add('active');

    if (name === 'Физика' && content) {
        setTimeout(() => {
            content.classList.remove('hidden');
            setTimeout(() => { content.classList.add('opacity-100'); }, 50);
        }, 300);
    } else {
        setTimeout(() => { window.location.href = url; }, 600);
    }
}

function closeTransition() {
    const screen = document.getElementById('transition-screen');
    const content = document.getElementById('transition-content');
    if (!screen || !content) return;

    content.classList.remove('opacity-100');
    setTimeout(() => {
        screen.classList.remove('active');
        content.classList.add('hidden');
    }, 300);
}
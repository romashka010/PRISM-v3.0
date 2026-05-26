function detectDeviceAndRedirect() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || (window.innerWidth <= 768);

    if (isMobile) {
        if (!window.location.pathname.includes('index_mobile.html')) {
            window.location.href = 'index_mobile.html';
        }
    }
}

detectDeviceAndRedirect();


let currentY = 0;
let targetY = 0;
const totalSlides = 4;
let bubbleSpeedMultiplier = 1.0;

const scrollSensitivity = 0.0016;
const isMagnetActive = true;
let snapTimeout = null;

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

let slides = [];
function ensureSlidesInitialized() {
    if (slides.length === 0 || slides.some(s => s === null)) {
        slides = [
            document.getElementById('slide-hero'),
            document.getElementById('slide-manifesto'),
            document.getElementById('slide-menu'),
            document.getElementById('slide-outro')
        ];
    }
}

const ambientColors = [
    'radial-gradient(circle 800px at 50% 110%, rgba(255, 255, 255, 0.04), transparent)',
    'radial-gradient(circle 800px at 50% 110%, rgba(139, 92, 246, 0.05), transparent)',
    'radial-gradient(circle 800px at 50% 110%, rgba(6, 182, 212, 0.05), transparent)',
    'radial-gradient(circle 800px at 50% 110%, rgba(249, 115, 22, 0.05), transparent)'
];

function updateSmoothScroll() {
    ensureSlidesInitialized();
    currentY = lerp(currentY, targetY, 0.085);

    if (targetY < 0) targetY = 0;
    if (targetY > totalSlides - 1) targetY = totalSlides - 1;

    if (Math.abs(targetY - currentY) < 0.0005) {
        currentY = targetY;
    }

    const rawPage = currentY;
    const currentPage = Math.floor(rawPage);
    const progress = rawPage - currentPage;

    const delta = Math.abs(targetY - currentY);
    bubbleSpeedMultiplier = 1.0 + Math.min(delta * 4.0, 6.0);

    slides.forEach((slide, index) => {
        if (!slide) return;
        const subElements = slide.querySelectorAll('.premium-fade');

        if (index < currentPage || index > currentPage + 1) {
            slide.style.opacity = '0';
            slide.style.pointerEvents = 'none';
            slide.style.visibility = 'hidden';
            return;
        }

        slide.style.visibility = 'visible';

        if (index === currentPage) {
            const opacityValue = 1 - progress;
            slide.style.opacity = opacityValue;
            slide.style.pointerEvents = opacityValue < 0.2 ? 'none' : 'auto';

            subElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed') || '1.0');
                const translateY = -progress * 100 * speed;
                const scale = 1 - (progress * 0.05);
                const blur = progress * 15 * speed;

                el.style.transform = `translateY(${translateY}px) scale(${scale})`;
                el.style.opacity = opacityValue;
                el.style.filter = `blur(${blur}px)`;
            });

        } else if (index === currentPage + 1) {
            const opacityValue = progress;
            slide.style.opacity = opacityValue;
            slide.style.pointerEvents = opacityValue < 0.2 ? 'none' : 'auto';

            subElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed') || '1.0');
                const translateY = (1 - progress) * 100 * speed;
                const scale = 0.95 + (progress * 0.05);
                const blur = (1 - progress) * 15 * speed;

                el.style.transform = `translateY(${translateY}px) scale(${scale})`;
                el.style.opacity = opacityValue;
                el.style.filter = `blur(${blur}px)`;
            });
        }
    });

    const targetColorIndex = Math.min(currentPage, ambientColors.length - 1);
    const glowBg = document.getElementById('glow-bg');
    if (glowBg) glowBg.style.background = ambientColors[targetColorIndex];

    requestAnimationFrame(updateSmoothScroll);
}

requestAnimationFrame(updateSmoothScroll);

function processScroll(delta) {
    const transitionScreen = document.getElementById('transition-screen');
    const contactModal = document.getElementById('contact-modal');
    
    if ((transitionScreen && transitionScreen.classList.contains('active')) || 
        (contactModal && contactModal.classList.contains('active'))) return;

    if (snapTimeout) clearTimeout(snapTimeout);

    targetY = Math.max(0, Math.min(totalSlides - 1, targetY + delta * scrollSensitivity));

    if (isMagnetActive) {
        snapTimeout = setTimeout(() => {
            targetY = Math.round(targetY);
        }, 150);
    }
}

window.addEventListener('wheel', (e) => { processScroll(e.deltaY); }, { passive: true });

let touchStartY = 0;
window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });

window.addEventListener('touchmove', (e) => {
    const currentTouchY = e.touches[0].clientY;
    const diffY = touchStartY - currentTouchY;

    if (Math.abs(diffY) > 5) {
        processScroll(diffY * 2.2);
        touchStartY = currentTouchY;
    }
}, { passive: true });

window.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowDown' || e.key === ' ') {
        targetY = Math.min(targetY + 1, totalSlides - 1);
    } else if (e.key === 'ArrowUp') {
        targetY = Math.max(targetY - 1, 0);
    }
});

function smoothScrollTo(slideIndex) {
    if (snapTimeout) clearTimeout(snapTimeout);
    targetY = slideIndex;
}

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
            this.speed = Math.random() * 0.7 + 0.15;
            this.opacity = Math.random() * 0.3 + 0.05;
            this.swing = Math.random() * 0.3 - 0.15;
            this.swingSpeed = Math.random() * 0.012 + 0.002;
            this.angle = Math.random() * Math.PI;
        }
        update() {
            this.y -= this.speed * bubbleSpeedMultiplier;
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

    bubbles = Array.from({ length: 80 }, () => new Bubble());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        bubbles.forEach(b => { b.update(); b.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

if (document.readyState === 'complete') {
    initBubbles();
} else {
    window.addEventListener('load', initBubbles);
}

function triggerTransition(name, url, color) {
    const transitionScreen = document.getElementById('transition-screen');
    const transitionContent = document.getElementById('transition-content');

    if (!transitionScreen) return;

    transitionScreen.style.background = color;
    transitionScreen.style.backgroundColor = color;
    transitionScreen.classList.add('active');

    if (name === 'Физика' && transitionContent) {
        setTimeout(() => {
            transitionContent.classList.remove('hidden');
            setTimeout(() => {
                transitionContent.classList.remove('opacity-0');
                transitionContent.classList.add('opacity-100');
            }, 50);
        }, 400);
    } else {
        setTimeout(() => { window.location.href = url; }, 800);
    }
}

function closeTransition() {
    const transitionScreen = document.getElementById('transition-screen');
    const transitionContent = document.getElementById('transition-content');

    if (!transitionScreen || !transitionContent) return;

    transitionContent.classList.remove('opacity-100');
    transitionContent.classList.add('opacity-0');

    setTimeout(() => {
        transitionScreen.classList.remove('active');
        setTimeout(() => { transitionContent.classList.add('hidden'); }, 800);
    }, 300);
}

function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    document.getElementById('contact-form-container').classList.remove('hidden');
    document.getElementById('contact-success-container').classList.add('hidden');
    document.getElementById('prism-contact-form').reset();

    const emailInput = document.getElementById('form-email');
    emailInput.classList.remove('border-rose-500', 'focus:border-rose-500');
    emailInput.classList.add('border-neutral-800');
    document.getElementById('email-error').classList.add('hidden');

    modal.classList.add('active');
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.remove('active');
}

function setupContactEvents() {
    const emailInputElem = document.getElementById('form-email');
    if (emailInputElem) {
        emailInputElem.addEventListener('input', function() {
            this.classList.remove('border-rose-500');
            this.classList.add('border-neutral-800');
            const err = document.getElementById('email-error');
            if (err) err.classList.add('hidden');
        });
    }

    const form = document.getElementById('prism-contact-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
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
        emailInput.classList.remove('border-neutral-800');
        emailInput.classList.add('border-rose-500');
        document.getElementById('email-error').classList.remove('hidden');
        emailInput.focus();
        if (typeof showToast === 'function') showToast('⚠️', 'Пожалуйста, введите корректный адрес почты.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "ПОДГОТОВКА ПОЧТОВОГО ШЛЮЗА...";
    submitBtn.style.backgroundColor = '#f43f5e';
    submitBtn.style.color = '#ffffff';

    setTimeout(() => {
        const recipientEmail = "prismlabsedu@gmail.com";
        const emailSubject = `Prism | Запрос на обратную связь от ${name}`;
        const emailBody = `Приветствую, команда Prism!\n\nМеня зовут ${name}(${email})\n\nСообщение:\n\n${message}\n\n\nС уважением,\n${name}`;

        const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        const newWindow = window.open(gmailWebUrl, '_blank');

        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        }

        document.getElementById('contact-form-container').classList.add('hidden');
        document.getElementById('contact-success-container').classList.remove('hidden');

        submitBtn.disabled = false;
        submitBtn.textContent = "Открыть Gmail и подготовить письмо";
        submitBtn.style.backgroundColor = '#ffffff';
        submitBtn.style.color = '#000000';
    }, 1000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupContactEvents);
} else {
    setupContactEvents();
}

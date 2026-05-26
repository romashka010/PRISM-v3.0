function showToast(emoji, text) {
    const toast = document.getElementById('toast-message') || document.getElementById('toast');
    if (!toast) return;

    const toastIcon = document.getElementById('toast-icon');
    const toastText = document.getElementById('toast-text');

    if (toastIcon) toastIcon.textContent = emoji;
    if (toastText) toastText.textContent = text;

    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
    }, 4500);
}
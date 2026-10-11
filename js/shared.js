// ==================== JAM REAL-TIME ====================
function updateClock() {
    const el = document.getElementById('liveClock');
    if (el) {
        const now = new Date();
        el.textContent = now.toLocaleTimeString('id-ID') + ' WITA';
    }
}

// ==================== TOAST NOTIFICATION ====================
function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<i class="fa-solid fa-bell" style="color:var(--accent-rose)"></i> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==================== INISIALISASI GLOBAL ====================
document.addEventListener('DOMContentLoaded', function () {
    setInterval(updateClock, 1000);
    updateClock();
});
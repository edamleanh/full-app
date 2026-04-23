// ============================================================
// js/features/context_menu.js
// Hệ thống Context Menu tuỳ chỉnh + Overlay bắt sự kiện
// ============================================================

/**
 * Hiển thị Context Menu tại toạ độ (x, y)
 * @param {number} x
 * @param {number} y
 * @param {Array<{label: string, action: function}>} menuItems
 */
window.showContextMenu = function(x, y, menuItems) {
    const contextMenu = document.getElementById('custom-context-menu');
    const overlay = document.getElementById('context-menu-overlay');
    contextMenu.innerHTML = '';

    menuItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'context-menu-item';
        div.innerText = item.label;
        div.addEventListener('click', () => {
            contextMenu.classList.add('hidden');
            if (overlay) overlay.classList.add('hidden');
            if (item.action) item.action();
        });
        contextMenu.appendChild(div);
    });

    contextMenu.style.left = `${x}px`;
    contextMenu.style.top  = `${y + 10}px`;
    contextMenu.classList.remove('hidden');
    if (overlay) overlay.classList.remove('hidden');
};

// Đóng menu khi click ra ngoài
document.addEventListener('click', (e) => {
    const cm      = document.getElementById('custom-context-menu');
    const overlay = document.getElementById('context-menu-overlay');
    if (cm && !cm.contains(e.target)) {
        cm.classList.add('hidden');
        if (overlay) overlay.classList.add('hidden');
    }
});

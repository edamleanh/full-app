// ============================================================
// js/core/utils.js
// Hàm tiện ích dùng chung toàn bộ dự án ACS Browser
// ============================================================

/**
 * Lấy webview đang active (Single Source of Truth)
 * @returns {HTMLElement|null}
 */
function getActiveWebview() {
    return document.querySelector('webview.active');
}

/**
 * Thuật toán "Đọc Tâm Trí" Omnibox:
 * Chuyển đổi input thô của người dùng thành URL hợp lệ.
 * @param {string} raw - Chuỗi thô từ thanh địa chỉ
 * @returns {string} URL hợp lệ
 */
function resolveUrl(raw) {
    let url = raw.trim();
    if (!url) return '';

    if (/^https?:\/\//i.test(url) || /^file:\/\//i.test(url)) {
        return url; // Đã có schema — giữ nguyên
    } else if (url === 'localhost' || url.startsWith('localhost:')) {
        return 'http://' + url;
    } else if (url.includes(' ')) {
        return 'https://www.google.com/search?q=' + encodeURIComponent(url);
    } else if (url.includes('.')) {
        return 'https://' + url;
    } else {
        return 'https://www.google.com/search?q=' + encodeURIComponent(url);
    }
}

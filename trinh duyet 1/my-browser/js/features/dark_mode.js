// ============================================================
// js/features/dark_mode.js
// Tự động tiêm Dark Mode vào mọi trang web (qua CSS inversion)
// Phụ thuộc: tab_manager.js (hàm getAllWebviews, getActiveWebview)
// ============================================================

// CSS tiêm vào trang web để tạo Dark Mode thông minh
// Dùng kỹ thuật "invert + hue-rotate" để đảo toàn màn hình
// rồi đảo ngược lại ảnh/video để chúng hiển thị bình thường
const DARK_MODE_CSS = `
  html {
    filter: invert(1) hue-rotate(180deg) !important;
    background: #111 !important;
  }
  img, video, picture, canvas, iframe, [style*="background-image"] {
    filter: invert(1) hue-rotate(180deg) !important;
  }
`;

// Script để tiêm CSS vào trang
const INJECT_SCRIPT = `
(function() {
  const STYLE_ID = '__acs_dark_mode__';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = \`${DARK_MODE_CSS}\`;
    document.documentElement.appendChild(style);
  }
})();
`;

// Script để gỡ CSS khỏi trang
const REMOVE_SCRIPT = `
(function() {
  const el = document.getElementById('__acs_dark_mode__');
  if (el) el.remove();
})();
`;

// ==================== State ====================
let isDarkModeEnabled = false;

try {
  isDarkModeEnabled = localStorage.getItem('acs_dark_mode') === 'true';
} catch (e) {}

// ==================== Core Logic ====================

/**
 * Tiêm Dark Mode CSS vào một webview cụ thể
 */
function applyDarkModeToWebview(webview) {
  if (!webview) return;
  try {
    webview.executeJavaScript(INJECT_SCRIPT, true).catch(() => {});
  } catch (e) {}
}

/**
 * Gỡ bỏ Dark Mode CSS khỏi một webview cụ thể
 */
function removeDarkModeFromWebview(webview) {
  if (!webview) return;
  try {
    webview.executeJavaScript(REMOVE_SCRIPT, true).catch(() => {});
  } catch (e) {}
}

/**
 * Áp dụng / gỡ bỏ Dark Mode cho TẤT CẢ các webview đang mở
 */
function applyDarkModeToAll(enable) {
  const webviews = document.querySelectorAll('webview');
  webviews.forEach((wv) => {
    if (enable) {
      applyDarkModeToWebview(wv);
    } else {
      removeDarkModeFromWebview(wv);
    }
  });
}

// ==================== Public API ====================

/**
 * Gọi sau khi tạo webview mới, đảm bảo Dark Mode tiêm vào khi trang load xong
 */
window.registerWebviewForDarkMode = function(webview) {
  // Tiêm ngay khi mỗi lần trang load xong
  webview.addEventListener('did-stop-loading', () => {
    if (isDarkModeEnabled) {
      applyDarkModeToWebview(webview);
    }
  });

  // Tiêm ngay lập tức nếu Dark Mode đang bật
  if (isDarkModeEnabled) {
    webview.addEventListener('dom-ready', () => {
      applyDarkModeToWebview(webview);
    });
  }
};

/**
 * Bật / Tắt Dark Mode và lưu trạng thái
 */
window.toggleDarkMode = function() {
  isDarkModeEnabled = !isDarkModeEnabled;
  localStorage.setItem('acs_dark_mode', isDarkModeEnabled);

  // Cập nhật icon nút
  const btn = document.getElementById('btn-dark-mode');
  if (btn) {
    const icon = btn.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.textContent = isDarkModeEnabled ? 'light_mode' : 'dark_mode';
    }
    btn.title = isDarkModeEnabled ? 'Tắt Dark Mode' : 'Bật Dark Mode';
    btn.classList.toggle('active', isDarkModeEnabled);
  }

  // Áp dụng cho tất cả webview ngay lập tức
  applyDarkModeToAll(isDarkModeEnabled);
};

// ==================== Init ====================
// Cập nhật trạng thái nút khi khởi động
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-dark-mode');
  if (!btn) return;

  const icon = btn.querySelector('.material-symbols-outlined');
  if (isDarkModeEnabled) {
    if (icon) icon.textContent = 'light_mode';
    btn.title = 'Tắt Dark Mode';
    btn.classList.add('active');
  }
});

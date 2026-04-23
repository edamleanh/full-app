// ============================================================
// js/tab/tab_ui.js
// Xây dựng DOM cho từng Tab: webview, tab element, drag&drop, events
// Phụ thuộc: context_menu.js
// ============================================================

const TAB_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

/**
 * Tạo và cấu hình một phần tử <webview>
 * @param {string} url
 * @returns {HTMLElement}
 */
function buildWebview(url) {
    const webview = document.createElement('webview');
    webview.setAttribute('partition', 'persist:main');
    webview.setAttribute('useragent', TAB_USER_AGENT);
    webview.setAttribute('allowpopups', '');
    // Tối ưu hóa WebPreferences cho YouTube Live Chat và Autoplay
    webview.setAttribute('webpreferences', 'backgroundThrottling=false, autoplayPolicy=no-user-gesture-required, contextIsolation=true, worldSafeExecuteJavaScript=true');
    webview.src = url;

    // Đăng ký với hệ thống Dark Mode để tiêm CSS khi trang load
    if (typeof window.registerWebviewForDarkMode === 'function') {
        window.registerWebviewForDarkMode(webview);
    }

    return webview;
}

/**
 * Gắn toàn bộ sự kiện webview vào tabId
 * @param {HTMLElement} webview
 * @param {string} tabId
 * @param {string} url
 * @param {Object} tabManager
 */
function bindWebviewEvents(webview, tabId, url, tabManager) {
    // Loading spinner
    webview.addEventListener('did-start-loading', () => {
        const tabEl = document.getElementById(tabId);
        if (tabEl) {
            const icon = tabEl.querySelector('.tab-icon');
            const spin = tabEl.querySelector('.tab-spinner');
            if (icon) icon.style.display = 'none';
            if (spin) spin.style.display = 'block';
        }
        if (tabManager.activeTabId === tabId) {
            const uInput = tabManager.urlInput;
            if (url === 'about:blank' || uInput.value === '') {
                uInput.focus();
                uInput.select();
            }
        }
    });

    webview.addEventListener('did-stop-loading', () => {
        const tabEl = document.getElementById(tabId);
        if (tabEl) {
            const icon = tabEl.querySelector('.tab-icon');
            const spin = tabEl.querySelector('.tab-spinner');
            if (spin) spin.style.display = 'none';
            if (icon && icon.getAttribute('src')) icon.style.display = 'block';
        }
    });

    // Sync URL
    webview.addEventListener('did-navigate', (e) => tabManager.handleNavigate(tabId, e.url));
    // Lắng nghe điều hướng trong trang (SPA)
    webview.addEventListener('did-navigate-in-page', (e) => {
        tabManager.handleNavigate(tabId, e.url);
        // Đã gỡ bỏ logic reload tự động vì nó gây mất khung Live Chat
    });

    // Sync title
    webview.addEventListener('page-title-updated', (e) => tabManager.handleTitleUpdate(tabId, e.title));

    // Sync favicon
    webview.addEventListener('page-favicon-updated', (e) => {
        if (e.favicons && e.favicons.length > 0) {
            const tabEl = document.getElementById(tabId);
            if (tabEl) {
                const iconEl = tabEl.querySelector('.tab-icon');
                if (iconEl) {
                    iconEl.src = e.favicons[0];
                    iconEl.style.display = 'block';
                }
            }
        }
    });
}

/**
 * Xây dựng DOM element cho Tab (không bao gồm webview)
 * @param {string} tabId
 * @param {Object} tabManager
 * @returns {Object} { tabEl, titleEl, iconEl, spinnerEl, closeBtn }
 */
function buildTabElement(tabId, tabManager) {
    const tabEl = document.createElement('div');
    tabEl.className = 'tab';
    tabEl.id        = tabId;
    tabEl.draggable = true;

    // --- Drag & Drop ---
    tabEl.addEventListener('dragstart', (e) => {
        tabManager.draggedTabId = tabId;
        tabEl.style.opacity     = '0.4';
        e.dataTransfer.effectAllowed = 'move';
    });
    tabEl.addEventListener('dragend', () => {
        tabManager.draggedTabId = null;
        tabEl.style.opacity     = '1';
    });
    tabEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });
    tabEl.addEventListener('drop', (e) => {
        e.preventDefault();
        if (tabManager.draggedTabId && tabManager.draggedTabId !== tabId) {
            const draggedEl    = document.getElementById(tabManager.draggedTabId);
            const rect         = tabEl.getBoundingClientRect();
            const insertAfter  = e.clientX > rect.left + rect.width / 2;
            if (insertAfter) {
                tabEl.parentNode.insertBefore(draggedEl, tabEl.nextSibling);
            } else {
                tabEl.parentNode.insertBefore(draggedEl, tabEl);
            }
            tabManager.reorderTabsArray();
        }
    });

    // --- Các phần tử con ---
    const spinnerEl = document.createElement('div');
    spinnerEl.className = 'tab-spinner';

    const iconEl = document.createElement('img');
    iconEl.className     = 'tab-icon';
    iconEl.style.display = 'none';

    const titleEl = document.createElement('div');
    titleEl.className = 'tab-title';
    titleEl.innerText = 'New Tab';

    const closeBtn = document.createElement('div');
    closeBtn.className = 'tab-close';
    closeBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px;">close</span>';

    tabEl.appendChild(spinnerEl);
    tabEl.appendChild(iconEl);
    tabEl.appendChild(titleEl);
    tabEl.appendChild(closeBtn);

    // --- Context Menu chuột phải ---
    tabEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const isPinned = tabEl.classList.contains('pinned');
        window.showContextMenu(e.clientX, e.clientY, [
            {
                label: isPinned ? 'Bỏ Ghim (Unpin)' : '📌 Ghim Thẻ (Pin)',
                action: () => {
                    tabEl.classList.toggle('pinned');
                    if (tabEl.classList.contains('pinned')) {
                        tabManager.tabsContainer.insertBefore(tabEl, tabManager.tabsContainer.firstChild);
                    }
                }
            },
            {
                label: '📺 Xem Ảnh trong ảnh (PiP)',
                action: () => window.triggerPiP()
            },
            {
                label: '✖️ Đóng Thẻ (Close)',
                action: () => tabManager.closeTab(tabId)
            }
        ]);
    });

    // --- Click & Chuột giữa ---
    tabEl.addEventListener('click',     ()  => tabManager.switchTab(tabId));
    tabEl.addEventListener('mousedown', (e) => {
        if (e.button === 1) {
            e.preventDefault();
            tabManager.closeTab(tabId);
        }
    });
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tabManager.closeTab(tabId);
    });

    return { tabEl, titleEl, iconEl, spinnerEl, closeBtn };
}

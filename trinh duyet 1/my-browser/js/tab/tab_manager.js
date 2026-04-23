// ============================================================
// js/tab/tab_manager.js  (Đã được Slim hóa)
// Quản lý vòng đời Tab: tạo, chuyển, đóng, đồng bộ dữ liệu
// Phụ thuộc: tab_ui.js, tab_hover_preview.js
// ============================================================

class TabManager {
    constructor() {
        this.tabs          = [];
        this.activeTabId   = null;
        this.tabCounter    = 0;
        this.draggedTabId  = null; // State cho Drag & Drop

        this.tabsContainer = document.getElementById('tabs-container');
        this.webContainer  = document.getElementById('web-container');
        this.btnNewTab     = document.getElementById('btn-new-tab');
        this.urlInput      = document.getElementById('url-input');

        this.init();
    }

    init() {
        this.btnNewTab.addEventListener('click', () => {
            this.urlInput.value = '';
            this.createTab();
        });
        this.createTab('about:blank');
    }

    createTab(url = 'about:blank') {
        const tabId = `tab-${++this.tabCounter}`;

        // 1. Tạo Webview (ủy quyền cho tab_ui.js)
        const webview = buildWebview(url);
        webview.id    = `webview-${tabId}`;
        bindWebviewEvents(webview, tabId, url, this);
        this.webContainer.appendChild(webview);

        // 2. Tạo DOM Tab (ủy quyền cho tab_ui.js)
        const { tabEl, titleEl } = buildTabElement(tabId, this);
        this.tabsContainer.insertBefore(tabEl, this.btnNewTab);

        // 3. Lưu trạng thái nội bộ
        const targetTab = { id: tabId, url, title: 'New Tab', webview, tabEl, titleEl, activeStream: null };
        this.tabs.push(targetTab);

        // 4. Gắn Hover Preview (ủy quyền cho tab_hover_preview.js)
        bindHoverLivePreview(targetTab, this);

        // 5. Tự động chuyển sang tab mới
        this.switchTab(tabId);
    }

    switchTab(tabId) {
        if (this.activeTabId === tabId) return;

        // Bỏ active tab cũ
        if (this.activeTabId) {
            const oldTab = this.tabs.find(t => t.id === this.activeTabId);
            if (oldTab) {
                oldTab.tabEl.classList.remove('active');
                oldTab.webview.classList.remove('active');
            }
        }

        // Active tab mới
        this.activeTabId = tabId;
        const newTab     = this.tabs.find(t => t.id === tabId);
        newTab.tabEl.classList.add('active');
        newTab.webview.classList.add('active');

        // Cập nhật Omnibox
        const currentUrl = newTab.webview.getURL() || newTab.url;
        this.urlInput.value = (currentUrl === 'about:blank') ? '' : currentUrl;

        // Thông báo cho renderer
        document.dispatchEvent(new CustomEvent('tab-switched', { detail: { webview: newTab.webview } }));
    }

    closeTab(tabId) {
        const tabIndex = this.tabs.findIndex(t => t.id === tabId);
        if (tabIndex === -1) return;

        const tab = this.tabs[tabIndex];
        tab.tabEl.remove();
        tab.webview.remove();
        this.tabs.splice(tabIndex, 1);

        // Dọn sạch Hover Preview
        const previewBox = document.getElementById('live-tab-preview-box');
        if (previewBox) previewBox.style.display = 'none';

        if (this.tabs.length === 0) {
            this.createTab();
        } else if (this.activeTabId === tabId) {
            const nextTab    = this.tabs[Math.max(0, tabIndex - 1)];
            this.activeTabId = null;
            this.switchTab(nextTab.id);
        }
    }

    handleNavigate(tabId, url) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) {
            tab.url = url;
            if (this.activeTabId === tabId) {
                this.urlInput.value = (url === 'about:blank' || url === 'about:blank/') ? '' : url;
            }
        }
    }

    handleTitleUpdate(tabId, title) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) {
            tab.title           = title;
            tab.titleEl.innerText = title;
        }
    }

    reorderTabsArray() {
        const newOrder = [];
        this.tabsContainer.querySelectorAll('.tab').forEach(domTab => {
            const found = this.tabs.find(t => t.id === domTab.id);
            if (found) newOrder.push(found);
        });
        this.tabs = newOrder;
    }
}

// Khởi tạo toàn cục
window.tabManager = new TabManager();

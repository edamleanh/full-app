// ============================================================
// js/features/bookmarks.js
// Hệ thống Dấu Trang (Bookmarks): load, save, render, drag-drop, rename
// Phụ thuộc: utils.js, context_menu.js
// ============================================================

let bookmarks = [];
let draggedBookmarkIndex = null;

function loadBookmarks() {
    try {
        const data = localStorage.getItem('lite_bookmarks');
        if (data) {
            bookmarks = JSON.parse(data);
        } else {
            bookmarks = [
                { title: 'Google',  url: 'https://www.google.com',  icon: 'https://www.google.com/s2/favicons?domain=google.com&sz=16'  },
                { title: 'YouTube', url: 'https://www.youtube.com', icon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=16' }
            ];
            saveBookmarks();
        }
    } catch (e) {
        bookmarks = [];
    }
    renderBookmarks();
}

function saveBookmarks() {
    localStorage.setItem('lite_bookmarks', JSON.stringify(bookmarks));
}

function renderBookmarks() {
    const bar      = document.getElementById('bookmarks-bar');
    const urlInput = document.getElementById('url-input');
    const starBtn  = document.getElementById('btn-add-bookmark');
    bar.innerHTML  = '';

    const wv = getActiveWebview();
    let currentUrl = '';
    try { currentUrl = wv ? wv.getURL() : ''; } catch {}

    let isBookmarked = false;

    bookmarks.forEach((bm, index) => {
        if (bm.url === currentUrl) isBookmarked = true;

        const el = document.createElement('div');
        el.className = 'bookmark-item';
        el.setAttribute('data-url', bm.url);
        el.innerHTML = `<img src="${bm.icon}" class="favicon"> <span>${bm.title}</span>`;

        // 1. Drag & Drop
        el.draggable = true;
        el.addEventListener('dragstart', (e) => {
            draggedBookmarkIndex = index;
            el.style.opacity = '0.4';
            e.dataTransfer.effectAllowed = 'move';
        });
        el.addEventListener('dragend', () => {
            draggedBookmarkIndex = null;
            el.style.opacity = '1';
        });
        el.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        el.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedBookmarkIndex !== null && draggedBookmarkIndex !== index) {
                const draggedItem = bookmarks[draggedBookmarkIndex];
                bookmarks.splice(draggedBookmarkIndex, 1);

                let newTargetIndex = index;
                if (draggedBookmarkIndex <= index) newTargetIndex--;

                const rect = el.getBoundingClientRect();
                if (e.clientX > rect.left + rect.width / 2) newTargetIndex++;

                bookmarks.splice(newTargetIndex, 0, draggedItem);
                saveBookmarks();
                renderBookmarks();
            }
        });

        // 2. Click để mở trang
        el.addEventListener('click', (e) => {
            if (e.target.tagName === 'INPUT') return;
            const activeWv = getActiveWebview();
            if (activeWv) {
                urlInput.value = bm.url;
                activeWv.loadURL(bm.url);
            }
        });

        // 3. Chuột phải: Đổi tên / Xóa
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            window.showContextMenu(e.clientX, e.clientY, [
                {
                    label: '✏️ Đổi Tên (Rename)',
                    action: () => {
                        el.innerHTML = `<img src="${bm.icon}" class="favicon"><input type="text" id="bm-rename-input" value="${bm.title}" style="background:transparent;color:#fff;border:1px solid var(--accent-color);outline:none;border-radius:3px;padding:2px 4px;font-size:13px;width:80px;box-shadow:0 0 5px rgba(50,205,50,0.4);">`;
                        const renameInput = document.getElementById('bm-rename-input');
                        renameInput.focus();
                        renameInput.select();

                        const finishRename = () => {
                            if (renameInput.value.trim()) {
                                bookmarks[index].title = renameInput.value.trim();
                                saveBookmarks();
                            }
                            renderBookmarks();
                        };
                        renameInput.addEventListener('keydown', (ev) => {
                            if (ev.key === 'Enter')  finishRename();
                            if (ev.key === 'Escape') renderBookmarks();
                        });
                        renameInput.addEventListener('blur', finishRename);
                    }
                },
                {
                    label: '❌ Xóa Dấu Trang (Delete)',
                    action: () => {
                        bookmarks.splice(index, 1);
                        saveBookmarks();
                        renderBookmarks();
                    }
                }
            ]);
        });

        bar.appendChild(el);
    });

    if (starBtn) {
        starBtn.classList.toggle('bookmarked', isBookmarked);
    }
}

// Nút Ngôi sao: Thêm / Xóa bookmark hiện tại
// Nút Ngôi sao: Thêm / Xóa bookmark hiện tại (Smart Toggle)
document.getElementById('btn-add-bookmark').addEventListener('click', () => {
    const wv = getActiveWebview();
    if (!wv) return;

    const url    = wv.getURL();
    const rawTitle = wv.getTitle();
    
    // 1. Chuẩn hóa URL để so khớp thông minh (loại bỏ / cuối và www.)
    const normalize = (u) => u.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '').toLowerCase();
    const normalizedTarget = normalize(url);

    // 2. Kiểm tra xem đã tồn tại chưa
    const existingIndex = bookmarks.findIndex(b => normalize(b.url) === normalizedTarget);

    if (existingIndex > -1) {
        // Nếu đã có -> Xóa (Toggle Off)
        bookmarks.splice(existingIndex, 1);
    } else {
        // 3. Nếu chưa có -> Thêm mới (Toggle On)
        
        // Tư duy thông minh: Trích xuất tên miền chính (vd: youtube.com) từ link dài
        let smartTitle = rawTitle;
        const hostname = new URL(url).hostname.replace(/^www\./i, '');
        
        // Luôn ưu tiên kiểm tra và thêm tên miền gốc vào Từ điển đề xuất (nếu chưa có)
        if (window.addToDictionary) {
            window.addToDictionary(hostname, hostname);
        }

        const domainMatch = window.customDictionary.find(d => d.url.toLowerCase() === hostname);
        if (domainMatch) {
            smartTitle = domainMatch.title;
        }

        // Lấy Favicon
        let iconUrl = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=16`;
        const activeTab = document.querySelector('.tab.active');
        if (activeTab) {
            const tabIcon = activeTab.querySelector('.tab-icon');
            const src = tabIcon ? tabIcon.getAttribute('src') : null;
            if (src && src !== '') iconUrl = src;
        }

        bookmarks.push({ title: smartTitle, url: url, icon: iconUrl });
        
        // Đã gỡ bỏ việc tự động thêm vào Từ điển đề xuất theo yêu cầu phân tách
    }

    saveBookmarks();
    renderBookmarks();
});

// Khởi chạy
loadBookmarks();

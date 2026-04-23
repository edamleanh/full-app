// ============================================================
// js/features/navigation.js
// Xử lý: Nút Back/Forward/Reload, URL Input, Omnibox keydown
// Phụ thuộc: utils.js, omnibox.js, context_menu.js, dictionary.js
// ============================================================

const btnBack    = document.getElementById('btn-back');
const btnForward = document.getElementById('btn-forward');
const btnReload  = document.getElementById('btn-reload');
const urlInput   = document.getElementById('url-input');

// --- Nút điều hướng ---
btnBack.addEventListener('click', () => {
    const wv = getActiveWebview();
    if (wv && wv.canGoBack()) wv.goBack();
});

btnForward.addEventListener('click', () => {
    const wv = getActiveWebview();
    if (wv && wv.canGoForward()) wv.goForward();
});

btnReload.addEventListener('click', () => {
    const wv = getActiveWebview();
    if (wv) wv.reload();
});

const btnPip = document.getElementById('btn-pip');
if (btnPip) {
    btnPip.addEventListener('click', () => {
        window.triggerPiP();
    });
}

const btnDarkMode = document.getElementById('btn-dark-mode');
if (btnDarkMode) {
    btnDarkMode.addEventListener('click', () => {
        window.toggleDarkMode();
    });
}

// Hàm kích hoạt PiP toàn cục
window.triggerPiP = function() {
    const wv = getActiveWebview();
    if (!wv) return;

    // Script tiêm vào Webview để yêu cầu PiP
    const pipScript = `
        (function() {
            const video = document.querySelector('video');
            if (video) {
                if (document.pictureInPictureElement) {
                    document.exitPictureInPicture();
                } else {
                    video.requestPictureInPicture().catch(err => {
                        console.error('PiP Error:', err);
                        alert('Không thể kích hoạt PiP trên trang này.');
                    });
                }
            } else {
                alert('Không tìm thấy video nào trên trang này.');
            }
        })();
    `;
    wv.executeJavaScript(pipScript);
};

// --- URL Input ---
urlInput.addEventListener('click', function () {
    this.select();
    showSuggestions(this.value);
});

urlInput.addEventListener('input', function () {
    showSuggestions(this.value);
});

// --- Phím Omnibox ---
urlInput.addEventListener('keydown', (event) => {
    const suggestionsBox = document.getElementById('omnibox-suggestions');
    const isBoxVisible   = !suggestionsBox.classList.contains('hidden');
    const items          = suggestionsBox.querySelectorAll('.suggestion-item');

    if (isBoxVisible && items.length > 0) {
        // Hỗ trợ cả phím Mũi Tên và phím Tab (như Chrome)
        if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey)) {
            event.preventDefault(); // Ngăn Tab chuyển focus đi chỗ khác
            selectedSuggestionIndex++;
            if (selectedSuggestionIndex >= items.length) selectedSuggestionIndex = 0;
            updateSuggestionHighlight(items);
            return;
        } else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
            event.preventDefault();
            selectedSuggestionIndex--;
            if (selectedSuggestionIndex < 0) selectedSuggestionIndex = items.length - 1;
            updateSuggestionHighlight(items);
            return;
        } else if (event.key === 'Escape') {
            hideSuggestions();
            return;
        }
    }

    if (event.key === 'Enter') {
        // Nếu có hộp gợi ý đang mở: chọn đề xuất đầu tiên (hoặc đã chọn)
        if (isBoxVisible && items.length > 0) {
            const index = selectedSuggestionIndex > -1 ? selectedSuggestionIndex : 0;
            if (items[index]) {
                urlInput.value = items[index].getAttribute('data-url');
            }
            hideSuggestions();
        }

        // Điều hướng
        const rawUrl = urlInput.value.trim();
        const wv     = getActiveWebview();
        hideSuggestions();
        if (!rawUrl || !wv) return;

        const url = resolveUrl(rawUrl);
        try { wv.loadURL(url); }
        catch (e) { wv.src = url; }
    }
});

// --- Chuột phải URL Input: mở Từ Điển ---
urlInput.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    window.showContextMenu(e.clientX, e.clientY, [
        {
            label: '📖 Quản lý Từ Điển Đề Xuất',
            action: () => {
                document.getElementById('dictionary-modal').classList.remove('hidden');
                document.getElementById('dict-input').focus();
            }
        }
    ]);
});

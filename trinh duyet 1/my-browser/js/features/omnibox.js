// ============================================================
// js/features/omnibox.js
// Hệ thống Gợi Ý (Autocomplete) cho thanh địa chỉ
// Phụ thuộc: utils.js, dictionary.js, bookmarks.js
// ============================================================

let selectedSuggestionIndex = -1;

function showSuggestions(query) {
    const q   = query.toLowerCase().trim();
    const box = document.getElementById('omnibox-suggestions');
    box.innerHTML = '';
    selectedSuggestionIndex = -1;

    if (q === '') {
        hideSuggestions();
        return;
    }

    // Chỉ lấy từ Từ điển đề xuất (Không lấy từ Dấu trang theo yêu cầu)
    const allItems = [
        ...customDictionary.map(d => ({ title: d.title, url: d.url, type: '📖' }))
    ];

    // Lọc theo từ khóa
    const results = allItems.filter(item =>
        item.title.toLowerCase().includes(q) || item.url.toLowerCase().includes(q)
    );

    // Loại trùng URL thông minh (Chuẩn hóa trước khi so sánh)
    const normalize = (u) => u.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '').toLowerCase();
    
    const uniqueResults = [];
    const seenNormalizedUrls = new Set();
    
    for (const res of results) {
        const norm = normalize(res.url);
        if (!seenNormalizedUrls.has(norm)) {
            seenNormalizedUrls.add(norm);
            uniqueResults.push(res);
        }
    }

    if (uniqueResults.length === 0) {
        hideSuggestions();
        return;
    }

    const urlInput = document.getElementById('url-input');
    uniqueResults.slice(0, 10).forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.setAttribute('data-url', item.url);
        div.innerHTML = `<span>${item.type}</span> <strong>${item.title}</strong> - <small style="color:#aaa">${item.url}</small>`;

        div.addEventListener('click', () => {
            urlInput.value = item.url;
            hideSuggestions();
            const wv = getActiveWebview();
            if (wv) wv.loadURL(item.url.startsWith('http') ? item.url : 'https://' + item.url);
        });

        box.appendChild(div);
    });

    box.classList.remove('hidden');
    const overlay = document.getElementById('context-menu-overlay');
    if (overlay) overlay.classList.remove('hidden');
}

function hideSuggestions() {
    const box = document.getElementById('omnibox-suggestions');
    const overlay = document.getElementById('context-menu-overlay');
    if (box) box.classList.add('hidden');
    if (overlay) overlay.classList.add('hidden');
    selectedSuggestionIndex = -1;
}

function updateSuggestionHighlight(items) {
    const urlInput = document.getElementById('url-input');
    items.forEach(item => item.classList.remove('selected'));
    if (selectedSuggestionIndex >= 0 && items[selectedSuggestionIndex]) {
        const el = items[selectedSuggestionIndex];
        el.classList.add('selected');
        urlInput.value = el.getAttribute('data-url');
        el.scrollIntoView({ block: 'nearest' });
    }
}

// Ẩn khi click ra ngoài (bao gồm cả click lên webview thông qua overlay)
document.addEventListener('click', (e) => {
    const box      = document.getElementById('omnibox-suggestions');
    const urlInput = document.getElementById('url-input');
    const overlay  = document.getElementById('context-menu-overlay');
    
    // Nếu click vào overlay hoặc click ra ngoài vùng input/box -> Ẩn
    if (e.target === overlay || (box && !box.contains(e.target) && e.target !== urlInput)) {
        hideSuggestions();
    }
});

// ============================================================
// js/features/dictionary.js
// Hệ thống Từ Điển Đề Xuất cá nhân (Omnibox autocomplete source)
// ============================================================

window.customDictionary = [];
let customDictionary = window.customDictionary;

const DEFAULT_DICT = [
    { title: 'Google',    url: 'google.com'    },
    { title: 'Facebook',  url: 'facebook.com'  },
    { title: 'YouTube',   url: 'youtube.com'   },
    { title: 'TikTok',    url: 'tiktok.com'    },
    { title: 'Instagram', url: 'instagram.com' },
    { title: 'Twitter',   url: 'x.com'         },
    { title: 'LinkedIn',  url: 'linkedin.com'  },
    { title: 'Reddit',    url: 'reddit.com'    },
    { title: 'Pinterest', url: 'pinterest.com' },
    { title: 'GitHub',    url: 'github.com'    },
    { title: 'Zalo',      url: 'chat.zalo.me'  },
    { title: 'Twitch',    url: 'twitch.tv'     },
    { title: 'Spotify',   url: 'open.spotify.com'},
    
];

function loadDictionary() {
    try {
        const data = localStorage.getItem('lite_dictionary');
        customDictionary = data ? JSON.parse(data) : [...DEFAULT_DICT];
    } catch {
        customDictionary = [...DEFAULT_DICT];
    }
    renderDictionaryModal();
}

function saveDictionary() {
    localStorage.setItem('lite_dictionary', JSON.stringify(customDictionary));
}

function renderDictionaryModal() {
    const list = document.getElementById('dict-list');
    if (!list) return;
    list.innerHTML = '';

    customDictionary.forEach((dict, index) => {
        const item = document.createElement('div');
        item.className = 'dict-item';
        item.innerHTML = `
            <span>${dict.url}</span>
            <button class="btn-delete-dict" data-index="${index}">
                <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
            </button>
        `;
        list.appendChild(item);
    });

    list.querySelectorAll('.btn-delete-dict').forEach(btn => {
        btn.addEventListener('click', function () {
            const idx = parseInt(this.getAttribute('data-index'));
            customDictionary.splice(idx, 1);
            saveDictionary();
            renderDictionaryModal();
        });
    });
}

// --- Sự kiện UI Modal ---
const closeModal = () => {
    document.getElementById('dictionary-modal').classList.add('hidden');
};

document.getElementById('btn-close-modal').addEventListener('click', closeModal);
document.getElementById('btn-close-modal-overlay').addEventListener('click', closeModal);

document.getElementById('btn-add-dict').addEventListener('click', () => {
    const input = document.getElementById('dict-input');
    let rawValue = input.value.trim().toLowerCase();
    
    if (rawValue) {
        let domain = rawValue;
        
        // Tư duy thông minh: Tự động trích xuất tên miền nếu là link dài
        try {
            if (rawValue.includes('.') && (rawValue.startsWith('http') || rawValue.includes('/'))) {
                const urlObj = new URL(rawValue.startsWith('http') ? rawValue : 'https://' + rawValue);
                domain = urlObj.hostname.replace(/^www\./i, '');
            } else {
                domain = rawValue.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
            }
        } catch (e) {
            // Fallback nếu parse URL lỗi
            domain = rawValue.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
        }

        // Kiểm tra trùng
        const exists = customDictionary.some(d => d.url.toLowerCase() === domain);
        if (!exists) {
            customDictionary.push({ title: domain, url: domain });
            saveDictionary();
            renderDictionaryModal();
            input.value = '';
        } else {
            // Nếu đã tồn tại thì chỉ cần xóa input
            input.value = '';
        }
    }
});
 
 /**
  * Thêm một mục vào từ điển một cách thông minh (không trùng lặp và không lưu trang con nếu tên miền đã có)
  */
 window.addToDictionary = function(title, url) {
     const normalizedUrl = url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '').toLowerCase();
     
     // Tư duy thông minh: Nếu tên miền chính đã có trong từ điển, không thêm các trang con rườm rà
     const hostname = new URL(url.startsWith('http') ? url : 'https://' + url).hostname.replace(/^www\./i, '');
     const isDomainAlreadyTrusted = customDictionary.some(d => {
         const dictUrl = d.url.toLowerCase();
         return dictUrl === hostname || dictUrl === normalizedUrl;
     });
     
     if (!isDomainAlreadyTrusted) {
         customDictionary.push({ title, url: normalizedUrl });
         saveDictionary();
         renderDictionaryModal();
     }
 };

// Khởi chạy
loadDictionary();

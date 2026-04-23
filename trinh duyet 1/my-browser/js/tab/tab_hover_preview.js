// ============================================================
// js/tab/tab_hover_preview.js
// Logic Live Video Hover Card (xem trước tab đang không active)
// Phụ thuộc: (không phụ thuộc module nào, dùng window.browserAPI)
// ============================================================

/**
 * Gắn logic Hover Preview cho một tab
 * @param {Object} tab - { id, tabEl, webview, activeStream }
 * @param {Object} tabManager - instance của TabManager
 */
function bindHoverLivePreview(tab, tabManager) {
    let hoverTimer = null;

    // Ẩn vĩnh viễn box review cũ
    const pbox = document.getElementById('live-tab-preview-box');
    if (pbox) pbox.style.display = 'none';

    tab.tabEl.addEventListener('mouseenter', () => {
        // Không thao tác với tab đang active
        if (tabManager.activeTabId === tab.id) return;

        if (hoverTimer) clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
            const wv = tab.webview;
            if (!wv) return;

            // Chạy ngầm kịch bản tìm thẻ Video để bật PiP
            const enterPipScript = `
                (function() {
                    const video = document.querySelector('video');
                    if (video) {
                        // Thử đánh thức video thức dậy nếu nó bị tạm dừng khi thoát PiP trước đó
                        if (video.paused) {
                            video.play().catch(e => {});
                        }
                        
                        // Đảm bảo không bị vướng state PiP cũ
                        if (!document.pictureInPictureElement) {
                            video.requestPictureInPicture().catch(err => {
                                console.log('Auto PiP failed:', err);
                            });
                        } else if (document.pictureInPictureElement !== video) {
                            document.exitPictureInPicture().then(() => {
                                video.requestPictureInPicture();
                            }).catch(e => {});
                        }
                    }
                })();
            `;
            // Chìa khóa vàng: tham số "true" cung cấp Mã thông báo Tương tác Người Dùng ảo cho tập lệnh (Bypass User Gesture Requirement)
            try { wv.executeJavaScript(enterPipScript, true); } catch (e) {}
        }, 400); // Đợi 400ms nán lại mới bật PiP để tránh nháy giật lúc lướt ngang
    });

    // Khi di chuột ra khỏi tab: tắt PiP
    tab.tabEl.addEventListener('mouseleave', () => {
        if (hoverTimer) clearTimeout(hoverTimer);

        if (tabManager.activeTabId === tab.id) return; // Nếu lỡ bấm đổi sang tab này rồi thì không tắt Video

        const wv = tab.webview;
        if (!wv) return;

        // Kịch bản thoát PiP
        const exitPipScript = `
            (function() {
                if (document.pictureInPictureElement) {
                    document.exitPictureInPicture().catch(err => {
                        console.log('Exit PiP Error:', err);
                    });
                }
            })();
        `;
        try { wv.executeJavaScript(exitPipScript, true); } catch (e) {}
    });
}

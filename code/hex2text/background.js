/**
 * Background Service Worker
 * Handles tab creation and context menu
 */

/**
 * Create context menu on install
 */
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'hex2text-decode',
        title: '🔓 Giải mã HEX',
        contexts: ['selection']
    });
    console.log('Context menu created');
});

/**
 * Handle context menu clicks
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'hex2text-decode' && info.selectionText) {
        // Send message to content script to show decode bubble
        chrome.tabs.sendMessage(tab.id, {
            action: 'decodeSelection',
            text: info.selectionText
        });
    }
});

/**
 * Listen for messages from content script and popup
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openTab') {
        handleOpenTab(message.url, message.incognito);
    }
});

/**
 * Open URL in new tab (normal or incognito)
 */
async function handleOpenTab(url, incognito) {
    try {
        if (incognito) {
            // Open in new incognito window
            await chrome.windows.create({
                url: url,
                incognito: true,
                focused: true
            });
        } else {
            // Open in new tab in current window
            await chrome.tabs.create({
                url: url,
                active: true
            });
        }
    } catch (error) {
        console.error('Error opening tab:', error);

        // If incognito fails (permission not granted), open in normal tab
        if (incognito) {
            console.log('Incognito mode not available, opening in normal tab');
            try {
                await chrome.tabs.create({
                    url: url,
                    active: true
                });
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        }
    }
}

// Log when service worker starts
console.log('Giải mã HEX - Background service worker loaded');

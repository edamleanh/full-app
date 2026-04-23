/**
 * Popup Script - Popup Mode
 * Handles manual HEX decoding in extension popup
 */

// DOM elements
const hexInput = document.getElementById('hex-input');
const decodeBtn = document.getElementById('decode-btn');
const resultSection = document.getElementById('result-section');
const resultText = document.getElementById('result-text');
const copyBtn = document.getElementById('copy-btn');
const urlActions = document.getElementById('url-actions');
const openBtn = document.getElementById('open-btn');
const openIncognitoBtn = document.getElementById('open-incognito-btn');

// Store decoded URL
let decodedUrl = null;

/**
 * Initialize popup
 */
function init() {
    // Auto-focus input
    hexInput.focus();

    // Event listeners
    decodeBtn.addEventListener('click', handleDecode);
    copyBtn.addEventListener('click', handleCopy);
    openBtn.addEventListener('click', () => handleOpenUrl(false));
    openIncognitoBtn.addEventListener('click', () => handleOpenUrl(true));

    // Allow Enter to decode (Ctrl/Cmd + Enter)
    hexInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleDecode();
        }
    });
}

/**
 * Handle decode button click
 */
function handleDecode() {
    const hexString = hexInput.value.trim();

    if (!hexString) {
        showError('Vui lòng nhập chuỗi HEX');
        return;
    }

    if (!isValidHex(hexString)) {
        showError('Định dạng HEX không hợp lệ');
        return;
    }

    // Decode
    const decoded = decodeHex(hexString);

    if (decoded === 'Invalid HEX') {
        showError('Không thể giải mã HEX');
        return;
    }

    // Show result
    showResult(decoded);
}

/**
 * Show decoded result
 */
function showResult(text) {
    resultText.textContent = text;
    resultText.classList.remove('error');
    resultSection.style.display = 'block';

    // Check if result is a URL
    if (isValidUrl(text)) {
        decodedUrl = text.trim();
        urlActions.style.display = 'flex';
    } else {
        decodedUrl = null;
        urlActions.style.display = 'none';
    }
}

/**
 * Show error message
 */
function showError(message) {
    resultText.textContent = message;
    resultText.classList.add('error');
    resultSection.style.display = 'block';
    urlActions.style.display = 'none';
    decodedUrl = null;
}

/**
 * Handle copy to clipboard
 */
async function handleCopy() {
    const text = resultText.textContent;

    if (!text || resultText.classList.contains('error')) {
        return;
    }

    try {
        await navigator.clipboard.writeText(text);

        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1000);
    } catch (error) {
        console.error('Failed to copy:', error);
    }
}

/**
 * Handle open URL
 */
function handleOpenUrl(incognito) {
    if (!decodedUrl) return;

    chrome.runtime.sendMessage({
        action: 'openTab',
        url: decodedUrl,
        incognito: incognito
    });

    // Close popup after opening
    window.close();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

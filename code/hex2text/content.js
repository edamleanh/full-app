/**
 * Content Script - Inline Mode
 * Handles HEX selection and inline decoding
 */

console.log('[HEX2TEXT] Content script loaded!', window.location.href);

// State management
let floatingIcon = null;
let inlineBubble = null;
let currentSelection = null;
let justCreatedBubble = false; // Flag to prevent immediate dismiss

// AbortController for event listeners cleanup
let abortController = new AbortController();

/**
 * Initialize content script
 */
function init() {
    console.log('[HEX2TEXT] Initializing content script...');
    document.addEventListener('mouseup', handleMouseUp, { signal: abortController.signal });
    document.addEventListener('selectionchange', handleSelectionChange, { signal: abortController.signal });
    document.addEventListener('scroll', cleanup, { signal: abortController.signal, passive: true });
    document.addEventListener('click', handleDocumentClick, { signal: abortController.signal });

    // Listen for messages from background (context menu)
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'decodeSelection' && message.text) {
            handleContextMenuDecode(message.text);
        }
    });
    console.log('[HEX2TEXT] Content script initialized successfully!');
}

/**
 * Handle mouse up event
 */
function handleMouseUp(e) {
    console.log('[HEX2TEXT] Mouse up event');
    // Small delay to ensure selection is complete
    setTimeout(() => {
        // CRITICAL: Skip if bubble exists (prevents destroying it)
        if (inlineBubble) {
            console.log('[HEX2TEXT] Bubble exists, skipping mouseup');
            return;
        }

        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        console.log('[HEX2TEXT] Selected text:', selectedText);
        console.log('[HEX2TEXT] Selected text length:', selectedText.length);

        if (!selectedText) {
            console.log('[HEX2TEXT] No text selected, cleaning up');
            cleanup();
            return;
        }

        // Check if selected text is valid HEX
        console.log('[HEX2TEXT] Checking if valid HEX...');
        if (isValidHex(selectedText)) {
            console.log('[HEX2TEXT] Valid HEX! Setting currentSelection to:', selectedText);
            currentSelection = selectedText;
            console.log('[HEX2TEXT] currentSelection is now:', currentSelection);
            showFloatingIcon(selection);
        } else {
            console.log('[HEX2TEXT] Not valid HEX, cleaning up');
            cleanup();
        }
    }, 10);
}

/**
 * Handle selection change
 */
function handleSelectionChange() {
    const selection = window.getSelection();
    const hasSelection = selection.toString().trim();

    console.log('[HEX2TEXT] Selection changed, hasSelection:', !!hasSelection, 'inlineBubble exists:', !!inlineBubble);

    // Don't cleanup if bubble is showing - let user interact with it
    if (inlineBubble) {
        console.log('[HEX2TEXT] Bubble is showing, ignoring selection change');
        return;
    }

    if (!hasSelection) {
        cleanup();
    }
}

/**
 * Handle document clicks to dismiss bubble
 */
function handleDocumentClick(e) {
    console.log('[HEX2TEXT] Document clicked');
    console.log('[HEX2TEXT] - target:', e.target);
    console.log('[HEX2TEXT] - target.className:', e.target.className);
    console.log('[HEX2TEXT] - inlineBubble:', inlineBubble);

    // Ignore clicks immediately after bubble creation
    if (justCreatedBubble) {
        console.log('[HEX2TEXT] Just created bubble, ignoring this click');
        return;
    }

    // Don't dismiss if clicking inside the bubble or icon
    if (floatingIcon && floatingIcon.contains(e.target)) {
        console.log('[HEX2TEXT] Clicked inside icon, not dismissing');
        return;
    }

    // Check if click is inside bubble or any of its children
    if (inlineBubble) {
        // Check if the clicked element is the bubble itself or inside it
        if (e.target === inlineBubble || inlineBubble.contains(e.target)) {
            console.log('[HEX2TEXT] Clicked inside bubble (target is bubble or child), not dismissing');
            return;
        }

        // Additional check: walk up the DOM tree to see if we're inside bubble
        let element = e.target;
        while (element) {
            if (element === inlineBubble) {
                console.log('[HEX2TEXT] Clicked inside bubble (found via parent walk), not dismissing');
                return;
            }
            element = element.parentElement;
        }
    }

    // Dismiss if clicking outside
    if (inlineBubble) {
        console.log('[HEX2TEXT] Clicked OUTSIDE bubble, dismissing');
        cleanup();
    }
}

/**
 * Handle context menu decode request
 */
function handleContextMenuDecode(text) {
    const trimmedText = text.trim();

    if (!isValidHex(trimmedText)) {
        return; // Ignore if not valid HEX
    }

    currentSelection = trimmedText;

    // Get current selection position to show bubble
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        showInlineBubble(rect, trimmedText);  // Pass text directly
    } else {
        // If no selection, try to get a reasonable position (e.g., center of viewport)
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const rect = {
            left: viewportWidth / 2 - 100,
            top: viewportHeight / 2 - 50,
            bottom: viewportHeight / 2 + 50,
            right: viewportWidth / 2 + 100,
            width: 200,
            height: 100
        };
        showInlineBubble(rect, trimmedText);  // Pass text directly
    }
}

/**
 * Show floating decode icon near selection
 */
function showFloatingIcon(selection) {
    console.log('[HEX2TEXT] showFloatingIcon called');
    console.log('[HEX2TEXT] currentSelection at icon creation:', currentSelection);

    // CRITICAL: Save currentSelection to local variable BEFORE cleanup()
    // because cleanup() sets currentSelection = null
    const hexToStore = currentSelection;
    console.log('[HEX2TEXT] hexToStore (saved before cleanup):', hexToStore);

    cleanup();

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Create floating icon
    floatingIcon = document.createElement('div');
    floatingIcon.className = 'hex2text-icon';
    floatingIcon.innerHTML = '🔓 Giải mã HEX';
    floatingIcon.title = 'Giải mã HEX sang Text';

    // Store selection and rect in the element to avoid losing it on click
    console.log('[HEX2TEXT] Storing in dataset:', hexToStore);
    floatingIcon.dataset.hexSelection = hexToStore;
    floatingIcon.dataset.rectLeft = rect.left.toString();
    floatingIcon.dataset.rectTop = rect.top.toString();
    floatingIcon.dataset.rectBottom = rect.bottom.toString();
    floatingIcon.dataset.rectRight = rect.right.toString();

    console.log('[HEX2TEXT] Dataset after storage:', floatingIcon.dataset.hexSelection);

    // Position below selection
    floatingIcon.style.position = 'absolute';
    floatingIcon.style.left = `${window.scrollX + rect.left}px`;
    floatingIcon.style.top = `${window.scrollY + rect.bottom + 5}px`;

    floatingIcon.addEventListener('click', (e) => {
        console.log('[HEX2TEXT] Icon clicked!');
        e.preventDefault();
        e.stopPropagation();

        // Retrieve selection from element data
        const savedSelection = e.currentTarget.dataset.hexSelection;
        const savedRect = {
            left: parseFloat(e.currentTarget.dataset.rectLeft),
            top: parseFloat(e.currentTarget.dataset.rectTop),
            bottom: parseFloat(e.currentTarget.dataset.rectBottom),
            right: parseFloat(e.currentTarget.dataset.rectRight)
        };

        console.log('[HEX2TEXT] Saved selection:', savedSelection);
        console.log('[HEX2TEXT] Saved rect:', savedRect);

        showInlineBubble(savedRect, savedSelection);
    }, { capture: true });

    document.body.appendChild(floatingIcon);
    console.log('[HEX2TEXT] Icon appended to body');
}

/**
 * Show inline bubble with decoded text
 */
function showInlineBubble(rect, hexText) {
    console.log('[HEX2TEXT] showInlineBubble called with rect:', rect);
    console.log('[HEX2TEXT] hexText parameter:', hexText);

    // Use parameter if provided, otherwise fall back to currentSelection
    const textToDecode = hexText || currentSelection;

    console.log('[HEX2TEXT] Text to decode:', textToDecode);

    if (!textToDecode) {
        console.error('[HEX2TEXT] No text to decode!');
        return;
    }

    // Decode the HEX
    const decoded = decodeHex(textToDecode);
    console.log('[HEX2TEXT] Decoded result:', decoded);
    const isUrl = isValidUrl(decoded);
    console.log('[HEX2TEXT] Is URL:', isUrl);

    // Remove icon
    if (floatingIcon) {
        floatingIcon.remove();
        floatingIcon = null;
    }

    // Create bubble
    inlineBubble = document.createElement('div');
    inlineBubble.className = 'hex2text-bubble';

    // Set flag to prevent immediate dismiss
    justCreatedBubble = true;
    console.log('[HEX2TEXT] Set justCreatedBubble = true');

    // Clear flag after a short delay
    setTimeout(() => {
        justCreatedBubble = false;
        console.log('[HEX2TEXT] Cleared justCreatedBubble flag');
    }, 300);

    // Prevent ALL clicks inside bubble from propagating to document
    inlineBubble.addEventListener('click', (e) => {
        console.log('[HEX2TEXT] Bubble clicked, target:', e.target.tagName);
        // CRITICAL: Allow button clicks to propagate
        if (e.target.tagName === 'BUTTON') {
            console.log('[HEX2TEXT] Button detected, allowing click');
            return; // Don't block button clicks
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
    }, true); // Use capture phase

    // Also add in bubble phase for extra safety
    inlineBubble.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            return; // Allow buttons
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
    }, false);

    // Result container
    const resultDiv = document.createElement('div');
    resultDiv.className = 'hex2text-result';
    resultDiv.textContent = decoded;
    inlineBubble.appendChild(resultDiv);

    // Add URL actions if result is a URL
    if (isUrl && decoded !== 'Invalid HEX') {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'hex2text-url-actions';

        const openBtn = document.createElement('button');
        openBtn.className = 'hex2text-btn hex2text-btn-primary';
        openBtn.innerHTML = '🔗 Mở link';
        openBtn.addEventListener('click', (e) => {
            console.log('[HEX2TEXT] Open button clicked!');
            openUrl(decoded, false);
        });

        const incognitoBtn = document.createElement('button');
        incognitoBtn.className = 'hex2text-btn hex2text-btn-secondary';
        incognitoBtn.innerHTML = '🕵️ Mở ẩn danh';
        incognitoBtn.addEventListener('click', (e) => {
            console.log('[HEX2TEXT] Incognito button clicked!');
            openUrl(decoded, true);
        });

        actionsDiv.appendChild(openBtn);
        actionsDiv.appendChild(incognitoBtn);
        inlineBubble.appendChild(actionsDiv);
    }

    // Position bubble
    inlineBubble.style.position = 'absolute';
    inlineBubble.style.left = `${window.scrollX + rect.left}px`;
    inlineBubble.style.top = `${window.scrollY + rect.bottom + 5}px`;

    // Force visibility with inline styles
    inlineBubble.style.display = 'block';
    inlineBubble.style.visibility = 'visible';
    inlineBubble.style.opacity = '1';
    inlineBubble.style.zIndex = '2147483647'; // Maximum z-index
    inlineBubble.style.pointerEvents = 'auto';
    inlineBubble.style.width = 'auto';
    inlineBubble.style.height = 'auto';

    console.log('[HEX2TEXT] Appending bubble to body at position:', {
        left: inlineBubble.style.left,
        top: inlineBubble.style.top,
        display: inlineBubble.style.display,
        visibility: inlineBubble.style.visibility,
        opacity: inlineBubble.style.opacity,
        zIndex: inlineBubble.style.zIndex
    });

    document.body.appendChild(inlineBubble);
    console.log('[HEX2TEXT] Bubble appended! Element:', inlineBubble);
    console.log('[HEX2TEXT] Bubble innerHTML:', inlineBubble.innerHTML);
    console.log('[HEX2TEXT] Bubble offsetWidth:', inlineBubble.offsetWidth);
    console.log('[HEX2TEXT] Bubble offsetHeight:', inlineBubble.offsetHeight);
    console.log('[HEX2TEXT] Bubble getBoundingClientRect:', inlineBubble.getBoundingClientRect());

    // Adjust position if bubble goes off screen
    setTimeout(() => {
        const bubbleRect = inlineBubble.getBoundingClientRect();
        if (bubbleRect.right > window.innerWidth) {
            inlineBubble.style.left = `${window.scrollX + window.innerWidth - bubbleRect.width - 10}px`;
        }
        if (bubbleRect.bottom > window.innerHeight) {
            inlineBubble.style.top = `${window.scrollY + rect.top - bubbleRect.height - 5}px`;
        }
    }, 0);
}

/**
 * Open URL in new tab
 */
function openUrl(url, incognito) {
    chrome.runtime.sendMessage({
        action: 'openTab',
        url: url,
        incognito: incognito
    });
    cleanup();
}

/**
 * Cleanup all created elements
 */
function cleanup() {
    console.log('[HEX2TEXT] Cleanup called');
    if (floatingIcon) {
        floatingIcon.remove();
        floatingIcon = null;
    }
    if (inlineBubble) {
        inlineBubble.remove();
        inlineBubble = null;
    }
    currentSelection = null;
    justCreatedBubble = false; // Reset flag
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    abortController.abort();
    cleanup();
});

// Monitor for dynamic content loading (e.g., pagination or lazy loading)
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            removeBlurs();
        }
    });
});

function removeBlurs() {
    const blurredElements = document.querySelectorAll('.blur-text, .blur-content, [class*="blur"]');
    blurredElements.forEach(el => {
        el.style.filter = 'none';
        el.style.webkitFilter = 'none';
        el.style.maxHeight = 'none';
        el.style.height = 'auto';
        el.style.overflow = 'visible';
        el.style.webkitLineClamp = 'unset';
    });

    // Hide login gates
    const gates = document.querySelectorAll('.js-login-modal, .btn-outline-review, .blur-overlay, [class*="blur-overlay"]');
    gates.forEach(gate => {
        gate.style.display = 'none';
    });
}

// Initial run
removeBlurs();

// Start observing the body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('Note8 Unblur: Content script active');

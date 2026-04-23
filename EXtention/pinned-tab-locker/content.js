// content.js for Pinned Tab Locker

let isOverlayCreated = false;
let lockOverlay = null;

function createLockOverlay() {
  if (isOverlayCreated) return;

  lockOverlay = document.createElement('div');
  lockOverlay.id = 'ptl-lock-overlay';
  lockOverlay.innerHTML = `
    <div class="ptl-background-blob" style="top: 20%; left: 20%;"></div>
    <div class="ptl-background-blob" style="bottom: 20%; right: 20%; background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);"></div>
    <div id="ptl-lock-container">
      <div class="ptl-icon">🔒</div>
      <div class="ptl-title">Tab Đã Khóa</div>
      <div class="ptl-subtitle">Vui lòng nhập mật khẩu để tiếp tục</div>
      <div class="ptl-input-group">
        <input type="password" id="ptl-password-input" placeholder="••••" autofocus>
      </div>
      <button id="ptl-unlock-btn">Mở Khóa</button>
      <div id="ptl-error-msg" class="ptl-error-msg">Mật khẩu không chính xác</div>
    </div>
  `;

  document.documentElement.appendChild(lockOverlay);
  isOverlayCreated = true;

  // Event listeners
  const unlockBtn = lockOverlay.querySelector('#ptl-unlock-btn');
  const passwordInput = lockOverlay.querySelector('#ptl-password-input');
  const errorMsg = lockOverlay.querySelector('#ptl-error-msg');

  const attemptUnlock = () => {
    const password = passwordInput.value;
    chrome.runtime.sendMessage({ action: 'VERIFY_PASSWORD', password }, (response) => {
      if (response && response.success) {
        hideOverlay();
        // Since we unlocked globally for the session, notify other tabs if needed (optional as they check on activation)
      } else {
        errorMsg.textContent = response.error || 'Lỗi không xác định';
        errorMsg.classList.add('visible');
        passwordInput.value = '';
        passwordInput.focus();
        
        // Shake animation
        const container = lockOverlay.querySelector('#ptl-lock-container');
        container.style.animation = 'none';
        container.offsetHeight; // trigger reflow
        container.style.animation = 'ptl-shake 0.4s';
      }
    });
  };

  unlockBtn.addEventListener('click', attemptUnlock);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') attemptUnlock();
  });

  // Add shake animation to CSS dynamically if not present
  if (!document.getElementById('ptl-dynamic-styles')) {
    const style = document.createElement('style');
    style.id = 'ptl-dynamic-styles';
    style.textContent = `
      @keyframes ptl-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
    `;
    document.head.appendChild(style);
  }
}

function showOverlay() {
  createLockOverlay();
  setTimeout(() => {
    lockOverlay.classList.add('visible');
    const input = lockOverlay.querySelector('#ptl-password-input');
    if (input) input.focus();
  }, 10);
}

function hideOverlay() {
  if (lockOverlay) {
    lockOverlay.classList.remove('visible');
    // We could remove it from DOM but keeping it for performance is fine
  }
}

// Initial check
function checkStatus() {
  chrome.runtime.sendMessage({ action: 'CHECK_LOCK_STATUS' }, (sessionResponse) => {
    if (sessionResponse && sessionResponse.isUnlocked) {
      hideOverlay();
    } else {
      // Check if this tab is actually pinned
      // For simplicity, background.js will tell us
      chrome.runtime.sendMessage({ action: 'GET_TAB_INFO' }, (tabResponse) => {
        if (tabResponse && tabResponse.pinned) {
          showOverlay();
        } else {
          hideOverlay();
        }
      });
    }
  });
}

// Listen for activation messages from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'TAB_ACTIVATED') {
    checkStatus();
  }
});

// Run check on load
checkStatus();

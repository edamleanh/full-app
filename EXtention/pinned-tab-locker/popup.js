// popup.js for Pinned Tab Locker

document.addEventListener('DOMContentLoaded', () => {
  const setupView = document.getElementById('setup-view');
  const mainView = document.getElementById('main-view');
  const resetView = document.getElementById('reset-view');
  const statusMsg = document.getElementById('status');

  function showView(viewName) {
    [setupView, mainView, resetView].forEach(v => v.classList.remove('active'));
    document.getElementById(viewName + '-view').classList.add('active');
  }

  function showStatus(msg, type = 'success') {
    statusMsg.textContent = msg;
    statusMsg.className = 'status-msg ' + type;
    setTimeout(() => {
      statusMsg.className = 'status-msg';
    }, 3000);
  }

  // Check if password exists
  chrome.storage.local.get(['passwordHash'], (result) => {
    if (result.passwordHash) {
      showView('main');
    } else {
      showView('setup');
    }
  });

  // Set Password
  document.getElementById('set-pwd-btn').addEventListener('click', () => {
    const pwd = document.getElementById('new-pwd').value;
    const confirm = document.getElementById('confirm-pwd').value;

    if (!pwd) return showStatus('Vui lòng nhập mật khẩu', 'error');
    if (pwd !== confirm) return showStatus('Mật khẩu không khớp', 'error');

    chrome.storage.local.set({ passwordHash: pwd }, () => {
      showStatus('Đã lưu mật khẩu!');
      showView('main');
    });
  });

  // Lock All Tabs
  document.getElementById('lock-all-btn').addEventListener('click', () => {
    chrome.storage.session.set({ isUnlocked: false }, () => {
      showStatus('Đã khóa tất cả tab ghim!');
      // Notify active tabs
      chrome.tabs.query({ pinned: true }, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: 'TAB_ACTIVATED' }).catch(() => {});
        });
      });
    });
  });

  // Reset View
  document.getElementById('show-reset-btn').addEventListener('click', () => showView('reset'));
  document.getElementById('back-btn').addEventListener('click', () => showView('main'));

  // Reset Password
  document.getElementById('reset-pwd-btn').addEventListener('click', () => {
    const oldPwd = document.getElementById('old-pwd').value;
    const newPwd = document.getElementById('reset-new-pwd').value;

    chrome.storage.local.get(['passwordHash'], (result) => {
      if (oldPwd !== result.passwordHash) {
        return showStatus('Mật khẩu cũ không đúng', 'error');
      }
      if (!newPwd) return showStatus('Vui lòng nhập mật khẩu mới', 'error');

      chrome.storage.local.set({ passwordHash: newPwd }, () => {
        showStatus('Đã đổi mật khẩu!');
        showView('main');
      });
    });
  });
});

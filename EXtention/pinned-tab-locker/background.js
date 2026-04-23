// background.js for Pinned Tab Locker

// On installation, set a default state if not exists
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['passwordHash'], (result) => {
    if (!result.passwordHash) {
      console.log('Pinned Tab Locker: No password set. Please set one in the popup.');
    }
  });
});

// Listener for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'VERIFY_PASSWORD') {
    chrome.storage.local.get(['passwordHash'], (result) => {
      // Simple hash check (in a real app, use a more secure method)
      // For this extension, we'll store the password as-is for simplicity unless requested otherwise,
      // but let's do a basic check.
      if (request.password === result.passwordHash) {
        // Unlock for the session
        chrome.storage.session.set({ isUnlocked: true }, () => {
          sendResponse({ success: true });
        });
      } else {
        sendResponse({ success: false, error: 'Mật khẩu không chính xác' });
      }
    });
    return true; // Keep channel open for async response
  }

  if (request.action === 'CHECK_LOCK_STATUS') {
    chrome.storage.session.get(['isUnlocked'], (result) => {
      sendResponse({ isUnlocked: !!result.isUnlocked });
    });
    return true;
  }

  if (request.action === 'GET_TAB_INFO') {
    const tabId = sender.tab ? sender.tab.id : null;
    if (tabId) {
      chrome.tabs.get(tabId, (tab) => {
        sendResponse({ pinned: tab.pinned });
      });
    } else {
      sendResponse({ pinned: false });
    }
    return true;
  }
});

// Detect when a pinned tab is focused to trigger re-check if needed
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.pinned) {
      // We can notify the content script to ensure it's locked if session is locked
      chrome.tabs.sendMessage(tab.id, { action: 'TAB_ACTIVATED' }).catch(() => {
        // Content script might not be ready, that's fine as it checks on start
      });
    }
  });
});

let creating; // Giữ promise tạo offscreen document

async function setupOffscreenDocument(path) {
  // Kiểm tra offscreen document đã tồn tại chưa
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL(path)]
  });

  if (existingContexts.length > 0) return;

  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: ['DOM_PARSER'],
      justification: 'Chạy OCR script trong nền vì không chạy được trong Service Worker.'
    });
    await creating;
    await new Promise(r => setTimeout(r, 300)); // Đợi script offscreen lên và đăng ký xong
    creating = null;
  }
}

// Bắt sự kiện khi bấm vào icon extension -> Cấp quyền tiêm script nếu có ActiveTab
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith("chrome://") || tab.url.startsWith("https://chrome.google.com")) {
      console.log("Cannot run on chrome internal pages.");
      return;
  }

  // Bước KHỞI ĐỘNG TRƯỚC (Pre-warming): Khởi tạo tắt ngay Worker lúc người dùng vừa bấm nút 
  // (tranh thủ thời gian chết lúc họ đi tìm và khoanh chữ)
  setupOffscreenDocument('offscreen.html').catch(console.error);

  // Chụp màn hình tab hiện tại
  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png", quality: 100 });
  
  // Tiêm script content.js và content.css vào trang
  await chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ["content.css"]
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });

  // Gửi ảnh chụp màn hình sang content script để hiển thị lớp chọn
  chrome.tabs.sendMessage(tab.id, { action: "INIT_CROP", image: dataUrl });
});

// Lắng nghe Message từ Content Script gửi về khi đã khoanh vùng cắt xong
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'PROCESS_OCR') {
    (async () => {
      // Đảm bảo document chạy offscreen đang tồn tại
      await setupOffscreenDocument('offscreen.html');

      try {
        // Forward yêu cầu đến offscreen document
        const response = await chrome.runtime.sendMessage({
          action: 'DO_OCR',
          image: message.image
        });

        let finalTranslation = '';
        let validText = (response && typeof response.text === 'string' && response.text.trim() !== "") ? response.text : null;
        
        // Auto Translate xử lý ngầm
        if (response?.success && validText) {
          try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${encodeURIComponent(validText)}`;
            const res = await fetch(url);
            const data = await res.json();
            
            const detectedLang = data[2];
            // Nếu phát hiện ngữ cảnh văn bản gốc không phải Tiếng Việt (VD: Tiếng Anh, Pháp, Trung...), thì lấy bản dịch.
            if (detectedLang && detectedLang !== 'vi') {
              if (data[0] && Array.isArray(data[0])) {
                 finalTranslation = data[0].map(item => item[0]).join('');
              }
            }
          } catch (e) {
            console.error("Lỗi Google Translate API: ", e);
          }
        }

        // Trả kết quả về lại content script để hiển thị lên UI
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'OCR_RESULT',
          text: validText ? validText : (response?.success ? 'Không tìm thấy chữ nào.' : 'Lỗi OCR: ' + (response?.text || 'Mất kết nối với Worker')),
          translation: finalTranslation,
          success: response?.success
        });
      } catch (err) {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'OCR_RESULT',
          text: 'Lỗi gửi tới Offscreen: ' + err.message,
          success: false
        });
      }
    })();
    return true; // Báo hiệu sẽ phản hồi bất đồng bộ (async response)
  }

  // Forward trạng thái tiến trình (đang tải core, đang tải data ngôn ngữ...)
  if (message.action === 'OCR_PROGRESS') {
    chrome.tabs.sendMessage(sender.tab?.id, {
      action: 'OCR_PROGRESS',
      status: message.status,
      progress: message.progress
    }).catch(() => {});
  }
});

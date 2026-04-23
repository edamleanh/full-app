const initializeWorker = async () => {
  try {
    const worker = await Tesseract.createWorker('vie+eng', 1, {
      workerPath: chrome.runtime.getURL('lib/worker.min.js'),
      corePath: chrome.runtime.getURL('lib/tesseract-core.wasm.js'),
      workerBlobURL: false, // <-- Quan trọng ở MV3: Không dùng blob URL để tránh bị CSP block
      logger: m => {
        // Send progress to background
        if (m.status === 'recognizing text' || m.status === 'loading tesseract core' || m.status === 'loading language traineddata') {
           chrome.runtime.sendMessage({ action: 'OCR_PROGRESS', progress: m.progress, status: m.status }).catch(() => {});
        }
      }
    });
    return worker;
  } catch (err) {
    console.error("Worker initialization failed: ", err);
    throw err;
  }
};


let workerPromise = initializeWorker();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'DO_OCR') {
    (async () => {
      try {
        const worker = await workerPromise;
        const { data: { text } } = await worker.recognize(message.image);
        sendResponse({ success: true, text: text });
      } catch (error) {
        console.error("OCR Error: ", error);
        // Trích xuất chuỗi lỗi kể cả khi object không có .message
        const errorMessage = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
        sendResponse({ success: false, text: errorMessage || 'Lỗi không xác định từ Worker' });
      }
    })();
    return true; // Asynchronous reply
  }
});

let screenshotDataUrl = null;
let overlay = null;
let selectionRect = null;
let startX, startY;
let isSelecting = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'INIT_CROP') {
    screenshotDataUrl = message.image;
    initOverlay();
  } else if (message.action === 'OCR_RESULT') {
    showResult(message.text, message.translation, message.success);
  } else if (message.action === 'OCR_PROGRESS') {
    updateLoadingProgress(message.status, message.progress);
  }
});

function initOverlay() {
  if (overlay) return;

  overlay = document.createElement('div');
  overlay.id = 'screen-ocr-overlay';

  selectionRect = document.createElement('div');
  selectionRect.id = 'screen-ocr-selection';

  overlay.appendChild(selectionRect);
  document.body.appendChild(overlay);

  overlay.addEventListener('mousedown', onMouseDown);
  overlay.addEventListener('mousemove', onMouseMove);
  overlay.addEventListener('mouseup', onMouseUp);
}

function removeOverlay() {
  if (overlay) {
    overlay.removeEventListener('mousedown', onMouseDown);
    overlay.removeEventListener('mousemove', onMouseMove);
    overlay.removeEventListener('mouseup', onMouseUp);
    overlay.remove();
    overlay = null;
    selectionRect = null;
  }
}

function onMouseDown(e) {
  isSelecting = true;
  startX = e.clientX;
  startY = e.clientY;
  
  selectionRect.style.left = startX + 'px';
  selectionRect.style.top = startY + 'px';
  selectionRect.style.width = '0px';
  selectionRect.style.height = '0px';
}

function onMouseMove(e) {
  if (!isSelecting) return;
  
  const currentX = e.clientX;
  const currentY = e.clientY;

  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  selectionRect.style.left = left + 'px';
  selectionRect.style.top = top + 'px';
  selectionRect.style.width = width + 'px';
  selectionRect.style.height = height + 'px';
}

function onMouseUp(e) {
  if (!isSelecting) return;
  isSelecting = false;

  const currentX = e.clientX;
  const currentY = e.clientY;

  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  if (width < 10 || height < 10) {
    removeOverlay();
    return; // Ignore tiny accidental clicks
  }

  processCrop(left, top, width, height);
  removeOverlay();
  showLoadingBox();
}

function processCrop(x, y, width, height) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    
    // Scale cho hình crop chuẩn với độ phân giải màn hình
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    const ctx = canvas.getContext('2d');
    
    // Rút trích hình ảnh (drawImage srcX, srcY, srcW, srcH, destX, destY, destW, destH)
    ctx.drawImage(
      img,
      x * dpr, y * dpr, width * dpr, height * dpr,
      0, 0, canvas.width, canvas.height
    );
    
    const croppedDataUrl = canvas.toDataURL('image/png');
    
    // Gửi ảnh về background để OCR
    chrome.runtime.sendMessage({
      action: 'PROCESS_OCR',
      image: croppedDataUrl
    });
  };
  img.src = screenshotDataUrl;
}

// ============== UI Hiển thị kết quả ============== //

let resultBox = null;

function showLoadingBox() {
  removeResultBox();

  resultBox = document.createElement('div');
  resultBox.id = 'screen-ocr-result-box';

  resultBox.innerHTML = `
    <div id="screen-ocr-result-header">
      <span>Đang nhận diện chữ...</span>
      <button id="screen-ocr-close">&times;</button>
    </div>
    <div id="screen-ocr-content">
      <div id="screen-ocr-spinner"></div>
    </div>
  `;

  document.body.appendChild(resultBox);
  document.getElementById('screen-ocr-close').onclick = removeResultBox;
}

function showResult(text, translation, success) {
  if (!resultBox) return; // Nếu user đã đóng box
  
  const headerSpan = resultBox.querySelector('#screen-ocr-result-header span');
  headerSpan.textContent = success ? 'Kết quả OCR:' : 'Lỗi OCR:';

  const contentDiv = document.getElementById('screen-ocr-content');
  
  // Render kết quả OCR gốc
  contentDiv.innerHTML = `
    <div class="ocr-text-header">
      <div class="ocr-original-text"></div>
      <button class="ocr-speaker-btn" title="Nghe Phát Âm">🔊</button>
    </div>
  `;
  contentDiv.querySelector('.ocr-original-text').textContent = text;
  
  // Nút nhấn nghe phát âm
  const speakerBtn = contentDiv.querySelector('.ocr-speaker-btn');
  speakerBtn.onclick = () => {
    window.speechSynthesis.cancel(); // Tắt luồng đọc cũ nếu đang đọc dở
    
    // Đợi 50 mili-giây để Chrome nạp xong lệnh Hủy, tránh việc cắt đứt các âm tiết đầu tiên
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = translation ? 'en-US' : 'vi-VN';
      utterance.rate = 0.9; // Tốc độ đọc vừa phải
      window.speechSynthesis.speak(utterance);
    }, 50);
  };
  
  // Nối văn bản clipboard
  let textToCopy = text;

  // Render bản dịch nếu có
  if (success && translation) {
    const divider = document.createElement('div');
    divider.className = 'ocr-translation-divider';
    divider.innerText = '-------- Bản Dịch --------';
    
    const translationDiv = document.createElement('div');
    translationDiv.className = 'ocr-translation-text';
    translationDiv.textContent = translation;
    
    contentDiv.appendChild(divider);
    contentDiv.appendChild(translationDiv);
    
    textToCopy = `${text}\n-------- Lời dịch --------\n${translation}`;
  }

  if (success) {
    const actionsDiv = document.createElement('div');
    actionsDiv.id = 'screen-ocr-actions';
    
    const copyBtn = document.createElement('button');
    copyBtn.id = 'screen-ocr-copy';
    copyBtn.innerText = 'Copy Văn Bản';
    copyBtn.onclick = async () => {
      await navigator.clipboard.writeText(textToCopy);
      copyBtn.innerText = 'Đã Copy!';
      setTimeout(() => { copyBtn.innerText = 'Copy Văn Bản'; }, 2000);
    };

    actionsDiv.appendChild(copyBtn);
    resultBox.appendChild(actionsDiv);
  }
}

function removeResultBox() {
  if (resultBox) {
    resultBox.remove();
    resultBox = null;
  }
}

function updateLoadingProgress(status, progress) {
  if (!resultBox) return;
  const headerSpan = resultBox.querySelector('#screen-ocr-result-header span');
  if (headerSpan) {
    let t = status;
    if (status === 'loading language traineddata') t = 'Đang tải Data Ngôn ngữ';
    else if (status === 'loading tesseract core') t = 'Khởi tạo Tesseract Core';
    else if (status === 'recognizing text') t = 'Đang nhận diện chữ';
    
    headerSpan.textContent = t + ` (${Math.round(progress * 100)}%)`;
  }
}

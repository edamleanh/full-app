const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const reloadBtn = document.getElementById('reload-btn');
const statusText = document.getElementById('system-status');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');

// Load danh sách file khi khởi động
async function loadFilesList() {
    try {
        const response = await fetch("/api/files");
        const data = await response.json();
        const fileList = document.getElementById("file-list");
        if (!fileList) return;
        fileList.innerHTML = "";
        
        if (data.files.length === 0) {
            fileList.innerHTML = "<li style='opacity: 0.5;'>Thư mục trống...</li>";
            return;
        }

        data.files.forEach(file => {
            const li = document.createElement("li");
            const ext = file.split('.').pop().toLowerCase();
            const icon = ext === 'pdf' ? 'bxs-file-pdf' : 'bxs-file-blank';
            li.innerHTML = `<i class='bx ${icon}'></i> ${file}`;
            fileList.appendChild(li);
        });
    } catch (e) {
        console.error("Lỗi cập nhật list file:", e);
    }
}

document.addEventListener("DOMContentLoaded", loadFilesList);

// Helper thêm tin nhắn vào khung chat
function appendMessage(isUser, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    if(!isUser && text === 'typing') {
        bubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        bubble.id = 'typing-indicator';
    } else {
        bubble.textContent = text;
    }
    
    msgDiv.appendChild(bubble);
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Xóa bong bóng Typing
function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) {
        typing.parentElement.remove();
    }
}

// Gửi tin nhắn
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(true, text);
    chatInput.value = '';
    
    // Tạo sẵn một khung trả lời rỗng với trạng thái chờ
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ai-message`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = '<div class="typing-indicator" id="typing-indicator"><span></span><span></span><span></span></div>';
    msgDiv.appendChild(bubble);
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ message: text })
        });
        
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || `Lỗi máy chủ (${response.status})`);
        }

        // Tắt nháy nháy ngay khi luồng bắt đầu mở
        const indicator = bubble.querySelector('#typing-indicator');
        if(indicator) {
            indicator.remove();
        }

        // Đọc dữ liệu thô theo luồng
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // Giải mã mảnh byte thành Ký tự và móc nối liên tục
            const chunk = decoder.decode(value, { stream: true });
            bubble.textContent += chunk; 
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }

    } catch (err) {
        const indicator = bubble.querySelector('#typing-indicator');
        if(indicator) indicator.remove();
        bubble.textContent = 'Lỗi kết nối Pipeline: ' + err.message;
    }
}

// Bắt sự kiện Click & Enter
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Nạp lại Folder Data bằng nút bấm
reloadBtn.addEventListener('click', async () => {
    statusText.textContent = "Đang quét & nhúng dữ liệu...";
    statusText.style.color = "#f59e0b"; // Warning color
    try {
        const res = await fetch('/api/reload_db', { method: 'POST' });
        const data = await res.json();
        statusText.textContent = data.message;
        statusText.style.color = "#10b981"; // Success color
        loadFilesList(); // Cập nhật lại UI list

    } catch(err) {
        statusText.textContent = "Lỗi nạp dữ liệu!";
        statusText.style.color = "#ef4444";
    }
});

// Drag & Drop Upload System
dropZone.addEventListener('click', () => fileInput.click());

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
});

// Xử lý khi Drop File 
dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFile(files[0]);
});

fileInput.addEventListener('change', function() {
    handleFile(this.files[0]);
});

async function handleFile(file) {
    if (!file) return;
    statusText.textContent = `Đang nạp ${file.name}...`;
    statusText.style.color = "#f59e0b";

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        statusText.textContent = data.message;
        statusText.style.color = "#10b981";
        loadFilesList();
    } catch(err) {
        statusText.textContent = "Tải lên thất bại!";
        statusText.style.color = "#ef4444";
    }
}

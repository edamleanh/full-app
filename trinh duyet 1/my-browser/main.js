const { app, BrowserWindow, ipcMain, webContents, session } = require('electron');
const path = require('path');

// Bùa chú trị lỗi đóng băng video Youtube SPA và tối ưu Iframe Chat:
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('enable-features', 'WebRTCPipeWireCapturer,NetworkServiceInProcess');

let mainWindow;

// NGĂN CHẶN CHẠY NHIỀU INSTANCE
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "ACS",
        icon: path.join(__dirname, 'corgi.png'),
        backgroundColor: '#000000',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true,
            nativeWindowOpen: true, // Hỗ trợ mở cửa sổ chat nếu cần
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#1a1a1a', // Màu tiêu đề tuỳ chỉnh
            symbolColor: '#ffffff',
            height: 42 // Cố định chiều cao 42px cho vùng nút của hệ điều hành
        }
    });

    // Tắt Menu mặc định (File, Edit, View...)
    mainWindow.setMenu(null);

    mainWindow.loadFile('index.html');
    
    // Tự động Fullscreen (Maximize) khi mở app
    mainWindow.maximize();
    
    // Optional: Open DevTools automatically to help debug
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// Handle IPC requests from Renderer to get WebContents WebRTC Source ID
ipcMain.handle('get-media-source-id', async (event, wcId) => {
    try {
        const wc = webContents.fromId(wcId);
        if (!wc) return null;
        
        // This is the Magic Electron API that gives us the Stream ID for ANY WebContents (even background ones)
        // Pass event.sender so the stream ID is valid for the renderer process!
        const streamId = await wc.getMediaSourceId(event.sender);
        return streamId;
    } catch (e) {
        console.error("Error getting media source ID:", e);
        return null;
    }
});

app.whenReady().then(() => {
    // Ép trình duyệt giả dạng Google Chrome phiên bản mới nhất trên toàn hệ thống
    app.userAgentFallback = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

    const mainSession = session.fromPartition('persist:main');

    // ƯU TIÊN MỞ CỬA SỔ NGAY LẬP TỨC 
    createWindow();

    // ===================================
    // KÍCH HOẠT HỆ THỐNG CHẶN QUẢNG CÁO NGẦM + TỐI ƯU TỐC ĐỘ (SPEED BOOST)
    // ===================================
    const { ElectronBlocker } = require('@ghostery/adblocker-electron');
    ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
        // Tăng giới hạn Listeners để tránh cảnh báo MaxListenersExceeded
        mainSession.setMaxListeners(20);

        // 1. Kích hoạt Adblocker cơ bản
        blocker.enableBlockingInSession(mainSession);
        
        // Hàm kiểm tra Whitelist bằng Regex (Bao quát toàn bộ hệ sinh thái Google/YouTube)
        const GOOGLE_YT_REGEX = /^(https?:\/\/)?([^/]+\.)?(youtube\.com|youtu\.be|googlevideo\.com|ytimg\.com|ggpht\.com|gstatic\.com|google\.com|googleapis\.com|googleusercontent\.com)(\/.*)?$/i;

        const isSafeDomain = (url) => GOOGLE_YT_REGEX.test(url);

        // 2. Chèn bộ lọc Whitelist vào onBeforeRequest (Bỏ qua lọc nội dung tuyệt đối)
        const adblockBeforeReq = blocker.onBeforeRequest;
        mainSession.webRequest.onBeforeRequest(null, (details, callback) => {
            if (isSafeDomain(details.url)) {
                return callback({ cancel: false });
            }
            adblockBeforeReq(details, callback);
        });

        // 3. Chèn bộ lọc Whitelist vào onHeadersReceived (Bỏ qua lọc Header & Script Injection)
        const adblockHeaders = blocker.onHeadersReceived;
        mainSession.webRequest.onHeadersReceived(null, (details, callback) => {
            if (isSafeDomain(details.url)) {
                return callback({ cancel: false });
            }
            adblockHeaders(details, callback);
        });

        // 4. Bổ sung onBeforeSendHeaders để đảm bảo Cookie không bao giờ bị can thiệp
        mainSession.webRequest.onBeforeSendHeaders(null, (details, callback) => {
            if (isSafeDomain(details.url)) {
                return callback({ requestHeaders: details.requestHeaders });
            }
            callback({ requestHeaders: details.requestHeaders });
        });

        // QUAN TRỌNG: Đã dời xuống để lấy tốc độ
        // createWindow();
    }).catch(err => {
        console.error('Failed to init Adblocker:', err);
    });

    const setupSession = (sess) => {
        sess.setPermissionRequestHandler((webContents, permission, callback) => {
            callback(true);
        });
        sess.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
            return true;
        });
    }

    setupSession(session.defaultSession);
    setupSession(mainSession);

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

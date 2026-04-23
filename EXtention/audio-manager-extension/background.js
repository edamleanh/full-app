chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-audio") {
    // Alt+9: Mute YT, Unmute SC
    updateAudioState(true, false);
  } else if (command === "toggle-audio-reverse") {
    // Alt+8: Mute SC, Unmute YT
    updateAudioState(false, true);
  } else if (command === "toggle-pip") {
    // Alt+7: Thoát Picture-in-Picture cho YouTube
    exitYouTubePiP();
  } else if (command === "toggle-pip-smart") {
    // Alt+P: Bật/Tắt Picture-in-Picture cho YouTube
    toggleYouTubePiP();
  }
});

function toggleYouTubePiP() {
  // Tìm các tab YouTube, ưu tiên tab đang phát nhạc (audible) hoặc tab đang active
  chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
    if (tabs.length === 0) return;

    // Ưu tiên: 1. Đang phát nhạc, 2. Đang active, 3. Tab đầu tiên tìm thấy
    const targetTab = tabs.find(t => t.audible) || tabs.find(t => t.active) || tabs[0];

    chrome.scripting.executeScript({
      target: { tabId: targetTab.id },
      func: () => {
        const video = document.querySelector('video');
        if (!video) return;

        if (document.pictureInPictureElement) {
          document.exitPictureInPicture()
            .catch(err => console.error("Exit PiP error:", err));
        } else {
          video.requestPictureInPicture()
            .catch(err => console.error("Enter PiP error:", err));
        }
      }
    }).catch(err => console.error("Execute toggle-pip script error:", err));
  });
}

function exitYouTubePiP() {
  chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
    if (tabs.length === 0) {
      console.log("Không tìm thấy tab YouTube nào đang mở.");
      return;
    }
    
    tabs.forEach((tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Kiểm tra xem trang có đang ở chế độ PiP không
          if (document.pictureInPictureElement) {
            console.log("Tìm thấy phần tử đang PiP, tiến hành thoát.");
            document.exitPictureInPicture()
              .then(() => console.log("Đã thoát PiP thành công."))
              .catch(err => console.error("Lỗi khi thoát PiP:", err));
          } else {
            // Đôi khi PiP browser UI không cập nhật ngay document.pictureInPictureElement,
            // Thử tìm bất cứ video element nào
            const videos = document.querySelectorAll('video');
            videos.forEach(v => {
              if (v.readyState > 0 && v.paused === false) { 
                // Kiểm tra sơ bộ nếu video đang chạy
                console.log("Video đang chạy được tìm thấy, thử thoát PiP.");
              }
            });
            console.log("Không phát hiện phần tử PiP hoạt động (theo document.pictureInPictureElement).");
          }
        }
      }).catch(err => console.error(`Lỗi thực thi script trên tab ${tab.id}:`, err));
    });
  });
}

function updateAudioState(muteYouTube, muteSoundCloud) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const url = tab.url || "";
      if (url.includes("youtube.com")) {
        chrome.tabs.update(tab.id, { muted: muteYouTube });
      } else if (url.includes("soundcloud.com")) {
        chrome.tabs.update(tab.id, { muted: muteSoundCloud });
      }
    });
    console.log(`Audio state updated: YT=${muteYouTube ? 'Muted' : 'Unmuted'}, SC=${muteSoundCloud ? 'Muted' : 'Unmuted'}`);
  });
}

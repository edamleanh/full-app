chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-pip") {
    // Ưu tiên tìm tab YouTube đang phát âm thanh trước
    chrome.tabs.query({ url: "*://*.youtube.com/*", audible: true }, (audibleTabs) => {
      if (audibleTabs.length > 0) {
        // Gửi thông báo đến tab đang phát
        chrome.tabs.sendMessage(audibleTabs[0].id, { action: "toggle-pip" }).catch((err) => console.log(err));
      } else {
        // Nếu không có tab nào đang phát âm thanh, gửi cho tất cả tab YouTube
        chrome.tabs.query({ url: "*://*.youtube.com/*" }, (allTabs) => {
          if (allTabs.length > 0) {
            for (let tab of allTabs) {
              chrome.tabs.sendMessage(tab.id, { action: "toggle-pip" }).catch((err) => console.log(err));
            }
          }
        });
      }
    });
  }
});

// content.js - Chạy trong môi trường isolated của Extension
// Có nhiệm vụ tiêm mã inject.js vào môi trường chính (MAIN world) của trang web
const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
script.onload = function() {
  this.remove(); // Xóa thẻ script sau khi chạy xong để làm sạch DOM
};
(document.head || document.documentElement).appendChild(script);

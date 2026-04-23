// inject.js - Chạy trực tiếp trên ngữ cảnh trang web (MAIN world)

try {
  // Ghi đè thuộc tính visibilityState luôn trả về 'visible'
  Object.defineProperty(Document.prototype, 'visibilityState', {
    get: function() { return 'visible'; },
    enumerable: true,
    configurable: true
  });

  // Ghi đè thuộc tính hidden luôn trả về false
  Object.defineProperty(Document.prototype, 'hidden', {
    get: function() { return false; },
    enumerable: true,
    configurable: true
  });

  // Chặn các sự kiện báo hiệu tab bị ẩn (visibilitychange)
  window.addEventListener('visibilitychange', function(e) {
    e.stopImmediatePropagation();
  }, true);

  // Thêm một số thuộc tính bổ sung để bao phủ cả tiền tố webkit cũ
  Object.defineProperty(Document.prototype, 'webkitVisibilityState', {
    get: function() { return 'visible'; },
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(Document.prototype, 'webkitHidden', {
    get: function() { return false; },
    enumerable: true,
    configurable: true
  });

  console.log("Audio Tab Manager: Chế độ can thiệp Visibility API đã được kích hoạt. Trình duyệt tin rằng tab đang visible.");
} catch (error) {
  console.error("Audio Tab Manager: Không thể tiêm mã bảo vệ Video", error);
}

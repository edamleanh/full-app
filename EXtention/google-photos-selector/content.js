// Tạo nút "Chọn tất cả"
const button = document.createElement('button');
button.innerText = 'Chọn tất cả ảnh hiển thị';
button.id = 'gp-select-all-btn';
document.body.appendChild(button);

button.addEventListener('click', () => {
    // Trong Google Photos, các thẻ có role="checkbox" là các dấu tick chọn ảnh hoặc ngày.
    // Lọc ra check box chưa được check (aria-checked="false").
    const checkboxes = document.querySelectorAll('[role="checkbox"][aria-checked="false"]');
    
    let count = 0;
    checkboxes.forEach(cb => {
        // Chỉ click nếu kích thước phần tử > 0 (để tránh click nhầm element bị ẩn)
        if (cb.offsetWidth > 0 && cb.offsetHeight > 0) {
            cb.click();
            count++;
        }
    });

    if (count > 0) {
        alert(`Đã chọn thêm ${count} mục hiện đang có trên màn hình.\n\nLưu ý: Bạn hãy tự kéo trang xuống để tải thêm ảnh, sau đó bấm lại nút này nếu muốn chọn thêm.`);
    } else {
        alert('Không tìm thấy ảnh nào để chọn, hoặc tất cả ảnh hiển thị đã được chọn rồi.\n\nHãy cuộn trang xuống để Google Photos tải thêm ảnh!');
    }
});

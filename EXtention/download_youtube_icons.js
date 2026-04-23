/*
  Hướng dẫn sử dụng để tải 40 icon đầu tiên:
  1. Mở xem một luồng trực tiếp (livestream) trên YouTube.
  2. Bấm vào nút "Biểu tượng cảm xúc" (mặt cười) trong khung chat để mở danh sách toàn bộ các icon của kênh đó.
  3. Bấm "F12" hoặc chuột phải chọn "Inspect" (Kiểm tra) để mở Developer Tools.
  4. Chuyển sang tab "Console".
  5. Copy toàn bộ đoạn code trong file này, dán vào tab Console và nhấn phím Enter.
  6. Nếu trình duyệt hỏi "Tải nhiều tệp xuống" (Download multiple files), hãy bấm "Allow" (Cho phép).
*/

async function downloadYoutubeIcons(count = 40) {
    // 1. Tìm các ảnh icon trong biểu tượng cảm xúc (emoji picker)
    const images = document.querySelectorAll('#categories img.yt-core-image, yt-live-chat-custom-emoji-picker-category-renderer img, #categories img, .yt-emoji-picker-category-renderer img');
    
    // 2. Lấy số lượng icon yêu cầu
    const icons = Array.from(images).slice(0, count);

    if (icons.length === 0) {
        console.error("❌ Không tìm thấy icon nào. Bạn hãy nhớ mở bảng biểu tượng cảm xúc (nhấp vào hình mặt cười) trong khung chat trước khi chạy lệnh nhé!");
        return;
    }

    console.log(`⏳ Đang bắt đầu tải ${icons.length} icon... Vui lòng chọn "Allow" (Cho phép) nếu Chrome/Edge hỏi.`);

    let successCount = 0;

    for (let i = 0; i < icons.length; i++) {
        let url = icons[i].src;
        if (!url) continue;

        // 3. (Tuỳ chọn) Đổi kích thước ảnh lớn hơn từ URL của YouTube
        // YouTube thường gắn param =s24-c-k-nd cho icon nhỏ, đổi thành s128 để nét hơn
        url = url.replace(/=s\d+-[cC]-[kK]-[nN][dD]/, '=s128-c-k-nd');
        url = url.replace(/=s\d+-/, '=s128-');
        
        let ext = "png";
        if (url.includes('.gif')) ext = "gif";
        else if (url.includes('.jpeg') || url.includes('.jpg')) ext = "jpg";
        else if (url.includes('.webp')) ext = "webp";

        // 4. Lấy tên tự động cho icon
        let name = icons[i].getAttribute('alt') || icons[i].getAttribute('data-emoji-id') || `icon_${i + 1}`;
        // Loại bỏ ký tự đặc biệt để không bị lỗi tên file
        name = name.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/^_+|_+$/g, '');
        if (!name) name = `icon_${i + 1}`;
        name = `${(i + 1).toString().padStart(2, '0')}_${name}`; // Thêm số thứ tự 01, 02...

        try {
            // 5. Tải ảnh và dùng Blob để lưu
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${name}.${ext}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            
            successCount++;
            
            // 6. Đợi 300ms giữa mỗi file để trình duyệt không chặn (block) việc tải xuống liên tục
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (err) {
            console.error(`❌ Lỗi khi tải icon ${name}:`, err);
        }
    }
    console.log(`✅ Hoàn tất tải ${successCount}/${icons.length} icons!`);
}

// Gọi hàm tải 40 icons
downloadYoutubeIcons(40);

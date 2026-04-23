const https = require('https');
const fs = require('fs');
const path = require('path');

const VIDEO_ID = 'jfKfPfyJRdk'; // Video ID từ URL của user
const URL = `https://www.youtube.com/live_chat?is_popout=1&v=${VIDEO_ID}`;
const OUT_DIR = path.join(__dirname, 'YouTube'); // Tên bộ icon là YouTube

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR);
}

console.log(`Bắt đầu chạy quét từ YouTube ID: ${VIDEO_ID}...`);

// Gửi HTTP GET request
https.get(URL, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Trích xuất cấu trúc dữ liệu ban đầu
        try {
            const dataStr = data.split('window["ytInitialData"] = ')[1];
            if (!dataStr) {
                console.error('❌ Không tìm thấy chữ window["ytInitialData"] = trong HTML. (Có thể live chat bị tắt hoặc video k tồn tại)');
                return;
            }
            const jsonString = dataStr.split(';</script>')[0];
            const initialData = JSON.parse(jsonString);
            const emojis = [];

            // Tìm kiếm đệ quy trong object JSON
            function findEmojis(obj) {
                if (!obj || typeof obj !== 'object') return;
                if (Array.isArray(obj)) {
                    for (const item of obj) findEmojis(item);
                } else {
                    if (obj.emojiId && obj.image && obj.image.thumbnails) {
                        emojis.push(obj);
                    }
                    for (const key in obj) {
                        findEmojis(obj[key]);
                    }
                }
            }

            findEmojis(initialData);

            // Lọc loại bỏ trùng lặp
            const unique = [];
            const seen = new Set();
            for (const e of emojis) {
                if (!seen.has(e.emojiId)) {
                    seen.add(e.emojiId);
                    unique.push(e);
                }
            }

            if (unique.length === 0) {
                console.log("❌ Không tìm thấy icon nào trong luồng này.");
                return;
            }

            console.log(`🔍 Tìm thấy ${unique.length} emojis. Bắt đầu lưu trữ tất cả vào thư mục 'YouTube'...`);

            let count = 0;
            unique.forEach((item, index) => {
                // Tên file (tên gợi nhớ ví dụ :happy:)
                let name = item.shortcuts && item.shortcuts.length > 0 
                  ? item.shortcuts[0].replace(/[:]/g, '').replace(/[^a-zA-Z0-9_-]/g, '_') 
                  : `icon_${index+1}`;
                  
                let imgUrl = item.image.thumbnails[item.image.thumbnails.length - 1].url;
                
                // Mẹo tăng chất lượng ảnh cho to hơn (s128px)
                imgUrl = imgUrl.replace(/=s\d+-[cC]-[kK]-[nN][dD]/, '=s128-c-k-nd');
                imgUrl = imgUrl.replace(/=s\d+-/, '=s128-');
                
                if (imgUrl.startsWith('//')) {
                    imgUrl = 'https:' + imgUrl;
                }

                let ext = "png";
                if (imgUrl.includes('.gif')) ext = "gif";
                else if (imgUrl.includes('.jpeg') || imgUrl.includes('.jpg')) ext = "jpg";
                else if (imgUrl.includes('.webp')) ext = "webp";

                const fileName = `${String(index + 1).padStart(3, '0')}_${name}.${ext}`;
                const filePath = path.join(OUT_DIR, fileName);

                // Tải hình ảnh xuống
                https.get(imgUrl, (res2) => {
                    const fileStream = fs.createWriteStream(filePath);
                    res2.pipe(fileStream);
                    fileStream.on('finish', () => {
                        fileStream.close();
                        count++;
                        console.log(`- Tải thành công => ${fileName}`);
                        if (count === unique.length) {
                            console.log(`\n✅ Hoàn tất! Đã tải xong ${count} icon. Ảnh được lưu tại thư mục: ${OUT_DIR}`);
                        }
                    });
                }).on('error', (err) => {
                    console.error(`❌ Lỗi tải file ${fileName}:`, err.message);
                    count++;
                });
            });

        } catch (e) {
            console.error('Lỗi khi phân tích dữ liệu JSON từ YouTube:', e);
        }
    });
}).on('error', err => {
    console.error('Lỗi kết nối:', err.message);
});

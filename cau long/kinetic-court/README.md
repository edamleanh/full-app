# 🏸 KINETIC COURT - The Ultimate Badminton Management Hub

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Fast-646CFF.svg)](https://vitejs.dev/)
[![Design](https://img.shields.io/badge/Design-Glassmorphism-brightgreen.svg)]()
[![UX](https://img.shields.io/badge/UX-Mobile--First-orange.svg)]()

**Kinetic Court** không chỉ là một ứng dụng quản lý cầu lông thông thường; nó là một hệ sinh thái kỹ thuật số được thiết kế để kết nối những người đam mê, tối ưu hóa việc quản lý tài chính nhóm và nâng tầm trải nghiệm chơi cầu lông lên một đẳng cấp mới. Với giao diện **Cyberpunk HUD** hiện đại và các tính năng đột phá, Kinetic Court mang lại sự minh bạch, tiện lợi và niềm vui cho từng buổi đấu.

---

## 🎨 Triết lý Thiết kế (Design & UX/UI)

### 1. Ngôn ngữ Thị giác: Glassmorphism HUD
Chúng tôi sử dụng phong cách **Glassmorphism** (Thiết kế thủy tinh) kết hợp với các yếu tố **HUD (Heads-Up Display)** để tạo ra một không gian số hiện đại:
- **Nền Tối (Deep Carbon):** Giảm mỏi mắt và làm nổi bật các yếu tố quan trọng trong môi trường ánh sáng mạnh tại sân cầu lông.
- **Neon Lime Accent (#c3ff00):** Màu sắc chủ đạo mang tính năng động, trẻ trung và dễ nhận diện.
- **Hiệu ứng Làm mờ (Backdrop Blur):** Tạo chiều sâu cho ứng dụng, giúp phân tách các lớp thông tin mà không gây rối mắt.

### 2. Trải nghiệm Người dùng (UX)
- **Mobile-First Navigation:** Mọi tương tác quan trọng đều được đặt trong tầm với của ngón tay cái, tối ưu hóa cho việc sử dụng bằng một tay.
- **Bottom Sheets:** Sử dụng bảng trượt từ dưới lên cho các bộ lọc và tìm kiếm, mang lại cảm giác bản địa (native app).
- **Haptic Animations:** Các hiệu ứng chuyển động mượt mà, phản hồi ngay lập tức cho người dùng khi bấm nút hoặc kéo trượt.
- **Safe Area Support:** Đảm bảo hiển thị hoàn hảo trên các dòng iPhone có tai thỏ hoặc Android có thanh đ                                                                                  q\ưqqiều hướng dưới.

---

## 🔥 Các Tính năng Cốt lõi (Core Features)

### 📍 1. Discovery Hub (Khám phá sân đấu)
- **Bản đồ Tương tác (Leaflet-Match):** Tích hợp bản đồ thế giới thực với các điểm đánh dấu sân cầu lông được tùy chỉnh theo phong cách HUD.
- **Bộ lọc Quận thông minh:** Cho phép tìm kiếm sân nhanh chóng theo khu vực địa lý với giao diện trượt quận trực quan.
- **Thông tin chi tiết:** Hiển thị giá cả, vị trí và đánh giá của từng sân ngay trên bản đồ.

### 🤝 2. Smart Matchmaking (Đối đầu & Kết nối)
- **Hệ thống Trình độ 8 cấp:** Từ **Newbie** đến **Bán chuyên**, sử dụng thanh trượt (slider) cực kỳ mượt mà để thiết lập mong muốn chính xác.
- **Tạo trận đấu nhanh:** Điền thông tin tự động từ kho dữ liệu sân hiện có, tiết kiệm thời gian cho người tổ chức.
- **Chế độ "Mọi trình độ":** Nút chuyển đổi nhanh cho các kèo giao lưu không giới hạn.

### 💰 3. Financial Infrastructure (Hệ thống Tài chính Nhóm)
Đây là "trái tim" của sự minh bạch trong nhóm:
- **Ví Nhóm (Group Wallet):** Theo dõi số dư quỹ chung, lịch sử nạp tiền và thanh toán sân.
- **Chia tiền Thông minh (Split Bill):** Tự động tính toán chi phí cho từng thành viên tham gia, có hỗ trợ các khoản phí phát sinh (nước uống, cầu, v.v.).
- **Quản lý Nợ tự động:** 
    - Tự động tạo hồ sơ nợ khi hoàn tất chia tiền.
    - **Cơ chế Gộp nợ (Aggregation):** Tự động cộng dồn các khoản nợ của cùng một người thành một mục duy nhất để dễ theo dõi.
    - Tính năng **"Nhắc nợ"** một chạm.
1
### 👤 4. Player Analytics & Progression
- **Hệ thống Gamification:** Tích lũy XP (Kinh nghiệm) qua từng trận đấu để tăng cấp độ (Tier).
- **Chỉ số Người chơi:** Theo dõi số trận đã đấu, tỷ lệ thắng (Win Rate) và lịch sử tham gia.
- **Profile HUD:** Giao diện cá nhân hóa hiển thị mọi thành tích theo phong cách game thủ chuyên nghiệp.

---

## 🛠 Công nghệ Sử dụng (Tech Stack)

| Thành phần | Công nghệ |
| :--- | :--- |
| **Framework** | React 18 |
| **Build Tool** | Vite |
| **Styling** | Pure CSS (Custom Props, Glassmorphism) |
| **Icons** | Lucide React |
| **Mapping** | Leaflet JS (with Custom Markers) |
| **State Management** | React Hooks (useState, useMemo) |

---

## 🚀 Hướng dấn Chạy Dự án

Nếu bạn muốn chạy Kinetic Court dưới máy cục bộ:

```bash
# 1. Clone repository
git clone https://github.com/edamleanh/caulong.git

# 2. Di chuyển vào thư mục project
cd kinetic-court

# 3. Cài đặt các thư viện cần thiết
npm install

# 4. Chạy chế độ phát triển
npm run dev
```

---

## 🔮 Tầm nhìn Tương lai (Future Roadmap)

- [ ] **OCR Hóa đơn**: Sử dụng AI để tự động đọc ảnh hóa đơn sân và nạp dữ liệu chi phí.
- [ ] **QR Thanh toán Động**: Tạo mã QR VietQR tự động chứa đúng số tiền cần trả cho từng thành viên.
- [ ] **Đa ngôn ngữ**: Hỗ trợ toàn diện tiếng Anh và tiếng Việt.
- [ ] **Báo cáo Tài chính Tháng**: Xuất file Excel/PDF chi tiết thu chi hàng tháng cho nhóm.

---

**Kinetic Court** được xây dựng với tình yêu dành cho môn cầu lông. Mọi mã nguồn đều được tối ưu hóa để mang lại tốc độ phản hồi nhanh nhất.

---

© 2026 Kinetic Court Project. Made with 🔥 and 🏸.

# full-app

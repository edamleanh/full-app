// Cấu hình (bạn có thể thay đổi)
const SCROLL_SPEED_MULTIPLIER = 0.3; // Tốc độ cuộn còn 3% so với mặc định
// Selector: #item-scroller (Danh sách chat), #categories (Danh sách emoji)
const YOUTUBE_SELECTORS = '#item-scroller, #categories';

// Khởi tạo một biến toàn cục lưu vị trí chuột hiện tại
let mousePositionX = 0;
let mousePositionY = 0;

// Lắng nghe sự kiện di chuyển chuột để biết chính xác chuột đang ở đâu
document.addEventListener('mousemove', (event) => {
    mousePositionX = event.clientX;
    mousePositionY = event.clientY;
});

// Sử dụng { passive: false } từ trên document hoặc window thường hiệu quả,
// nhưng vì YouTube sử dụng các event listener riêng biệt để tính toán scroll, ta phải can thiệp mạnh hơn một chút.
window.addEventListener('wheel', (event) => {
    // 1. Lấy phần tử chính xác nhất đang nằm dưới con trỏ chuột
    const elementUnderMouse = document.elementFromPoint(mousePositionX, mousePositionY);
    if (!elementUnderMouse) return;

    // 2. Kiểm tra xem phần tử đó hoặc tổ tiên của nó có nằm trong danh sách cần giảm tốc không
    const targetElement = elementUnderMouse.closest(YOUTUBE_SELECTORS);
    
    if (targetElement) {
        // Cố gắng tìm phần tử thực sự có thanh cuộn từ mục tiêu
        let scrollableElement = targetElement;
        
        while (scrollableElement && scrollableElement !== document.body) {
            // Kiểm tra xem phần tử có khả năng cuộn không
            const isScrollable = scrollableElement.scrollHeight > scrollableElement.clientHeight;
            const style = window.getComputedStyle(scrollableElement);
            const hasScrollOverflow = style.overflowY === 'auto' || style.overflowY === 'scroll';
            
            if (isScrollable && hasScrollOverflow) {
                break; // Tìm thấy phần tử thực sự cuộn
            }
            scrollableElement = scrollableElement.parentElement;
        }

        if (scrollableElement && scrollableElement !== document.body) {
            // Ngăn chặn cuộn nhanh mặc định
            // CẦN THIẾT: YouTube đôi khi ngăn chặn `preventDefault` mặc định,
            // việc chúng ta dùng `{ passive: false }` sẽ cho phép ta bắt `preventDefault()`
            if (event.cancelable) {
                event.preventDefault(); 
            }
            
            // Tính toán khoảng cách cuộn tùy chỉnh (chậm hơn)
            const scrollAmount = event.deltaY * SCROLL_SPEED_MULTIPLIER;
            
            // Cập nhật vị trí cuộn cho phần tử đó
            // Sử dụng set timeout 0 để đưa việc cuộn vào hàng đợi tiếp theo, giảm giật lag.
            setTimeout(() => {
                scrollableElement.scrollBy({
                    top: scrollAmount,
                    behavior: 'auto' // 'auto' hoặc 'smooth', 'auto' phản hồi tức thì
                });
            }, 0);
        }
    }
}, { passive: false, capture: true }); // Thêm 'capture: true' để bắt sự kiện TRƯỚC khi YouTube bắt được nó

// Báo hiệu extension đã chạy thành công trong khung đó
console.log("Livestream Slow Scroll Extension loaded in a frame.");

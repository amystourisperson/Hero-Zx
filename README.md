# Hero-Zx

Game platformer 2D pixel art chạy trong trình duyệt. Đồng hành cùng Hero qua 10 màn ngày và đêm, giải cứu Rồng Trắng, vượt các khu rừng theo mùa và đối đầu Rồng Lửa để cứu công chúa.

**[Chơi ngay](https://hero-zx-adventure.sharpbeacon2.chatgpt.site)** · **[Mã nguồn GitHub](https://github.com/amystourisperson/Hero-Zx)**

## Chạy game

Mở terminal trong thư mục dự án và chạy một máy chủ tĩnh, ví dụ:

```powershell
npx serve dist
```

Sau đó mở địa chỉ được in trong terminal.

## Điều khiển

- Trái: `A` hoặc `←`
- Phải: `D` hoặc `→`
- Nhảy: `Space`, `W` hoặc `↑`
- Điện thoại: ba nút cảm ứng trái, phải và nhảy
- Khua kiếm khi vượt ải: nhấn `Enter` (chỉ có hoạt ảnh, không gây sát thương lên quái)
- Chat: nhấn `C` hoặc chạm nút **Chat** để hiện lời thoại trên đầu Hero

## Hành trình và cơ chế chơi

- 10 màn xen kẽ ngày và đêm. Trận đấu rồng diễn ra ở Thành Rồng Dưới Trăng, màn 10
- Quái ban đêm gồm lửa ma trơi, nhện đen, cây ăn thịt và heo rừng. Quái quay mặt theo hướng di chuyển
- Các màn đêm có bẫy tên bắn từ đất, đá rơi và kiến trúc như đèn lồng, bến gỗ, cổng đá và tháp
- Cây ăn thịt bắn đạn lửa. Người tuyết xuất hiện ở màn Mùa Đông và ném bóng tuyết
- 5 mạng cho mỗi lượt chơi
- Mỗi màn có cột mốc hồi sinh ở giữa đường
- Shop mở từ màn 2, với giá 20 xu cho 1 mạng, 12 xu cho khiên bất tử 1,5 giây và 16 xu để đóng băng quái 3 giây
- Bẫy hàng rào ẩn yêu cầu giải phép cộng, trừ, nhân hoặc chia. Trả lời sai mất 1 mạng
- Thu thập xu, cổng kết thúc màn và màn giải cứu công chúa
- Nhặt phi tiêu, kiếm và cung ở màn cuối. Trong đấu trường, dùng phím `1`, `2`, `3` hoặc chạm nút vũ khí
- Rồng bay thấp khi dùng phi tiêu, đứng đất khi đấu kiếm và bay cao khi dùng cung. Đọc hết khế ước để trở lại chân thành
- Khi hết máu lần đầu, rồng hóa Cuồng Nộ và bắn chùm 3 đạn lửa tỏa ra. Mỗi lần tàng hình kéo dài 0,5 giây và đòn đánh không trúng trong thời gian đó
- Sau khi cứu công chúa, lễ cưới hoa anh đào bắt đầu và Rồng Đỏ thu nhỏ thành pet
- Hỗ trợ bàn phím và màn hình cảm ứng

## Rồng Trắng đồng hành

- Ở màn 2, nhảy theo sáu bậc gỗ lên sàn cao để giải cứu Rồng Trắng và đọc cuộc hội thoại. Màn này có mưa đêm.
- Sau khi được cứu, pet tự bay qua lại và đuổi theo Hero với quán tính, có độ trễ khi Hero nhảy hoặc đổi hướng. Pet theo qua các màn và vẫn ở lại khi Hero mất mạng. Chơi lại từ đầu sẽ đặt pet về lồng.
- Sau khoảng chờ ngẫu nhiên 8–18 giây, pet tạo khiên bất tử trong 3 giây, bảo vệ cả khi vượt ải và đấu rồng. Khiên pet đợi khiên đang dùng kết thúc; thời gian tạm dừng trong hội thoại và cửa hàng.
- Khoảng 1,2 giây trước khi bật khiên, pet nói: “Cẩn thận chủ nhân ơi!”.

## Thời tiết và bẫy mới

- **Màn 2 — Rừng Mưa Đêm:** mưa rơi chéo; sáu bậc gỗ dẫn lên sàn cao chứa lồng Rồng Trắng. Phải lên tới sàn mới có thể giải cứu pet.
- **Màn 7 — Phế Tích Mùa Thu:** gió cuốn các lớp lá xoay bay qua màn hình và đẩy nhẹ Hero khi đang ở trên không.
- **Bẫy phun lửa:** đặt ở phế tích mùa thu; miệng phun sáng lên và tóe tia báo trước 0,6 giây. Một chu kỳ dài 4 giây, phun lửa khoảng 1 giây. Đợi lửa tắt hoặc canh nhảy qua.
- **Đầm lầy:** hai vùng bùn ở mùa thu nằm gần zombie tuần tra. Khi chạm bùn, tốc độ chạy còn 45%; đầm lầy không tự trừ mạng. Nhảy ra hoặc rời vùng bùn để lấy lại tốc độ bình thường.

## Rồng Lửa Cuồng Nộ

- Trạng thái thường bắn một đạn mỗi lượt. Cuồng Nộ bắn ba đạn theo hình quạt, cách nhau đủ rộng để canh nhảy né.
- Chùm lửa không đuổi theo Hero sau khi đã bắn. Mỗi đợt cách nhau khoảng 2,3 giây; rồng hoãn phun khi Hero quá sát miệng để tránh chùm lửa chưa kịp tách ra.
- Khi rồng đứng đất, chùm đạn tỏa lên trên. Khi rồng bay, chùm đạn hướng về vị trí Hero tại lúc bắn.
- Phím `1`, `2`, `3` dùng vũ khí gây sát thương trong đấu trường. `Enter` chỉ khua kiếm khi vượt ải, không gây sát thương và không thay thế các phím đấu boss.

## Mã nguồn và cập nhật

Game dùng HTML, CSS và JavaScript thuần, không cần bước build.

```text
dist/
  index.html   Giao diện, hội thoại và các nút điều khiển
  styles.css   Bố cục máy tính và điện thoại
  game.js      Bản đồ, vật lý, vẽ pixel art và logic chơi
.openai/
  hosting.json Cấu hình xuất bản Sites
```

Sau khi sửa mã nguồn, tải lại trang chạy trên máy để thử. Push lên GitHub chỉ cập nhật mã nguồn; cần deploy lên Sites để cập nhật link chơi. Link game giữ nguyên sau mỗi lần deploy.

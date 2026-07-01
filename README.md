# Hệ Thống Quản Lý Nhà Hàng HaceLao Hotpot 🍲

HaceLao là một hệ thống quản lý nhà hàng lẩu hiện đại được thiết kế theo kiến trúc Frontend tĩnh kết hợp Backend Java Spring Boot và giao tiếp thời gian thực qua WebSocket. 

Hệ thống giúp số hóa và tối ưu toàn bộ quy trình vận hành nhà hàng, từ việc khách hàng tự đặt món tại bàn, nhà bếp nhận order, đến thu ngân quản lý hóa đơn và thanh toán.

---

## 🏗️ Cấu Trúc Hệ Thống

Hệ thống được chia thành 4 phân hệ chính:
1. **Phân hệ Web (`apps/web`)**: Trang đích (Landing page) giới thiệu nhà hàng, chi nhánh và thực đơn dành cho khách hàng truy cập từ nhà.
2. **Phân hệ Máy tính bảng (`apps/tablet`)**: Giao diện đặt tại mỗi bàn ăn. Khách hàng tự do xem thực đơn, chọn món và gọi món trực tiếp.
3. **Phân hệ Nhà bếp (`apps/kitchen`)**: Giao diện dành riêng cho đầu bếp. Hiển thị các món khách gọi theo thời gian thực (Real-time). Bếp trưởng có thể báo trạng thái món (Đang nấu, Đã xong) hoặc thiết lập thực đơn hiển thị trong ngày.
4. **Phân hệ Thu ngân (`apps/cashier`)**: Dành cho nhân viên thu ngân quản lý sơ đồ bàn, tình trạng bàn, in hóa đơn, thanh toán và tích điểm khách hàng.

---

## ⚙️ Yêu Cầu Cài Đặt

- **Backend**: Java 17+, Maven 3.6+
- **Frontend**: Trình duyệt web hiện đại (Chrome, Edge, Safari...)
- **Database**: H2 Database (In-memory, tự động khởi tạo khi chạy server)

---

## 🚀 Hướng Dẫn Khởi Chạy

### 1. Khởi động Backend (Spring Boot)
Backend cung cấp API và hệ thống Web Socket để các giao diện Frontend giao tiếp.

- Mở Terminal/Command Prompt, trỏ vào thư mục `hacelao-backend`.
- Chạy lệnh khởi động Maven:
  ```bash
  ./mvnw spring-boot:run
  ```
- Backend sẽ chạy tại: `http://localhost:8080`.

### 2. Khởi động Frontend
Vì Frontend được viết thuần bằng HTML/CSS/JS tĩnh, bạn có thể chạy một Web Server đơn giản.

- Mở một Terminal mới, trỏ vào thư mục chứa dự án (nơi có thư mục `apps`).
- Chạy Python HTTP Server (hoặc dùng Live Server extension trên VSCode):
  ```bash
  python3 -m http.server 8001
  ```
- Truy cập vào hệ thống qua trình duyệt: `http://localhost:8001/apps/`

---

## 📖 Hướng Dẫn Sử Dụng Từng Phân Hệ

### 🔒 1. Đăng Nhập Hệ Thống
Truy cập: `http://localhost:8001/apps/login.html`
- Hệ thống hỗ trợ đăng nhập qua `Mã nhân viên` hoặc `Tên đăng nhập`.
- Hệ thống sẽ tự động phân quyền và chuyển hướng nhân viên tới phân hệ tương ứng:
  - Tài khoản **Thu Ngân** ➔ Giao diện Thu Ngân (Cashier).
  - Tài khoản **Đầu Bếp** ➔ Giao diện Nhà Bếp (Kitchen).

### 💳 2. Phân Hệ Thu Ngân (Cashier)
- **Sơ đồ bàn**: Hiển thị tổng quan các bàn. Màu sắc biểu thị trạng thái (Xanh: Trống, Vàng: Đang phục vụ, Đỏ: Chờ thanh toán).
- **Thanh toán**:
  - Khi khách hàng muốn thanh toán, click vào bàn tương ứng và chọn **Xác nhận chốt bàn**.
  - Nhập **Số điện thoại** của khách hàng để hệ thống tự động nhận diện điểm tích lũy. Nếu là khách hàng mới, hãy nhập tên của họ, hệ thống sẽ tự động tạo thẻ thành viên.
  - Sử dụng điểm: Nhập số điểm muốn đổi (1 điểm = 1.000 VNĐ). Điểm mới sau mỗi hóa đơn được cộng tự động (bằng 10% giá trị thanh toán).
  - Chọn phương thức thanh toán (Tiền mặt hoặc QR Code).

### 👨‍🍳 3. Phân Hệ Nhà Bếp (Kitchen)
- **Quản lý món hàng ngày**: 
  - Đầu bếp có quyền tick chọn những món sẽ mở bán trong ngày hôm nay. Chỉ những món được chọn mới hiển thị ở máy tính bảng của khách.
- **Xử lý món (Real-time)**:
  - Khi khách gọi món, danh sách món sẽ tự động nhảy lên màn hình bếp thông qua WebSocket.
  - Bếp chuyển trạng thái các món: `Tiếp nhận` ➔ `Đang nấu` ➔ `Đã xong` ➔ `Đã phục vụ`.

### 📱 4. Phân Hệ Máy Tính Bảng (Tablet)
Truy cập: `http://localhost:8001/apps/tablet/datmon.html` (Thường được mở sẵn và ghim trên tablet tại bàn).
- Khách hàng xem danh mục, chọn số lượng và thêm vào giỏ hàng.
- Khi chọn **Gửi đơn**, đơn hàng lập tức được truyền tới Bếp thông qua WebSocket (Không cần tải lại trang).
- Có thể theo dõi trạng thái món ăn của mình (đang làm hay đã xong).

---

## 🧪 Tài Khoản Test

> **Mật khẩu** = Số điện thoại của nhân viên  
> **Tên đăng nhập** có thể nhập có dấu hoặc **không dấu**, không phân biệt hoa thường  
> Ví dụ: `nguyen van toan` hoặc `Nguyễn Văn Toàn` đều được chấp nhận

### 🏪 CN01 – HaceLao Nguyễn Chí Thanh (6 bàn: 1–6)

| Tên đăng nhập | Không dấu (ví dụ gõ) | Mật khẩu | Vai trò |
|---|---|---|---|
| Nguyễn Văn Toàn | `nguyen van toan` | `0901112222` | 👨‍🍳 Đầu bếp |
| Lê Minh Tuấn | `le minh tuan` | `0903334444` | 👨‍🍳 Đầu bếp |
| Hoàng Quang Hải | `hoang quang hai` | `0905556666` | 👨‍🍳 Đầu bếp |
| Trần Thu Hà | `tran thu ha` | `0902223333` | 💳 Thu ngân |
| Phạm Ngọc Ánh | `pham ngoc anh` | `0904445555` | 💳 Thu ngân |
| Vũ Thùy Linh | `vu thuy linh` | `0906667777` | 💳 Thu ngân |

### 🏪 CN02 – HaceLao Vincom Mega Mall Times City (3 bàn: 1–3)

| Tên đăng nhập | Không dấu (ví dụ gõ) | Mật khẩu | Vai trò |
|---|---|---|---|
| Đặng Kim Chi | `dang kim chi` | `0907778888` | 👨‍🍳 Đầu bếp |
| Bùi Ngọc Bảo | `bui ngoc bao` | `0908889999` | 💳 Thu ngân |

### 🏪 CN03 – HaceLao Lotte Mall Tây Hồ

| Tên đăng nhập | Không dấu (ví dụ gõ) | Mật khẩu | Vai trò |
|---|---|---|---|
| Đinh Trọng Tài | `dinh trong tai` | `0909990000` | 👨‍🍳 Đầu bếp |
| Ngô Thu Phương | `ngo thu phuong` | `0910001111` | 💳 Thu ngân |

### 🏪 CN04 – HaceLao Vincom Phạm Ngọc Thạch

| Tên đăng nhập | Không dấu (ví dụ gõ) | Mật khẩu | Vai trò |
|---|---|---|---|
| Lương Bích Hữu | `luong bich huu` | `0911112222` | 👨‍🍳 Đầu bếp |
| Hồ Quang Hiếu | `ho quang hieu` | `0912223333` | 💳 Thu ngân |

### 👥 Khách hàng có điểm tích lũy (dùng để test thanh toán)

| Số điện thoại | Tên | Điểm tích lũy |
|---|---|---|
| 0901111111 | Nguyễn Văn An | 500 điểm (= 500.000đ) |
| 0902222222 | Trần Thị Bích | 150 điểm |
| 0904444444 | Phạm Thu Dung | 1.200 điểm (= 1.200.000đ) |
| 0905555555 | Hoàng Trọng Ân | 45 điểm |
| 0903333333 | Lê Hoàng Cường | 0 điểm |

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript, SockJS, StompJS.
- **Backend**: Java, Spring Boot (Spring Web, Spring Data JPA, Spring WebSocket).
- **Cơ sở dữ liệu**: H2 Database (Môi trường phát triển).

---
*Phát triển bởi đội ngũ HaceLao.*

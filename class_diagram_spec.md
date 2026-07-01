# 1. Các kiểu liệt kê (Enumerations)

Các enum dùng để định nghĩa các tập giá trị cố định cho các thuộc tính trong hệ thống.

- **VaiTroNhanVien**: DauBep, ThuNgan
- **TrangThaiTaiKhoan**: HoatDong, KhoaTamThoi
- **TrangThaiChiTietOrder**: DaTiepNhan, DangNau, DaXong, DaHuy
- **TrangThaiBan**: Trong, DangPhucVu, ChoThanhToan
- **PhuongThucThanhToan**: TienMat, ChuyenKhoanQR
- **TrangThaiOrder**: DangMo, DaThanhToan
- **TrangThaiMonAn**: ConHang, HetHang

# 2. Chi tiết các Lớp (Classes)

*Lưu ý: Các phương thức thao tác dữ liệu được thiết kế tập trung tại các lớp Controller và Repository theo mô hình MVC của Spring Boot thay vì nằm trực tiếp trong thực thể (Entity).*

## 2.1. Lớp ChiNhanh (Chi nhánh)

- **Thuộc tính:**
  - `- idChiNhanh: string (Private)`
  - `- tenChiNhanh: string (Private)`
  - `- diaChi: string (Private)`
  - `- soDienThoai: string (Private)`
  - `- thongTin: string (Private)`
  - `- hinhAnh: string (Private)`

- **Phương thức:**
  - `+ layDanhSachChiNhanh(): List<ChiNhanh> (Public)`

- **Mối quan hệ:**
  - **Aggregation (Tập hợp):** Một ChiNhanh (1) bao gồm nhiều NhanVien (1...*). Hình thoi rỗng ở phía ChiNhanh.
  - **Composition (Cấu thành):** Một ChiNhanh (1) chứa nhiều Ban (1...*). Hình thoi đặc ở phía ChiNhanh (nếu xóa chi nhánh, các bàn thuộc chi nhánh đó cũng không còn ý nghĩa).

## 2.2. Lớp NhanVien (Nhân viên)

- **Thuộc tính:**
  - `- idNhanVien: string (Private)`
  - `- idChiNhanh: string (Private)`
  - `- tenDangNhap: string (Private)`
  - `- matKhau: string (Private)`
  - `- vaiTro: VaiTroNhanVien (Private)`

- **Phương thức:**
  - `+ dangNhap(loginRequest: NhanVien): ResponseEntity<?> (Public)`
  - `- chuanHoa(s: string): string (Private)`

- **Mối quan hệ:**
  - **Aggregation (Tập hợp):** Được tập hợp vào ChiNhanh.
  - **Association (Liên kết):** Nhân viên (với vai trò Thu ngân) tạo ra nhiều HoaDon (0...*).

*(Ghi chú sự khác biệt: Lớp NhanVien trong thiết kế hiện tại không còn là lớp cha của DauBep và ThuNgan. Vai trò được phân biệt qua thuộc tính enum `vaiTro` để giảm thiểu sự phức tạp của cơ sở dữ liệu).*

## 2.3. Lớp KhachHang (Khách hàng)

- **Thuộc tính:**
  - `- soDienThoai: string (Private)`
  - `- tenKhachHang: string (Private)`
  - `- diemTichLuy: int (Private)`

- **Phương thức:**
  - `+ layThongTinKhachHang(sdt: string): ResponseEntity<KhachHang> (Public)`
  - `+ taoKhachHang(khachHang: KhachHang): ResponseEntity<KhachHang> (Public)`

- **Mối quan hệ:**
  - **Association (Liên kết):** Một KhachHang (0...1) sở hữu nhiều HoaDon (0...*). Nghĩa là một hóa đơn có thể có hoặc không có khách hàng thành viên.

## 2.4. Lớp Ban (Bàn ăn)

- **Thuộc tính:**
  - `- idBan: string (Private)`
  - `- idChiNhanh: string (Private)`
  - `- soBan: int (Private)`
  - `- trangThai: TrangThaiBan (Private)`

- **Phương thức:**
  - `+ layDanhSachBan(): List<Ban> (Public)`
  - `+ capNhatTrangThaiBan(id: string, status: TrangThaiBan): Ban (Public)`

- **Mối quan hệ:**
  - Được cấu thành (Composition) trong ChiNhanh.
  - **Association (Liên kết):** Một Ban (1) có thể có nhiều OrderEntity (0...*).

## 2.5. Lớp OrderEntity (Đơn gọi món)

- **Thuộc tính:**
  - `- idOrder: string (Private)`
  - `- idBan: string (Private)`
  - `- tongTienTamTinh: double (Private)`
  - `- trangThaiOrder: TrangThaiOrder (Private)`

- **Phương thức:**
  - `+ taoDonHang(order: OrderEntity): OrderEntity (Public)`
  - `+ layDanhSachDonHang(): List<OrderEntity> (Public)`
  - `+ capNhatTrangThaiDonHang(idOrder: string, status: TrangThaiOrder): OrderEntity (Public)`
  - `+ thanhToanDonHang(idOrder: string, request: CheckoutRequest): ResponseEntity<?> (Public)`

- **Mối quan hệ:**
  - Liên kết với Ban (Nhiều Order thuộc về 1 Bàn).
  - **Aggregation (Tập hợp):** Nằm trong 1 HoaDon (1 Order (1) nằm trong 1 HoaDon (0...1)).
  - **Composition (Cấu thành):** Một Order (1) bắt buộc phải chứa các ChiTietOrder (1...*). Nếu hủy Order thì các ChiTietOrder bên trong cũng bị hủy.

## 2.6. Lớp ChiTietOrder (Chi tiết đơn gọi món)

- **Thuộc tính:**
  - `- id: Long (Private)`
  - `- idOrder: string (Private)`
  - `- idMonAn: string (Private)`
  - `- soLuong: int (Private)`
  - `- donGia: double (Private)`
  - `- thoiGianGoi: LocalDateTime (Private)`
  - `- trangThaiMon: TrangThaiChiTietOrder (Private)`

- **Phương thức:**
  - `+ layChiTietDonHang(idOrder: string): List<ChiTietOrder> (Public)`
  - `+ themMonVaoDonHang(idOrder: string, item: ChiTietOrder): ChiTietOrder (Public)`
  - `+ capNhatTrangThaiMon(itemId: Long, status: TrangThaiChiTietOrder): ChiTietOrder (Public)`

- **Mối quan hệ:**
  - Được cấu thành (Composition) trong OrderEntity.
  - **Association (Liên kết):** Tham chiếu đến một MonAn cụ thể.

## 2.7. Lớp HoaDon (Hóa đơn thanh toán)

- **Thuộc tính:**
  - `- idHoaDon: string (Private)`
  - `- idOrder: string (Private)`
  - `- idNhanVienThuNgan: string (Private)`
  - `- soDienThoai: string (Private)`
  - `- tongTienTamTinh: double (Private)`
  - `- tongTienThanhToan: double (Private)`
  - `- ngayThanhToan: LocalDateTime (Private)`
  - `- diemDaSuDung: int (Private)`
  - `- soTienDaGiam: double (Private)`
  - `- tienKhachDua: double (Private)`
  - `- tienThua: double (Private)`
  - `- phuongThucThanhToan: PhuongThucThanhToan (Private)`

- **Phương thức:**
  - `+ layDanhSachHoaDon(): List<HoaDon> (Public)`

- **Mối quan hệ:**
  - **Aggregation (Tập hợp):** HoaDon (0...1) chứa OrderEntity (1...*). Hình thoi rỗng ở phía HoaDon.
  - Liên kết với NhanVien (Người tạo ra hóa đơn).
  - Liên kết với KhachHang (Người thanh toán).

## 2.8. Lớp DanhMuc (Danh mục món ăn)

- **Thuộc tính:**
  - `- idDanhMuc: string (Private)`
  - `- idDanhMucCha: string (Private)`
  - `- tenDanhMuc: string (Private)`

- **Phương thức:**
  - `+ layDanhSachDanhMuc(): List<DanhMuc> (Public)`

- **Mối quan hệ:**
  - **Self-Association (Liên kết vòng):** Danh mục có thể phân cấp, chứa các danh mục con (1 Danh mục có thể chứa idDanhMucCha tham chiếu đến chính nó).
  - **Aggregation (Tập hợp):** Một DanhMuc (1) quản lý nhóm các MonAn (1...*). Hình thoi rỗng ở phía DanhMuc.

## 2.9. Lớp MonAn (Món ăn)

- **Thuộc tính:**
  - `- idMonAn: string (Private)`
  - `- idDanhMuc: string (Private)`
  - `- tenMonAn: string (Private)`
  - `- gia: double (Private)`
  - `- trangThai: TrangThaiMonAn (Private)`
  - `- hinhAnh: string (Private)`

- **Phương thức:**
  - `+ layDanhSachMonAn(categoryId: string): List<MonAn> (Public)`
  - `+ capNhatTrangThaiMonAn(id: string, status: TrangThaiMonAn): MonAn (Public)`

- **Mối quan hệ:**
  - Được tập hợp (Aggregation) vào DanhMuc.
  - Liên kết (Association) với ChiTietOrder (Chi tiết gọi món ánh xạ đến món ăn này).

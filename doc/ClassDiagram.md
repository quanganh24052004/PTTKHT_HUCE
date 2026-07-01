**1\. Các kiểu liệt kê (Enumerations)**

Các enum dùng để định nghĩa các tập giá trị cố định cho các thuộc tính trong hệ thống.

- **VaiTroNhanVien**: ThuNgan, DauBep
- **TrangThaiTaiKhoan**: HoatDong, KhoaTamThoi
- **TrangThaiChiTietOrder**: DaTiepNhan, DangNau, DaXong, DaHuy
- **TrangThaiBan**: Trong, DangPhucVu, ChoThanhToan
- **PhuongThucThanhToan**: TienMat, ChuyenKhoanQR
- **TrangThaiOrder**: DangMo, DaThanhToan
- **TrangThaiMonAn**: ConHang, HetHang

**2\. Chi tiết các Lớp (Classes)**

**2.1. Lớp ChiNhanh (Chi nhánh)**

- **Thuộc tính:**
    - \- idChiNhanh: string (Private)
    - \- tenChiNhanh: string (Private)
    - \- diaChi: string (Private)
    - \- soDienThoai: string (Private)
    - \- thongTinGioiThieu: string (Private)
- **Phương thức:**
    - \+ layDanhSachChiNhanh(): List (Public)
    - \+ xemChiTietChiNhanh(id: string): ChiNhanh (Public)
- **Mối quan hệ:**
    - **Aggregation (Tập hợp):** Một ChiNhanh (1) bao gồm nhiều NhanVien (1...\*). Hình thoi rỗng ở phía ChiNhanh.
    - **Composition (Cấu thành):** Một ChiNhanh (1) chứa nhiều Ban (1...\*). Hình thoi đặc ở phía ChiNhanh (nếu xóa chi nhánh, các bàn thuộc chi nhánh đó cũng không còn ý nghĩa).

**2.2. Lớp NhanVien (Nhân viên - Lớp cha)**

- **Thuộc tính:**
    - \- idNhanVien: string (Private)
    - \- tenDangNhap: string (Private)
    - \- matKhau: string (Private)
    - \- vaiTro: VaiTroNhanVien (Private)
    - \- trangThaiTaiKhoan: TrangThaiTaiKhoan (Private)
- **Phương thức:**
    - \+ DangNhap(tenDangNhap: string, matKhau: string): string (Public)
    - \+ DangXuat(token: string): boolean (Public)
    - \+ kiemTraVaiTro(token: string): VaiTroNhanVien (Public)
- **Mối quan hệ:** \* Được tập hợp (Aggregation) vào ChiNhanh.
    - Là lớp cha của DauBep và ThuNgan.

**2.3. Lớp DauBep (Đầu bếp - Kế thừa từ NhanVien)**

- **Phương thức bổ sung:**
    - \+ lapThucDon(ngay: Date): ThucDon (Public)
    - \+ capNhatTrangThaiMonTrongNgay(idMon: string, tt: TrangThaiMonAn): void (Public)
    - \+ huyMonHetNguyenLieu(idChiTiet: int): boolean (Public)
- **Mối quan hệ:** Generalization (Kế thừa) từ NhanVien (mũi tên tam giác rỗng chỉ về NhanVien).

**2.4. Lớp ThuNgan (Thu ngân - Kế thừa từ NhanVien)**

- **Phương thức bổ sung:**
    - \+ taoHoaDon(idBan: string): HoaDon (Public)
    - \+ timKhachHang(soDienThoai: string): KhachHang (Public)
    - \+ dangKyKhachHangMoi(ten: string, sdt: string): KhachHang (Public)
- **Mối quan hệ:** \* Generalization (Kế thừa) từ NhanVien.
    - **Association (Liên kết):** Một ThuNgan (1) tạo ra nhiều HoaDon (0...\*).

**2.5. Lớp KhachHang (Khách hàng)**

- **Thuộc tính:**
    - \- soDienThoai: string (Private)
    - \- tenKhachHang: string (Private)
    - \- diemTichLuy: int (Private)
- **Phương thức:**
    - \+ tichDiem(diemCong: int): void (Public)
    - \+ doiDiem(diemSuDung: int): boolean (Public)
- **Mối quan hệ:** \* **Association (Liên kết):** Một KhachHang (0...1) sở hữu nhiều HoaDon (0...\*). Nghĩa là một hóa đơn có thể có hoặc không có khách hàng thành viên.

**2.6. Lớp Ban (Bàn ăn)**

- **Thuộc tính:**
    - \- idBan: string (Private)
    - \- soBan: int (Private)
    - \- trangThai: TrangThaiBan (Private)
- **Phương thức:**
    - \+ capNhatTrangThai(trangThaiMoi: TrangThaiBan): void (Public)
    - \+ layDanhSachOrderChuaThanhToan(): List<Order> (Public)
- **Mối quan hệ:**
    - Được cấu thành (Composition) trong ChiNhanh.
    - **Association (Liên kết):** Một Ban (1) có thể có nhiều Order (0...\*).

**2.7. Lớp Order (Đơn gọi món)**

- **Thuộc tính:**
    - \- idOrder: string (Private)
    - \- tongTienTamTinh: float (Private)
    - \- trangThaiOrder: TrangThaiOrder (Private)
- **Phương thức:**
    - \+ themChiTietOrder(mon: MonAn, soLuong: int): void (Public)
    - \+ tinhTongTienTamTinh(): float (Public)
    - \+ layDanhSachMonTrongOrder(): List (Public)
    - \+ xoaMonKhoiGio(idMonAn: string): void (Public)
- **Mối quan hệ:**
    - Liên kết với Ban (Nhiều Order thuộc về 1 Bàn).
    - Được tập hợp (Aggregation) vào HoaDon (1 Order (1) nằm trong 1 HoaDon (0...1)).
    - **Composition (Cấu thành):** Một Order (1) bắt buộc phải chứa các ChiTietOrder (1...\*). Nếu hủy Order thì các ChiTietOrder bên trong cũng bị hủy.

**2.8. Lớp ChiTietOrder (Chi tiết đơn gọi món)**

- **Thuộc tính:**
    - \- idChiTiet: int (Private)
    - \- soLuong: int (Private)
    - \- donGia: float (Private)
    - \- thoiGianDat: DateTime (Private)
    - \- trangThaiMon: TrangThaiChiTietOrder (Private)
- **Phương thức:**
    - \+ capNhatTrangThaiMon(tt: TrangThaiChiTietOrder): void (Public)
    - \+ danhDauHoanThanh(): void (Public)
- **Mối quan hệ:**
    - Được cấu thành (Composition) trong Order.
    - **Association (Liên kết):** Nhiều ChiTietOrder (0...\*) tham chiếu đến một MonAn cụ thể (1).

**2.9. Lớp HoaDon (Hóa đơn thanh toán)**

- **Thuộc tính:**
    - \- idHoaDon: string (Private)
    - \- tongTienThanhToan: float (Private)
    - \- ngayThanhToan: DateTime (Private)
    - \- tienKhachDua: float (Private)
    - \- tienThua: float (Private)
    - \- diemDaSuDung: int (Private)
    - \- soTienDaGiam: float (Private)
    - \- phuongThucThanhToan: PhuongThucThanhToan (Private)
- **Phương thức:**
    - \+ tinhTongTienThuc(tongTien: float, diemSuDung: int): float (Public)
    - \+ tinhTienThua(tienKhachDua: float): float (Public)
    - \+ ganKhachHang(khachHang: KhachHang): void (Public)
    - \+ capNhatPhuongThucThanhToan(pt: PhuongThucThanhToan): void (Public)
- **Mối quan hệ:**
    - **Aggregation (Tập hợp):** HoaDon (0...1) chứa Order (1…\*). Hình thoi rỗng ở phía HoaDon.
    - Liên kết với ThuNgan (Người tạo ra hóa đơn).
    - Liên kết với KhachHang (Người thanh toán).

**2.10. Lớp ThucDon (Thực đơn trong ngày/nhóm)**

- **Thuộc tính:**
    - \- idThucDon: string (Private)
    - \- ngayApDung: Date (Private)
- **Phương thức:**
    - \+ themMonVaoThucDon(mon: MonAn): void (Public)
    - \+ xoaMonAn(idMonAn: string): void (Public)
    - \+ layDanhSachMonTrongNgay(): List (Public)
    - \+ timKiemMonTrongThucDon(tuKhoa: string): List (Public)
- **Mối quan hệ:**
    - **Aggregation (Tập hợp):** Một ThucDon (1) bao gồm nhiều MonAn (1...\*). Hình thoi rỗng nằm ở phía ThucDon.

**2.11. Lớp DanhMucMonAn (Danh mục món ăn, VD: Đồ uống, Món chính)**

- **Thuộc tính:**
    - \- idDanhMuc: string (Private)
    - \- tenDanhMuc: string (Private)
- **Phương thức:**
    - \+ layDanhSachMon(): List (Public)
- **Mối quan hệ:**
    - **Self-Association (Liên kết vòng):** Danh mục có thể phân cấp, chứa các danh mục con (1 Danh mục (0...1) có thể chứa nhiều Danh mục con (0...\*)).
    - **Aggregation (Tập hợp):** Một DanhMucMonAn (1) quản lý nhóm các MonAn (1...\*). Hình thoi rỗng ở phía DanhMucMonAn.

**2.12. Lớp MonAn (Món ăn)**

- **Thuộc tính:**
    - \- idMonAn: string (Private)
    - \- tenMonAn: string (Private)
    - \- gia: float (Private)
    - \- trangThai: TrangThaiMonAn (Private)
- **Phương thức:**
    - \+ capNhatTrangThai(trangThaiMon: TrangThaiMonAn): void (Public)
    - \+ layTatCaMonAnTheoChiNhanh(idChiNhanh: string): List (Public)
    - \+ layThongTinMonAn(idMonAn: string): MonAn (Public)
    - \+ timKiemMonAn(tuKhoa: string): List (Public)
- **Mối quan hệ:**
    - Được tập hợp (Aggregation) vào ThucDon và DanhMucMonAn.
    - Liên kết (Association) với ChiTietOrder (Chi tiết gọi món ánh xạ đến món ăn này).

@startuml
skinparam classAttributeIconSize 0
skinparam linetype ortho

package "com.hacelao.backend.entity.enums" {
    enum PhuongThucThanhToan {
        TienMat
        ChuyenKhoanQR
    }

    enum TrangThaiBan {
        Trong
        DangPhucVu
        ChoThanhToan
    }

    enum TrangThaiChiTietOrder {
        DaTiepNhan
        DangNau
        DaXong
        DaHuy
    }

    enum TrangThaiMonAn {
        ConHang
        HetHang
    }

    enum TrangThaiOrder {
        DangMo
        DaThanhToan
    }

    enum TrangThaiTaiKhoan {
        HoatDong
        KhoaTamThoi
    }

    enum VaiTroNhanVien {
        DauBep
        ThuNgan
    }
}

package "com.hacelao.backend.entity" {
    note "Các lớp Entity đều sử dụng Lombok @Data\n(tự động sinh toàn bộ Getters, Setters, toString...)" as N1

    class Ban {
        - idBan: String
        - idChiNhanh: String
        - soBan: int
        - trangThai: TrangThaiBan
    }

    class ChiNhanh {
        - idChiNhanh: String
        - tenChiNhanh: String
        - diaChi: String
        - soDienThoai: String
        - thongTin: String
        - hinhAnh: String
    }

    class ChiTietOrder {
        - id: Long
        - idOrder: String
        - idMonAn: String
        - soLuong: int
        - donGia: double
        - thoiGianGoi: LocalDateTime
        - trangThaiMon: TrangThaiChiTietOrder
    }

    class DanhMuc {
        - idDanhMuc: String
        - idDanhMucCha: String
        - tenDanhMuc: String
    }

    class HoaDon {
        - idHoaDon: String
        - idOrder: String
        - idNhanVienThuNgan: String
        - soDienThoai: String
        - tongTienTamTinh: double
        - tongTienThanhToan: double
        - ngayThanhToan: LocalDateTime
        - diemDaSuDung: int
        - soTienDaGiam: double
        - tienKhachDua: double
        - tienThua: double
        - phuongThucThanhToan: PhuongThucThanhToan
    }

    class KhachHang {
        - soDienThoai: String
        - tenKhachHang: String
        - diemTichLuy: int
    }

    class MonAn {
        - idMonAn: String
        - idDanhMuc: String
        - tenMonAn: String
        - gia: double
        - trangThai: TrangThaiMonAn
        - hinhAnh: String
    }

    class NhanVien {
        - idNhanVien: String
        - idChiNhanh: String
        - tenDangNhap: String
        - matKhau: String
        - vaiTro: VaiTroNhanVien
    }

    class OrderEntity {
        - idOrder: String
        - idBan: String
        - tongTienTamTinh: double
        - trangThaiOrder: TrangThaiOrder
    }
}

package "com.hacelao.backend.repository" {
    interface JpaRepository<T, ID>
    interface BanRepository extends JpaRepository
    interface ChiNhanhRepository extends JpaRepository
    interface ChiTietOrderRepository extends JpaRepository
    interface DanhMucRepository extends JpaRepository
    interface HoaDonRepository extends JpaRepository
    interface KhachHangRepository extends JpaRepository
    interface MonAnRepository extends JpaRepository
    interface NhanVienRepository extends JpaRepository
    interface OrderRepository extends JpaRepository
}

package "com.hacelao.backend.controller" {

    class AuthController {
        - nhanVienRepository: NhanVienRepository
        - chuanHoa(s: String): String
        + dangNhap(loginRequest: NhanVien): ResponseEntity<?>
    }

    class BanController {
        - banRepository: BanRepository
        + layDanhSachBan(): List<Ban>
        + capNhatTrangThaiBan(id: String, status: TrangThaiBan): Ban
    }

    class ChiNhanhController {
        - chiNhanhRepository: ChiNhanhRepository
        + layDanhSachChiNhanh(): List<ChiNhanh>
    }

    class DonHangController {
        - orderRepository: OrderRepository
        - chiTietOrderRepository: ChiTietOrderRepository
        - banRepository: BanRepository
        - hoaDonRepository: HoaDonRepository
        - khachHangRepository: KhachHangRepository
        + layDanhSachDonHang(): List<OrderEntity>
        + taoDonHang(order: OrderEntity): OrderEntity
        + layChiTietDonHang(idOrder: String): List<ChiTietOrder>
        + themMonVaoDonHang(idOrder: String, item: ChiTietOrder): ChiTietOrder
        + capNhatTrangThaiMon(itemId: Long, status: TrangThaiChiTietOrder): ChiTietOrder
        + capNhatTrangThaiDonHang(idOrder: String, status: TrangThaiOrder): OrderEntity
        + thanhToanDonHang(idOrder: String, request: CheckoutRequest): ResponseEntity<?>
    }

    class HoaDonController {
        - hoaDonRepository: HoaDonRepository
        + layDanhSachHoaDon(): List<HoaDon>
    }

    class KhachHangController {
        - khachHangRepository: KhachHangRepository
        + layThongTinKhachHang(sdt: String): ResponseEntity<KhachHang>
        + taoKhachHang(khachHang: KhachHang): ResponseEntity<KhachHang>
    }

    class ThucDonController {
        - menuService: MenuService
        + layDanhSachDanhMuc(): List<DanhMuc>
        + layDanhSachMonAn(categoryId: String): List<MonAn>
        + capNhatTrangThaiMonAn(id: String, status: TrangThaiMonAn): MonAn
        + layThucDonHangNgay(idChiNhanh: String): List<String>
        + capNhatThucDonHangNgay(ids: List<String>, idChiNhanh: String): List<String>
    }

    class WebSocketController {
        - messagingTemplate: SimpMessagingTemplate
        - extractJsonString(json: String, key: String): String
        + thongBaoDonHangMoi(message: String): void
        + thongBaoTrangThaiDonHang(message: String): void
        + capNhatThucDon(message: String): void
        + suKienBan(message: String): String
    }
}

' Repository Dependencies
AuthController --> NhanVienRepository
BanController --> BanRepository
ChiNhanhController --> ChiNhanhRepository
DonHangController --> OrderRepository
DonHangController --> ChiTietOrderRepository
DonHangController --> BanRepository
DonHangController --> HoaDonRepository
DonHangController --> KhachHangRepository
HoaDonController --> HoaDonRepository
KhachHangController --> KhachHangRepository

' Entity Relationships
Ban --> TrangThaiBan
ChiTietOrder --> TrangThaiChiTietOrder
HoaDon --> PhuongThucThanhToan
MonAn --> TrangThaiMonAn
NhanVien --> VaiTroNhanVien
OrderEntity --> TrangThaiOrder

ChiNhanh "1" <-- "*" Ban : thuộc về >
ChiNhanh "1" <-- "*" NhanVien : làm việc tại >
Ban "1" <-- "*" OrderEntity : có >
OrderEntity "1" <-- "*" ChiTietOrder : chứa >
MonAn "1" <-- "*" ChiTietOrder : là >
DanhMuc "1" <-- "*" MonAn : phân loại >
DanhMuc "1" <-- "*" DanhMuc : danh mục con >
OrderEntity "1" <-- "1" HoaDon : thanh toán cho >
NhanVien "1" <-- "*" HoaDon : thu ngân tạo >
KhachHang "1" <-- "*" HoaDon : khách hàng thanh toán >

@enduml

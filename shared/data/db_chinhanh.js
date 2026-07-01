// ==========================================
// DỮ LIỆU CHI NHÁNH, NHÂN VIÊN & KHÁCH HÀNG
// ==========================================
const listChiNhanh = [
    { idChiNhanh: 'CN01', tenChiNhanh: 'HaceLao Nguyễn Chí Thanh', diaChi: 'Tầng 6, Tổ hợp văn phòng cho thuê, 54A Nguyễn Chí Thanh, Láng Thượng, Đống Đa, Hà Nội', soDienThoai: '222222222', thongTin: '10:00 AM - 02:00 AM', hinhAnh: 'images/Web Trang chủ/chi-nhanh.png' },
    { idChiNhanh: 'CN02', tenChiNhanh: 'HaceLao Vincom Mega Mall Times City', diaChi: 'Tầng B1, Vincom Mega Mall Times City, 458 Minh Khai, Hai Bà Trưng, Hà Nội', soDienThoai: '8888888888', thongTin: '10:00 AM - 03:00 AM', hinhAnh: 'images/Web Trang chủ/chi-nhanh.png' },
    { idChiNhanh: 'CN03', tenChiNhanh: 'HaceLao Lotte Mall Tây Hồ', diaChi: 'Tầng 4, TTTM Lotte Hà Nội, 272 Võ Chí Công, Phú Thượng, Tây Hồ, Hà Nội', soDienThoai: '1717171717', thongTin: '10:00 AM - 03:00 AM', hinhAnh: 'images/Web Trang chủ/chi-nhanh.png' },
    { idChiNhanh: 'CN04', tenChiNhanh: 'Hacelao Vincom Phạm Ngọc Thạch', diaChi: 'Tầng B1, Vincom Phạm Ngọc Thạch, 2 Phạm Ngọc Thạch, Kim Liên, Hà Nội', soDienThoai: '0123456789', thongTin: '10:00 AM - 03:00 AM', hinhAnh: 'images/Web Trang chủ/chi-nhanh.png' }
];

const listKhachHang = [
    { soDienThoai: '0901111111', tenKhachHang: 'Nguyễn Văn An', diemTichLuy: 500 },
    { soDienThoai: '0902222222', tenKhachHang: 'Trần Thị Bích', diemTichLuy: 150 },
    { soDienThoai: '0903333333', tenKhachHang: 'Lê Hoàng Cường', diemTichLuy: 0 },
    { soDienThoai: '0904444444', tenKhachHang: 'Phạm Thu Dung', diemTichLuy: 1200 },
    { soDienThoai: '0905555555', tenKhachHang: 'Hoàng Trọng Ân', diemTichLuy: 45 }
];

const listNhanVien = [
    { idNhanVien: 'NV_B01', idChiNhanh: 'CN01', tenDangNhap: 'daubep_CN01', matKhau: '123456', vaiTro: 'DauBep', trangThaiTaiKhoan: 'HoatDong' },
    { idNhanVien: 'NV_T01', idChiNhanh: 'CN01', tenDangNhap: 'thungan_CN01', matKhau: '123456', vaiTro: 'ThuNgan', trangThaiTaiKhoan: 'HoatDong' },
    { idNhanVien: 'NV_B02', idChiNhanh: 'CN02', tenDangNhap: 'daubep_CN02', matKhau: '123456', vaiTro: 'DauBep', trangThaiTaiKhoan: 'HoatDong' },
    { idNhanVien: 'NV_T02', idChiNhanh: 'CN02', tenDangNhap: 'thungan_CN02', matKhau: '123456', vaiTro: 'ThuNgan', trangThaiTaiKhoan: 'HoatDong' },
    { idNhanVien: 'NV_B03', idChiNhanh: 'CN03', tenDangNhap: 'daubep_CN03', matKhau: '123456', vaiTro: 'DauBep', trangThaiTaiKhoan: 'HoatDong' },
    { idNhanVien: 'NV_T03', idChiNhanh: 'CN03', tenDangNhap: 'thungan_CN03', matKhau: '123456', vaiTro: 'ThuNgan', trangThaiTaiKhoan: 'HoatDong' },
    { idNhanVien: 'NV_B04', idChiNhanh: 'CN04', tenDangNhap: 'daubep_CN04', matKhau: '123456', vaiTro: 'DauBep', trangThaiTaiKhoan: 'HoatDong' },
    { idNhanVien: 'NV_T04', idChiNhanh: 'CN04', tenDangNhap: 'thungan_CN04', matKhau: '123456', vaiTro: 'ThuNgan', trangThaiTaiKhoan: 'HoatDong' }
];
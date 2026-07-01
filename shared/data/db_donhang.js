// ==========================================
// DỮ LIỆU ĐƠN HÀNG, BÀN & HÓA ĐƠN
// ==========================================
const listBan = [
    { idBan: 'B01_CN01', idChiNhanh: 'CN01', soBan: 1, trangThai: 'DangPhucVu' },
    { idBan: 'B02_CN01', idChiNhanh: 'CN01', soBan: 2, trangThai: 'DangPhucVu' },
    { idBan: 'B03_CN01', idChiNhanh: 'CN01', soBan: 3, trangThai: 'Trong' },
    { idBan: 'B04_CN01', idChiNhanh: 'CN01', soBan: 4, trangThai: 'Trong' },
    { idBan: 'B05_CN01', idChiNhanh: 'CN01', soBan: 5, trangThai: 'Trong' },
    { idBan: 'B06_CN01', idChiNhanh: 'CN01', soBan: 6, trangThai: 'Trong' },
    { idBan: 'B01_CN02', idChiNhanh: 'CN02', soBan: 1, trangThai: 'DangPhucVu' },
    { idBan: 'B02_CN02', idChiNhanh: 'CN02', soBan: 2, trangThai: 'Trong' },
    { idBan: 'B03_CN02', idChiNhanh: 'CN02', soBan: 3, trangThai: 'Trong' }
];

const listOrder = [
    { idOrder: 'OD_001', idBan: 'B01_CN01', tongTienTamTinh: 719000, trangThaiOrder: 'DaThanhToan' },
    { idOrder: 'OD_002', idBan: 'B02_CN01', tongTienTamTinh: 409000, trangThaiOrder: 'DangMo' },
    { idOrder: 'OD_003', idBan: 'B01_CN02', tongTienTamTinh: 414000, trangThaiOrder: 'DangMo' },
    { idOrder: 'OD_004', idBan: 'B03_CN01', tongTienTamTinh: 324000, trangThaiOrder: 'DaThanhToan' }
];

const listChiTietOrder = [
    { idOrder: 'OD_001', idMonAn: 'MA01', soLuong: 1, donGia: 299000, thoiGianGoi: '2026-05-28T18:00:00', trangThaiMon: 'DaXong' },
    { idOrder: 'OD_001', idMonAn: 'MA18', soLuong: 4, donGia: 100000, thoiGianGoi: '2026-05-28T18:00:00', trangThaiMon: 'DaXong' },
    { idOrder: 'OD_001', idMonAn: 'MA30', soLuong: 1, donGia: 20000, thoiGianGoi: '2026-05-28T19:00:00', trangThaiMon: 'DaXong' },
    { idOrder: 'OD_002', idMonAn: 'MA02', soLuong: 1, donGia: 299000, thoiGianGoi: '2026-05-28T20:40:00', trangThaiMon: 'DangNau' },
    { idOrder: 'OD_002', idMonAn: 'MA08', soLuong: 1, donGia: 100000, thoiGianGoi: '2026-05-28T20:40:00', trangThaiMon: 'DaXong' },
    { idOrder: 'OD_002', idMonAn: 'MA13', soLuong: 1, donGia: 10000, thoiGianGoi: '2026-05-28T20:55:00', trangThaiMon: 'DaTiepNhan' },
    { idOrder: 'OD_003', idMonAn: 'MA03', soLuong: 1, donGia: 399000, thoiGianGoi: '2026-05-28T20:15:00', trangThaiMon: 'DaXong' },
    { idOrder: 'OD_003', idMonAn: 'MA26', soLuong: 1, donGia: 10000, thoiGianGoi: '2026-05-28T20:15:00', trangThaiMon: 'DaXong' },
    { idOrder: 'OD_003', idMonAn: 'MA34', soLuong: 1, donGia: 5000, thoiGianGoi: '2026-05-28T20:15:00', trangThaiMon: 'DangNau' },
    { idOrder: 'OD_004', idMonAn: 'MA01', soLuong: 1, donGia: 299000, thoiGianGoi: '2026-05-27T10:00:00', trangThaiMon: 'DaXong' },
    { idOrder: 'OD_004', idMonAn: 'MA15', soLuong: 1, donGia: 25000, thoiGianGoi: '2026-05-27T10:00:00', trangThaiMon: 'DaXong' }
];

const listHoaDon = [
    { idHoaDon: 'HD_001', idOrder: 'OD_001', idNhanVien_ThuNgan: 'NV_T01', soDienThoai: '0901111111', tongTienTamTinh: 719000, tongTienThanhToan: 519000, ngayThanhToan: '2026-05-28T20:00:00', diemDaSuDung: 200, soTienDaGiam: 200000, tienKhachDua: 600000, tienThua: 81000, phuongThucThanhToan: 'TienMat' },
    { idHoaDon: 'HD_002', idOrder: 'OD_004', idNhanVien_ThuNgan: 'NV_T01', soDienThoai: null, tongTienTamTinh: 324000, tongTienThanhToan: 324000, ngayThanhToan: '2026-05-27T11:00:00', diemDaSuDung: 0, soTienDaGiam: 0, tienKhachDua: 324000, tienThua: 0, phuongThucThanhToan: 'ChuyenKhoanQR' }
];
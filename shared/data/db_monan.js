// ==========================================
// DANH MỤC & MÓN ĂN
// ==========================================
const listDanhMuc = [
    { idDanhMuc: 'DM_NL', idDanhMucCha: null, tenDanhMuc: 'Nước lẩu' },
    { idDanhMuc: 'DM_MC', idDanhMucCha: null, tenDanhMuc: 'Món chính' },
    { idDanhMuc: 'DM_NC', idDanhMucCha: null, tenDanhMuc: 'Nước chấm' },
    { idDanhMuc: 'DM_DAV', idDanhMucCha: null, tenDanhMuc: 'Đồ ăn vặt' },
    { idDanhMuc: 'DM_TU', idDanhMucCha: null, tenDanhMuc: 'Thức uống' },
    { idDanhMuc: 'DM_MC_T', idDanhMucCha: 'DM_MC', tenDanhMuc: 'Món thịt' },
    { idDanhMuc: 'DM_MC_HS', idDanhMucCha: 'DM_MC', tenDanhMuc: 'Hải sản' },
    { idDanhMuc: 'DM_MC_BM', idDanhMucCha: 'DM_MC', tenDanhMuc: 'Món bún mì' },
    { idDanhMuc: 'DM_MC_R', idDanhMucCha: 'DM_MC', tenDanhMuc: 'Rau' }
];

const listMonAn = [
    { idMonAn: 'MA01', idDanhMuc: 'DM_NL', tenMonAn: 'Lẩu Cà Chua Truyền Thống', gia: 299000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Lẩu 1.webp' },
    { idMonAn: 'MA02', idDanhMuc: 'DM_NL', tenMonAn: 'Lẩu Dầu Cay Mala', gia: 349000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Lẩu 2.webp' },
    { idMonAn: 'MA03', idDanhMuc: 'DM_NL', tenMonAn: 'Lẩu Xương', gia: 399000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Lẩu 3.webp' },
    { idMonAn: 'MA04', idDanhMuc: 'DM_NL', tenMonAn: 'Lẩu Sữa Mala', gia: 499000, trangThai: 'HetHang', hinhAnh: 'images/Web Trang chủ/Lẩu 4.webp' },
    { idMonAn: 'MA05', idDanhMuc: 'DM_DAV', tenMonAn: 'Bánh quẩy nhỏ', gia: 10000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Ăn vặt 1.png' },
    { idMonAn: 'MA07', idDanhMuc: 'DM_DAV', tenMonAn: 'Viên Tôm', gia: 30000, trangThai: 'HetHang', hinhAnh: 'images/Web Trang chủ/Ăn vặt 2.png' },
    { idMonAn: 'MA08', idDanhMuc: 'DM_DAV', tenMonAn: 'Màn thầu chiên', gia: 60000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Ăn vặt 3.png' },
    { idMonAn: 'MA09', idDanhMuc: 'DM_DAV', tenMonAn: 'Tempura tôm', gia: 80000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Ăn vặt 4.webp' },
    { idMonAn: 'MA10', idDanhMuc: 'DM_DAV', tenMonAn: 'Tôm hùm đất cay Tứ Xuyên', gia: 100000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Ăn vặt 5.jpg' },
    { idMonAn: 'MA11', idDanhMuc: 'DM_DAV', tenMonAn: 'Bánh gạo nếp', gia: 20000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Ăn vặt 6.jpg' },
    { idMonAn: 'MA12', idDanhMuc: 'DM_TU', tenMonAn: 'Hồng trà sữa', gia: 25000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Nước 1.webp' },
    { idMonAn: 'MA13', idDanhMuc: 'DM_TU', tenMonAn: 'Nước cam', gia: 20000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Nước 2.png' },
    { idMonAn: 'MA14', idDanhMuc: 'DM_TU', tenMonAn: 'Nước dưa hấu', gia: 25000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Nước 3.png' },
    { idMonAn: 'MA15', idDanhMuc: 'DM_TU', tenMonAn: 'Trà đào', gia: 25000, trangThai: 'HetHang', hinhAnh: 'images/Web Trang chủ/Nước 4.webp' },
    { idMonAn: 'MA16', idDanhMuc: 'DM_TU', tenMonAn: 'Trà hoa lạc thần', gia: 50000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Nước 5.webp' },
    { idMonAn: 'MA17', idDanhMuc: 'DM_TU', tenMonAn: 'Matcha sữa chua', gia: 40000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Nước 6.png' },
    { idMonAn: 'MA18', idDanhMuc: 'DM_MC_T', tenMonAn: 'Thăn lõi vai Bò', gia: 100000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Thịt 1.png' },
    { idMonAn: 'MA19', idDanhMuc: 'DM_MC_T', tenMonAn: 'Thịt bò bông tuyết', gia: 110000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Thịt 2.png' },
    { idMonAn: 'MA20', idDanhMuc: 'DM_MC_T', tenMonAn: 'Nạc dăm heo', gia: 80000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Thịt 3.png' },
    { idMonAn: 'MA21', idDanhMuc: 'DM_MC_T', tenMonAn: 'Sườn bò rút xương', gia: 130000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/Thịt 4.webp' },
    { idMonAn: 'MA22', idDanhMuc: 'DM_MC_HS', tenMonAn: 'Tôm Sú', gia: 300000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/HS1.jpg' },
    { idMonAn: 'MA23', idDanhMuc: 'DM_MC_HS', tenMonAn: 'Bao tử cá basa', gia: 349000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/HS2.jpg' },
    { idMonAn: 'MA24', idDanhMuc: 'DM_MC_HS', tenMonAn: 'Sò điệp viên QQ', gia: 399000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/HS3.webp' },
    { idMonAn: 'MA25', idDanhMuc: 'DM_MC_HS', tenMonAn: 'Bạch tuộc baby', gia: 199000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/HS4.jpg' },
    { idMonAn: 'MA26', idDanhMuc: 'DM_MC_BM', tenMonAn: 'Mì ăn liền', gia: 10000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/BM1.png' },
    { idMonAn: 'MA27', idDanhMuc: 'DM_MC_BM', tenMonAn: 'Miến dong', gia: 20000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/BM2.webp' },
    { idMonAn: 'MA28', idDanhMuc: 'DM_MC_BM', tenMonAn: 'Miến khoai lang', gia: 15000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/BM3.png' },
    { idMonAn: 'MA29', idDanhMuc: 'DM_MC_BM', tenMonAn: 'Bánh gạo', gia: 30000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/BM4.png' },
    { idMonAn: 'MA30', idDanhMuc: 'DM_MC_R', tenMonAn: 'Rau muống', gia: 20000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/R1.png' },
    { idMonAn: 'MA31', idDanhMuc: 'DM_MC_R', tenMonAn: 'Rau mồng tơi', gia: 20000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/R2.png' },
    { idMonAn: 'MA32', idDanhMuc: 'DM_MC_R', tenMonAn: 'Cải thảo', gia: 20000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/R3.png' },
    { idMonAn: 'MA33', idDanhMuc: 'DM_MC_R', tenMonAn: 'Rau thập cẩm', gia: 30000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/R4.png' },
    { idMonAn: 'MA34', idDanhMuc: 'DM_NC', tenMonAn: 'Nước chấm thanh vị', gia: 5000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/NC1.png' },
    { idMonAn: 'MA35', idDanhMuc: 'DM_NC', tenMonAn: 'Nước chấm hải sản', gia: 5000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/NC2.png' },
    { idMonAn: 'MA36', idDanhMuc: 'DM_NC', tenMonAn: 'Nước chấm chua ngọt', gia: 5000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/NC3.png' },
    { idMonAn: 'MA37', idDanhMuc: 'DM_NC', tenMonAn: 'Nước chấm mè', gia: 5000, trangThai: 'ConHang', hinhAnh: 'images/Web Trang chủ/NC4.png' }
];

const listChiTietThucDon = [
    { idThucDon: 'TD_CN01', idMonAn: 'MA01' }, { idThucDon: 'TD_CN01', idMonAn: 'MA03' },
    { idThucDon: 'TD_CN01', idMonAn: 'MA05' }, { idThucDon: 'TD_CN01', idMonAn: 'MA12' },
    { idThucDon: 'TD_CN01', idMonAn: 'MA18' }, { idThucDon: 'TD_CN01', idMonAn: 'MA26' },
    { idThucDon: 'TD_CN01', idMonAn: 'MA30' }, { idThucDon: 'TD_CN01', idMonAn: 'MA34' },
    { idThucDon: 'TD_CN02', idMonAn: 'MA02' }, { idThucDon: 'TD_CN02', idMonAn: 'MA04' }
];
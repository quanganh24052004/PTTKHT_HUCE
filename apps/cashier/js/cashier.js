const API_BASE = 'http://localhost:8080/api';
let danhSachBan = [];
let danhSachMonAn = [];
let banHienTai = null;
let ketNoiSocket = null;
let boLocTrangThai = 'ALL';

function locTheoTrangThai(status) {
    boLocTrangThai = status;
    ['ALL', 'Trong', 'DangPhucVu', 'ChoThanhToan'].forEach(s => {
        const btn = document.getElementById('btnFilter' + s);
        if(btn) {
            if(s === status) {
                btn.classList.remove('btn-gray');
                btn.classList.add('btn-orange', 'active');
            } else {
                btn.classList.remove('btn-orange', 'active');
                btn.classList.add('btn-gray');
            }
        }
    });
    locBan();
}

function ketNoiWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws');
    ketNoiSocket = Stomp.over(socket);
    ketNoiSocket.connect({}, function (frame) {
        console.log('Cashier Connected to STOMP');
        ketNoiSocket.subscribe('/topic/maytinhbang', function (message) {
            console.log("Tablet event, refresh danhSachBan");
            hienThiBanTuDatabase();
        });
        ketNoiSocket.subscribe('/topic/bep', function (message) {
            console.log("Kitchen event, refresh danhSachBan");
            hienThiBanTuDatabase();
        });
    });
}

// --- Sơ đồ bàn ---
async function khoiTaoSoDoBan() {
    ketNoiWebSocket();
    try {
        const res = await fetch(`${API_BASE}/thucdon/monan`);
        danhSachMonAn = await res.json();
    } catch(e) {}
    await hienThiBanTuDatabase();
    capNhatTieuDeThuNgan();
}

async function hienThiBanTuDatabase() {
    try {
        const res = await fetch(`${API_BASE}/danhSachBan`, { headers: { 'Cache-Control': 'no-cache' } });
        let allTables = await res.json();
        
        let nvInfoStr = localStorage.getItem('nhanVienInfo');
        let branchId = null;
        if(nvInfoStr) {
            let nvInfo = JSON.parse(nvInfoStr);
            branchId = nvInfo.idChiNhanh;
            
            if(branchId) {
                danhSachBan = allTables.filter(t => t.idChiNhanh === branchId);
            } else {
                danhSachBan = allTables;
            }
        } else {
            danhSachBan = allTables;
        }

        locBan();
    } catch(e) { console.error("Lỗi tải bàn:", e); }
}

async function capNhatTieuDeThuNgan() {
    let nvInfoStr = localStorage.getItem('nhanVienInfo');
    if(nvInfoStr) {
        let nvInfo = JSON.parse(nvInfoStr);
        let branchId = nvInfo.idChiNhanh;
        
        // Update user name in sidebar
        const nameEl = document.getElementById('sidebarUserName');
        if(nameEl) nameEl.innerText = nvInfo.tenDangNhap;

        if(branchId) {
            try {
                const resBranches = await fetch(`${API_BASE}/chinhanh`);
                const branches = await resBranches.json();
                const currentBranch = branches.find(b => b.idChiNhanh === branchId);
                if(currentBranch) {
                    const h2 = document.querySelector('.header h2');
                    if(h2) {
                        let baseText = h2.innerText.split(' (')[0];
                        h2.innerText = `${baseText} (${currentBranch.tenChiNhanh})`;
                    }
                    
                    // Update user role in sidebar with branch
                    const roleEl = document.querySelector('.sidebar-user-role');
                    if(roleEl) {
                        roleEl.innerText = `Thu ngân - ${currentBranch.tenChiNhanh}`;
                    }
                }
            } catch (e) {}
        }
    }
}

function locBan() {
    const grid = document.getElementById('tableGrid');
    if(!grid) return;
    const searchInput = document.getElementById('tableSearchInput');
    let query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    let filteredTables = danhSachBan;

    if(boLocTrangThai !== 'ALL') {
        filteredTables = filteredTables.filter(t => t.trangThai === boLocTrangThai);
    }
    
    if(query) {
        filteredTables = filteredTables.filter(t => t.soBan.toString().toLowerCase().includes(query));
    }
    
    grid.innerHTML = filteredTables.map(t => {
        let statusClass = t.trangThai === 'Trong' ? 'status-trong' : (t.trangThai === 'DangPhucVu' ? 'status-dang-phuc-vu' : 'status-cho-thanh-toan');
        let statusText = t.trangThai === 'Trong' ? 'Trống' : (t.trangThai === 'DangPhucVu' ? 'Đang phục vụ' : 'Chờ thanh toán');
        return `
        <div class="table-card ${statusClass}" onclick="moChiTietBan('${t.idBan}', '${t.soBan}', '${t.trangThai}')">
            <div class="table-number">${t.soBan}</div>
            <div class="table-status ${statusClass}">${statusText}</div>
        </div>
        `;
    }).join('');
}

async function moChiTietBan(idBan, soBan, status) {
    banHienTai = { idBan, soBan, status, orders: [] };
    const modal = document.getElementById('tableModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const footer = document.getElementById('modalFooter');
    
    title.innerText = `Bàn số ${soBan}`;
    
    if(status === 'Trong') {
        body.innerHTML = `<p>Bàn này chưa có order.</p>`;
        footer.innerHTML = `<button class="btn btn-gray" onclick="closeModal()">Đóng</button>`;
    } else {
        body.innerHTML = `<p>Đang tải hóa đơn...</p>`;
        modal.style.display = 'flex';
        
        try {
            const res = await fetch(`${API_BASE}/donhang`, { headers: { 'Cache-Control': 'no-cache' } });
            const danhSachDonHang = await res.json();
            const openOrder = danhSachDonHang.find(o => o.idBan === idBan && o.trangThaiOrder === 'DangMo');
            
            if(openOrder) {
                const resItems = await fetch(API_BASE + '/donhang/' + openOrder.idOrder + '/items');
                const items = await resItems.json();
                
                items.sort((a,b) => new Date(a.thoiGianGoi) - new Date(b.thoiGianGoi));
                let groups = [];
                items.forEach(o => {
                    if (groups.length === 0) {
                        groups.push({ time: new Date(o.thoiGianGoi), items: [o] });
                    } else {
                        let lastGroup = groups[groups.length - 1];
                        let diff = new Date(o.thoiGianGoi) - lastGroup.time;
                        if (diff < 10000) { // within 10 seconds
                            lastGroup.items.push(o);
                        } else {
                            groups.push({ time: new Date(o.thoiGianGoi), items: [o] });
                        }
                    }
                });
                
                let total = 0;
                let listHTML = groups.map((g, index) => {
                    let groupHtml = `<div style="font-weight: bold; color: #FF6B00; margin-top: 10px; margin-bottom: 5px; border-bottom: 1px dashed #ccc; padding-bottom: 3px;">Order ${index + 1} - ${g.time.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</div>`;
                    let itemsHtml = g.items.map(o => {
                        let itemName = o.idMonAn;
                        let def = danhSachMonAn.find(x => x.idMonAn === o.idMonAn);
                        if(def) itemName = def.tenMonAn;
                        
                        if(o.trangThaiMon === 'DaHuy') {
                            return `
                            <div class="bill-item" style="padding-left: 10px; opacity: 0.6;">
                                <span style="text-decoration: line-through;">${o.soLuong}x ${itemName}</span>
                                <span style="color:red; font-size: 13px;">Đã hủy</span>
                            </div>
                            `;
                        } else {
                            total += o.donGia * o.soLuong;
                            return `
                            <div class="bill-item" style="padding-left: 10px;">
                                <span>${o.soLuong}x ${itemName}</span>
                                <span>${(o.donGia * o.soLuong).toLocaleString('vi-VN')} đ</span>
                            </div>
                            `;
                        }
                    }).join('');
                    return groupHtml + itemsHtml;
                }).join('');
                
                body.innerHTML = `
                    ${listHTML}
                    <div style="text-align:right; font-weight:bold; font-size:18px; margin-top:15px;">Tổng cộng: ${total.toLocaleString('vi-VN')} đ</div>
                `;
            } else {
                body.innerHTML = `<p>Không tìm thấy hóa đơn mở.</p>`;
            }
        } catch(e) {
            body.innerHTML = `<p>Lỗi tải hóa đơn.</p>`;
        }
        
        if(status === 'DangPhucVu') {
            footer.innerHTML = `
                <button class="btn btn-gray" onclick="closeModal()">Đóng</button>
                <button class="btn btn-orange" onclick="chotBan('${idBan}', '${soBan}')">Xác nhận</button>
            `;
        } else if(status === 'ChoThanhToan') {
            footer.innerHTML = `
                <button class="btn btn-gray" onclick="closeModal()">Đóng</button>
                <button class="btn btn-blue" onclick="window.location.href='thanhtoan.html?table=${idBan}&soBan=${soBan}'">Thanh toán ngay</button>
            `;
        }
    }
    
    modal.style.display = 'flex';
}

async function chotBan(idBan, soBan) {
    try {
        await fetch(`${API_BASE}/danhSachBan/${idBan}/status?status=ChoThanhToan`, { method: 'PUT' });
        if(ketNoiSocket) {
            ketNoiSocket.send("/app/ban.sukien", {}, JSON.stringify({ event: "LOCK_TABLE" }));
        }
        window.location.href = `thanhtoan.html?table=${idBan}&soBan=${soBan}`;
    } catch(e) { alert("Lỗi chốt bàn"); }
}

function closeModal() {
    document.getElementById('tableModal').style.display = 'none';
}

// --- Thanh toán ---
async function khoiTaoThanhToan() {
    ketNoiWebSocket();
    const urlParams = new URLSearchParams(window.location.search);
    const tableId = urlParams.get('table');
    const soBan = urlParams.get('soBan');
    if(!tableId) { window.location.href = 'sodoban.html'; return; }
    
    banHienTai = { idBan: tableId, soBan };
    document.getElementById('ttTableTitle').innerText = `Thanh toán Bàn ${soBan}`;
    
    try {
        const resItemsList = await fetch(`${API_BASE}/thucdon/monan`, { headers: { 'Cache-Control': 'no-cache' } });
        danhSachMonAn = await resItemsList.json();
        
        const resOrd = await fetch(API_BASE + '/donhang', { headers: { 'Cache-Control': 'no-cache' } });
        const danhSachDonHang = await resOrd.json();
        const openOrder = danhSachDonHang.find(o => o.idBan === tableId && o.trangThaiOrder === 'DangMo');
        
        if(openOrder) {
            banHienTai.openOrderId = openOrder.idOrder;
            const resItems = await fetch(API_BASE + '/donhang/' + openOrder.idOrder + '/items');
            const items = await resItems.json();
            
            items.sort((a,b) => new Date(a.thoiGianGoi) - new Date(b.thoiGianGoi));
            let groups = [];
            items.forEach(o => {
                if (groups.length === 0) {
                    groups.push({ time: new Date(o.thoiGianGoi), items: [o] });
                } else {
                    let lastGroup = groups[groups.length - 1];
                    let diff = new Date(o.thoiGianGoi) - lastGroup.time;
                    if (diff < 10000) {
                        lastGroup.items.push(o);
                    } else {
                        groups.push({ time: new Date(o.thoiGianGoi), items: [o] });
                    }
                }
            });
            
            let total = 0;
            let listHTML = groups.map((g, index) => {
                let groupHtml = `<div style="font-weight: bold; color: #FF6B00; margin-top: 10px; margin-bottom: 5px; border-bottom: 1px dashed #ccc; padding-bottom: 3px;">Order ${index + 1} - ${g.time.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</div>`;
                let itemsHtml = g.items.map(o => {
                    let itemName = o.idMonAn;
                    let def = danhSachMonAn.find(x => x.idMonAn === o.idMonAn);
                    if(def) itemName = def.tenMonAn;
                    
                    if(o.trangThaiMon === 'DaHuy') {
                        return `
                        <div class="bill-item" style="padding-left: 10px; opacity: 0.6;">
                            <span style="text-decoration: line-through;">${o.soLuong}x ${itemName}</span>
                            <span style="color:red; font-size: 13px;">Đã hủy</span>
                        </div>
                        `;
                    } else {
                        total += o.donGia * o.soLuong;
                        return `
                        <div class="bill-item" style="padding-left: 10px;">
                            <span>${o.soLuong}x ${itemName}</span>
                            <span>${(o.donGia * o.soLuong).toLocaleString('vi-VN')} đ</span>
                        </div>
                        `;
                    }
                }).join('');
                return groupHtml + itemsHtml;
            }).join('');
            
            document.getElementById('ttBillList').innerHTML = listHTML;
            document.getElementById('ttTotal').innerText = `Tổng cộng: ${total.toLocaleString('vi-VN')} đ`;
            document.getElementById('ttInvoiceId').innerText = `Mã HĐ: HD_${openOrder.idOrder.replace('OD_','')}`;
            window.currentTotal = total;
            
            // Setup customer lookup
            const phoneInput = document.getElementById('customerPhone');
            if (phoneInput) {
                let timeout = null;
                phoneInput.oninput = function() {
                    clearTimeout(timeout);
                    timeout = setTimeout(async () => {
                        const sdt = phoneInput.value.trim();
                        const infoDiv = document.getElementById('customerInfo');
                        const redeemBox = document.getElementById('redeemBox');
                        const newCustomerBox = document.getElementById('newCustomerBox');
                        
                        if (sdt.length >= 9) {
                            try {
                                const res = await fetch(`${API_BASE}/khachhang/${sdt}`);
                                if (res.ok) {
                                    const kh = await res.json();
                                    window.currentCustomerPoints = kh.diemTichLuy;
                                    infoDiv.innerText = `${kh.tenKhachHang} - Điểm tích lũy: ${kh.diemTichLuy} điểm`;
                                    infoDiv.style.color = '#27AE60';
                                    infoDiv.style.display = 'block';
                                    redeemBox.style.display = 'block';
                                    if(newCustomerBox) newCustomerBox.style.display = 'none';
                                } else {
                                    window.currentCustomerPoints = 0;
                                    infoDiv.innerText = `Khách hàng mới (Sẽ được tạo tự động khi thanh toán)`;
                                    infoDiv.style.color = '#F39C12';
                                    infoDiv.style.display = 'block';
                                    redeemBox.style.display = 'none';
                                    if(newCustomerBox) newCustomerBox.style.display = 'block';
                                }
                            } catch(e) {}
                        } else {
                            window.currentCustomerPoints = 0;
                            infoDiv.style.display = 'none';
                            redeemBox.style.display = 'none';
                            if(newCustomerBox) newCustomerBox.style.display = 'none';
                        }
                        tinhTienThua();
                    }, 500);
                };
            }
        }
    } catch(e) { console.error(e); }
}

function chonPhuongThuc(method) {
    document.getElementById('btnCash').classList.remove('active');
    document.getElementById('btnQR').classList.remove('active');
    document.getElementById('qrBox').style.display = 'none';
    document.getElementById('cashBox').style.display = 'none';
    
    if(method === 'cash') {
        document.getElementById('btnCash').classList.add('active');
        document.getElementById('cashBox').style.display = 'block';
    } else {
        document.getElementById('btnQR').classList.add('active');
        document.getElementById('qrBox').style.display = 'block';
    }
}

function tinhTienThua() {
    const tienKhachDuaStr = document.getElementById('tienKhachDua').value;
    const tienKhachDua = parseFloat(tienKhachDuaStr) || 0;
    
    let total = window.currentTotal || 0;
    
    // Deduct redeemed points (1 pt = 1000 VND)
    let redeemInput = document.getElementById('diemSuDung');
    let diemSuDung = 0;
    if (redeemInput && redeemInput.value) {
        diemSuDung = parseInt(redeemInput.value);
        if (diemSuDung > window.currentCustomerPoints) diemSuDung = window.currentCustomerPoints;
        if (diemSuDung < 0) diemSuDung = 0;
        redeemInput.value = diemSuDung; // cap max
    }
    
    total = total - (diemSuDung * 1000);
    if (total < 0) total = 0;
    
    // Cập nhật lại UI tổng tiền nếu có giảm trừ
    const totalDiv = document.getElementById('ttTotal');
    if (diemSuDung > 0) {
        totalDiv.innerHTML = `Tổng cộng: ${window.currentTotal.toLocaleString('vi-VN')} đ <br><span style="color:#27AE60; font-size:16px;">- Đổi điểm: ${(diemSuDung*1000).toLocaleString('vi-VN')} đ</span> <br><span style="color:#E63946">Phải thanh toán: ${total.toLocaleString('vi-VN')} đ</span>`;
    } else {
        totalDiv.innerText = `Tổng cộng: ${window.currentTotal.toLocaleString('vi-VN')} đ`;
    }
    
    const change = tienKhachDua - total;
    const changeDiv = document.getElementById('tienThuaDisplay');
    if (change >= 0) {
        changeDiv.innerText = `Tiền thừa: ${change.toLocaleString('vi-VN')} đ`;
        changeDiv.style.color = '#27AE60';
    } else {
        changeDiv.innerText = `Chưa đủ tiền: ${(-change).toLocaleString('vi-VN')} đ`;
        changeDiv.style.color = '#E74C3C';
    }
}


async function xacNhanThanhToan() {
    try {
        if(!banHienTai.openOrderId) return;
        
        const sdt = document.getElementById('customerPhone') ? document.getElementById('customerPhone').value.trim() : '';
        const tenKhachHang = document.getElementById('customerName') ? document.getElementById('customerName').value.trim() : '';
        const isCash = document.getElementById('btnCash').classList.contains('active');
        let total = window.currentTotal || 0;
        let redeemInput = document.getElementById('diemSuDung');
        let diemSuDung = (redeemInput && redeemInput.value) ? parseInt(redeemInput.value) : 0;
        if (diemSuDung > window.currentCustomerPoints) diemSuDung = window.currentCustomerPoints;
        total = total - (diemSuDung * 1000);
        if (total < 0) total = 0;
        
        const tienKhachDua = isCash ? (parseFloat(document.getElementById('tienKhachDua').value) || 0) : total;
        const tienThua = isCash ? (tienKhachDua - total) : 0;
        
        if (isCash && tienKhachDua < total) {
            alert("Số tiền khách đưa chưa đủ!");
            return;
        }

        const payload = {
            sdt: sdt,
            tenKhachHang: tenKhachHang,
            phuongThucThanhToan: isCash ? 'cash' : 'qr',
            tienKhachDua: tienKhachDua,
            tienThua: tienThua,
            tongTienThanhToan: total,
            diemSuDung: diemSuDung
        };

        const res = await fetch(`${API_BASE}/donhang/${banHienTai.openOrderId}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Thanh toán thành công! Hóa đơn đã được in.");
            setTimeout(() => {
                window.location.href = 'sodoban.html';
            }, 500);
        } else {
            alert("Lỗi khi thanh toán!");
        }
    } catch(e) { console.error(e); alert("Lỗi hệ thống"); }
}

function dangXuat() {
    window.location.href = '../dangNhap.html';
}

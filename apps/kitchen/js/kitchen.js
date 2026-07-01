const API_BASE = 'http://localhost:8080/api';
let danhSachMonAn = [];
let kdsOrders = []; 
let ketNoiSocket = null;

function normalizeVN(str) {
    if(!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
}

// --- MENU MANAGEMENT ---
let currentMainFilter = 'ALL';
let currentModalFilter = 'ALL';
let searchQuery = '';
let dailyMenuIds = [];

function getDailyMenuIds() {
    return dailyMenuIds;
}

async function setDailyMenuIds(ids) {
    dailyMenuIds = ids;
    try {
        await fetch(`${API_BASE}/thucdon/hangngay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ids)
        });
        if(ketNoiSocket) {
            ketNoiSocket.send("/app/thucdon.capnhat", {}, JSON.stringify({ action: 'dailyMenuUpdate' }));
        }
    } catch(e) { console.error("Lỗi lưu thực đơn ngày:", e); }
}

async function loadDailyMenu() {
    try {
        const res = await fetch(`${API_BASE}/thucdon/hangngay`);
        dailyMenuIds = await res.json();
    } catch(e) {}
}

async function fetchItems() {
    try {
        const res = await fetch(`${API_BASE}/thucdon/monan`);
        danhSachMonAn = await res.json();
    } catch(e) { console.error("Lỗi fetch items:", e); }
}

async function initMenuManager() {
    await fetchItems();
    await loadDailyMenu();
    
    // Event listeners
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = normalizeVN(e.target.value);
        renderMenuManager();
    });
    
    renderMenuManager();
    ketNoiWebSocket();
    updateKitchenHeader();
}

async function updateKitchenHeader() {
    let nvInfoStr = localStorage.getItem('nhanVienInfo');
    if(nvInfoStr) {
        let nvInfo = JSON.parse(nvInfoStr);
        let branchId = nvInfo.idChiNhanh;
        
        // Update user name in sidebar
        const nameEl = document.getElementById('sidebarUserName');
        if(nameEl) nameEl.innerText = nvInfo.tenDangNhap;

        if(branchId) {
            try {
                const res = await fetch(`${API_BASE}/chinhanh`);
                const branches = await res.json();
                const branch = branches.find(b => b.idChiNhanh === branchId);
                if(branch) {
                    const h2 = document.querySelector('.header h2');
                    if(h2 && !h2.innerText.includes(branch.tenChiNhanh)) {
                        h2.innerText = h2.innerText + ` (${branch.tenChiNhanh})`;
                    }
                    
                    // Update user role in sidebar with branch
                    const roleEl = document.querySelector('.sidebar-user-role');
                    if(roleEl) {
                        roleEl.innerText = `Đầu bếp - ${branch.tenChiNhanh}`;
                    }
                }
            } catch(e) {}
        }
    }
}

function filterMain(cat) {
    currentMainFilter = cat;
    document.querySelectorAll('.main-content .filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderMenuManager();
}

function renderMenuManager() {
    const grid = document.getElementById('menuGrid');
    if(!grid) return;
    
    let dailyIds = getDailyMenuIds();
    let itemsToShow = danhSachMonAn.filter(i => dailyIds.includes(i.idMonAn));
    
    if (currentMainFilter !== 'ALL') {
        itemsToShow = itemsToShow.filter(i => i.idDanhMuc === currentMainFilter || i.idDanhMuc.startsWith(currentMainFilter));
    }
    
    if (searchQuery) {
        itemsToShow = itemsToShow.filter(i => normalizeVN(i.tenMonAn).includes(searchQuery));
    }
    
    grid.innerHTML = itemsToShow.map(i => {
        let isConHang = i.trangThai === 'ConHang';
        let badgeClass = isConHang ? 'badge-con' : 'badge-het';
        let badgeText = isConHang ? 'Còn hàng' : 'Hết hàng';
        
        return `
        <div class="menu-card">
            <img src="../web/${i.hinhAnh}" onerror="this.onerror=null; this.src='https://via.placeholder.com/70'">
            <div class="menu-card-info">
                <div class="menu-card-title">
                    <span style="font-size: 14px;">${i.tenMonAn}</span>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size: 13px; font-weight: normal; color: #555;">Trạng thái</span>
                        <label class="switch">
                            <input type="checkbox" ${isConHang ? 'checked' : ''} onchange="toggleItemStatus('${i.idMonAn}', this.checked)">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
                    <div class="menu-card-price">${i.gia.toLocaleString('vi-VN')} đ</div>
                    <div class="menu-badge ${badgeClass}">${badgeText}</div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

async function toggleItemStatus(id, isChecked) {
    const newStatus = isChecked ? 'ConHang' : 'HetHang';
    // Update local immediately for UI
    let item = danhSachMonAn.find(i => i.idMonAn === id);
    if(item) item.trangThai = newStatus;
    
    renderMenuManager(); // Refresh badge
    
    try {
        await fetch(`${API_BASE}/thucdon/monan/${id}/status?status=${newStatus}`, { method: 'PUT' });
    } catch(e) { console.error("Lỗi update trạng thái:", e); }
    
    if(ketNoiSocket) {
        ketNoiSocket.send("/app/thucdon.capnhat", {}, JSON.stringify({ idMonAn: id, trangThai: newStatus }));
    }
}

// --- MODAL THÊM MÓN HẰNG NGÀY ---
function openDailyMenuModal() {
    const d = new Date();
    document.getElementById('currentDateTitle').innerText = `Ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
    document.getElementById('dailyMenuModal').style.display = 'flex';
    renderDailyMenuModal();
}

function closeDailyMenuModal() {
    document.getElementById('dailyMenuModal').style.display = 'none';
    renderMenuManager();
}

function filterModal(cat) {
    currentModalFilter = cat;
    document.querySelectorAll('.modal-filter').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderDailyMenuModal();
}

function renderDailyMenuModal() {
    const list = document.getElementById('modalItemsList');
    
    let itemsToShow = danhSachMonAn;
    if (currentModalFilter !== 'ALL') {
        itemsToShow = itemsToShow.filter(i => i.idDanhMuc === currentModalFilter || i.idDanhMuc.startsWith(currentModalFilter));
    }
    
    let dailyIds = getDailyMenuIds();
    
    // Đồng bộ nút gạt Master
    const masterToggle = document.getElementById('masterToggle');
    if (masterToggle && itemsToShow.length > 0) {
        masterToggle.checked = itemsToShow.every(i => dailyIds.includes(i.idMonAn));
    } else if (masterToggle) {
        masterToggle.checked = false;
    }
    
    list.innerHTML = itemsToShow.map(i => {
        let isSelected = dailyIds.includes(i.idMonAn);
        return `
        <div class="modal-item-row">
            <label class="switch">
                <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleDailyMenu('${i.idMonAn}', this.checked)">
                <span class="slider"></span>
            </label>
            <div class="modal-item-name">${i.tenMonAn}</div>
            <div class="modal-item-price">${i.gia.toLocaleString('vi-VN')} đ</div>
        </div>
        `;
    }).join('');
}

async function toggleDailyMenu(id, isChecked) {
    let dailyIds = getDailyMenuIds();
    if (isChecked) {
        if (!dailyIds.includes(id)) dailyIds.push(id);
        
        let item = danhSachMonAn.find(i => i.idMonAn === id);
        if(item && item.trangThai === 'HetHang') {
            await toggleItemStatus(id, true);
        }
    } else {
        dailyIds = dailyIds.filter(x => x !== id);
    }
    await setDailyMenuIds(dailyIds);
    renderDailyMenuModal(); // Tự động check/uncheck master toggle
}

async function toggleAllDailyMenuItems(isChecked) {
    let itemsToShow = danhSachMonAn;
    if (currentModalFilter !== 'ALL') {
        itemsToShow = itemsToShow.filter(i => i.idDanhMuc === currentModalFilter || i.idDanhMuc.startsWith(currentModalFilter));
    }
    
    let dailyIds = getDailyMenuIds();
    
    for (let i of itemsToShow) {
        if (isChecked) {
            if (!dailyIds.includes(i.idMonAn)) dailyIds.push(i.idMonAn);
            if(i.trangThai === 'HetHang') {
                await toggleItemStatus(i.idMonAn, true);
            }
        } else {
            dailyIds = dailyIds.filter(x => x !== i.idMonAn);
        }
    }
    
    await setDailyMenuIds(dailyIds);
    renderDailyMenuModal();
}

// --- KDS (XỬ LÝ ĐƠN HÀNG) ---
async function initKDS() {
    await fetchItems();
    ketNoiWebSocket();
    fetchPendingOrders();
    updateKitchenHeader();
}

let currentKdsFilter = 'ALL';

function filterKds(status) {
    currentKdsFilter = status;
    document.querySelectorAll('.kds-filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderKDS();
}

async function fetchPendingOrders() {
    try {
        const resTables = await fetch(`${API_BASE}/ban`, { cache: 'no-store' });
        const allTables = await resTables.json();
        const tableBranchMap = {};
        allTables.forEach(t => tableBranchMap[t.idBan] = t.idChiNhanh);

        let nvInfoStr = localStorage.getItem('nhanVienInfo');
        let myBranchId = nvInfoStr ? JSON.parse(nvInfoStr).idChiNhanh : null;

        const resOrd = await fetch(API_BASE + '/donhang', { cache: 'no-store' });
        let danhSachDonHang = await resOrd.json();

        if (myBranchId) {
            danhSachDonHang = danhSachDonHang.filter(o => tableBranchMap[o.idBan] === myBranchId);
        }
        
        let tempOrders = [];
        
        for(let o of danhSachDonHang) {
            if(o.trangThaiOrder === 'DangMo') {
                const resItems = await fetch(API_BASE + '/donhang/' + o.idOrder + '/items', { cache: 'no-store' });
                const items = await resItems.json();
                
                for(let i of items) {
                    // Only show DaTiepNhan, DangNau, DaXong
                    if(['DaTiepNhan', 'DangNau', 'DaXong'].includes(i.trangThaiMon)) {
                        let itemDef = danhSachMonAn.find(x => x.idMonAn === i.idMonAn);
                        let localTimeStr = "12:00";
                        if (i.thoiGianGoi) {
                            let d = new Date(i.thoiGianGoi);
                            localTimeStr = d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
                        }
                        
                        tempOrders.push({
                            id: i.id, 
                            idMonAn: i.idMonAn,
                            orderId: o.idOrder,
                            ban: o.idBan,
                            time: localTimeStr,
                            name: itemDef ? itemDef.tenMonAn : i.idMonAn,
                            hinhAnh: itemDef ? itemDef.hinhAnh : "",
                            qty: i.soLuong,
                            status: i.trangThaiMon
                        });
                    }
                }
            }
        }
        
        kdsOrders = tempOrders;
        // Sort by time ascending (oldest first, newest at the bottom)
        kdsOrders.sort((a, b) => a.time.localeCompare(b.time));
        
        renderKDS();
    } catch(e) { console.error(e); }
}

function renderKDS() {
    const container = document.getElementById('kdsList');
    if(!container) return;

    let filtered = kdsOrders;
    if(currentKdsFilter !== 'ALL') {
        filtered = filtered.filter(o => o.status === currentKdsFilter);
    }
    
    const kdsSearchInput = document.getElementById('kdsSearchInput');
    if (kdsSearchInput && kdsSearchInput.value) {
        let q = normalizeVN(kdsSearchInput.value);
        filtered = filtered.filter(o => normalizeVN(o.name).includes(q));
    }

    const groups = {
        'DaXong': { title: 'Đã xong', items: filtered.filter(o => o.status === 'DaXong') },
        'DangNau': { title: 'Đang nấu', items: filtered.filter(o => o.status === 'DangNau') },
        'DaTiepNhan': { title: 'Hàng đợi', items: filtered.filter(o => o.status === 'DaTiepNhan') }
    };

    let html = '';
    for(let key in groups) {
        if(groups[key].items.length > 0 || currentKdsFilter === key) {
            html += `<div class="kds-section-title">${groups[key].title}</div>`;
            html += groups[key].items.map(o => createKDSRow(o)).join('');
        }
    }

    if(filtered.length === 0) {
        html = `<div style="text-align:center; padding: 50px; color:#888;">Không có món ăn nào trong danh mục này</div>`;
    }

    container.innerHTML = html;
}

function createKDSRow(order) {
    let badgeClass = '', badgeText = '', actions = '';
    
    if(order.status === 'DaTiepNhan') {
        badgeClass = 'da-tiep-nhan'; badgeText = 'Đã tiếp nhận';
        actions = `
            <button class="btn-kds btn-kds-green" onclick="updateOrderStatus(${order.id}, 'DangNau')">Bắt đầu</button>
            <button class="btn-kds btn-kds-red" onclick="updateOrderStatus(${order.id}, 'DaHuy')">Hủy món</button>
        `;
    } else if (order.status === 'DangNau') {
        badgeClass = 'dang-nau'; badgeText = 'Đang nấu';
        actions = `
            <button class="btn-kds btn-kds-green" onclick="updateOrderStatus(${order.id}, 'DaXong')">Đã xong</button>
        `;
    } else if (order.status === 'DaXong') {
        badgeClass = 'da-xong'; badgeText = 'Đã xong';
        actions = `
            <button class="btn-kds btn-kds-disabled" disabled>Đã xong</button>
        `;
    }
    
    // Convert table ID (e.g. B01_CN01 -> 1)
    let tableDisp = order.ban;
    if(tableDisp.startsWith('B')) {
        let parts = tableDisp.split('_');
        tableDisp = parseInt(parts[0].replace('B', ''), 10).toString();
    }
    
    return `
        <div class="kds-item-row">
            <img src="../web/${order.hinhAnh}" class="kds-item-img" onerror="this.onerror=null; this.src='https://via.placeholder.com/100x70'">
            <div class="kds-item-details">
                <div class="kds-item-main">
                    <span class="kds-item-name">${order.name}</span>
                    <span class="kds-item-qty">Số lượng: ${order.qty}</span>
                </div>
                <div class="kds-item-meta">
                    <span style="font-size: 13px; color: #555;">Thời gian đặt món<br><strong style="color:#000;">${order.time}</strong></span>
                    <span class="kds-item-table">Bàn số: ${tableDisp}</span>
                </div>
                <div class="kds-badge ${badgeClass}">${badgeText}</div>
                <div class="kds-actions">${actions}</div>
            </div>
        </div>
    `;
}

async function updateOrderStatus(itemId, newStatus) {
    await fetch(API_BASE + `/donhang/items/${itemId}/status?status=${newStatus}`, { method: 'PUT' });
    
    const ticket = kdsOrders.find(o => o.id === itemId);
    if(ticket && ketNoiSocket) {
        // Gửi cho Tablet
        ketNoiSocket.send("/app/donhang.trangthai", {}, JSON.stringify({ 
            idMonAnKDS: ticket.idMonAn, 
            statusKDS: newStatus
        }));
        // Báo cho các bếp khác reload
        ketNoiSocket.send("/app/donhang.moi", {}, JSON.stringify({ event: 'RELOAD_ORDERS' }));
    }
    
    await fetchPendingOrders();
}

function ketNoiWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws');
    ketNoiSocket = Stomp.over(socket);
    const nvInfoStr = localStorage.getItem('nhanVienInfo');
    const branchId = nvInfoStr ? JSON.parse(nvInfoStr).idChiNhanh : null;
    ketNoiSocket.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        // Subscribe topic theo chi nhánh của đầu bếp
        const topicBep = branchId ? `/topic/bep/${branchId}` : '/topic/bep';
        ketNoiSocket.subscribe(topicBep, function (message) {
            console.log("Nhận đơn hàng mới từ tablet:", message.body);
            fetchPendingOrders();
        });
    });
}

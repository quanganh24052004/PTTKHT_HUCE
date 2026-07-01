const API_BASE = 'http://localhost:8080/api';
let allCategories = [];
let danhSachMonAn = [];
let gioHang = [];
let orders = [];
let currentCat = null;
let isLocked = false;
let currentTableId = localStorage.getItem('tabletTableId');

if (!currentTableId) {
    window.location.href = 'index.html';
}

function normalizeVN(str) {
    if(!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
}

// Fetch data on load
window.onload = async () => {
    try {
        await fetchCategories();
        await loadDailyMenu();
        await fetchItems();
        renderCategories();
        
        const mainCats = allCategories.filter(c => !c.idDanhMucCha);
        if(mainCats.length > 0) {
            selectCategory(mainCats[0].idDanhMuc, mainCats[0].tenDanhMuc);
        }
        
        // Fetch table and branch info
        try {
            const resTables = await fetch(`${API_BASE}/ban`);
            const allTables = await resTables.json();
            const banHienTai = allTables.find(t => t.idBan === currentTableId);
            if(banHienTai) {
                const resBranches = await fetch(`${API_BASE}/chinhanh`);
                const allBranches = await resBranches.json();
                const branch = allBranches.find(b => b.idChiNhanh === banHienTai.idChiNhanh);
                if(branch) {
                    document.querySelector('.table-info').innerText = `Bàn số ${banHienTai.soBan} - ${branch.tenChiNhanh}`;
                }
            }
        } catch(e) {}
        
        await fetchExistingOrders();
        
        setupSearch();
        ketNoiWebSocket();
    } catch (e) {
        console.error("Lỗi khi tải dữ liệu:", e);
    }
};

async function fetchExistingOrders() {
    try {
        const resOrders = await fetch(API_BASE + '/donhang');
        const danhSachDonHang = await resOrders.json();
        const openOrder = danhSachDonHang.find(o => o.idBan === currentTableId && o.trangThaiOrder === 'DangMo');
        
        if (openOrder) {
            const resItems = await fetch(`${API_BASE}/donhang/${openOrder.idOrder}/items`);
            const items = await resItems.json();
            
            orders = items.map(item => {
                const menuItem = danhSachMonAn.find(i => i.idMonAn === item.idMonAn) || { tenMonAn: 'Món ăn', hinhAnh: 'https://via.placeholder.com/80', gia: item.donGia };
                return {
                    ...menuItem,
                    sl: item.soLuong,
                    trangThaiMon: item.trangThaiMon,
                    ticketId: openOrder.idOrder,
                    sessionName: 'Đã gọi trước đó',
                    time: new Date(item.thoiGianGoi).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
                };
            });
            updateCartBadge();
        }
    } catch(e) {
        console.error("Lỗi fetchExistingOrders:", e);
    }
}

function setupSearch() {
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const val = normalizeVN(e.target.value);
        const dropdown = document.getElementById('searchDropdown');
        if(!val) {
            dropdown.style.display = 'none';
            return;
        }
        let dailyIds = getDailyMenuIds();
        const results = danhSachMonAn.filter(i => dailyIds.includes(i.idMonAn) && normalizeVN(i.tenMonAn).includes(val));
        
        if(results.length === 0) {
            dropdown.innerHTML = '<div style="padding: 15px; color: #666; text-align: center;">Không tìm thấy món ăn</div>';
            dropdown.style.display = 'block';
            return;
        }
        
        dropdown.innerHTML = results.map(i => `
            <div style="padding: 10px 15px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 15px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#f9f9f9'" onmouseout="this.style.background='transparent'" onclick="showItemDetails('${i.idMonAn}'); document.getElementById('searchDropdown').style.display='none'; document.getElementById('searchInput').value='';">
                <img src="../web/${i.hinhAnh}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://via.placeholder.com/50'">
                <div style="flex-grow: 1;">
                    <div style="font-weight: 600; color: #333; font-size: 15px; margin-bottom: 5px;">${i.tenMonAn}</div>
                    <div style="color: #FF6B00; font-weight: 700; font-size: 14px;">${i.gia.toLocaleString('vi-VN')} đ</div>
                </div>
            </div>
        `).join('');
        dropdown.style.display = 'block';
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if(!e.target.closest('.search-bar')) {
            document.getElementById('searchDropdown').style.display = 'none';
        }
    });
}

async function fetchCategories() {
    const res = await fetch(`${API_BASE}/thucdon/danhmuc`);
    allCategories = await res.json();
}

let dailyMenuIds = [];
function getDailyMenuIds() {
    return dailyMenuIds;
}

async function loadDailyMenu() {
    try {
        const branchId = localStorage.getItem('tabletBranchId');
        const url = branchId
            ? `${API_BASE}/thucdon/hangngay?idChiNhanh=${branchId}`
            : `${API_BASE}/thucdon/hangngay`;
        const res = await fetch(url);
        dailyMenuIds = await res.json();
    } catch(e) {}
}

async function fetchItems() {
    const res = await fetch(`${API_BASE}/thucdon/monan`);
    const items = await res.json();
    
    // Khách hàng chỉ được thấy những món nằm trong Thực đơn hôm nay (do bếp chọn), bất kể còn hay hết
    danhSachMonAn = items.filter(i => dailyMenuIds.includes(i.idMonAn));
}

function renderCategories() {
    const mainCats = allCategories.filter(c => !c.idDanhMucCha);
    const container = document.getElementById('mainCategories');
    container.innerHTML = mainCats.map(c => `
        <div class="cat-card ${currentCat === c.idDanhMuc ? 'active' : ''}" onclick="selectCategory('${c.idDanhMuc}', '${c.tenDanhMuc}')">
            <img src="../web/images/${getCatImage(c.tenDanhMuc)}" onerror="this.onerror=null; this.src='https://via.placeholder.com/140'" alt="${c.tenDanhMuc}">
            <span>${c.tenDanhMuc}</span>
        </div>
    `).join('');
}

function getCatImage(name) {
    if(name.includes('lẩu')) return 'icon-nuoc-lau.png';
    if(name.includes('chính')) return 'icon-mon-chinh.png';
    if(name.includes('chấm')) return 'icon-nuoc-cham.png';
    if(name.includes('vặt')) return 'icon-do-an-vat.png';
    if(name.includes('uống')) return 'icon-thuc-uong.png';
    return 'icon-nuoc-lau.png';
}

function selectCategory(id, name) {
    currentCat = id;
    renderCategories();
    
    if(name) {
        document.getElementById('categoryTitle').innerText = name;
    }
    
    renderSubCategories(id);
    filterItems(id);
}

function renderSubCategories(catId) {
    const subCats = allCategories.filter(c => c.idDanhMucCha === catId);
    const bar = document.getElementById('subCategoryBar');
    if(subCats.length > 0) {
        bar.innerHTML = `
            <button class="filter-btn active" onclick="selectSubCategory('ALL', '${catId}')">Tất cả</button>
            ${subCats.map(c => `<button class="filter-btn" onclick="selectSubCategory('${c.idDanhMuc}', '${catId}')">${c.tenDanhMuc}</button>`).join('')}
        `;
        bar.style.display = 'flex';
    } else {
        bar.style.display = 'none';
    }
}

function selectSubCategory(subId, parentCatId) {
    const bar = document.getElementById('subCategoryBar');
    bar.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    filterItems(parentCatId, subId);
}

function filterItems(catId, subId = 'ALL') {
    let allowedCats = [];
    if(subId === 'ALL') {
        const subCats = allCategories.filter(c => c.idDanhMucCha === catId).map(c => c.idDanhMuc);
        allowedCats = [catId, ...subCats];
    } else {
        allowedCats = [subId];
    }
    
    const filtered = danhSachMonAn.filter(i => allowedCats.includes(i.idDanhMuc));
    const container = document.getElementById('itemsGrid');
    
    if(filtered.length === 0) {
        container.innerHTML = '<div style="padding: 50px; text-align: center; width: 100%; grid-column: 1 / -1; font-size: 20px; color: #666;">Chưa có món ăn được thêm</div>';
        return;
    }

    container.innerHTML = filtered.map(i => `
        <div class="item-card" onclick="showItemDetails('${i.idMonAn}')">
            <img src="../web/${i.hinhAnh}" class="item-image" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200'" alt="${i.tenMonAn}">
            <div class="item-details">
                <div class="item-bottom">
                    <span class="item-status ${i.trangThai === 'ConHang' ? '' : 'out'}">${i.trangThai === 'ConHang' ? 'Còn hàng' : 'Hết hàng'}</span>
                    <div class="item-title">${i.tenMonAn}</div>
                    <span class="item-price">${i.gia.toLocaleString('vi-VN')} đ</span>
                </div>
            </div>
        </div>
    `).join('');
}

let currentItemDetails = null;
let currentItemQty = 1;

function showItemDetails(id) {
    const item = danhSachMonAn.find(i => i.idMonAn === id);
    if(item.trangThai === 'HetHang') {
        alert('Món này đã hết hàng!');
        return;
    }
    currentItemDetails = item;
    currentItemQty = 1;
    
    const container = document.getElementById('itemModalBody');
    container.innerHTML = `
        <div class="item-modal-left">
            <img src="../web/${item.hinhAnh}" onerror="this.onerror=null; this.src='https://via.placeholder.com/300'">
        </div>
        <div class="item-modal-right">
            <button class="btn-close-small" onclick="closeModals()">Đóng</button>
            <div class="item-modal-title">${item.tenMonAn}</div>
            <div class="item-modal-price">${item.gia.toLocaleString('vi-VN')} đ</div>
            <div class="item-modal-desc">
                Món ăn hấp dẫn phải gọi khi đến HaceLao! Nguyên liệu được chọn lọc kỹ càng để tạo nên hương vị đặc biệt khó quên.
            </div>
            <div class="item-modal-bottom">
                <div class="qty-selector">
                    <button onclick="updateItemDetailsQty(-1)">-</button>
                    <span id="itemDetailsQty">${currentItemQty}</span>
                    <button onclick="updateItemDetailsQty(1)">+</button>
                </div>
                <button class="btn-add-cart" onclick="confirmAddItem()">Thêm</button>
            </div>
        </div>
    `;
    
    document.body.classList.add('modal-open');
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('itemModal').style.display = 'flex';
}

function updateItemDetailsQty(delta) {
    if(currentItemQty + delta > 0) {
        currentItemQty += delta;
        document.getElementById('itemDetailsQty').innerText = currentItemQty;
    }
}

function confirmAddItem() {
    if(isLocked) {
        alert("Bàn đã được chốt thanh toán, quý khách không thể gọi thêm món lúc này.");
        closeModals();
        return;
    }
    if(!currentItemDetails) return;
    const existing = gioHang.find(c => c.idMonAn === currentItemDetails.idMonAn);
    if(existing) {
        existing.soLuong += currentItemQty;
    } else {
        gioHang.push({...currentItemDetails, soLuong: currentItemQty});
    }
    updateCartBadge();
    closeModals();
    showToast(`Đã thêm ${currentItemQty} phần ${currentItemDetails.tenMonAn} vào giỏ hàng!`);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if(!toast) return;
    toast.innerText = message;
    toast.className = "toast show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

function themVaoGioHang(id) {
    if(isLocked) {
        alert("Bàn đã được chốt thanh toán, quý khách không thể gọi thêm món lúc này.");
        return;
    }
    const item = danhSachMonAn.find(i => i.idMonAn === id);
    if(item.trangThai === 'HetHang') {
        alert('Món này đã hết hàng!');
        return;
    }
    const existing = gioHang.find(c => c.idMonAn === id);
    if(existing) {
        existing.soLuong++;
    } else {
        gioHang.push({...item, soLuong: 1});
    }
    updateCartBadge();
}

function updateCartBadge() {
    const total = gioHang.reduce((sum, i) => sum + i.soLuong, 0);
    document.getElementById('cartBadge').innerText = total;
}

// Modals
function showCart() {
    const container = document.getElementById('cacMonTrongGio');
    let total = 0;
    container.innerHTML = gioHang.map((i, index) => {
        total += i.gia * i.soLuong;
        return `
        <div class="cart-item">
            <input type="checkbox" class="cart-checkbox" checked onchange="updateCartTotal()">
            <img src="../web/${i.hinhAnh}" onerror="this.onerror=null; this.src='https://via.placeholder.com/80'">
            <div class="cart-item-info">
                <h4>${i.tenMonAn}</h4>
            </div>
            <div class="cart-item-price">${(i.gia * i.soLuong).toLocaleString('vi-VN')} đ</div>
            <div class="cart-controls">
                <button onclick="updateQuantity(${index}, -1)">-</button>
                <span>${i.soLuong}</span>
                <button onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button class="cart-delete" onclick="removeFromCart(${index})">🗑️</button>
        </div>
    `}).join('');
    document.getElementById('cartTotal').innerText = total.toLocaleString('vi-VN') + ' đ';
    document.body.classList.add('modal-open');
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('cartModal').style.display = 'flex';
}

function toggleSelectAllCart() {
    const isChecked = document.getElementById('selectAllCart').checked;
    document.querySelectorAll('.cart-checkbox').forEach(cb => cb.checked = isChecked);
    updateCartTotal();
}

function updateCartTotal() {
    let total = 0;
    document.querySelectorAll('.cart-item').forEach((row, index) => {
        const checkbox = row.querySelector('.cart-checkbox');
        if(checkbox && checkbox.checked) {
            total += gioHang[index].gia * gioHang[index].soLuong;
        }
    });
    document.getElementById('cartTotal').innerText = total.toLocaleString('vi-VN') + ' đ';
}

function updateQuantity(index, delta) {
    gioHang[index].soLuong += delta;
    if(gioHang[index].soLuong <= 0) gioHang.splice(index, 1);
    updateCartBadge();
    showCart();
}

function removeFromCart(index) {
    gioHang.splice(index, 1);
    updateCartBadge();
    showCart();
}

let orderSessionCounter = 1;

async function confirmOrder() {
    if(gioHang.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }
    
    const selectedIndices = [];
    document.querySelectorAll('.cart-item').forEach((row, index) => {
        const checkbox = row.querySelector('.cart-checkbox');
        if(checkbox && checkbox.checked) {
            selectedIndices.push(index);
        }
    });
    
    if(selectedIndices.length === 0) {
        alert("Vui lòng chọn ít nhất 1 món để đặt!");
        return;
    }
    
    const itemsToOrder = selectedIndices.map(i => gioHang[i]);
    
    // Kiểm tra trạng thái mới nhất từ danhSachMonAn
    let outOfStockItems = [];
    for (let item of itemsToOrder) {
        const currentItem = danhSachMonAn.find(i => i.idMonAn === item.idMonAn);
        if (!currentItem || currentItem.trangThai === 'HetHang') {
            outOfStockItems.push(item.tenMonAn);
        }
    }
    
    if (outOfStockItems.length > 0) {
        alert("Rất xin lỗi quý khách, các món sau vừa hết hàng: " + outOfStockItems.join(', ') + ". Vui lòng bỏ chọn khỏi giỏ hàng hoặc chọn món khác!");
        return;
    }
    
    try {
        const API_BASE = 'http://localhost:8080/api';
        let orderId = null;
        
        // Fetch current open order
        const resOrders = await fetch(API_BASE + '/donhang');
        const danhSachDonHang = await resOrders.json();
        const openOrder = danhSachDonHang.find(o => o.idBan === currentTableId && o.trangThaiOrder === 'DangMo');
        
        if(openOrder) {
            orderId = openOrder.idOrder;
        } else {
            // Create new order
            const newOrder = {
                idOrder: 'OD_' + Date.now(),
                idBan: currentTableId,
                tongTienTamTinh: 0,
                trangThaiOrder: 'DangMo'
            };
            const resCreate = await fetch(API_BASE + '/donhang', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newOrder)
            });
            const created = await resCreate.json();
            orderId = created.idOrder;
        }
        
        // Add items to order
        const sessionName = 'Order ' + orderSessionCounter++;
        const currentTime = new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
        for(let item of itemsToOrder) {
            const chiTiet = {
                idMonAn: item.idMonAn,
                soLuong: item.soLuong,
                donGia: item.gia,
                trangThaiMon: 'DaTiepNhan'
            };
            await fetch(`${API_BASE}/donhang/${orderId}/items`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(chiTiet)
            });
            
            // Local fallback for UI
            const existing = orders.find(o => o.idMonAn === item.idMonAn && o.sessionName === sessionName);
            if(existing) {
                existing.soLuong += item.soLuong;
            } else {
                orders.push({...item, sl: item.soLuong, trangThaiMon: 'TiepNhan', ticketId: orderId, sessionName: sessionName, time: currentTime});
            }
        }
        
        // Notify Kitchen
        if(ketNoiSocket) {
            ketNoiSocket.send("/app/donhang.moi", {}, JSON.stringify({ 
                table: "Bàn " + currentTableId,
                idChiNhanh: localStorage.getItem('tabletBranchId'),
                items: itemsToOrder.map(i => ({ name: i.tenMonAn, qty: i.soLuong })) 
            }));
        }
        
        showToast('Đã gửi order xuống bếp!');
        gioHang = gioHang.filter((_, idx) => !selectedIndices.includes(idx));
        updateCartBadge();
        closeModals();
        showOrders();
        
    } catch(e) {
        console.error("Lỗi gửi order:", e);
        alert("Lỗi kết nối máy chủ! Vui lòng thử lại.");
    }
}

function showOrders() {
    const container = document.getElementById('orderItems');
    let total = 0;
    
    const groups = {};
    orders.forEach(i => {
        if(!groups[i.sessionName]) groups[i.sessionName] = [];
        groups[i.sessionName].push(i);
    });
    
    let html = '';
    for(let session in groups) {
        let subtotal = 0;
        let sessionTime = groups[session][0].time || '';
        let sessionHtml = groups[session].map((i, index) => {
            if (i.trangThaiMon !== 'DaHuy' && i.trangThaiMon !== 'Huy') {
                subtotal += i.gia * i.sl;
                total += i.gia * i.sl;
            }
            let badgeClass = i.trangThaiMon === 'TiepNhan' ? 'tiep-nhan' : (i.trangThaiMon === 'DangNau' ? 'dang-nau' : (i.trangThaiMon === 'DaHuy' ? 'huy' : 'da-xong'));
            let badgeText = i.trangThaiMon === 'TiepNhan' ? 'Đã tiếp nhận' : (i.trangThaiMon === 'DangNau' ? 'Đang nấu' : (i.trangThaiMon === 'DaHuy' ? 'Đã hủy' : 'Đã xong'));
            let strikeStyle = i.trangThaiMon === 'DaHuy' ? 'text-decoration: line-through; opacity: 0.6;' : '';
            return `
            <div class="cart-item" style="${strikeStyle}">
                <img src="../web/${i.hinhAnh}" onerror="this.onerror=null; this.src='https://via.placeholder.com/80'">
                <div class="cart-item-info">
                    <h4>${i.tenMonAn}</h4>
                </div>
                <div class="status-badge ${badgeClass}">${badgeText}</div>
                <div style="font-weight: bold; width: 60px;">SL: ${i.sl}</div>
            </div>
        `}).join('');
        
        html += `<div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #eee; padding-bottom: 5px; margin: 15px 0 10px 0;">
                    <h4 style="color: #FF6B00; margin: 0;">${session} <span style="font-size:14px; color:#666; font-weight:normal; margin-left:10px;">(${sessionTime})</span></h4>
                    <span style="font-weight: bold; color: #555;">Tổng: ${subtotal.toLocaleString('vi-VN')} đ</span>
                 </div>`;
        html += sessionHtml;
    }
    
    container.innerHTML = html;
    document.getElementById('ordersTotal').innerText = total.toLocaleString('vi-VN') + ' đ';
    closeModals();
    document.body.classList.add('modal-open');
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('ordersModal').style.display = 'flex';
}

function showInvoice() {
    const container = document.getElementById('invoiceItems');
    let total = 0;
    
    const groups = {};
    const invoiceOrders = orders.filter(o => o.trangThaiMon !== 'DaHuy' && o.trangThaiMon !== 'Huy');
    
    invoiceOrders.forEach(i => {
        if(!groups[i.sessionName]) groups[i.sessionName] = [];
        groups[i.sessionName].push(i);
        total += i.gia * i.sl;
    });
    
    let html = '';
    for(let session in groups) {
        let subtotal = 0;
        let sessionHtml = groups[session].map((i, index) => {
            subtotal += i.gia * i.sl;
            return `
            <div class="cart-item">
                <img src="../web/${i.hinhAnh}" onerror="this.onerror=null; this.src='https://via.placeholder.com/80'">
                <div class="cart-item-info">
                    <h4>${i.tenMonAn}</h4>
                </div>
                <div class="cart-item-price">${i.gia.toLocaleString('vi-VN')} đ</div>
                <div style="font-weight: bold; width: 60px;">SL: ${i.sl}</div>
                <div class="cart-item-price" style="color:#E63946;">Tổng: ${(i.gia * i.sl).toLocaleString('vi-VN')} đ</div>
            </div>
        `}).join('');
        
        html += `<div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #eee; padding-bottom: 5px; margin: 15px 0 10px 0;">
                    <h4 style="color: #FF6B00; margin: 0;">${session}</h4>
                    <span style="font-weight: bold; color: #555;">Tổng: ${subtotal.toLocaleString('vi-VN')} đ</span>
                 </div>`;
        html += sessionHtml;
    }
    
    if (invoiceOrders.length === 0) {
        html = '<div style="text-align:center; padding: 30px; color:#888;">Chưa có món nào được gọi.</div>';
    }
    
    container.innerHTML = html;
    document.getElementById('invoiceTotal').innerText = total.toLocaleString('vi-VN') + ' đ';
    closeModals();
    document.body.classList.add('modal-open');
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('invoiceModal').style.display = 'flex';
}

function payInvoice() {
    alert("Thu ngân sẽ đến hỗ trợ thanh toán!");
    closeModals();
}

function closeModals() {
    document.body.classList.remove('modal-open');
    document.getElementById('overlay').style.display = 'none';
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

// WebSocket setup
let ketNoiSocket = null;
function ketNoiWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws');
    ketNoiSocket = Stomp.over(socket);
    const branchId = localStorage.getItem('tabletBranchId');
    ketNoiSocket.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        // Subscribe topic theo chi nhánh nếu có, còn không thì topic chung
        const topicTablet = branchId ? `/topic/maytinhbang/${branchId}` : '/topic/maytinhbang';
        ketNoiSocket.subscribe(topicTablet, function (message) {
            const data = JSON.parse(message.body);
            if(data.idMonAn && data.trangThai) {
                const item = danhSachMonAn.find(i => i.idMonAn === data.idMonAn);
                if(item) {
                    item.trangThai = data.trangThai;
                    if(typeof currentCat !== 'undefined' && currentCat) filterItems(currentCat);
                }
            } else if(data.idMonAnKDS && data.statusKDS) {
                let updated = false;
                orders.filter(o => o.idMonAn === data.idMonAnKDS).forEach(o => {
                    if(o.trangThaiMon !== 'DaXong') {
                        o.trangThaiMon = data.statusKDS;
                        updated = true;
                    }
                });
                if(updated && document.getElementById('ordersModal').style.display === 'flex') {
                    showOrders();
                }
            } else if(data.ticketId && data.status) {
                orders.filter(o => o.ticketId === data.ticketId).forEach(o => {
                    o.trangThaiMon = data.status;
                });
                if(document.getElementById('ordersModal').style.display === 'flex') {
                    showOrders();
                }
            } else if(data.action === 'dailyMenuUpdate') {
                // Chỉ reload nếu thực đơn được cập nhật bởi bếp cùng chi nhánh
                const myBranchId = localStorage.getItem('tabletBranchId');
                if (!data.idChiNhanh || data.idChiNhanh === myBranchId) {
                    loadDailyMenu().then(() => {
                        fetchItems().then(() => {
                            if(typeof currentCat !== 'undefined' && currentCat) filterItems(currentCat);
                        });
                    });
                }
            } else if(data.event) {
                if(data.event === 'LOCK_TABLE') {
                    if (data.idBan === currentTableId) {
                        isLocked = true;
                        alert("Thu ngân đã chốt bàn để thanh toán. Bạn không thể đặt thêm món.");
                    }
                } else if(data.event === 'RESET_TABLE') {
                    if (data.idBan === currentTableId) {
                        alert("Thanh toán thành công. Cảm ơn quý khách!");
                        window.location.reload();
                    }
                }
            }
        });
    });
}


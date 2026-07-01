const API_BASE = 'http://localhost:8080/api';
let allCategories = [];
let allItems = [];
let cart = [];
let orders = [];
let currentCat = null;
let isLocked = false;
let currentTableId = new URLSearchParams(window.location.search).get('table') || 'B01_CN01';

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
            const resTables = await fetch(`${API_BASE}/tables`);
            const allTables = await resTables.json();
            const currentTable = allTables.find(t => t.idBan === currentTableId);
            if(currentTable) {
                const resBranches = await fetch(`${API_BASE}/branches`);
                const allBranches = await resBranches.json();
                const branch = allBranches.find(b => b.idChiNhanh === currentTable.idChiNhanh);
                if(branch) {
                    document.querySelector('.table-info').innerText = `Bàn số ${currentTable.soBan} - ${branch.tenChiNhanh}`;
                }
            }
        } catch(e) {}
        
        await fetchExistingOrders();
        
        setupSearch();
        connectWebSocket();
    } catch (e) {
        console.error("Lỗi khi tải dữ liệu:", e);
    }
};

async function fetchExistingOrders() {
    try {
        const resOrders = await fetch(API_BASE + '/orders');
        const allOrders = await resOrders.json();
        const openOrder = allOrders.find(o => o.idBan === currentTableId && o.trangThaiOrder === 'DangMo');
        
        if (openOrder) {
            const resItems = await fetch(`${API_BASE}/orders/${openOrder.idOrder}/items`);
            const items = await resItems.json();
            
            orders = items.map(item => {
                const menuItem = allItems.find(i => i.idMonAn === item.idMonAn) || { tenMonAn: 'Món ăn', hinhAnh: 'https://via.placeholder.com/80', gia: item.donGia };
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
        const results = allItems.filter(i => dailyIds.includes(i.idMonAn) && normalizeVN(i.tenMonAn).includes(val));
        
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
    const res = await fetch(`${API_BASE}/menu/categories`);
    allCategories = await res.json();
}

let dailyMenuIds = [];
function getDailyMenuIds() {
    return dailyMenuIds;
}

async function loadDailyMenu() {
    try {
        const res = await fetch(`${API_BASE}/menu/daily`);
        dailyMenuIds = await res.json();
    } catch(e) {}
}

async function fetchItems() {
    const res = await fetch(`${API_BASE}/menu/items`);
    const items = await res.json();
    
    // Khách hàng chỉ được thấy những món nằm trong Thực đơn hôm nay (do bếp chọn), bất kể còn hay hết
    allItems = items.filter(i => dailyMenuIds.includes(i.idMonAn));
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
    
    const filtered = allItems.filter(i => allowedCats.includes(i.idDanhMuc));
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
    const item = allItems.find(i => i.idMonAn === id);
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
    const existing = cart.find(c => c.idMonAn === currentItemDetails.idMonAn);
    if(existing) {
        existing.soLuong += currentItemQty;
    } else {
        cart.push({...currentItemDetails, soLuong: currentItemQty});
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

function addToCart(id) {
    if(isLocked) {
        alert("Bàn đã được chốt thanh toán, quý khách không thể gọi thêm món lúc này.");
        return;
    }
    const item = allItems.find(i => i.idMonAn === id);
    if(item.trangThai === 'HetHang') {
        alert('Món này đã hết hàng!');
        return;
    }
    const existing = cart.find(c => c.idMonAn === id);
    if(existing) {
        existing.soLuong++;
    } else {
        cart.push({...item, soLuong: 1});
    }
    updateCartBadge();
}

function updateCartBadge() {
    const total = cart.reduce((sum, i) => sum + i.soLuong, 0);
    document.getElementById('cartBadge').innerText = total;
}

// Modals
function showCart() {
    const container = document.getElementById('cartItems');
    let total = 0;
    container.innerHTML = cart.map((i, index) => {
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
            total += cart[index].gia * cart[index].soLuong;
        }
    });
    document.getElementById('cartTotal').innerText = total.toLocaleString('vi-VN') + ' đ';
}

function updateQuantity(index, delta) {
    cart[index].soLuong += delta;
    if(cart[index].soLuong <= 0) cart.splice(index, 1);
    updateCartBadge();
    showCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartBadge();
    showCart();
}

let orderSessionCounter = 1;

async function confirmOrder() {
    if(cart.length === 0) {
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
    
    const itemsToOrder = selectedIndices.map(i => cart[i]);
    
    try {
        const API_BASE = 'http://localhost:8080/api';
        let orderId = null;
        
        // Fetch current open order
        const resOrders = await fetch(API_BASE + '/orders');
        const allOrders = await resOrders.json();
        const openOrder = allOrders.find(o => o.idBan === currentTableId && o.trangThaiOrder === 'DangMo');
        
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
            const resCreate = await fetch(API_BASE + '/orders', {
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
            await fetch(`${API_BASE}/orders/${orderId}/items`, {
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
        if(stompClient) {
            stompClient.send("/app/order.new", {}, JSON.stringify({ 
                table: "Bàn " + currentTableId, 
                items: itemsToOrder.map(i => ({ name: i.tenMonAn, qty: i.soLuong })) 
            }));
        }
        
        showToast('Đã gửi order xuống bếp!');
        cart = cart.filter((_, idx) => !selectedIndices.includes(idx));
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
let stompClient = null;
function connectWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/tablet', function (message) {
            const data = JSON.parse(message.body);
            if(data.idMonAn && data.trangThai) {
                const item = allItems.find(i => i.idMonAn === data.idMonAn);
                if(item) {
                    item.trangThai = data.trangThai;
                    if(typeof currentCat !== 'undefined' && currentCat) filterItems(currentCat);
                }
            } else if(data.idMonAnKDS && data.statusKDS) {
                let updated = false;
                orders.filter(o => o.idMonAn === data.idMonAnKDS).forEach(o => {
                    // Update only if it's an active status, avoiding reverting DaXong if there are multiple same items.
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
                loadDailyMenu().then(() => {
                    fetchItems().then(() => {
                        if(typeof currentCat !== 'undefined' && currentCat) filterItems(currentCat);
                    });
                });
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

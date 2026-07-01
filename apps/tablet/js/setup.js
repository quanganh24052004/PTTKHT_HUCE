const API_BASE = 'http://localhost:8080/api';
let allTables = [];
let branches = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch branches
        const resBranch = await fetch(`${API_BASE}/chinhanh`);
        branches = await resBranch.json();
        
        const branchSelect = document.getElementById('branchSelect');
        branches.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b.idChiNhanh;
            opt.textContent = b.tenChiNhanh;
            branchSelect.appendChild(opt);
        });

        // Fetch tables
        const resTable = await fetch(`${API_BASE}/ban`);
        allTables = await resTable.json();
    } catch(e) {
        console.error("Lỗi khi tải dữ liệu setup:", e);
    }
});

function loadTables() {
    const branchId = document.getElementById('branchSelect').value;
    const tableSelect = document.getElementById('tableSelect');
    
    // Reset table select
    tableSelect.innerHTML = '<option value="">-- Chọn bàn --</option>';
    
    if (!branchId) {
        tableSelect.innerHTML = '<option value="">-- Vui lòng chọn chi nhánh trước --</option>';
        return;
    }
    
    // Lọc bàn theo chi nhánh
    const filteredTables = allTables.filter(t => t.idChiNhanh === branchId);
    
    // Sort tables by soBan just in case
    filteredTables.sort((a,b) => a.soBan - b.soBan);

    filteredTables.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.idBan;
        opt.textContent = `Bàn số ${t.soBan}`;
        opt.dataset.soBan = t.soBan;
        tableSelect.appendChild(opt);
    });
}

function startTablet() {
    const branchId = document.getElementById('branchSelect').value;
    const tableSelect = document.getElementById('tableSelect');
    const tableId = tableSelect.value;
    const warningText = document.getElementById('warningText');
    
    if (!branchId || !tableId) {
        warningText.style.display = 'block';
        return;
    }
    
    const selectedOption = tableSelect.options[tableSelect.selectedIndex];
    const soBan = selectedOption.dataset.soBan;
    
    warningText.style.display = 'none';
    
    // Lưu vào localStorage
    localStorage.setItem('tabletBranchId', branchId);
    localStorage.setItem('tabletTableId', tableId);
    localStorage.setItem('tabletSoBan', soBan);
    
    // Chuyển hướng sang datmon.html
    window.location.href = 'datmon.html';
}

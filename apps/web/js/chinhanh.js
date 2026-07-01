$(document).ready(function() {
    // 1. Lấy container để đổ dữ liệu vào
    var branchList = $("#branch-list");
    var html = "";

    // 2. Duyệt qua mảng dữ liệu chi nhánh
    for (var i = 0; i < listChiNhanh.length; i++) {
        var branch = listChiNhanh[i];
        
        // Thiết lập ảnh dự phòng nếu không có ảnh
        var imgSrc = branch.hinhAnh ? branch.hinhAnh : "images/anh-bia-lau.png";
        
        // Tạo khối HTML cho từng thẻ chi nhánh
        html += `
        <div class="branch-card" onclick="openMapModal('${branch.tenChiNhanh}', '${branch.diaChi}')" style="cursor: pointer;">
            <img src="${imgSrc}" alt="${branch.tenChiNhanh}" class="branch-img">
            <div class="branch-info">
                <h2 class="branch-name">${branch.tenChiNhanh}</h2>
                <div class="branch-location">Việt Nam - Hà Nội</div>
                
                <div class="branch-details">
                    <div class="detail-item">
                        <span class="detail-label">Số điện thoại</span>
                        <span class="detail-value">${branch.soDienThoai}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Giờ mở cửa</span>
                        <span class="detail-value">${branch.thongTin}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Địa chỉ</span>
                        <span class="detail-value">${branch.diaChi}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // 3. Đổ khối HTML vào màn hình
    branchList.html(html);

    // Xử lý đóng Popup Bản đồ
    $("#close-map-btn").click(function() {
        $("#map-modal").removeClass("show");
        $("#map-iframe-container").empty(); // Xóa iframe đi để ngắt kết nối bản đồ
    });

    // Đóng khi click ra ngoài popup
    $(window).click(function(event) {
        if ($(event.target).is("#map-modal")) {
            $("#map-modal").removeClass("show");
            $("#map-iframe-container").empty();
        }
    });
});

// Hàm mở Modal và chèn iframe Google Maps
function openMapModal(tenChiNhanh, diaChi) {
    $("#map-branch-name").text(tenChiNhanh);
    
    // Tạo iframe Google Maps tự động tìm kiếm theo địa chỉ
    var encodedAddress = encodeURIComponent(diaChi);
    var iframeHtml = `<iframe 
        width="100%" 
        height="100%" 
        frameborder="0" 
        style="border:0"
        src="https://maps.google.com/maps?q=${encodedAddress}&t=&z=16&ie=UTF8&iwloc=&output=embed" 
        allowfullscreen>
    </iframe>`;
    
    $("#map-iframe-container").html(iframeHtml);
    $("#map-modal").addClass("show");
}

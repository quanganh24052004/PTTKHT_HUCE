$(document).ready(function() {
    // 1. Hàm lấy danh sách ID danh mục hợp lệ (bao gồm cả danh mục con)
    function getValidCategoryIds(parentId) {
        var validIds = [parentId];
        for (var i = 0; i < listDanhMuc.length; i++) {
            if (listDanhMuc[i].idDanhMucCha === parentId) {
                validIds.push(listDanhMuc[i].idDanhMuc);
            }
        }
        return validIds;
    }

    // 2. Hàm render món ăn
    function renderMonAn(categoryId, categoryName) {
        if (categoryName) {
            $("#category-title").text(categoryName);
        }
        
        var validIds = getValidCategoryIds(categoryId);
        var html = "";
        
        for (var i = 0; i < listMonAn.length; i++) {
            var mon = listMonAn[i];
            if (validIds.includes(mon.idDanhMuc)) {
                var imgSrc = mon.hinhAnh;
                
                // Tránh lỗi ảnh hỏng
                var fallbackImg = "onerror=\"this.src='images/Web Trang chủ/Lẩu 1.webp'\"";

                var desc = "Món ăn tuyệt hảo từ HaceLao, hứa hẹn mang lại trải nghiệm ẩm thực đáng nhớ.";
                if (mon.idMonAn === 'MA01') desc = "Món lẩu phải gọi khi đến HaceLao! Những quả cà chua chín mọng được hầm chậm để tạo nên phần nước lẩu đậm đà và dồi dào vị cà chua tự nhiên.";
                if (mon.idMonAn === 'MA02') desc = "Hương vị cay nồng đặc trưng của ẩm thực Tứ Xuyên, kích thích vị giác mạnh mẽ.";
                if (mon.idMonAn === 'MA03') desc = "Nước lẩu được ninh từ xương heo nhiều giờ liền, mang lại vị ngọt thanh tự nhiên và bổ dưỡng.";
                if (mon.idMonAn === 'MA04') desc = "Sự kết hợp độc đáo giữa vị cay của Mala và sự béo ngậy của sữa, tạo nên trải nghiệm khó quên.";

                html += `
                <div class="dish-card" data-desc="${desc}">
                    <img src="${imgSrc}" alt="${mon.tenMonAn}" ${fallbackImg}>
                    <div class="dish-info">
                        <p class="dish-name">${mon.tenMonAn}</p>
                        <p class="dish-price">${mon.gia.toLocaleString('vi-VN')} đ</p>
                    </div>
                </div>`;
            }
        }
        
        $("#dish-list").html(html);
    }

    // 3. Xử lý sự kiện click danh mục lớn
    $(".category-card").on("click", function() {
        $(".category-card").removeClass("active");
        $(this).addClass("active");
        
        var categoryId = $(this).attr("data-category");
        var categoryName = $(this).find("p").text();
        
        if (categoryId === 'DM_MC') {
            // Nếu là Món chính -> Hiện sidebar, ẩn tiêu đề giữa
            $("#main-header").hide();
            $("#sidebar-filter").show();
            
            // Xóa layout 3 cột (Món chính dùng 2 cột)
            $("#dish-list").removeClass("grid-3-cols");
            
            // Lấy mục đang active ở sidebar để render
            var activeSubCategory = $(".filter-item.active").attr("data-subcategory");
            renderMonAn(activeSubCategory, null);
        } else {
            // Ngược lại -> Ẩn sidebar, hiện tiêu đề giữa
            $("#main-header").show();
            $("#sidebar-filter").hide();
            
            // Nếu là Đồ ăn vặt hoặc Thức uống -> Dùng layout 3 cột
            if (categoryId === 'DM_DAV' || categoryId === 'DM_TU') {
                $("#dish-list").addClass("grid-3-cols");
            } else {
                $("#dish-list").removeClass("grid-3-cols");
            }
            
            renderMonAn(categoryId, categoryName);
        }
    });

    // Xử lý sự kiện click danh mục con trong Sidebar (Bộ lọc tìm kiếm)
    $(".filter-item").on("click", function() {
        $(".filter-item").removeClass("active");
        $(this).addClass("active");
        
        var subCategoryId = $(this).attr("data-subcategory");
        renderMonAn(subCategoryId, null);
    });

    // 4. Mở Modal - Sử dụng Event Delegation vì thẻ sinh ra bằng JS
    $(document).on("click", ".dish-card", function() {
        var img = $(this).find("img").attr("src");
        var name = $(this).find(".dish-name").text();
        var price = $(this).find(".dish-price").text();
        var desc = $(this).attr("data-desc");

        $("#modal-img").attr("src", img);
        $("#modal-name").text(name);
        $("#modal-price").text(price);
        $("#modal-desc").text(desc);

        $("#dish-modal").fadeIn();
    });

    // 5. Đóng Modal
    $(".close-btn").click(function() {
        $("#dish-modal").fadeOut();
    });

    $(window).click(function(event) {
        if (event.target.id === "dish-modal") {
            $("#dish-modal").fadeOut();
        }
    });

    // 6. Tính năng tìm kiếm thả xuống (Dropdown)
    $(document).on("input", ".search-box input", function() {
        var keyword = $(this).val().toLowerCase().trim();
        var dropdown = $("#search-dropdown");
        
        if (keyword === "") {
            // Rỗng thì ẩn hộp thả xuống
            dropdown.hide();
            return;
        }

        var html = "";
        var count = 0;
        
        for (var i = 0; i < listMonAn.length; i++) {
            var mon = listMonAn[i];
            if (mon.tenMonAn.toLowerCase().includes(keyword)) {
                count++;
                var imgSrc = mon.hinhAnh;
                var fallbackImg = "onerror=\"this.src='images/Web Trang chủ/Lẩu 1.webp'\"";
                
                var desc = "Món ăn tuyệt hảo từ HaceLao, hứa hẹn mang lại trải nghiệm ẩm thực đáng nhớ.";
                if (mon.idMonAn === 'MA01') desc = "Món lẩu phải gọi khi đến HaceLao! Những quả cà chua chín mọng được hầm chậm để tạo nên phần nước lẩu đậm đà và dồi dào vị cà chua tự nhiên.";
                if (mon.idMonAn === 'MA02') desc = "Hương vị cay nồng đặc trưng của ẩm thực Tứ Xuyên, kích thích vị giác mạnh mẽ.";
                if (mon.idMonAn === 'MA03') desc = "Nước lẩu được ninh từ xương heo nhiều giờ liền, mang lại vị ngọt thanh tự nhiên và bổ dưỡng.";
                if (mon.idMonAn === 'MA04') desc = "Sự kết hợp độc đáo giữa vị cay của Mala và sự béo ngậy của sữa, tạo nên trải nghiệm khó quên.";

                // Gắn dữ liệu cần thiết cho thẻ con để khi click có thể hiện popup
                html += `
                <div class="search-result-item" 
                     data-img="${imgSrc}" 
                     data-name="${mon.tenMonAn}" 
                     data-price="${mon.gia.toLocaleString('vi-VN')} đ" 
                     data-desc="${desc}">
                    <img src="${imgSrc}" alt="${mon.tenMonAn}" ${fallbackImg}>
                    <div class="search-result-info">
                        <div class="search-result-name">${mon.tenMonAn}</div>
                        <div class="search-result-price">${mon.gia.toLocaleString('vi-VN')} đ</div>
                    </div>
                </div>`;
            }
        }
        
        if (count === 0) {
            // Hiện thông báo không tìm thấy
            html = `<div class="search-empty">Không tìm thấy món ăn trong thực đơn.</div>`;
        }
        
        dropdown.html(html).show();
    });

    // 7. Click vào một kết quả trong dropdown thì mở popup và ẩn dropdown
    $(document).on("click", ".search-result-item", function() {
        var img = $(this).attr("data-img");
        var name = $(this).attr("data-name");
        var price = $(this).attr("data-price");
        var desc = $(this).attr("data-desc");

        $("#modal-img").attr("src", img);
        $("#modal-name").text(name);
        $("#modal-price").text(price);
        $("#modal-desc").text(desc);

        $("#dish-modal").fadeIn();
        
        // Ẩn dropdown và xóa nội dung ô search
        $("#search-dropdown").hide();
        $(".search-box input").val("");
    });

    // 8. Click ra ngoài thì ẩn dropdown
    $(document).on("click", function(event) {
        // Nếu click không trúng ô tìm kiếm hoặc dropdown
        if (!$(event.target).closest('.search-box').length) {
            $("#search-dropdown").hide();
        }
    });

    // Khởi tạo hiển thị ban đầu: Nước lẩu
    renderMonAn("DM_NL", "Nước lẩu");
});
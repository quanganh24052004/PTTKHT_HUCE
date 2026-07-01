// js/menu.js

$(document).ready(function(){
    // 1. Hút Header vào và xử lý menu active
    $("#header-ly").load("../../shared/html/header_chung.html", function() {
        
        // Lấy địa chỉ trang hiện tại
        var path = window.location.pathname.split("/").pop();
        
        // Nếu đang ở trang chủ
        if (path == "" || path == "index.html") {
            path = "index.html";
        }

        // Tìm trong menu, thẻ <a> nào có link trùng với path thì thêm class active
        $(".main-nav a").each(function() {
            if ($(this).attr("href") === path) {
                $(this).addClass("active");
            }
        });

        // Ẩn thanh tìm kiếm trên tất cả các trang trừ trang Thực đơn
        if (path !== "thucdon.html") {
            $(".search-box").hide();
        }
    });

    // 2. Hút Footer
    $("#footer-ly").load("../../shared/html/footer_chung.html");
});
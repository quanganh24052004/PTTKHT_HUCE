package com.hacelao.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    // Tablet sends new order notification to Kitchen
    @MessageMapping("/donhang.moi")
    @SendTo("/topic/bep")
    public String thongBaoDonHangMoi(String message) {
        return message; // Can be a JSON string describing the new order
    }

    // Kitchen sends order status update to Tablet
    @MessageMapping("/donhang.trangthai")
    @SendTo("/topic/maytinhbang")
    public String thongBaoTrangThaiDonHang(String message) {
        return message; // Can be a JSON string describing the order status
    }

    @MessageMapping("/thucdon.capnhat")
    @SendTo("/topic/maytinhbang")
    public String capNhatThucDon(String message) {
        return message;
    }

    @MessageMapping("/ban.sukien")
    @SendTo("/topic/maytinhbang")
    public String suKienBan(String message) {
        return message;
    }
}

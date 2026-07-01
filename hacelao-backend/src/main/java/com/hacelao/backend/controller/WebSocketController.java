package com.hacelao.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Trích xuất giá trị của một key từ chuỗi JSON đơn giản.
     * Ví dụ: extractJsonString("{\"idChiNhanh\":\"CN01\",...}", "idChiNhanh") -> "CN01"
     */
    private String extractJsonString(String json, String key) {
        try {
            String search = "\"" + key + "\"";
            int keyIdx = json.indexOf(search);
            if (keyIdx < 0) return null;
            int colonIdx = json.indexOf(":", keyIdx + search.length());
            if (colonIdx < 0) return null;
            // Skip whitespace
            int start = colonIdx + 1;
            while (start < json.length() && (json.charAt(start) == ' ' || json.charAt(start) == '\t')) start++;
            if (start >= json.length()) return null;
            if (json.charAt(start) == '"') {
                int end = json.indexOf("\"", start + 1);
                if (end < 0) return null;
                return json.substring(start + 1, end);
            }
            // null or number
            int end = start;
            while (end < json.length() && json.charAt(end) != ',' && json.charAt(end) != '}') end++;
            String val = json.substring(start, end).trim();
            return val.equals("null") ? null : val;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Tablet gửi đơn hàng mới -> Chuyển đến bếp của đúng chi nhánh.
     * Payload JSON cần có field "idChiNhanh" để định tuyến tới /topic/bep/{idChiNhanh}.
     */
    @MessageMapping("/donhang.moi")
    public void thongBaoDonHangMoi(String message) {
        String idChiNhanh = extractJsonString(message, "idChiNhanh");
        if (idChiNhanh != null && !idChiNhanh.isEmpty()) {
            messagingTemplate.convertAndSend("/topic/bep/" + idChiNhanh, message);
        } else {
            messagingTemplate.convertAndSend("/topic/bep", message);
        }
    }

    /**
     * Bếp cập nhật trạng thái đơn -> Chuyển đến tablet của đúng chi nhánh.
     */
    @MessageMapping("/donhang.trangthai")
    public void thongBaoTrangThaiDonHang(String message) {
        String idChiNhanh = extractJsonString(message, "idChiNhanh");
        if (idChiNhanh != null && !idChiNhanh.isEmpty()) {
            messagingTemplate.convertAndSend("/topic/maytinhbang/" + idChiNhanh, message);
        } else {
            messagingTemplate.convertAndSend("/topic/maytinhbang", message);
        }
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


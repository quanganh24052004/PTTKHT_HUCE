package com.hacelao.backend.controller;
import com.hacelao.backend.entity.*;
import com.hacelao.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;
import java.time.ZoneId;
import com.hacelao.backend.entity.enums.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired private OrderRepository orderRepository;
    @Autowired private ChiTietOrderRepository chiTietOrderRepository;
    @Autowired private BanRepository banRepository;
    @Autowired private HoaDonRepository hoaDonRepository;
    @Autowired private KhachHangRepository khachHangRepository;
    @Autowired private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    public static class CheckoutRequest {
        public String sdt;
        public String phuongThucThanhToan;
        public double tienKhachDua;
        public double tienThua;
        public double tongTienThanhToan;
        public int diemSuDung;
    }

    @GetMapping
    public List<OrderEntity> getOrders() {
        return orderRepository.findAll();
    }

    @PostMapping
    public OrderEntity createOrder(@RequestBody OrderEntity order) {
        OrderEntity saved = orderRepository.save(order);
        banRepository.findById(order.getIdBan()).ifPresent(ban -> {
            ban.setTrangThai(TrangThaiBan.DangPhucVu);
            banRepository.save(ban);
        });
        return saved;
    }
    
    @GetMapping("/{idOrder}/items")
    public List<ChiTietOrder> getOrderItems(@PathVariable String idOrder) {
        return chiTietOrderRepository.findAll().stream().filter(i -> i.getIdOrder().equals(idOrder)).toList();
    }
    
    @PostMapping("/{idOrder}/items")
    public ChiTietOrder addItemToOrder(@PathVariable String idOrder, @RequestBody ChiTietOrder item) {
        item.setIdOrder(idOrder);
        item.setThoiGianGoi(LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));
        return chiTietOrderRepository.save(item);
    }
    
    @PutMapping("/items/{itemId}/status")
    public ChiTietOrder updateItemStatus(@PathVariable Long itemId, @RequestParam TrangThaiChiTietOrder status) {
        ChiTietOrder item = chiTietOrderRepository.findById(itemId).orElseThrow();
        item.setTrangThaiMon(status);
        if(status == TrangThaiChiTietOrder.DaXong) {
            orderRepository.findById(item.getIdOrder()).ifPresent(order -> {
                banRepository.findById(order.getIdBan()).ifPresent(ban -> {
                    ban.setTrangThai(TrangThaiBan.DangPhucVu);
                    banRepository.save(ban);
                });
            });
        }
        return chiTietOrderRepository.save(item);
    }
    
    @PutMapping("/{idOrder}/status")
    public OrderEntity updateOrderStatus(@PathVariable String idOrder, @RequestParam TrangThaiOrder status) {
        OrderEntity order = orderRepository.findById(idOrder).orElseThrow();
        order.setTrangThaiOrder(status);
        return orderRepository.save(order);
    }

    @PostMapping("/{idOrder}/checkout")
    public ResponseEntity<?> checkoutOrder(@PathVariable String idOrder, @RequestBody CheckoutRequest request) {
        OrderEntity order = orderRepository.findById(idOrder).orElseThrow();
        
        // Update Order
        order.setTrangThaiOrder(TrangThaiOrder.DaThanhToan);
        orderRepository.save(order);
        
        // Update Table
        banRepository.findById(order.getIdBan()).ifPresent(ban -> {
            ban.setTrangThai(TrangThaiBan.Trong);
            banRepository.save(ban);
        });
        
        // Update HoaDon
        HoaDon hoaDon = hoaDonRepository.findAll().stream()
                .filter(hd -> hd.getIdOrder().equals(idOrder))
                .findFirst()
                .orElse(new HoaDon());
        
        if (hoaDon.getIdHoaDon() == null) {
            hoaDon.setIdHoaDon("HD_" + idOrder.replace("OD_", ""));
        }
        hoaDon.setIdOrder(idOrder);
        hoaDon.setNgayThanhToan(LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));
        
        if (request.sdt != null && !request.sdt.trim().isEmpty()) {
            hoaDon.setSoDienThoai(request.sdt);
            // Deduct used points and reward points: 5% of tongTienThanhToan
            khachHangRepository.findById(request.sdt).ifPresent(kh -> {
                int currentPoints = kh.getDiemTichLuy();
                if (request.diemSuDung > 0 && currentPoints >= request.diemSuDung) {
                    currentPoints -= request.diemSuDung;
                }
                currentPoints += (int)(request.tongTienThanhToan * 0.05);
                kh.setDiemTichLuy(currentPoints);
                khachHangRepository.save(kh);
            });
        }
        
        hoaDon.setPhuongThucThanhToan(
            "cash".equalsIgnoreCase(request.phuongThucThanhToan) ? PhuongThucThanhToan.TienMat : PhuongThucThanhToan.ChuyenKhoanQR
        );
        hoaDon.setTienKhachDua(request.tienKhachDua);
        hoaDon.setTienThua(request.tienThua);
        hoaDon.setTongTienThanhToan(request.tongTienThanhToan);
        
        hoaDon.setDiemDaSuDung(request.diemSuDung);
        hoaDon.setSoTienDaGiam(request.diemSuDung * 1000);
        hoaDonRepository.save(hoaDon);
        
        // Notify Tablet to reset
        messagingTemplate.convertAndSend("/topic/tablet", "{\"event\": \"RESET_TABLE\", \"idBan\": \"" + order.getIdBan() + "\"}");
        
        return ResponseEntity.ok().build();
    }
}

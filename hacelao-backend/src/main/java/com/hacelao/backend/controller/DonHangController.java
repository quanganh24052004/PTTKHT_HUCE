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
@RequestMapping("/api/donhang")
@CrossOrigin(origins = "*")
public class DonHangController {
    @Autowired private OrderRepository orderRepository;
    @Autowired private ChiTietOrderRepository chiTietOrderRepository;
    @Autowired private BanRepository banRepository;
    @Autowired private HoaDonRepository hoaDonRepository;
    @Autowired private KhachHangRepository khachHangRepository;
    @Autowired private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    public static class CheckoutRequest {
        public String sdt;
        public String tenKhachHang;
        public String phuongThucThanhToan;
        public Double tienKhachDua;
        public Double tienThua;
        public Double tongTienThanhToan;
        public Integer diemSuDung;
    }

    @GetMapping
    public List<OrderEntity> layDanhSachDonHang() {
        return orderRepository.findAll();
    }

    @PostMapping
    public OrderEntity taoDonHang(@RequestBody OrderEntity order) {
        OrderEntity saved = orderRepository.save(order);
        banRepository.findById(order.getIdBan()).ifPresent(ban -> {
            ban.setTrangThai(TrangThaiBan.DangPhucVu);
            banRepository.save(ban);
        });
        return saved;
    }
    
    @GetMapping("/{idOrder}/items")
    public List<ChiTietOrder> layChiTietDonHang(@PathVariable String idOrder) {
        return chiTietOrderRepository.findAll().stream().filter(i -> i.getIdOrder().equals(idOrder)).toList();
    }
    
    @PostMapping("/{idOrder}/items")
    public ChiTietOrder themMonVaoDonHang(@PathVariable String idOrder, @RequestBody ChiTietOrder item) {
        item.setIdOrder(idOrder);
        item.setThoiGianGoi(LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")));
        return chiTietOrderRepository.save(item);
    }
    
    @PutMapping("/items/{itemId}/status")
    public ChiTietOrder capNhatTrangThaiMon(@PathVariable Long itemId, @RequestParam TrangThaiChiTietOrder status) {
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
    public OrderEntity capNhatTrangThaiDonHang(@PathVariable String idOrder, @RequestParam TrangThaiOrder status) {
        OrderEntity order = orderRepository.findById(idOrder).orElseThrow();
        order.setTrangThaiOrder(status);
        return orderRepository.save(order);
    }

    @PostMapping("/{idOrder}/checkout")
    public ResponseEntity<?> thanhToanDonHang(@PathVariable String idOrder, @RequestBody CheckoutRequest request) {
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
            KhachHang kh = khachHangRepository.findById(request.sdt).orElseGet(() -> {
                KhachHang newKh = new KhachHang();
                newKh.setSoDienThoai(request.sdt);
                newKh.setTenKhachHang(request.tenKhachHang != null && !request.tenKhachHang.trim().isEmpty() ? request.tenKhachHang : "Khách hàng mới");
                newKh.setDiemTichLuy(0);
                return newKh;
            });
            int currentPoints = kh.getDiemTichLuy();
            int diemSuDung = request.diemSuDung != null ? request.diemSuDung : 0;
            double tongTien = request.tongTienThanhToan != null ? request.tongTienThanhToan : 0.0;
            
            if (diemSuDung > 0 && currentPoints >= diemSuDung) {
                currentPoints -= diemSuDung;
            }
            // 10% giá trị mua hàng, 1 điểm = 1000đ
            currentPoints += (int)((tongTien * 0.10) / 1000.0);
            kh.setDiemTichLuy(currentPoints);
            khachHangRepository.save(kh);
        }
        
        hoaDon.setPhuongThucThanhToan(
            "cash".equalsIgnoreCase(request.phuongThucThanhToan) ? PhuongThucThanhToan.TienMat : PhuongThucThanhToan.ChuyenKhoanQR
        );
        hoaDon.setTienKhachDua(request.tienKhachDua != null ? request.tienKhachDua : 0.0);
        hoaDon.setTienThua(request.tienThua != null ? request.tienThua : 0.0);
        hoaDon.setTongTienThanhToan(request.tongTienThanhToan != null ? request.tongTienThanhToan : 0.0);
        
        int diemDaSuDung = request.diemSuDung != null ? request.diemSuDung : 0;
        hoaDon.setDiemDaSuDung(diemDaSuDung);
        hoaDon.setSoTienDaGiam(diemDaSuDung * 1000.0);
        hoaDonRepository.save(hoaDon);
        
        // Notify Tablet to reset
        String idChiNhanh = banRepository.findById(order.getIdBan()).map(b -> b.getIdChiNhanh()).orElse("");
        if (!idChiNhanh.isEmpty()) {
            messagingTemplate.convertAndSend("/topic/maytinhbang/" + idChiNhanh, "{\"event\": \"RESET_TABLE\", \"idBan\": \"" + order.getIdBan() + "\", \"idChiNhanh\": \"" + idChiNhanh + "\"}");
        } else {
            messagingTemplate.convertAndSend("/topic/maytinhbang", "{\"event\": \"RESET_TABLE\", \"idBan\": \"" + order.getIdBan() + "\"}");
        }
        
        return ResponseEntity.ok().build();
    }
}

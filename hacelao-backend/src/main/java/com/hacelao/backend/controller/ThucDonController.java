package com.hacelao.backend.controller;
import com.hacelao.backend.entity.*;
import com.hacelao.backend.service.MenuService;
import com.hacelao.backend.entity.enums.TrangThaiMonAn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/thucdon")
@CrossOrigin(origins = "*")
public class ThucDonController {
    @Autowired private MenuService menuService;

    @GetMapping("/danhmuc")
    public List<DanhMuc> layDanhSachDanhMuc() {
        return menuService.getAllDanhMuc();
    }

    @GetMapping("/monan")
    public List<MonAn> layDanhSachMonAn(@RequestParam(required = false) String categoryId) {
        if (categoryId != null && !categoryId.isEmpty()) {
            return menuService.getMonAnByDanhMuc(categoryId);
        }
        return menuService.getAllMonAn();
    }
    
    @PutMapping("/monan/{id}/status")
    public MonAn capNhatTrangThaiMonAn(@PathVariable String id, @RequestParam TrangThaiMonAn status) {
        return menuService.updateTrangThaiMonAn(id, status);
    }

    /**
     * Thực đơn hàng ngày lưu theo từng chi nhánh.
     * Key: idChiNhanh, Value: danh sách idMonAn
     */
    private static final Map<String, List<String>> thucDonTheoChiNhanh = new ConcurrentHashMap<>();

    @GetMapping("/hangngay")
    public List<String> layThucDonHangNgay(@RequestParam(required = false) String idChiNhanh) {
        if (idChiNhanh != null && !idChiNhanh.isBlank()) {
            return thucDonTheoChiNhanh.getOrDefault(idChiNhanh, new ArrayList<>());
        }
        // Nếu không truyền chi nhánh, trả về danh sách rỗng (fallback an toàn)
        return new ArrayList<>();
    }

    @PostMapping("/hangngay")
    public List<String> capNhatThucDonHangNgay(
            @RequestBody List<String> ids,
            @RequestParam(required = false) String idChiNhanh) {
        if (idChiNhanh != null && !idChiNhanh.isBlank()) {
            thucDonTheoChiNhanh.put(idChiNhanh, new ArrayList<>(ids));
            return thucDonTheoChiNhanh.get(idChiNhanh);
        }
        // Nếu không có chi nhánh, không làm gì (không ghi đè toàn cục)
        return ids;
    }
}

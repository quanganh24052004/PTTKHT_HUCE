package com.hacelao.backend.controller;
import com.hacelao.backend.entity.*;
import com.hacelao.backend.service.MenuService;
import com.hacelao.backend.entity.enums.TrangThaiMonAn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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

    private static List<String> danhSachMonHangNgay = new java.util.ArrayList<>();

    @GetMapping("/hangngay")
    public List<String> layThucDonHangNgay() {
        return danhSachMonHangNgay;
    }

    @PostMapping("/hangngay")
    public List<String> capNhatThucDonHangNgay(@RequestBody List<String> ids) {
        danhSachMonHangNgay = new java.util.ArrayList<>(ids);
        return danhSachMonHangNgay;
    }
}

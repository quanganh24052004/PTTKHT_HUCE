package com.hacelao.backend.controller;
import com.hacelao.backend.entity.*;
import com.hacelao.backend.service.MenuService;
import com.hacelao.backend.entity.enums.TrangThaiMonAn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {
    @Autowired private MenuService menuService;

    @GetMapping("/categories")
    public List<DanhMuc> getCategories() {
        return menuService.getAllDanhMuc();
    }

    @GetMapping("/items")
    public List<MonAn> getItems(@RequestParam(required = false) String categoryId) {
        if (categoryId != null && !categoryId.isEmpty()) {
            return menuService.getMonAnByDanhMuc(categoryId);
        }
        return menuService.getAllMonAn();
    }
    
    @PutMapping("/items/{id}/status")
    public MonAn updateItemStatus(@PathVariable String id, @RequestParam TrangThaiMonAn status) {
        return menuService.updateTrangThaiMonAn(id, status);
    }

    private static List<String> dailyMenuIds = new java.util.ArrayList<>();

    @GetMapping("/daily")
    public List<String> getDailyMenu() {
        return dailyMenuIds;
    }

    @PostMapping("/daily")
    public List<String> updateDailyMenu(@RequestBody List<String> ids) {
        dailyMenuIds = new java.util.ArrayList<>(ids);
        return dailyMenuIds;
    }
}

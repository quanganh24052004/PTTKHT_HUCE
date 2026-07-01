package com.hacelao.backend.controller;
import com.hacelao.backend.entity.*;
import com.hacelao.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.hacelao.backend.entity.enums.TrangThaiBan;

@RestController
@RequestMapping("/api/ban")
@CrossOrigin(origins = "*")
public class BanController {
    @Autowired private BanRepository banRepository;

    @GetMapping
    public List<Ban> layDanhSachBan() {
        return banRepository.findAll();
    }
    
    @PutMapping("/{id}/status")
    public Ban capNhatTrangThaiBan(@PathVariable String id, @RequestParam TrangThaiBan status) {
        Ban ban = banRepository.findById(id).orElseThrow();
        ban.setTrangThai(status);
        return banRepository.save(ban);
    }
}

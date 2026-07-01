package com.hacelao.backend.controller;

import com.hacelao.backend.entity.KhachHang;
import com.hacelao.backend.repository.KhachHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/khachhang")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class KhachHangController {

    private final KhachHangRepository khachHangRepository;

    @GetMapping("/{sdt}")
    public ResponseEntity<KhachHang> getKhachHang(@PathVariable String sdt) {
        return khachHangRepository.findById(sdt)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<KhachHang> createKhachHang(@RequestBody KhachHang khachHang) {
        if (khachHang.getSoDienThoai() == null || khachHang.getSoDienThoai().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (khachHangRepository.existsById(khachHang.getSoDienThoai())) {
            return ResponseEntity.badRequest().build();
        }
        KhachHang saved = khachHangRepository.save(khachHang);
        return ResponseEntity.ok(saved);
    }
}

package com.hacelao.backend.controller;
import com.hacelao.backend.entity.*;
import com.hacelao.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired private NhanVienRepository nhanVienRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody NhanVien loginRequest) {
        if (loginRequest.getTenDangNhap() == null || loginRequest.getMatKhau() == null) {
            return ResponseEntity.status(401).build();
        }
        return nhanVienRepository.findAll().stream()
                .filter(nv -> nv.getTenDangNhap().trim().equalsIgnoreCase(loginRequest.getTenDangNhap().trim()) 
                           && nv.getMatKhau().trim().equals(loginRequest.getMatKhau().trim()))
                .findFirst()
                .map(nv -> ResponseEntity.ok(nv))
                .orElseGet(() -> ResponseEntity.status(401).build());
    }
}

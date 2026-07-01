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

    @PostMapping("/dangnhap")
    public ResponseEntity<?> dangNhap(@RequestBody NhanVien loginRequest) {
        if (loginRequest.getTenDangNhap() == null || loginRequest.getMatKhau() == null) {
            return ResponseEntity.status(401).build();
        }
        String loginId = loginRequest.getTenDangNhap().trim();
        String password = loginRequest.getMatKhau().trim();
        
        return nhanVienRepository.findAll().stream()
                .filter(nv -> (nv.getTenDangNhap().trim().equalsIgnoreCase(loginId) 
                            || nv.getIdNhanVien().trim().equalsIgnoreCase(loginId))
                           && nv.getMatKhau().trim().equals(password))
                .findFirst()
                .map(nv -> ResponseEntity.ok(nv))
                .orElseGet(() -> ResponseEntity.status(401).build());
    }
}

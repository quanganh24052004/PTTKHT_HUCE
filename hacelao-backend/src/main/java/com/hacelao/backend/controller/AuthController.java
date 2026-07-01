package com.hacelao.backend.controller;
import com.hacelao.backend.entity.*;
import com.hacelao.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.text.Normalizer;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired private NhanVienRepository nhanVienRepository;

    /**
     * Chuẩn hóa chuỗi: bỏ dấu tiếng Việt, chuyển về chữ thường.
     * VD: "Nguyễn Văn Toàn" -> "nguyen van toan"
     */
    private String chuanHoa(String s) {
        if (s == null) return "";
        String normalized = Normalizer.normalize(s.trim(), Normalizer.Form.NFD);
        // Xóa các ký tự combining (dấu), rồi đổi đ/Đ riêng
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String result = pattern.matcher(normalized).replaceAll("");
        return result.replace("đ", "d").replace("Đ", "D").toLowerCase();
    }

    @PostMapping("/dangnhap")
    public ResponseEntity<?> dangNhap(@RequestBody NhanVien loginRequest) {
        if (loginRequest.getTenDangNhap() == null || loginRequest.getMatKhau() == null) {
            return ResponseEntity.status(401).build();
        }
        String loginId = chuanHoa(loginRequest.getTenDangNhap());
        String password = loginRequest.getMatKhau().trim();
        
        return nhanVienRepository.findAll().stream()
                .filter(nv -> (chuanHoa(nv.getTenDangNhap()).equals(loginId)
                            || chuanHoa(nv.getIdNhanVien()).equals(loginId))
                           && nv.getMatKhau().trim().equals(password))
                .findFirst()
                .map(nv -> ResponseEntity.ok(nv))
                .orElseGet(() -> ResponseEntity.status(401).build());
    }
}

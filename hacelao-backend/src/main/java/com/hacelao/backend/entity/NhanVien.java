package com.hacelao.backend.entity;
import com.hacelao.backend.entity.enums.*;
import jakarta.persistence.*;
import lombok.*;
@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class NhanVien {
    @Id private String idNhanVien;
    private String idChiNhanh;
    private String tenDangNhap;
    private String matKhau;
    @Enumerated(EnumType.STRING) private VaiTroNhanVien vaiTro;
}

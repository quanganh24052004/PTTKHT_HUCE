package com.hacelao.backend.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class KhachHang {
    @Id private String soDienThoai;
    private String tenKhachHang;
    private int diemTichLuy;
}

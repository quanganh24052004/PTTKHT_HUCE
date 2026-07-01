package com.hacelao.backend.entity;
import com.hacelao.backend.entity.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class ChiTietOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String idOrder;
    private String idMonAn;
    private int soLuong;
    private double donGia;
    private LocalDateTime thoiGianGoi;
    @Enumerated(EnumType.STRING) private TrangThaiChiTietOrder trangThaiMon;
}

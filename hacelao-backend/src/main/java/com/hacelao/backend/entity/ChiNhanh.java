package com.hacelao.backend.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class ChiNhanh {
    @Id private String idChiNhanh;
    private String tenChiNhanh;
    private String diaChi;
    private String soDienThoai;
    private String thongTin;
    private String hinhAnh;
}

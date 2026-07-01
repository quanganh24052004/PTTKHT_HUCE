package com.hacelao.backend.entity;
import com.hacelao.backend.entity.enums.*;
import jakarta.persistence.*;
import lombok.*;
@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class MonAn {
    @Id private String idMonAn;
    private String idDanhMuc;
    private String tenMonAn;
    private double gia;
    @Enumerated(EnumType.STRING) private TrangThaiMonAn trangThai;
    private String hinhAnh;
}

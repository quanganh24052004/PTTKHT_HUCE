package com.hacelao.backend.entity;
import com.hacelao.backend.entity.enums.*;
import jakarta.persistence.*;
import lombok.*;
@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class Ban {
    @Id private String idBan;
    private String idChiNhanh;
    private int soBan;
    @Enumerated(EnumType.STRING) private TrangThaiBan trangThai;
}

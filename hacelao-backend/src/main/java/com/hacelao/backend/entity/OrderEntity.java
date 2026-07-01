package com.hacelao.backend.entity;
import com.hacelao.backend.entity.enums.*;
import jakarta.persistence.*;
import lombok.*;
@Entity @Data @NoArgsConstructor @AllArgsConstructor @Table(name="orders")
public class OrderEntity {
    @Id private String idOrder;
    private String idBan;
    private double tongTienTamTinh;
    @Enumerated(EnumType.STRING) private TrangThaiOrder trangThaiOrder;
}

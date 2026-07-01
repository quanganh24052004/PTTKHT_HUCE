package com.hacelao.backend.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class DanhMuc {
    @Id private String idDanhMuc;
    private String idDanhMucCha;
    private String tenDanhMuc;
}

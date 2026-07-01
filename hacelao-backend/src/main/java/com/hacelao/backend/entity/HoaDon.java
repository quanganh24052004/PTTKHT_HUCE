package com.hacelao.backend.entity;
import com.hacelao.backend.entity.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class HoaDon {
    @Id private String idHoaDon;
    private String idOrder;
    private String idNhanVienThuNgan;
    private String soDienThoai;
    private double tongTienTamTinh;
    private double tongTienThanhToan;
    private LocalDateTime ngayThanhToan;
    private int diemDaSuDung;
    private double soTienDaGiam;
    private double tienKhachDua;
    private double tienThua;
    @Enumerated(EnumType.STRING) private PhuongThucThanhToan phuongThucThanhToan;
}

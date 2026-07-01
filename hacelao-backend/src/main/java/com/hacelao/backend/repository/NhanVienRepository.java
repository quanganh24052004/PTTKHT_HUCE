package com.hacelao.backend.repository;
import com.hacelao.backend.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, String> {
}

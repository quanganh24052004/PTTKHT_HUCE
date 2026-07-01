package com.hacelao.backend.repository;
import com.hacelao.backend.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, String> {
}

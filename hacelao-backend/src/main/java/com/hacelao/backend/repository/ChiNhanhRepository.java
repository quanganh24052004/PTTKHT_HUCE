package com.hacelao.backend.repository;
import com.hacelao.backend.entity.ChiNhanh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ChiNhanhRepository extends JpaRepository<ChiNhanh, String> {
}

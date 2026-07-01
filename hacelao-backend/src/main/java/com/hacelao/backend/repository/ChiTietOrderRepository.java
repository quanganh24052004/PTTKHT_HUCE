package com.hacelao.backend.repository;
import com.hacelao.backend.entity.ChiTietOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ChiTietOrderRepository extends JpaRepository<ChiTietOrder, Long> {
}

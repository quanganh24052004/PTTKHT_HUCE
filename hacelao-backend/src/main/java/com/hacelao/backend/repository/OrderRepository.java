package com.hacelao.backend.repository;
import com.hacelao.backend.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, String> {
}

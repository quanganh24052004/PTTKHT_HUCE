package com.hacelao.backend.repository;
import com.hacelao.backend.entity.Ban;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface BanRepository extends JpaRepository<Ban, String> {
}

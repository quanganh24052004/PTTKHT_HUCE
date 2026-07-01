package com.hacelao.backend.repository;
import com.hacelao.backend.entity.MonAn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface MonAnRepository extends JpaRepository<MonAn, String> {
}

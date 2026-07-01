package com.hacelao.backend.repository;
import com.hacelao.backend.entity.DanhMuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface DanhMucRepository extends JpaRepository<DanhMuc, String> {
}

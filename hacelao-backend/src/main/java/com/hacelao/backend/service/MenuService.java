package com.hacelao.backend.service;
import com.hacelao.backend.entity.*;
import com.hacelao.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.hacelao.backend.entity.enums.TrangThaiMonAn;

@Service
public class MenuService {
    @Autowired private DanhMucRepository danhMucRepository;
    @Autowired private MonAnRepository monAnRepository;

    public List<DanhMuc> getAllDanhMuc() {
        return danhMucRepository.findAll();
    }

    public List<MonAn> getAllMonAn() {
        return monAnRepository.findAll();
    }
    
    public List<MonAn> getMonAnByDanhMuc(String idDanhMuc) {
        // We might need a custom query, but we can filter here for simplicity or add to repo.
        return monAnRepository.findAll().stream().filter(m -> m.getIdDanhMuc().equals(idDanhMuc)).toList();
    }
    
    public MonAn updateTrangThaiMonAn(String idMonAn, TrangThaiMonAn trangThai) {
        MonAn monAn = monAnRepository.findById(idMonAn).orElseThrow();
        monAn.setTrangThai(trangThai);
        return monAnRepository.save(monAn);
    }
}

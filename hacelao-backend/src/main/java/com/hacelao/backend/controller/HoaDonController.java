package com.hacelao.backend.controller;

import com.hacelao.backend.entity.HoaDon;
import com.hacelao.backend.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hoadon")
@CrossOrigin(origins = "*")
public class HoaDonController {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @GetMapping
    public List<HoaDon> getAllHoaDon() {
        return hoaDonRepository.findAll();
    }
}

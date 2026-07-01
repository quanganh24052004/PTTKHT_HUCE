package com.hacelao.backend.controller;
import com.hacelao.backend.entity.ChiNhanh;
import com.hacelao.backend.repository.ChiNhanhRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "*")
public class ChiNhanhController {
    @Autowired private ChiNhanhRepository chiNhanhRepository;

    @GetMapping
    public List<ChiNhanh> getAll() {
        return chiNhanhRepository.findAll();
    }
}

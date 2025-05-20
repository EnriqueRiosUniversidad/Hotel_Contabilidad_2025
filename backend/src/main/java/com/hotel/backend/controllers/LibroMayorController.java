package com.hotel.backend.controllers;


import com.hotel.backend.DTOs.LibroMayorCuentaDTO;
import com.hotel.backend.DTOs.LibroMayorDTO;
import com.hotel.backend.services.LibroMayorService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/libro-mayor")
@CrossOrigin(origins = "*")
public class LibroMayorController {

    private final LibroMayorService service;

    public LibroMayorController(LibroMayorService service) {
        this.service = service;
    }

    @GetMapping("/{periodoId}")
    public ResponseEntity<List<LibroMayorCuentaDTO>> obtenerLibroMayor(@PathVariable Long periodoId) {
        List<LibroMayorCuentaDTO> resultado = service.obtenerLibroMayorAgrupado(periodoId);
        return ResponseEntity.ok(resultado);
    }
}



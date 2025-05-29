package com.hotel.backend.controllers;


import com.hotel.backend.DTOs.BalanceResultadoDTO;
import com.hotel.backend.DTOs.BalanceSYSDTO;
import com.hotel.backend.DTOs.LibroMayorCuentaDTO;
import com.hotel.backend.DTOs.LibroMayorDTO;
import com.hotel.backend.services.BalanceResultadoService;
import com.hotel.backend.services.LibroMayorService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/libro-mayor")
@CrossOrigin(origins = "*")
public class LibroMayorController {

    private final LibroMayorService libroMayorService;


    public LibroMayorController(LibroMayorService service) {
        this.libroMayorService = service;

    }

    @GetMapping("/{periodoId}")
    public ResponseEntity<List<LibroMayorCuentaDTO>> obtenerLibroMayor(@PathVariable Long periodoId) {
        List<LibroMayorCuentaDTO> resultado = libroMayorService.obtenerLibroMayorAgrupado(periodoId);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/cuenta")
    public ResponseEntity<List<LibroMayorDTO>> obtenerPorCuentaYRango(
            @RequestParam Long periodoId,
            @RequestParam String codigo,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta
    ) {
        return ResponseEntity.ok(libroMayorService.obtenerPorCuentaYRango(periodoId, codigo, desde, hasta));
    }


    @GetMapping("/balance-sumas-saldos/{periodoId}")
    public ResponseEntity<List<BalanceSYSDTO>> obtenerBalanceSYS(@PathVariable Long periodoId) {
        List<BalanceSYSDTO> resultado = libroMayorService.obtenerBalanceSYS(periodoId);
        return ResponseEntity.ok(resultado);
    }



}



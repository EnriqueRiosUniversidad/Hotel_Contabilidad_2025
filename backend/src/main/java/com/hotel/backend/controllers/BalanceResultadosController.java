package com.hotel.backend.controllers;

import com.hotel.backend.DTOs.BalanceResultadoDTO;
import com.hotel.backend.services.BalanceResultadoService;
import com.hotel.backend.services.LibroMayorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/balance-resultado")
@CrossOrigin(origins = "*")
public class BalanceResultadosController {
    private final BalanceResultadoService balanceResultadoService;

    public BalanceResultadosController( BalanceResultadoService balanceResultadoService) {

        this.balanceResultadoService = balanceResultadoService;
    }
    @GetMapping("/{periodoId}")
    public ResponseEntity<List<BalanceResultadoDTO>> getBalanceResultado(@PathVariable Long periodoId) {
        List<BalanceResultadoDTO> resultado = balanceResultadoService.obtenerEstadoResultados(periodoId);
        return ResponseEntity.ok(resultado);
    }
}

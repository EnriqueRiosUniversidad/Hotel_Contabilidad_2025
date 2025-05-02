package com.hotel.backend.controllers;

import com.hotel.backend.DTOs.AsientoContableDTO;
import com.hotel.backend.services.AsientoContableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/librodiario")
@RequiredArgsConstructor
public class AsientoContableController {

    private final AsientoContableService service;

    @PreAuthorize("hasRole('CONTADOR')")
    @GetMapping("/{periodoId}")
    public ResponseEntity<List<AsientoContableDTO>> listarPorPeriodo(@PathVariable Integer periodoId) {
        return ResponseEntity.ok(service.listarPorPeriodo(periodoId));
    }

    @PostMapping
    public ResponseEntity<AsientoContableDTO> crear(@RequestBody AsientoContableDTO dto) {
        return ResponseEntity.ok(service.crear(dto));
    }

    @GetMapping("/detalle/{asientoId}")
    public ResponseEntity<AsientoContableDTO> obtenerDetalle(@PathVariable Long asientoId) {
        return ResponseEntity.ok(service.buscarPorId(asientoId));
    }


    @PutMapping("/{id}")
    public ResponseEntity<AsientoContableDTO> actualizar(@PathVariable Long id, @RequestBody AsientoContableDTO dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }


}

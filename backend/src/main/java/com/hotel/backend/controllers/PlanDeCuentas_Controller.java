package com.hotel.backend.controllers;

import com.hotel.backend.DTOs.CuentaContableDTO;
import com.hotel.backend.services.Cuenta_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@EnableMethodSecurity
@RestController
@RequestMapping("/plancuentas")
@RequiredArgsConstructor
public class PlanDeCuentas_Controller {

    private final Cuenta_Service cuentaService;

    @GetMapping("/by-id")
    public ResponseEntity<CuentaContableDTO> getByIdCuenta(
            @RequestParam String codigo,
            @RequestParam Integer periodoId) {
        return ResponseEntity.ok(cuentaService.getByIdCuenta(codigo, periodoId));
    }

    @GetMapping("/buscar")
    public ResponseEntity<CuentaContableDTO> getByCodigoYPeriodo(
            @RequestParam String codigo,
            @RequestParam Long periodoId) {
        return ResponseEntity.ok(cuentaService.getByCodigoCuenta(codigo, periodoId));
    }

    @GetMapping("/")
    public ResponseEntity<List<CuentaContableDTO>> getCuentas() {
        return ResponseEntity.ok(cuentaService.getCuentas());
    }

    @GetMapping("/plan/{periodoContableId}")
    public ResponseEntity<List<CuentaContableDTO>> getByPlan(@PathVariable Integer periodoContableId) {
        return ResponseEntity.ok(cuentaService.getByPlan(periodoContableId));
    }

    @PreAuthorize("hasRole('CONTADOR')")
    @PostMapping("/cuenta")
    public ResponseEntity<CuentaContableDTO> crearCuenta(@RequestBody CuentaContableDTO dto) {
        CuentaContableDTO nuevaCuenta = cuentaService.crearCuenta(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCuenta);
    }


    @PreAuthorize("hasRole('CONTADOR')")
    @DeleteMapping("/")
    public ResponseEntity<Void> eliminarCuenta(
                @RequestParam String codigo,
            @RequestParam Integer periodoId) {
        cuentaService.eliminarCuenta(codigo, periodoId);
        return ResponseEntity.noContent().build();
    }
}

package com.hotel.backend.controllers;

import com.hotel.backend.DTOs.CuentaContableDTO;
import com.hotel.backend.services.Cuenta_Service;
import lombok.RequiredArgsConstructor;
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



    @GetMapping("/{id}")
    public  ResponseEntity<CuentaContableDTO> getByIdCuenta(@PathVariable Long id){
        CuentaContableDTO dto= cuentaService.getByIdCuenta(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/buscar")
    public ResponseEntity<CuentaContableDTO> getByCodigoYPeriodo(
            @RequestParam String codigo,
            @RequestParam Long periodoId) {
        CuentaContableDTO dto = cuentaService.getByCodigoCuenta(codigo, periodoId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/")
    public  ResponseEntity<List<CuentaContableDTO>> getCuentas(){
        List<CuentaContableDTO> dtos= cuentaService.getCuentas();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/plan/{periodoContableId}")
    public ResponseEntity<List<CuentaContableDTO>> getByPlan(@PathVariable Long periodoContableId) {
        List<CuentaContableDTO> dtos = cuentaService.getByPlan(periodoContableId);
        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasRole('CONTADOR')")
    @PostMapping("/cuenta")
    public ResponseEntity<CuentaContableDTO> crearCuenta(@RequestBody CuentaContableDTO dto) {
        CuentaContableDTO cuentaCreada = cuentaService.crearCuenta(dto);
        return ResponseEntity.ok(cuentaCreada);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CONTADOR')")
    public ResponseEntity<CuentaContableDTO> actualizarCuenta(
            @PathVariable Long id,
            @RequestBody CuentaContableDTO dto) {
        return ResponseEntity.ok(cuentaService.actualizarCuenta(id, dto));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CONTADOR')")
    public ResponseEntity<Void> eliminarCuenta(@PathVariable Long id) {
        cuentaService.eliminarCuenta(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }



}

    package com.hotel.backend.controllers;

    import com.hotel.backend.DTOs.CuentaContableDTO;
    import com.hotel.backend.services.Cuenta_Service;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/plancuentas")
    @RequiredArgsConstructor
    public class CuentaContableController {

        private final Cuenta_Service cuentaService;

        @GetMapping
        public ResponseEntity<List<CuentaContableDTO>> listarTodas() {
            return ResponseEntity.ok(cuentaService.getCuentas());
        }

        @GetMapping("/plan/{periodoId}")
        public ResponseEntity<List<CuentaContableDTO>> listarPorPeriodo(@PathVariable Integer periodoId) {
            return ResponseEntity.ok(cuentaService.getByPlan(periodoId));
        }

        @GetMapping("/cuenta")
        public ResponseEntity<CuentaContableDTO> buscarCuenta(@RequestParam String codigo, @RequestParam Integer periodoId) {
            return ResponseEntity.ok(cuentaService.getByIdCuenta(codigo, periodoId));
        }

        @PreAuthorize("hasRole('CONTADOR')")
        @PostMapping("/cuenta")
        public ResponseEntity<CuentaContableDTO> crear(@RequestBody CuentaContableDTO dto) {
            return ResponseEntity.ok(cuentaService.crearCuenta(dto));
        }

        @PreAuthorize("hasRole('CONTADOR')")
        @PutMapping("/cuenta")
        public ResponseEntity<CuentaContableDTO> actualizar(@RequestBody CuentaContableDTO dto) {
            return ResponseEntity.ok(cuentaService.actualizarCuenta(dto));
        }

        @PreAuthorize("hasRole('CONTADOR')")
        @DeleteMapping
        public ResponseEntity<Void> eliminar(@RequestParam String codigo, @RequestParam Integer periodoId) {
            cuentaService.eliminarCuenta(codigo, periodoId);
            return ResponseEntity.noContent().build();
        }
    }

    package com.hotel.backend.controllers;

    import com.hotel.backend.DTOs.CuentaBalanceDTO;
    import com.hotel.backend.DTOs.CuentaBalanceTreeDTO;
    import com.hotel.backend.DTOs.CuentaContableDTO;
    import com.hotel.backend.DTOs.PeriodoContableDTO;
    import com.hotel.backend.entities.EstadoPeriodo;
    import com.hotel.backend.entities.PeriodoContable;
    import com.hotel.backend.repository.CuentasContables_Repository;
    import com.hotel.backend.services.Cuenta_Service;
    import com.hotel.backend.services.PeriodoContableService;
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
        private final CuentasContables_Repository cuentasContables_Repository;
        private final PeriodoContableService periodoContableService;

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
        @DeleteMapping("/cuenta")
        public ResponseEntity<Void> eliminar(@RequestParam String codigo, @RequestParam Integer periodoId) {
            cuentaService.eliminarCuenta(codigo, periodoId);
            return ResponseEntity.noContent().build();
        }



        //Balance general
        @GetMapping("/balance-general/{periodoId}")
        public ResponseEntity<List<CuentaBalanceDTO>> obtenerBalance(@PathVariable Integer periodoId) {
            return ResponseEntity.ok(cuentaService.obtenerBalanceGeneral(periodoId));
        }

        //Version actualizada
        @GetMapping("/balance-general/tree/{periodoId}")
        public ResponseEntity<List<CuentaBalanceTreeDTO>> getBalanceGeneralTree(@PathVariable Integer periodoId) {
            return ResponseEntity.ok(cuentaService.getBalanceGeneralTree(periodoId));
        }



        @PostMapping("/copiar-cuentas")
        public ResponseEntity<String> copiarCuentas(
                @RequestParam Integer origenId,
                @RequestParam Integer destinoId
        ) {
            periodoContableService.copiarCuentasDePeriodo(origenId, destinoId);
            return ResponseEntity.ok("Cuentas copiadas con éxito.");
        }

        @PostMapping("/periodos")
        public ResponseEntity<PeriodoContableDTO> crearPeriodo(@RequestBody PeriodoContableDTO dto) {
            PeriodoContableDTO creado = periodoContableService.crearPeriodoDesdeDTO(dto);
            return ResponseEntity.ok(creado);
        }

        @GetMapping("/periodos")
        public List<PeriodoContableDTO> listarPeriodos() {
            return periodoContableService.listarPeriodos();
        }

    }

package com.hotel.backend.DTOs;

import com.hotel.backend.DTOs.LibroMayorDTO;
import com.hotel.backend.entities.CuentaContableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LibroMayorCuentaDTO {
    private CuentaContableId cuentaCodigo;
    private String cuentaNombre;
    private List<LibroMayorDTO> movimientos;
    private BigDecimal totalDebe;
    private BigDecimal totalHaber;
    private BigDecimal saldo;
}

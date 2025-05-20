package com.hotel.backend.DTOs;

import com.hotel.backend.entities.CuentaContableId;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class LibroMayorDTO {
    private CuentaContableId cuentaCodigo;
    private String cuentaNombre;
    private LocalDate fecha;
    private String descripcion;
    private Double debe;
    private Double haber;

    public LibroMayorDTO(CuentaContableId cuentaCodigo, String cuentaNombre, LocalDate fecha, String descripcion, Double debe, Double haber) {
        this.cuentaCodigo = cuentaCodigo;
        this.cuentaNombre = cuentaNombre;
        this.fecha = fecha;
        this.descripcion = descripcion;
        this.debe = debe;
        this.haber = haber;
    }
}

package com.hotel.backend.DTOs;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AsientoContableDTO {
    private Long id;
    private LocalDate fecha;
    private String descripcion;
    private String tipoAsiento;
    private Integer periodoId;
    private List<DetalleAsientoDTO> detalles;
}

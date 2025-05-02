package com.hotel.backend.DTOs;

import lombok.Data;

@Data
public class DetalleAsientoDTO {
    private String cuentaCodigo;
    private Integer cuentaPeriodoContableId;
    private Double debe;
    private Double haber;
}

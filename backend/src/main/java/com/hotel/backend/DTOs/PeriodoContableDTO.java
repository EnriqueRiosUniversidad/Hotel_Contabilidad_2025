package com.hotel.backend.DTOs;

import com.hotel.backend.entities.EstadoPeriodo;
import lombok.Data;

@Data
public class PeriodoContableDTO {
    private Integer periodoId;      // 🔑 para seleccionar el periodo
    private Integer anio;
    private Integer mesInicio;
    private Integer mesFin;
    private EstadoPeriodo estado;
}

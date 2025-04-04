package com.hotel.backend.DTOs;

import com.hotel.backend.entities.EstadoPeriodo;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class PeriodoContableDTO {

    private Integer anio;
    private Integer mesInicio;
    private Integer mesFin;
    @Enumerated(EnumType.STRING)
    private EstadoPeriodo estado;

}

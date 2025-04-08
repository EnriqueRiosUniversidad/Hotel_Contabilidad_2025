package com.hotel.backend.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "periodos_contables")
@Data
public class PeriodoContable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer periodoId;
    private Integer anio;
    private Integer mesInicio;
    private Integer mesFin;

    @Enumerated(EnumType.STRING)
    private EstadoPeriodo estado;
}
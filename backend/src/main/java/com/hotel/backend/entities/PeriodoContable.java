package com.hotel.backend.entities;
import jakarta.persistence.*;

@Entity
@Table(name = "periodos_contables")
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
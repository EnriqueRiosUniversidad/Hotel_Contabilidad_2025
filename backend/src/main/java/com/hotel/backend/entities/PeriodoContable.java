package com.hotel.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "periodos_contables")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PeriodoContable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer periodoId;

    private Integer anio;
    private Integer mesInicio;
    private Integer mesFin;

    @Enumerated(EnumType.STRING)
    private EstadoPeriodo estado;

    @OneToMany(mappedBy = "periodoContable", cascade = CascadeType.ALL)
    private List<CuentaContable> cuentasContables;

    // Si en el futuro tenés asientos:
    // @OneToMany(mappedBy = "periodoContable")
    // private List<Asiento> asientos;
}

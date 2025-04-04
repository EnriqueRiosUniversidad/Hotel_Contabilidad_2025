package com.hotel.backend.entities;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "asientos_contables")
@Data
public class AsientoContable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer asientoId;

    @ManyToOne
    @JoinColumn(name = "periodo_id")
    private PeriodoContable periodo;

    private String descripcion;
    private Date fecha;

    @Enumerated(EnumType.STRING)
    private TipoAsiento tipoAsiento;
}

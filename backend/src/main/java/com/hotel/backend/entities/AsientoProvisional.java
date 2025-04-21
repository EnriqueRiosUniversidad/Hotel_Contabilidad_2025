package com.hotel.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "asientos_provisionales")
@Data
public class AsientoProvisional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer asientoProvId;

    @ManyToOne
    @JoinColumn(name = "asiento_generado_id")
    private AsientoGenerado asientoGenerado;

    @ManyToOne
    @JoinColumn(name = "periodo_id", nullable = false)
    private PeriodoContable periodo;

    private String descripcion;
    private Date fecha;

    @Enumerated(EnumType.STRING)
    private TipoAsiento tipoAsiento;

    @Enumerated(EnumType.STRING)
    private EstadoAsientoProv estado;
}

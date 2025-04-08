package com.hotel.backend.entities;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "asientos_generados")
@Data
public class AsientoGenerado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer asientoGeneradoId;

    @ManyToOne
    @JoinColumn(name = "modelo_id")
    private ModeloAsiento modelo;

    @ManyToOne
    @JoinColumn(name = "asiento_id", nullable = true)
    private AsientoContable asiento;

    private Date fechaGeneracion;

    @Enumerated(EnumType.STRING)
    private ModuloOrigen moduloOrigen;

    @Enumerated(EnumType.STRING)
    private EstadoAsiento estado;
}

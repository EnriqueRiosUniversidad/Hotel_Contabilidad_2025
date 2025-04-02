package com.hotel.backend.entities;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "asientos_provisionales")
public class AsientoProvisional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer asientoProvId;

    @ManyToOne
    @JoinColumn(name = "asiento_generado_id")
    private AsientoGenerado asientoGenerado;

    private String descripcion;
    private Date fecha;

    @Enumerated(EnumType.STRING)
    private TipoAsiento tipoAsiento;

    @Enumerated(EnumType.STRING)
    private EstadoAsientoProv estado;
}
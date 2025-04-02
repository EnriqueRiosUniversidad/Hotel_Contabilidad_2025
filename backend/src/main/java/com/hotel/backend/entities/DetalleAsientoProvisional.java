package com.hotel.backend.entities;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalles_asientos_provisionales")
public class DetalleAsientoProvisional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detalleProvId;

    @ManyToOne
    @JoinColumn(name = "asiento_prov_id")
    private AsientoProvisional asientoProv;

    @ManyToOne
    @JoinColumn(name = "cuenta_id")
    private CuentaContable cuenta;

    private BigDecimal debe;
    private BigDecimal haber;
}

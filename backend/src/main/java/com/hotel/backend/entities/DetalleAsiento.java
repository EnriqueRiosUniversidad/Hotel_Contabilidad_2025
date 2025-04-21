package com.hotel.backend.entities;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "detalles_asientos")
@Data
public class DetalleAsiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detalleId;

    @ManyToOne
    @JoinColumn(name = "asiento_id")
    private AsientoContable asiento;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "cuenta_codigo", referencedColumnName = "codigo"),
            @JoinColumn(name = "cuenta_periodo_contable_id", referencedColumnName = "periodo_contable_id")
    })
    private CuentaContable cuenta;

    private BigDecimal debe;
    private BigDecimal haber;
}
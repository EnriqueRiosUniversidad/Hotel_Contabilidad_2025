package com.hotel.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "detalles_asientos_provisionales")
@Data
public class DetalleAsientoProvisional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer detalleProvId;

    @ManyToOne
    @JoinColumn(name = "asiento_prov_id")
    private AsientoProvisional asientoProv;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "cuenta_codigo", referencedColumnName = "codigo"),
            @JoinColumn(name = "cuenta_periodo_contable_id", referencedColumnName = "periodo_contable_id")
    })
    private CuentaContable cuenta;

    private BigDecimal debe;
    private BigDecimal haber;
}

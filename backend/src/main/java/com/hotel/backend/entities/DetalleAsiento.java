package com.hotel.backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalles_asientos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleAsiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double debe;

    private Double haber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asiento_id")
    private AsientoContable asiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "cuenta_codigo", referencedColumnName = "codigo"),
            @JoinColumn(name = "cuenta_periodo_contable_id", referencedColumnName = "periodo_contable_id")
    })
    private CuentaContable cuenta;
}

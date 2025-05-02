    package com.hotel.backend.entities;

    import jakarta.persistence.*;
    import lombok.*;

    @Entity
    @Table(name = "cuentas_contables")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @EqualsAndHashCode(onlyExplicitlyIncluded = true)
    public class CuentaContable {

        @EmbeddedId
        @EqualsAndHashCode.Include
        private CuentaContableId id;

        private String nombre;

        @Enumerated(EnumType.STRING)
        private TipoCuenta tipo;

        private Integer nivel;

        @ManyToOne
        @JoinColumns({
                @JoinColumn(name = "cuenta_padre_codigo", referencedColumnName = "codigo"),
                @JoinColumn(name = "cuenta_padre_periodo_contable_id", referencedColumnName = "periodo_contable_id")
        })
        private CuentaContable cuentaPadre;

        @MapsId("periodoContableId")
        @ManyToOne(optional = false)
        @JoinColumn(name = "periodo_contable_id")
        private PeriodoContable periodoContable;
    }

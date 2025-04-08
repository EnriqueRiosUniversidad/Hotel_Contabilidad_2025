package com.hotel.backend.entities;
import jakarta.persistence.*;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cuentas_contables")
@Data
    public class CuentaContable {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer cuentaId;

        private String codigo;
        private String nombre;

        @Enumerated(EnumType.STRING)
        private TipoCuenta tipo;

        private Integer nivel;

        @ManyToOne
        @JoinColumn(name = "cuenta_padre_id")
        private CuentaContable cuentaPadre;

        @ManyToOne
        @JoinColumn(name = "periodo_contable_id", nullable = false)
        private PeriodoContable periodoContable;


    }

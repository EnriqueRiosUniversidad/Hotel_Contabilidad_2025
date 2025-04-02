package com.hotel.backend.entities;
import jakarta.persistence.*;
import jakarta.persistence.*;

@Entity
@Table(name = "cuentas_contables")
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
}
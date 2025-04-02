package com.hotel.backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "modelos_asientos")
public class ModeloAsiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer modeloId;
    private String descripcion;

    @Enumerated(EnumType.STRING)
    private TipoAsiento tipoAsiento;
}
package com.hotel.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "modelos_asientos")
@Data
public class ModeloAsiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer modeloId;
    private String descripcion;

    @Enumerated(EnumType.STRING)
    private TipoAsiento tipoAsiento;
}
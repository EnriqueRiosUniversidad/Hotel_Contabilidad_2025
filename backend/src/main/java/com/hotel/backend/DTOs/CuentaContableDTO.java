package com.hotel.backend.DTOs;

import com.hotel.backend.entities.TipoCuenta;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class CuentaContableDTO {
    private String codigo;
    private String nombre;
    @Enumerated(EnumType.STRING)
    private TipoCuenta tipo;
    private Integer nivel;
    private Long cuentaPadreId;
    private Long periodoContableId;
}
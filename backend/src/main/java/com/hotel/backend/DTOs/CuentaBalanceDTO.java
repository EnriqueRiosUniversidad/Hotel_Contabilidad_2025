package com.hotel.backend.DTOs;

import com.hotel.backend.entities.TipoCuenta;
import com.hotel.backend.entities.SubtipoCuenta;
import lombok.Data;

@Data
public class CuentaBalanceDTO {
    private String cuenta;
    private TipoCuenta tipo;
    private SubtipoCuenta subtipo;
    private double monto;
}

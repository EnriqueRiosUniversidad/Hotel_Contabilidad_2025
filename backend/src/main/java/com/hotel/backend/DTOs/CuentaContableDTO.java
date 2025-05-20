package com.hotel.backend.DTOs;

import com.hotel.backend.entities.TipoCuenta;
import com.hotel.backend.entities.SubtipoCuenta;
import lombok.Data;

@Data
public class CuentaContableDTO {

    private String codigo;
    private String nombre;
    private TipoCuenta tipo;
    private SubtipoCuenta subtipo;
    private Integer nivel;

    // Clave compuesta de la cuenta padre (si existe)
    private String cuentaPadreId;            // ej: "1.1.1"
    private Integer cuentaPadrePeriodoId;    // ej: 1

    // Clave compuesta de esta cuenta
    private Integer periodoContableId;       // se combina con codigo para formar el ID compuesto

    private boolean imputable;


}

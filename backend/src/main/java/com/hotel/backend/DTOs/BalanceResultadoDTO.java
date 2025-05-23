package com.hotel.backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BalanceResultadoDTO {
    private String cuenta;
    private Double monto;
    private String tipo; // "seccion", "total" o null
}
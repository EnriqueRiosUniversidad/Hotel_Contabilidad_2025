package com.hotel.backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BalanceSYSDTO {
    private String codigo;
    private String cuenta;
    private double debe;
    private double haber;
    private double saldoDebe;
    private double saldoHaber;
}

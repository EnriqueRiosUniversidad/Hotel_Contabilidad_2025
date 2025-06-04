package com.hotel.backend.DTOs;

import java.util.ArrayList;
import java.util.List;


import lombok.Data;

@Data
public class CuentaBalanceTreeDTO {
    private String codigo;
    private String nombre;
    private Double debe;
    private Double haber;
    private Double saldo;
    private List<CuentaBalanceTreeDTO> hijos = new ArrayList<>();


}


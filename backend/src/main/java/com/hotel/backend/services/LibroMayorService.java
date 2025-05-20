package com.hotel.backend.services;

import com.hotel.backend.DTOs.LibroMayorDTO;
import com.hotel.backend.DTOs.LibroMayorCuentaDTO;
import com.hotel.backend.repository.LibroMayorRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;


import java.util.*;
import java.util.ArrayList;

import java.util.stream.Collectors;

@Service
public class LibroMayorService {

    private final LibroMayorRepository repository;

    public LibroMayorService(LibroMayorRepository repository) {
        this.repository = repository;
    }

    public List<LibroMayorCuentaDTO> obtenerLibroMayorAgrupado(Long periodoId) {
        List<LibroMayorDTO> registros = repository.obtenerLibroMayorPorPeriodo(periodoId);

        Map<String, List<LibroMayorDTO>> agrupado = registros.stream()
                .collect(Collectors.groupingBy(r -> r.getCuentaCodigo().getCodigo()));

        List<LibroMayorCuentaDTO> resultado = new ArrayList<>();

        for (Map.Entry<String, List<LibroMayorDTO>> entry : agrupado.entrySet()) {
            List<LibroMayorDTO> movimientos = entry.getValue();
            movimientos.sort(Comparator.comparing(LibroMayorDTO::getFecha));

            BigDecimal totalDebe = movimientos.stream()
                    .map(r -> r.getDebe() != null ? BigDecimal.valueOf(r.getDebe()) : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalHaber = movimientos.stream()
                    .map(r -> r.getHaber() != null ? BigDecimal.valueOf(r.getHaber()) : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            LibroMayorDTO primero = movimientos.get(0);

            resultado.add(new LibroMayorCuentaDTO(
                    primero.getCuentaCodigo(),
                    primero.getCuentaNombre(),
                    movimientos,
                    totalDebe,
                    totalHaber,
                    totalDebe.subtract(totalHaber)
            ));
        }

        return resultado;
    }
}

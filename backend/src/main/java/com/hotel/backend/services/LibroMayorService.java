package com.hotel.backend.services;

import com.hotel.backend.DTOs.BalanceSYSDTO;
import com.hotel.backend.DTOs.LibroMayorDTO;
import com.hotel.backend.DTOs.LibroMayorCuentaDTO;
import com.hotel.backend.repository.LibroMayorRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;


import java.time.LocalDate;
import java.util.*;
import java.util.ArrayList;

import java.util.stream.Collectors;

@Service
public class LibroMayorService {

    private final LibroMayorRepository libroMayorRepository;

    public LibroMayorService(LibroMayorRepository repository) {
        this.libroMayorRepository = repository;
    }

    public List<LibroMayorCuentaDTO> obtenerLibroMayorAgrupado(Long periodoId) {
        List<LibroMayorDTO> registros = libroMayorRepository.obtenerLibroMayorPorPeriodo(periodoId);

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


    public List<LibroMayorDTO> obtenerPorCuentaYRango(Long periodoId, String codigo, LocalDate desde, LocalDate hasta) {
        return libroMayorRepository.obtenerLibroDeCuentaEnRango(periodoId, codigo, desde, hasta);
    }

    public List<BalanceSYSDTO> obtenerBalanceSYS(Long periodoId) {
        List<LibroMayorDTO> registros = libroMayorRepository.obtenerLibroMayorPorPeriodo(periodoId);

        Map<String, List<LibroMayorDTO>> agrupado = registros.stream()
                .collect(Collectors.groupingBy(r -> r.getCuentaCodigo().getCodigo()));

        List<BalanceSYSDTO> resultado = new ArrayList<>();

        for (Map.Entry<String, List<LibroMayorDTO>> entry : agrupado.entrySet()) {
            List<LibroMayorDTO> movimientos = entry.getValue();
            String nombre = movimientos.get(0).getCuentaNombre();

            double sumDebe = movimientos.stream().mapToDouble(r -> r.getDebe() != null ? r.getDebe() : 0).sum();
            double sumHaber = movimientos.stream().mapToDouble(r -> r.getHaber() != null ? r.getHaber() : 0).sum();

            double saldoDebe = 0;
            double saldoHaber = 0;

            if (sumDebe > sumHaber) saldoDebe = sumDebe - sumHaber;
            else if (sumHaber > sumDebe) saldoHaber = sumHaber - sumDebe;

            resultado.add(new BalanceSYSDTO(entry.getKey(), nombre, sumDebe, sumHaber, saldoDebe, saldoHaber));
        }

        return resultado;
    }


}

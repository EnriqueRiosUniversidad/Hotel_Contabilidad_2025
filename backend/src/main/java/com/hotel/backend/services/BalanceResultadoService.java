package com.hotel.backend.services;

import com.hotel.backend.DTOs.LibroMayorDTO;
import com.hotel.backend.DTOs.BalanceResultadoDTO;
import com.hotel.backend.repository.LibroMayorRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BalanceResultadoService {

    private final LibroMayorRepository libroMayorRepository;

    public BalanceResultadoService(LibroMayorRepository libroMayorRepository) {
        this.libroMayorRepository = libroMayorRepository;
    }

    public List<BalanceResultadoDTO> obtenerEstadoResultados(Long periodoId) {
        List<LibroMayorDTO> registros = libroMayorRepository.obtenerLibroMayorPorPeriodo(periodoId);

        Map<String, Double> cuentas = registros.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getCuentaCodigo().getCodigo() + " - " + r.getCuentaNombre(),
                        LinkedHashMap::new,
                        Collectors.summingDouble(r -> (r.getDebe() != null ? -r.getDebe() : 0) + (r.getHaber() != null ? r.getHaber() : 0))
                ));

        List<BalanceResultadoDTO> resultado = new ArrayList<>();

        // Agrupación manual
        Map<String, String> secciones = new LinkedHashMap<>();
        secciones.put("4", "Ingresos");
        secciones.put("5.1", "Costos");
        secciones.put("5.2", "Gastos Operativos");
        secciones.put("5.3", "Gastos Financieros");
        secciones.put("6", "Otros Resultados");

        Map<String, List<BalanceResultadoDTO>> seccionado = new LinkedHashMap<>();

        for (Map.Entry<String, Double> entry : cuentas.entrySet()) {
            String codigo = entry.getKey().split(" ")[0];
            Double monto = entry.getValue();

            for (String prefijo : secciones.keySet()) {
                if (codigo.startsWith(prefijo)) {
                    seccionado.computeIfAbsent(prefijo, k -> new ArrayList<>())
                            .add(new BalanceResultadoDTO(entry.getKey(), monto, null));
                    break;
                }
            }
        }

        double utilidadBruta = 0;
        double utilidadOperativa = 0;
        double resultadoFinal = 0;

        for (Map.Entry<String, String> seccion : secciones.entrySet()) {
            String codigo = seccion.getKey();
            String nombre = seccion.getValue();
            List<BalanceResultadoDTO> lista = seccionado.getOrDefault(codigo, new ArrayList<>());

            resultado.add(new BalanceResultadoDTO(nombre, null, "seccion"));
            resultado.addAll(lista);

            double total = lista.stream().mapToDouble(r -> r.getMonto() != null ? r.getMonto() : 0).sum();
            resultado.add(new BalanceResultadoDTO("Total " + nombre, total, "total"));

            if (codigo.equals("4")) utilidadBruta += total;
            if (codigo.equals("5.1")) utilidadBruta -= total;
            if (codigo.equals("5.2")) utilidadOperativa = utilidadBruta - total;
            if (codigo.equals("5.3")) resultadoFinal = utilidadOperativa - total;
            if (codigo.equals("6")) resultadoFinal += total;
        }

        resultado.add(new BalanceResultadoDTO("Resultado del Ejercicio", resultadoFinal, "total"));

        return resultado;
    }
}

package com.hotel.backend.services;

import com.hotel.backend.DTOs.PeriodoContableDTO;
import com.hotel.backend.entities.CuentaContable;
import com.hotel.backend.entities.CuentaContableId;
import com.hotel.backend.entities.EstadoPeriodo;
import com.hotel.backend.entities.PeriodoContable;
import com.hotel.backend.repository.CuentasContables_Repository;
import com.hotel.backend.repository.PeriodoContable_Repository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PeriodoContableService {

    private final PeriodoContable_Repository periodoRepository;
    private final PeriodoContable_Repository periodoContable_Repository;
    private final CuentasContables_Repository cuentasContables_Repository;

    public List<PeriodoContableDTO> listarPeriodos() {
        return periodoRepository.findAll().stream().map(p -> {
            PeriodoContableDTO dto = new PeriodoContableDTO();
            dto.setPeriodoId(p.getPeriodoId());
            dto.setAnio(p.getAnio());
            dto.setMesInicio(p.getMesInicio());
            dto.setMesFin(p.getMesFin());
            dto.setEstado(p.getEstado());
            return dto;
        }).toList();
    }

    public PeriodoContableDTO crearPeriodoDesdeDTO(PeriodoContableDTO dto) {
        PeriodoContable nuevo = new PeriodoContable();
        nuevo.setAnio(dto.getAnio());
        nuevo.setMesInicio(1);
        nuevo.setMesFin(12);
        nuevo.setEstado(EstadoPeriodo.EDITABLE);
        PeriodoContable guardado = periodoRepository.save(nuevo);

        PeriodoContableDTO result = new PeriodoContableDTO();
        result.setPeriodoId(guardado.getPeriodoId());
        result.setAnio(guardado.getAnio());
        result.setMesInicio(guardado.getMesInicio());
        result.setMesFin(guardado.getMesFin());
        result.setEstado(guardado.getEstado());
        return result;
    }



    @Transactional
    public void copiarCuentasDePeriodo(Integer origenId, Integer destinoId) {
        List<CuentaContable> cuentas = cuentasContables_Repository.findById_PeriodoContableId(origenId);
        Optional<PeriodoContable> destinoPeriodo = periodoRepository.findById(destinoId);


        if (destinoPeriodo.isEmpty()) {
            throw new IllegalArgumentException("El período destino no existe.");
        }

        for (CuentaContable cuenta : cuentas) {
            CuentaContable nueva = new CuentaContable();
            nueva.setId(new CuentaContableId(cuenta.getId().getCodigo(), destinoId));
            nueva.setNombre(cuenta.getNombre());
            nueva.setNivel(cuenta.getNivel());
            nueva.setTipo(cuenta.getTipo());
            nueva.setSubtipo(cuenta.getSubtipo());
            nueva.setImputable(cuenta.isImputable());
            nueva.setPeriodoContable(destinoPeriodo.get()); // <-- ESTA LÍNEA ES CLAVE

            if (cuenta.getCuentaPadre() != null) {
                CuentaContableId padreId = cuenta.getCuentaPadre().getId();
                CuentaContable cuentaPadre = new CuentaContable();
                cuentaPadre.setId(new CuentaContableId(padreId.getCodigo(), destinoId));
                cuentaPadre.setPeriodoContable(destinoPeriodo.get());
                nueva.setCuentaPadre(cuentaPadre);
            } else {
                nueva.setCuentaPadre(null);
            }

            cuentasContables_Repository.save(nueva);
        }
    }

}


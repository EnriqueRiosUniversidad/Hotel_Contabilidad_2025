package com.hotel.backend.services;

import com.hotel.backend.DTOs.CuentaContableDTO;
import com.hotel.backend.entities.*;
import com.hotel.backend.repository.CuentasContables_Repository;
import com.hotel.backend.repository.PeriodoContable_Repository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class Cuenta_Service {

    private final CuentasContables_Repository cuentasContables_Repository;
    private final PeriodoContable_Repository periodoContable_Repository;
    private final ModelMapper mapper = new ModelMapper();

    @PostConstruct
    public void configurarMapper() {
        this.mapper.typeMap(CuentaContable.class, CuentaContableDTO.class).addMappings(mapper -> {
            mapper.map(src -> src.getId().getCodigo(), CuentaContableDTO::setCodigo);
            mapper.map(src -> {
                CuentaContable padre = src.getCuentaPadre();
                return padre != null ? padre.getId().getCodigo() : null;
            }, CuentaContableDTO::setCuentaPadreId);
            mapper.map(src -> {
                CuentaContable padre = src.getCuentaPadre();
                return padre != null ? padre.getId().getPeriodoContableId() : null;
            }, CuentaContableDTO::setCuentaPadrePeriodoId);
            mapper.map(src -> src.getPeriodoContable().getPeriodoId(), CuentaContableDTO::setPeriodoContableId);
        });
    }

    @Transactional
    public CuentaContableDTO getByIdCuenta(String codigo, Integer periodoId) {
        CuentaContable cuentaEntity = cuentasContables_Repository
                .findById(new CuentaContableId(codigo, periodoId))
                .orElseThrow(() -> new EntityNotFoundException("Cuenta contable no encontrada."));
        return mapper.map(cuentaEntity, CuentaContableDTO.class);
    }

    @Transactional
    public CuentaContableDTO getByCodigoCuenta(String codigo, Long periodoId) {
        CuentaContable cuentaEntity = cuentasContables_Repository
                .findById_CodigoAndId_PeriodoContableId(codigo, periodoId.intValue())
                .orElseThrow(() -> new IllegalArgumentException("Cuenta no encontrada para el período especificado"));
        return mapper.map(cuentaEntity, CuentaContableDTO.class);
    }

    @Transactional
    public List<CuentaContableDTO> getCuentas() {
        return cuentasContables_Repository.findAll()
                .stream()
                .map(cuenta -> mapper.map(cuenta, CuentaContableDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<CuentaContableDTO> getByPlan(Integer periodoContableId) {
        List<CuentaContable> cuentas = cuentasContables_Repository.findByPeriodoContable_PeriodoId(periodoContableId);
        return cuentas.stream()
                .map(c -> mapper.map(c, CuentaContableDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public CuentaContableDTO crearCuenta(CuentaContableDTO dto) {
        CuentaContableId idCuenta = new CuentaContableId(dto.getCodigo(), dto.getPeriodoContableId());

        // 1. Verificar si ya existe una cuenta con ese código en ese período
        if (cuentasContables_Repository.existsById(idCuenta)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Ya existe una cuenta con el código '" + dto.getCodigo() +
                            "' en el período contable " + dto.getPeriodoContableId());
        }

        // 2. Verificar que el período exista
        PeriodoContable periodo = periodoContable_Repository.findById(dto.getPeriodoContableId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Período contable no encontrado (ID: " + dto.getPeriodoContableId() + ")"));

        // 3. Verificar cuenta padre (si se provee)
        CuentaContable cuentaPadre = null;
        if (dto.getCuentaPadreId() != null && dto.getCuentaPadrePeriodoId() != null) {
            CuentaContableId idPadre = new CuentaContableId(dto.getCuentaPadreId(), dto.getCuentaPadrePeriodoId());

            // Validar que sea del mismo período contable
            if (!dto.getCuentaPadrePeriodoId().equals(dto.getPeriodoContableId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "La cuenta padre debe pertenecer al mismo período contable");
            }

            cuentaPadre = cuentasContables_Repository.findById(idPadre)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Cuenta padre no encontrada (código: " + dto.getCuentaPadreId() + ")"));
        }

        // 4. Crear y guardar
        CuentaContable cuenta = mapper.map(dto, CuentaContable.class);
        cuenta.setId(idCuenta);
        cuenta.setPeriodoContable(periodo);
        cuenta.setCuentaPadre(cuentaPadre);

        CuentaContable guardada = cuentasContables_Repository.save(cuenta);
        return mapper.map(guardada, CuentaContableDTO.class);
    }

    @Transactional
    public void eliminarCuenta(String codigo, Integer periodoId) {
        CuentaContable cuenta = cuentasContables_Repository.findById(new CuentaContableId(codigo, periodoId))
                .orElseThrow(() -> new EntityNotFoundException("Cuenta contable no encontrada"));

        if (cuenta.getPeriodoContable().getEstado() != EstadoPeriodo.EDITABLE) {
            throw new IllegalStateException("No se puede eliminar la cuenta, el período no está en estado EDITABLE.");
        }

        cuentasContables_Repository.delete(cuenta);
    }
}

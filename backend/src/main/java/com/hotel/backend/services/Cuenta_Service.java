package com.hotel.backend.services;

import com.hotel.backend.DTOs.CuentaContableDTO;
import com.hotel.backend.entities.CuentaContable;
import com.hotel.backend.entities.EstadoPeriodo;
import com.hotel.backend.entities.PeriodoContable;
import com.hotel.backend.repository.CuentasContables_Repository;
import com.hotel.backend.repository.PeriodoContable_Repository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class Cuenta_Service {
    private final CuentasContables_Repository cuentasContables_Repository;
    private final PeriodoContable_Repository periodoContable_Repository;
    private final ModelMapper modelMapper = new ModelMapper();



    @Transactional
    public CuentaContableDTO getByIdCuenta(Long id) {
        CuentaContable cuentaEntity =  cuentasContables_Repository.getById(id);
        CuentaContableDTO dto = modelMapper.map(cuentaEntity, CuentaContableDTO.class);
        return dto;
    }

    @Transactional
    public CuentaContableDTO getByCodigoCuenta(String codigo, Long periodoId) {
        CuentaContable cuentaEntity = cuentasContables_Repository
                .findByCodigoAndPeriodoContable_PeriodoId(codigo, periodoId)
                .orElseThrow(() -> new IllegalArgumentException("Cuenta no encontrada para el período especificado"));

        return modelMapper.map(cuentaEntity, CuentaContableDTO.class);
    }


    @Transactional
    public List<CuentaContableDTO> getCuentas() {
        List<CuentaContable> cuentasEntity = cuentasContables_Repository.findAll();

        return cuentasEntity.stream()
                .map(cuenta -> modelMapper.map(cuenta, CuentaContableDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<CuentaContableDTO> getByPlan(Long periodoContableId) {
        List<CuentaContable> cuentas = cuentasContables_Repository.findByPeriodoContable_PeriodoId(periodoContableId);
        return cuentas.stream()
                .map(c -> modelMapper.map(c, CuentaContableDTO.class))
                .toList();
    }

    @Transactional
    public CuentaContableDTO crearCuenta(CuentaContableDTO dto) {

        // Buscar el período contable por el ID recibido en el DTO.
        PeriodoContable periodo = periodoContable_Repository.findById(dto.getPeriodoContableId())
                .orElseThrow(() -> new IllegalArgumentException("Periodo contable no encontrado o no suministrado"));

        // Si se suministró ID de cuenta padre, buscarla; si no, se queda en null.
        CuentaContable cuentaPadre = null;
        if (dto.getCuentaPadreId() != null) {
            cuentaPadre = cuentasContables_Repository.findById(dto.getCuentaPadreId())
                    .orElseThrow(() -> new IllegalArgumentException("Cuenta padre no encontrada."));
        }

        // Mapear el DTO a la entidad y asignar el período y la cuenta padre.
        CuentaContable entity = modelMapper.map(dto, CuentaContable.class);
        entity.setPeriodoContable(periodo);
        entity.setCuentaPadre(cuentaPadre);

        // Guardar la entidad en la base de datos.
        CuentaContable entityGuardada = cuentasContables_Repository.save(entity);

        // Mapear la entidad guardada de vuelta a DTO y retornarla.
        return modelMapper.map(entityGuardada, CuentaContableDTO.class);
    }


    @Transactional
    public CuentaContableDTO actualizarCuenta(Long id, CuentaContableDTO dto) {
        CuentaContable cuentaExistente = cuentasContables_Repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cuenta contable no encontrada con ID: " + id));

        // Actualiza solo los campos no nulos del DTO
        if (dto.getCodigo() != null) {
            cuentaExistente.setCodigo(dto.getCodigo());
        }

        if (dto.getNombre() != null) {
            cuentaExistente.setNombre(dto.getNombre());
        }

        if (dto.getTipo() != null) {
            cuentaExistente.setTipo(dto.getTipo());
        }

        if (dto.getNivel() != null) {
            cuentaExistente.setNivel(dto.getNivel());
        }

        if (dto.getCuentaPadreId() != null) {
            CuentaContable cuentaPadre = cuentasContables_Repository.findById(dto.getCuentaPadreId())
                    .orElseThrow(() -> new EntityNotFoundException("Cuenta padre no encontrada"));
            cuentaExistente.setCuentaPadre(cuentaPadre);
        }

        if (dto.getPeriodoContableId() != null) {
            PeriodoContable periodo = periodoContable_Repository.findById(dto.getPeriodoContableId())
                    .orElseThrow(() -> new EntityNotFoundException("Periodo contable no encontrado"));
            cuentaExistente.setPeriodoContable(periodo);
        }

        CuentaContable actualizada = cuentasContables_Repository.save(cuentaExistente);
        return modelMapper.map(actualizada, CuentaContableDTO.class);
    }


    @Transactional
    public void eliminarCuenta(Long id) {
        // Buscar la cuenta contable por ID
        CuentaContable cuenta = cuentasContables_Repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cuenta contable no encontrada con ID " + id));

        // Validar que el período contable asociado esté en estado EDITABLE
        if (cuenta.getPeriodoContable() == null || cuenta.getPeriodoContable().getEstado() != EstadoPeriodo.EDITABLE) {
            throw new IllegalStateException("No se puede eliminar la cuenta, el período contable no se encuentra en estado EDITABLE.");
        }

        // Eliminar la cuenta
        cuentasContables_Repository.delete(cuenta);
    }



}

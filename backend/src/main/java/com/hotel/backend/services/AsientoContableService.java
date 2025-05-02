package com.hotel.backend.services;

import com.hotel.backend.DTOs.AsientoContableDTO;
import com.hotel.backend.DTOs.DetalleAsientoDTO;
import com.hotel.backend.entities.*;
import com.hotel.backend.repository.*;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AsientoContableService {

    private final AsientoContableRepository asientoRepo;
    private final PeriodoContable_Repository periodoRepo;
    private final CuentasContables_Repository cuentaRepo;

    private final ModelMapper mapper = new ModelMapper();

    public List<AsientoContableDTO> listarPorPeriodo(Integer periodoId) {
        return asientoRepo.findByPeriodo_PeriodoId(periodoId)
                .stream()
                .map(a -> mapper.map(a, AsientoContableDTO.class))
                .toList();
    }

    public AsientoContableDTO crear(AsientoContableDTO dto) {
        PeriodoContable periodo = periodoRepo.findById(dto.getPeriodoId())
                .orElseThrow(() -> new RuntimeException("Periodo no encontrado"));

        AsientoContable asiento = AsientoContable.builder()
                .fecha(dto.getFecha())
                .descripcion(dto.getDescripcion())
                .tipoAsiento(dto.getTipoAsiento())
                .periodo(periodo)
                .build();

        List<DetalleAsiento> detalles = dto.getDetalles().stream().map(d -> {
            CuentaContable cuenta = cuentaRepo.findById(
                    new CuentaContableId(d.getCuentaCodigo(), d.getCuentaPeriodoContableId())
            ).orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

            return DetalleAsiento.builder()
                    .cuenta(cuenta)
                    .debe(d.getDebe())
                    .haber(d.getHaber())
                    .asiento(asiento)
                    .build();
        }).toList();

        asiento.setDetalles(detalles);
        AsientoContable guardado = asientoRepo.save(asiento);

        return mapper.map(guardado, AsientoContableDTO.class);
    }

    public AsientoContableDTO buscarPorId(Long id) {
        AsientoContable asiento = asientoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Asiento no encontrado"));

        AsientoContableDTO dto = new AsientoContableDTO();
        dto.setId(asiento.getId());
        dto.setDescripcion(asiento.getDescripcion());
        dto.setFecha(asiento.getFecha());
        dto.setTipoAsiento(asiento.getTipoAsiento());
        dto.setPeriodoId(asiento.getPeriodo().getPeriodoId());

        List<DetalleAsientoDTO> detalles = asiento.getDetalles().stream().map(detalle -> {
            DetalleAsientoDTO d = new DetalleAsientoDTO();
            d.setCuentaCodigo(detalle.getCuenta().getId().getCodigo());
            d.setCuentaPeriodoContableId(detalle.getCuenta().getPeriodoContable().getPeriodoId());
            d.setDebe(detalle.getDebe());
            d.setHaber(detalle.getHaber());
            return d;
        }).toList();

        dto.setDetalles(detalles);
        return dto;
    }






    @Transactional
    public AsientoContableDTO actualizar(Long id, AsientoContableDTO dto) {
        AsientoContable existente = asientoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Asiento no encontrado"));

        PeriodoContable periodo = periodoRepo.findById(dto.getPeriodoId())
                .orElseThrow(() -> new RuntimeException("Periodo no encontrado"));

        // Validar partida doble
        double totalDebe = dto.getDetalles().stream().mapToDouble(DetalleAsientoDTO::getDebe).sum();
        double totalHaber = dto.getDetalles().stream().mapToDouble(DetalleAsientoDTO::getHaber).sum();
        if (Double.compare(totalDebe, totalHaber) != 0) {
            throw new RuntimeException("La partida doble no está balanceada.");
        }

        existente.setDescripcion(dto.getDescripcion());
        existente.setFecha(dto.getFecha());
        existente.setTipoAsiento(dto.getTipoAsiento());
        existente.setPeriodo(periodo);

        List<DetalleAsiento> nuevosDetalles = dto.getDetalles().stream().map(d -> {
            CuentaContable cuenta = cuentaRepo.findById(new CuentaContableId(d.getCuentaCodigo(), d.getCuentaPeriodoContableId()))
                    .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));
            return DetalleAsiento.builder()
                    .asiento(existente)
                    .cuenta(cuenta)
                    .debe(d.getDebe())
                    .haber(d.getHaber())
                    .build();
        }).toList();

        existente.getDetalles().clear();
        existente.getDetalles().addAll(nuevosDetalles);

        return mapper.map(asientoRepo.save(existente), AsientoContableDTO.class);
    }

    @Transactional
    public void eliminar(Long id) {
        AsientoContable asiento = asientoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Asiento no encontrado"));
        asientoRepo.delete(asiento);
    }

}

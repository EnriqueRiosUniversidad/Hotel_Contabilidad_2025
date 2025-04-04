package com.hotel.backend.repository;

import com.hotel.backend.entities.CuentaContable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CuentasContables_Repository extends JpaRepository<CuentaContable, Long> {
    List<CuentaContable> findByPeriodoContable_PeriodoId(Long periodoContableId);

    Optional<CuentaContable> findByCodigoAndPeriodoContable_PeriodoId(String codigo, Long periodoId);

}

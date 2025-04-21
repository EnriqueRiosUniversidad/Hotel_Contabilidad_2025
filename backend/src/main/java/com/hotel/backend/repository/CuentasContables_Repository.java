package com.hotel.backend.repository;

import com.hotel.backend.entities.CuentaContable;
import com.hotel.backend.entities.CuentaContableId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CuentasContables_Repository extends JpaRepository<CuentaContable, CuentaContableId> {
    List<CuentaContable> findByPeriodoContable_PeriodoId(Integer periodoContableId);

    Optional<CuentaContable> findById_CodigoAndId_PeriodoContableId(String codigo, Integer periodoId);
}

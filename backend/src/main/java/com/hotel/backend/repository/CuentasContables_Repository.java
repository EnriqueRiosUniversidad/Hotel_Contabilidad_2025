package com.hotel.backend.repository;

import com.hotel.backend.entities.CuentaContable;
import com.hotel.backend.entities.CuentaContableId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CuentasContables_Repository extends JpaRepository<CuentaContable, CuentaContableId> {

    // Usamos el acceso directo al ID embebido (más claro en la mayoría de los casos)
    List<CuentaContable> findById_PeriodoContableId(Integer periodoId);

    boolean existsById(CuentaContableId id);

    Optional<CuentaContable> findById_CodigoAndId_PeriodoContableId(String codigo, Integer periodoId);
}

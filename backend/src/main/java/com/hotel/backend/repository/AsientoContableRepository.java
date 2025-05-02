package com.hotel.backend.repository;

import com.hotel.backend.entities.AsientoContable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AsientoContableRepository extends JpaRepository<AsientoContable, Long> {
    List<AsientoContable> findByPeriodo_PeriodoId(Integer periodoId);
}

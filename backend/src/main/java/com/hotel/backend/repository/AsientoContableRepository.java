package com.hotel.backend.repository;

import com.hotel.backend.entities.AsientoContable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AsientoContableRepository extends JpaRepository<AsientoContable, Long> {
    List<AsientoContable> findByPeriodo_PeriodoId(Integer periodoId);

    @Query("""
    SELECT d.cuenta.id.codigo, SUM(d.debe), SUM(d.haber)
    FROM AsientoContable a
    JOIN a.detalles d
    WHERE a.periodo.periodoId = :periodoId
    GROUP BY d.cuenta.id.codigo
""")
    List<Object[]> sumDebeHaberPorCuenta(@Param("periodoId") Integer periodoId);


}

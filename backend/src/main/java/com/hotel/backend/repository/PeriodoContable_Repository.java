package com.hotel.backend.repository;

import com.hotel.backend.entities.CuentaContable;
import com.hotel.backend.entities.EstadoPeriodo;
import com.hotel.backend.entities.PeriodoContable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PeriodoContable_Repository extends JpaRepository<PeriodoContable, Integer> {

    // for year and month:
    Optional<PeriodoContable> findByAnioAndMesInicio(Integer anio, Integer mesInicio);

    //  búsquedas por estado
    List<PeriodoContable> findByEstado(EstadoPeriodo estado);
}


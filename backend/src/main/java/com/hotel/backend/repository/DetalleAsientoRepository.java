
package com.hotel.backend.repository;

import com.hotel.backend.entities.DetalleAsiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetalleAsientoRepository extends JpaRepository<DetalleAsiento, Long> {

    // Método necesario para el balance general: obtiene los detalles de asientos por período contable
    List<DetalleAsiento> findByAsiento_Periodo_PeriodoId(Integer periodoId);

}

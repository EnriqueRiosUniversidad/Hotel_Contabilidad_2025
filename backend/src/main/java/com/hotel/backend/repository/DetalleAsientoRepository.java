package com.hotel.backend.repository;

import com.hotel.backend.entities.DetalleAsiento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleAsientoRepository extends JpaRepository<DetalleAsiento, Long> {
}

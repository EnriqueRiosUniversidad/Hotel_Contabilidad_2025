package com.hotel.backend.repository;

import com.hotel.backend.entities.AsientoContable;
import com.hotel.backend.DTOs.LibroMayorDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

@Repository
public interface LibroMayorRepository extends CrudRepository<AsientoContable, Long> {

    @Query("SELECT new com.hotel.backend.DTOs.LibroMayorDTO(" +
            "c.id, c.nombre, a.fecha, a.descripcion, d.debe, d.haber) " +
            "FROM AsientoContable a " +
            "JOIN a.detalles d " +
            "JOIN d.cuenta c " +
            "WHERE a.periodo.id = :periodoId " +
            "ORDER BY c.id, a.fecha")
    List<LibroMayorDTO> obtenerLibroMayorPorPeriodo(@Param("periodoId") Long periodoId);



}

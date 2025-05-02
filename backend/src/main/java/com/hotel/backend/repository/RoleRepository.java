package com.hotel.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hotel.backend.entities.Role;
public interface RoleRepository extends JpaRepository<Role, Integer> {
}

package com.zelev.zelevbe.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zelev.zelevbe.persistence.entity.Unidad;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface UnidadRepository extends JpaRepository<Unidad, Long> {
    
}

package com.zelev.zelevbe.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zelev.zelevbe.persistence.entity.Articulo;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface ArticuloRepository extends JpaRepository<Articulo, Integer> {
    
}

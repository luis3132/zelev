package com.zelev.zelevbe.persistence.repository.imagen;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zelev.zelevbe.persistence.entity.imagen.Imagen;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface ImagenRepository extends JpaRepository<Imagen, Integer> {
    
}

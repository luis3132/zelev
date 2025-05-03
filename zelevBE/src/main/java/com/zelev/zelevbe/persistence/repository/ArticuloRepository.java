package com.zelev.zelevbe.persistence.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.zelev.zelevbe.persistence.entity.Articulo;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface ArticuloRepository extends JpaRepository<Articulo, Integer> {

    @Query("SELECT a FROM Articulo a JOIN a.categorias c WHERE a.estado = 'ACTIVO' AND c.categoria = ?1")
    Page<Articulo> findByCategoria(Integer categoria, Pageable pageable);

}

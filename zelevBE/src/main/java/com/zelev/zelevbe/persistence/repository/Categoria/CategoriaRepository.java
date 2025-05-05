package com.zelev.zelevbe.persistence.repository.Categoria;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.zelev.zelevbe.persistence.entity.Categoria.Categoria;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    
    @Query("SELECT c FROM Categoria c WHERE c.subcategoria = ''")
    List<Categoria> findAllByCategoria();

    @Query("SELECT c FROM Categoria c WHERE c.categoria = ?1 and c.subcategoria != ''")
    List<Categoria> findAllBySubcategoria(String categoria);
}

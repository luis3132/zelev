package com.zelev.zelevbe.persistence.repository.Categoria;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zelev.zelevbe.persistence.entity.Categoria.ArtiCate;
import com.zelev.zelevbe.persistence.entity.Categoria.ArtiCatePK;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface ArtiCateRepository extends JpaRepository<ArtiCate, ArtiCatePK> {
    
}

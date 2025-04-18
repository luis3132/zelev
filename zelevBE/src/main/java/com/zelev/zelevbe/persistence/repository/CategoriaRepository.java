package com.zelev.zelevbe.persistence.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zelev.zelevbe.persistence.entity.Categoria;

import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByCategoria(String categoria);
    List<Categoria> findBySubcategoria(String subcategoria);
}

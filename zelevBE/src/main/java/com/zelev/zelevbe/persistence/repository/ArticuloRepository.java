package com.zelev.zelevbe.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zelev.zelevbe.persistence.entity.Articulo.Articulo;

import java.util.List;

@Repository
public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
    List<Articulo> findByNombreContaining(String nombre);
    List<Articulo> findByEstado(String estado);
}
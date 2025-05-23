package com.zelev.zelevbe.domain.service.interfaces;

import java.util.List;
import java.util.Optional;

import com.zelev.zelevbe.domain.dto.CategoriaCreateDTO;
import com.zelev.zelevbe.persistence.entity.Categoria.ArtiCate;
import com.zelev.zelevbe.persistence.entity.Categoria.ArtiCatePK;
import com.zelev.zelevbe.persistence.entity.Categoria.Categoria;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface ICategoriaService {
    List<Categoria> findAll();
    List<Categoria> findAllBySubcategoria(String categoria);
    List<Categoria> findAllByCategoria();
    Optional<Categoria> findById(Integer id);
    Categoria save(CategoriaCreateDTO categoria);
    Categoria update(Categoria categoria);
    Boolean deleteById(Integer id);
    Optional<ArtiCate> findByIdArtiCate(ArtiCatePK id);
    ArtiCate saveArtiCate(ArtiCatePK id);
    Boolean deleteByIdArtiCate(ArtiCatePK id);
}

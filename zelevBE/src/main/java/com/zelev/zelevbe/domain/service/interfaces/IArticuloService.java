package com.zelev.zelevbe.domain.service.interfaces;

import java.util.List;
import java.util.Optional;

import com.zelev.zelevbe.domain.dto.articulo.ArticuloCreateDTO;
import com.zelev.zelevbe.domain.dto.articulo.UnidadCreateDTO;
import com.zelev.zelevbe.persistence.entity.Articulo;
import com.zelev.zelevbe.persistence.entity.Unidad;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface IArticuloService {
    List<Articulo> findAllArticulos();
    Optional<Articulo> findByIdArticulo(Integer id);
    Articulo saveArticulo(ArticuloCreateDTO articulo);
    Articulo updateArticulo(Articulo articulo);
    Boolean deleteArticulo(Integer id);
    Optional<Unidad> findByIdUnidad(Long id);
    Unidad saveUnidad(UnidadCreateDTO unidad);
    Unidad updateUnidad(Unidad unidad);
    Boolean deleteUnidad(Long id);
}

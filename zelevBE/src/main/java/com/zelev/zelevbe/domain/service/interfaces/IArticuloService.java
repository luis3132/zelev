package com.zelev.zelevbe.domain.service.interfaces;

import java.util.List;
import java.util.Optional;

import com.zelev.zelevbe.domain.dto.articulo.ArticuloCreateDTO;
import com.zelev.zelevbe.domain.dto.articulo.ArticuloListDTO;
import com.zelev.zelevbe.domain.dto.articulo.ArticuloUpdateDTO;
import com.zelev.zelevbe.domain.dto.articulo.UnidadCreateDTO;
import com.zelev.zelevbe.persistence.entity.Articulo;
import com.zelev.zelevbe.persistence.entity.Unidad;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface IArticuloService {
    List<ArticuloListDTO> findAllArticulos(Integer page, Integer size);
    List<ArticuloListDTO> findAllArticulosByCategorie(Integer id, Integer page, Integer size);
    Optional<Articulo> findByIdArticulo(Integer id);
    Articulo saveArticulo(ArticuloCreateDTO articulo);
    Articulo updateArticulo(ArticuloUpdateDTO articulo);
    Boolean deleteArticulo(Integer id);
    Optional<Unidad> findByIdUnidad(Long id);
    Unidad saveUnidad(UnidadCreateDTO unidad);
    Unidad updateUnidad(UnidadCreateDTO unidad);
    Boolean deleteUnidad(Long id);
}

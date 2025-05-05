package com.zelev.zelevbe.domain.dto.articulo;

import java.util.List;

import com.zelev.zelevbe.persistence.entity.Unidad;
import com.zelev.zelevbe.persistence.entity.Categoria.Categoria;
import com.zelev.zelevbe.persistence.entity.imagen.ImgArtUni;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticuloListDTO {
    private Integer idArticulo;
    private String nombre;
    private String descripcion;
    private Double impuesto;
    private String estado;
    private List<Categoria> categorias;
    private List<ImgArtUni> imagenes;
    private List<Unidad> unidades;
}

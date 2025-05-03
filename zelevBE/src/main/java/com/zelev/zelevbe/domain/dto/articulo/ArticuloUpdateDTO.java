package com.zelev.zelevbe.domain.dto.articulo;

import java.util.List;

import com.zelev.zelevbe.constants.EstadoArticulo;
import com.zelev.zelevbe.domain.dto.Imagen.ImgArtUniCreateDTO;

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
public class ArticuloUpdateDTO {
    private Integer idArticulo;
    private String nombre;
    private String descripcion;
    private Double impuesto;
    private EstadoArticulo estado;
    private List<Integer> categoriasNuevas;
    private List<Integer> categoriasEliminar;
    private ImgArtUniCreateDTO imagen;
    private List<UnidadCreateDTO> unidades;
}
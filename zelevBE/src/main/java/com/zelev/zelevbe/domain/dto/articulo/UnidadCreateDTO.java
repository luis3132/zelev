package com.zelev.zelevbe.domain.dto.articulo;

import com.zelev.zelevbe.constants.EstadoUnidad;
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
public class UnidadCreateDTO {
    private Long upc;
    private String label;
    private String precio;
    private Integer articulo;
    private Integer cantidad;
    private EstadoUnidad estado;
    private String descripcion;
    private ImgArtUniCreateDTO imagen;
}

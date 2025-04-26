package com.zelev.zelevbe.domain.dto.articulo;

import java.util.List;

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
public class ArticuloCreateDTO {
    private String nombre;
    private String descripcion;
    private Double impuesto;
    private String estado;
    private List<UnidadCreateDTO> unidades;
}

package com.zelev.zelevbe.domain.dto.articulo;

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
public class UnidadUpdateDTO {
    private Long upc;
    private String label;
    private String precio;
    private Integer cantidad;
    private String descripcion;
    private String estado;
    private Integer Articulo;
}

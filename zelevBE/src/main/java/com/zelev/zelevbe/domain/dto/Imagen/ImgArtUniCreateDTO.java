package com.zelev.zelevbe.domain.dto.Imagen;

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
public class ImgArtUniCreateDTO {
    private Integer imagen;
    private Integer articulo;
    private Long unidad;
}

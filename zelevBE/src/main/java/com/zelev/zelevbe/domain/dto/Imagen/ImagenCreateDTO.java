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
public class ImagenCreateDTO {
    private String url;
    private String alt;
}

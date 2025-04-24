package com.zelev.zelevbe.persistence.entity.Categoria;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArtiCatePK {
    private Integer articulo;
    private Integer categoria;
}

package com.zelev.zelevbe.persistence.entity.Pedido;

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
public class PediUnidPK {
    private Integer pedido;
    private Long unidad;
}

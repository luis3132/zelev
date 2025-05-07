package com.zelev.zelevbe.domain.dto.Pedido;

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
public class PedidoCreateDTO {
    private Long unidad;
    private String precio;
    private Integer cantidad;
    private String usuario;
}

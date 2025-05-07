package com.zelev.zelevbe.domain.dto.Pedido;

import com.zelev.zelevbe.constants.EstadoPedido;

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
public class PedidoUpdateDTO {
    private Integer idPedido;
    private String empleado;
    private EstadoPedido estado;
}

package com.zelev.zelevbe.domain.service.interfaces;

import java.util.List;

import com.zelev.zelevbe.domain.dto.Pedido.PedidoCreateDTO;
import com.zelev.zelevbe.domain.dto.Pedido.PedidoUpdateDTO;
import com.zelev.zelevbe.persistence.entity.Pedido.Pedido;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface IPedidoService {
    Pedido savePedido(List<PedidoCreateDTO> pedido);
    List<Pedido> findAllPedido();
    List<Pedido> findAllPedidoByClienteId(String cedula);
    Pedido updatePedido(PedidoUpdateDTO pedido);
}

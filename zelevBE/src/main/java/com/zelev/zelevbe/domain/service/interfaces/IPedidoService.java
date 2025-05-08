package com.zelev.zelevbe.domain.service.interfaces;

import java.util.List;

import com.zelev.zelevbe.domain.dto.Pedido.PedidoCreateDTO;
import com.zelev.zelevbe.domain.dto.Pedido.PedidoGraficaDTO;
import com.zelev.zelevbe.domain.dto.Pedido.PedidoUpdateDTO;
import com.zelev.zelevbe.persistence.entity.Pedido.Pedido;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface IPedidoService {
    Pedido savePedido(List<PedidoCreateDTO> pedido);
    List<PedidoGraficaDTO> findAllPedido();
    List<Pedido> findAllPedidoByEstado(String estado);
    List<Pedido> findAllPedidoByClienteId(String cedula);
    Pedido updatePedido(PedidoUpdateDTO pedido);
}

package com.zelev.zelevbe.domain.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zelev.zelevbe.domain.dto.Pedido.PedidoCreateDTO;
import com.zelev.zelevbe.domain.dto.Pedido.PedidoUpdateDTO;
import com.zelev.zelevbe.domain.service.PedidoService;
import com.zelev.zelevbe.persistence.entity.Pedido.Pedido;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@RestController
@RequestMapping("/api/pedido")
public class PedidoController {
    
    @Autowired
    private PedidoService pedidoService;

    @GetMapping("/list")
    public ResponseEntity<List<Pedido>> findAllPedidos() {
        List<Pedido> pedidos = pedidoService.findAllPedido();
        return pedidos.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(pedidos);
    }

    @GetMapping("/list/{cedula}")
    public ResponseEntity<List<Pedido>> findAllPedidosByUser(@PathVariable("cedula") String cedula) {
        List<Pedido> pedidos = pedidoService.findAllPedidoByClienteId(cedula);
        return pedidos.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(pedidos);
    }

    @PostMapping("/new")
    public ResponseEntity<Pedido> savePedido(@RequestBody List<PedidoCreateDTO> pedido) {
        Pedido pedidoCreado = pedidoService.savePedido(pedido);
        return pedidoCreado == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(pedidoCreado);
    }

    @PutMapping("/update")
    public ResponseEntity<Pedido> updatePedido(@RequestBody PedidoUpdateDTO pedido) {
        Pedido pedidoActualizado = pedidoService.updatePedido(pedido);
        return pedidoActualizado == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(pedidoActualizado);
    }
}

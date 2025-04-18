package com.zelev.zelevbe.domain.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.zelev.zelevbe.domain.service.PedidoService;
import com.zelev.zelevbe.persistence.entity.Unidad;
import com.zelev.zelevbe.persistence.entity.Pedido.Pedido;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // Obtener todos los pedidos
    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidos() {
        return new ResponseEntity<>(pedidoService.listarTodos(), HttpStatus.OK);
    }

    // Obtener pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedido(@PathVariable Long id) {
        Pedido pedido = pedidoService.buscarPorId(id);
        return pedido != null ? 
            new ResponseEntity<>(pedido, HttpStatus.OK) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Crear nuevo pedido
    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody Pedido pedido) {
        return new ResponseEntity<>(pedidoService.crearPedido(pedido), HttpStatus.CREATED);
    }



    // Actualizar pedido
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> actualizarPedido(
            @PathVariable Long id, 
            @RequestBody Pedido pedido) {
        if (!pedido.getId().equals(id)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(pedidoService.actualizarPedido(pedido), HttpStatus.OK);
    }

    // Cambiar estado de pedido
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Pedido> cambiarEstadoPedido(
            @PathVariable Long id, 
            @RequestParam String estado) {
        Pedido pedido = pedidoService.cambiarEstado(id, estado);
        return pedido != null ? 
            new ResponseEntity<>(pedido, HttpStatus.OK) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Obtener unidades de un pedido
    @GetMapping("/{id}/unidades")
    public ResponseEntity<List<Unidad>> obtenerUnidadesDePedido(@PathVariable Long id) {
        List<Unidad> unidades = pedidoService.obtenerUnidadesPorPedido(id);
        return new ResponseEntity<>(unidades, HttpStatus.OK);
    }

    // Agregar unidad a pedido
    @PostMapping("/{idPedido}/unidades/{upc}")
    public ResponseEntity<Void> agregarUnidadAPedido(
            @PathVariable Long idPedido, 
            @PathVariable String upc) {
        boolean resultado = pedidoService.agregarUnidadAPedido(idPedido, upc);
        return resultado ? 
            new ResponseEntity<>(HttpStatus.CREATED) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
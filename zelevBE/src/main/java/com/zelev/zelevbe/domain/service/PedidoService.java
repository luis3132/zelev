package com.zelev.zelevbe.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zelev.zelevbe.persistence.entity.Unidad;
import com.zelev.zelevbe.persistence.entity.Pedido.PediUnid;
import com.zelev.zelevbe.persistence.entity.Pedido.Pedido;
import com.zelev.zelevbe.persistence.repository.PedidoRepository;
import com.zelev.zelevbe.persistence.repository.UnidadRepository;
import com.zelev.zelevbe.persistence.repository.UsuarioRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class PedidoService {

    @Autowired private PedidoRepository pedidoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private UnidadRepository unidadRepository;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    public Pedido crearPedido(Pedido pedido) {
        pedido.setFechaPedido(new Date());
        return pedidoRepository.save(pedido);
    }

    public Pedido actualizarPedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public void eliminarPedido(Long id) {
        pedidoRepository.deleteById(id);
    }

    public Pedido cambiarEstado(Long id, String estado) {
        Pedido pedido = buscarPorId(id);
        if (pedido != null) {
            pedido.setEstado(estado);
            return pedidoRepository.save(pedido);
        }
        return null;
    }

    public List<Unidad> obtenerUnidadesPorPedido(Long id) {
        // Implement logic to fetch units for the given order ID
        return new ArrayList<>(); // Replace with actual implementation
    }

    public boolean agregarUnidadAPedido(Long idPedido, String upc) {
        Pedido pedido = pedidoRepository.findById(idPedido).orElse(null);
        Unidad unidad = unidadRepository.findById(upc).orElse(null);
    
        if (pedido != null && unidad != null) {
            PediUnid link = new PediUnid(pedido, unidad);
    
            // Sincroniza ambos lados de la relación
            pedido.getUnidades().add(link);
            unidad.getPedidos().add(link);
    
            pedidoRepository.save(pedido);
            return true;
        }
        return false;
    }
    
}
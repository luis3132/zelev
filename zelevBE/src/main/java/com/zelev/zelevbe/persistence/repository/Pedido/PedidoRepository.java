package com.zelev.zelevbe.persistence.repository.Pedido;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.zelev.zelevbe.persistence.entity.Pedido.Pedido;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    
    @Query("SELECT p FROM Pedido p WHERE p.cliente.cedula = ?1")
    List<Pedido> findAllByClienteId(String clienteId);
}

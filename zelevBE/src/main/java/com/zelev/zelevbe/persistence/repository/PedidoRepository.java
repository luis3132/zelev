package com.zelev.zelevbe.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.zelev.zelevbe.persistence.entity.Pedido.Pedido;

import java.util.Date;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByClienteCedula(String cedula);
    List<Pedido> findByEstado(String estado);
    List<Pedido> findByFechaPedidoBetween(Date inicio, Date fin);
}
package com.zelev.zelevbe.persistence.repository.Pedido;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zelev.zelevbe.persistence.entity.Pedido.PediUnid;
import com.zelev.zelevbe.persistence.entity.Pedido.PediUnidPK;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface PediUnidRepository extends JpaRepository<PediUnid, PediUnidPK> {
    
}

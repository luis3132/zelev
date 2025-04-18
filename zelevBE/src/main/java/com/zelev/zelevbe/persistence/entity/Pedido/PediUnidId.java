package com.zelev.zelevbe.persistence.entity.Pedido;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PediUnidId implements Serializable {
    
    private Long pedidoId;
    private String unidadUpc;

    public PediUnidId() {}

    public PediUnidId(Long pedidoId, String unidadUpc) {
        this.pedidoId = pedidoId;
        this.unidadUpc = unidadUpc;
    }

    public Long getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
        this.pedidoId = pedidoId;
    }

    public String getUnidadUpc() {
        return unidadUpc;
    }

    public void setUnidadUpc(String unidadUpc) {
        this.unidadUpc = unidadUpc;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PediUnidId pediUniId = (PediUnidId) o;
        return Objects.equals(pedidoId, pediUniId.pedidoId) &&
               Objects.equals(unidadUpc, pediUniId.unidadUpc);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pedidoId, unidadUpc);
    }
}


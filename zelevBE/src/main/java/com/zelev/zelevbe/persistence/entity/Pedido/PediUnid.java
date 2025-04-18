package com.zelev.zelevbe.persistence.entity.Pedido;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zelev.zelevbe.persistence.entity.Unidad;

import jakarta.persistence.*;

@Entity
@Table(name = "pediuni")
public class PediUnid {

    @EmbeddedId
    private PediUnidId id;

    @ManyToOne
    @MapsId("pedidoId")
    @JoinColumn(name = "id_pedido")
    @JsonIgnore
    private Pedido pedido;

    @ManyToOne
    @MapsId("unidadUpc")
    @JoinColumn(name = "upc_unidad")
    @JsonIgnore
    private Unidad unidad;

    private int cantidad;

    public PediUnid() {
    }

    public PediUnid(Pedido pedido, Unidad unidad) {
        this.id = new PediUnidId(pedido.getId(), unidad.getUpc());
        this.pedido = pedido;
        this.unidad = unidad;
    }

    public PediUnidId getId() {
        return id;
    }

    public void setId(PediUnidId id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public Unidad getUnidad() {
        return unidad;
    }

    public void setUnidad(Unidad unidad) {
        this.unidad = unidad;
    }

}
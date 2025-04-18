package com.zelev.zelevbe.persistence.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zelev.zelevbe.persistence.entity.Articulo.Articulo;
import com.zelev.zelevbe.persistence.entity.Pedido.PediUnid;

@Entity
@Table(name = "unidad")
public class Unidad {
    @Id
    private String upc;
    
    private String label;
    private Double precio;
    
    @ManyToOne
    @JoinColumn(name = "articulo")
    @JsonIgnore
    private Articulo articulo;
    
    private Integer cantidad;
    
    @Column(name = "fecha_creacion")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaCreacion;
    
    private String estado;
    private String descripcion;
    
    @OneToMany(mappedBy = "unidad", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("unidades")
    private Set<PediUnid> pedidos = new HashSet<>();
    
    // Constructores, getters y setters
    public Unidad() {}

    public Unidad(String upc, String label, Double precio, Articulo articulo, Integer cantidad) {
        this.upc = upc;
        this.label = label;
        this.precio = precio;
        this.articulo = articulo;
        this.cantidad = cantidad;
        this.fechaCreacion = new Date();
        this.estado = "Activo";
    }

    public String getUpc() {
        return upc;
    }

    public void setUpc(String upc) {
        this.upc = upc;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Articulo getArticulo() {
        return articulo;
    }

    public void setArticulo(Articulo articulo) {
        this.articulo = articulo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Set<PediUnid> getPedidos() {
        return pedidos;
    }

    public void setPedidos(Set<PediUnid> pedidos) {
        this.pedidos = pedidos;
    }

    public void addPedido(PediUnid pediUnid) {
        pedidos.add(pediUnid);
        pediUnid.setUnidad(this);
    }

    public void removePedido(PediUnid pediUnid) {
        pedidos.remove(pediUnid);
        pediUnid.setUnidad(null);
    }

    
}
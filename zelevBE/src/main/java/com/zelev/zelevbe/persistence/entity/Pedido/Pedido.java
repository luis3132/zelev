package com.zelev.zelevbe.persistence.entity.Pedido;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
import com.zelev.zelevbe.persistence.entity.Unidad;
import com.zelev.zelevbe.persistence.entity.Usuario;

@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "cliente")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario cliente;
    
    @ManyToOne
    @JoinColumn(name = "empleado")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario empleado;
    
    @Column(name = "fecha_pedido")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaPedido;
    
    private String estado;
    
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<PediUnid> unidades = new HashSet<>();
    
    // Constructores, getters y setters
    public Pedido() {}

    public Pedido(Usuario cliente, Usuario empleado) {
        this.cliente = cliente;
        this.empleado = empleado;
        this.fechaPedido = new Date();
        this.estado = "Pendiente";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getCliente() {
        return cliente;
    }

    public void setCliente(Usuario cliente) {
        this.cliente = cliente;
    }

    public Usuario getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Usuario empleado) {
        this.empleado = empleado;
    }

    public Date getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(Date fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Set<PediUnid> getUnidades() {
        return unidades;
    }

    public void setUnidades(Set<PediUnid> unidades) {
        this.unidades = unidades;
    }

    public void agregarUnidad(PediUnid pediUnid) {
        unidades.add(pediUnid);
        pediUnid.setPedido(this); // Establecer la relación inversa
    }

    public void eliminarUnidad(PediUnid pediUnid) {
        unidades.remove(pediUnid);
        pediUnid.setPedido(null); // Limpiar la relación inversa
    }


    
    // Métodos helper
    public void agregarUnidad(Unidad unidad) {
        PediUnid pediUnid = new PediUnid(this, unidad);
        this.unidades.add(pediUnid);
        unidad.getPedidos().add(pediUnid); // <- ¡esto sincroniza la relación!
    }

    public void eliminarUnidad(Unidad unidad) {
        PediUnid pediUnid = new PediUnid(this, unidad);
        unidades.remove(pediUnid);
    }
    
}
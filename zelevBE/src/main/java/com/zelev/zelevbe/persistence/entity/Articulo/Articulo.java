package com.zelev.zelevbe.persistence.entity.Articulo;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.zelev.zelevbe.persistence.entity.Categoria;
import com.zelev.zelevbe.persistence.entity.Unidad;

@Entity
@Table(name = "articulo")
public class Articulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_articulo")
    private Long id;
    
    private String nombre;
    private String descripcion;
    private Double impuesto;
    private String estado;
    
    @OneToMany(mappedBy = "articulo")
    private Set<Unidad> unidades = new HashSet<>();
    
    @OneToMany(mappedBy = "articulo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @JsonManagedReference
    private Set<ArtiCate> categorias = new HashSet<>();
    
    // Constructores, getters y setters
    public Articulo() {
    }

    public Articulo(String nombre, String descripcion, Double impuesto, String estado) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.impuesto = impuesto;
        this.estado = estado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getImpuesto() {
        return impuesto;
    }

    public void setImpuesto(Double impuesto) {
        this.impuesto = impuesto;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Set<Unidad> getUnidades() {
        return unidades;
    }

    public void setUnidades(Set<Unidad> unidades) {
        this.unidades = unidades;
    }

    public Set<ArtiCate> getCategorias() {
        return categorias;
    }

    public void setCategorias(Set<ArtiCate> categorias) {
        this.categorias = categorias;
    }

    public void agregarUnidad(Unidad unidad) {
        unidades.add(unidad);
        unidad.setArticulo(this);
    }

    
    
    // Métodos helper
    public void agregarCategoria(Categoria categoria) {
        ArtiCate artiCate = new ArtiCate(this, categoria);
        categorias.add(artiCate);
    }
}
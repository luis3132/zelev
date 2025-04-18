package com.zelev.zelevbe.persistence.entity;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zelev.zelevbe.persistence.entity.Articulo.ArtiCate;

@Entity
@Table(name = "categoria")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Long id;
    
    private String subcategoria;
    private String categoria;
    
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<ArtiCate> articulos = new HashSet<>();
    
    // Constructores, getters y setters


    public Categoria() {}
    
    public Categoria(String subcategoria, String categoria) {
        this.subcategoria = subcategoria;
        this.categoria = categoria;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getSubcategoria() {
        return subcategoria;
    }
    
    public void setSubcategoria(String subcategoria) {
        this.subcategoria = subcategoria;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Set<ArtiCate> getArticulos() {
        return articulos;
    }

    public void setArticulos(Set<ArtiCate> articulos) {
        this.articulos = articulos;
    }

    @Override
    public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Categoria categoria = (Categoria) o;
    return Objects.equals(id, categoria.id);
}



}
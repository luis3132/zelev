package com.zelev.zelevbe.persistence.entity.Articulo;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zelev.zelevbe.persistence.entity.Categoria;

import jakarta.persistence.*;

@Entity
@Table(name = "arti_cate")
public class ArtiCate {

    @EmbeddedId
    private ArtiCateId id;

    @ManyToOne
    @MapsId("articulo")
    @JoinColumn(name = "articulo")
    @JsonIgnore
    @JsonBackReference
    private Articulo articulo;

    @ManyToOne
    @MapsId("categoria")
    @JoinColumn(name = "categoria")
    @JsonIgnore
    private Categoria categoria;

    public ArtiCate() {}

    public ArtiCate(Articulo articulo, Categoria categoria) {
        this.id = new ArtiCateId(articulo.getId(), categoria.getId());
        this.articulo = articulo;
        this.categoria = categoria;
    }

    public ArtiCateId getId() {
        return id;
    }

    public void setId(ArtiCateId id) {
        this.id = id;
    }

    public Articulo getArticulo() {
        return articulo;
    }

    public void setArticulo(Articulo articulo) {
        this.articulo = articulo;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}

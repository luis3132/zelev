package com.zelev.zelevbe.persistence.entity.Articulo;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class ArtiCateId implements Serializable {
    private Long articulo;
    private Long categoria;

    public ArtiCateId() {}

    public ArtiCateId(Long articulo, Long categoria) {
        this.articulo = articulo;
        this.categoria = categoria;
    }

    public Long getArticulo() {
        return articulo;
    }

    public void setArticulo(Long articulo) {
        this.articulo = articulo;
    }

    public Long getCategoria() {
        return categoria;
    }

    public void setCategoria(Long categoria) {
        this.categoria = categoria;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ArtiCateId that = (ArtiCateId) o;
        return Objects.equals(articulo, that.articulo) && Objects.equals(categoria, that.categoria);
    }

    @Override
    public int hashCode() {
        return Objects.hash(articulo, categoria);
    }
}
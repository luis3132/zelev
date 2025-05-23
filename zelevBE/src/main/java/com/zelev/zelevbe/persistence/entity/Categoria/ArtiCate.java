package com.zelev.zelevbe.persistence.entity.Categoria;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.zelev.zelevbe.persistence.entity.Articulo;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "arti_cate")
public class ArtiCate {
    
    @EmbeddedId
    private ArtiCatePK id;

    @ManyToOne
    @MapsId("categoria")
    @JoinColumn(name = "categoria", referencedColumnName = "id_categoria")
    private Categoria categoria;

    @ManyToOne
    @MapsId("articulo")
    @JoinColumn(name = "articulo", referencedColumnName = "id_articulo")
    @JsonBackReference("articulo-categoria")
    private Articulo articulo;

}

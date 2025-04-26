package com.zelev.zelevbe.persistence.entity.imagen;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zelev.zelevbe.persistence.entity.Articulo;
import com.zelev.zelevbe.persistence.entity.Unidad;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "img_art_uni")
public class ImgArtUni {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_img_art_uni")
    private Integer idImgArtUni;

    @ManyToOne
    @JoinColumn(name = "imagen", referencedColumnName = "id_imagen")
    private Imagen imagen;

    @ManyToOne
    @JoinColumn(name = "articulo", referencedColumnName = "id_articulo")
    @JsonBackReference("articulo-imagen")
    private Articulo articulo;

    @ManyToOne
    @JoinColumn(name = "unidad", referencedColumnName = "upc")
    @JsonIgnore
    private Unidad unidad;
}

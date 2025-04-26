package com.zelev.zelevbe.persistence.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.zelev.zelevbe.constants.EstadoArticulo;
import com.zelev.zelevbe.persistence.entity.imagen.ImgArtUni;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Table(name = "articulo")
public class Articulo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_articulo")
    private Integer idArticulo;

    private String nombre;
    private String descripcion;
    private Double impuesto;
    private EstadoArticulo estado;

    @OneToMany(mappedBy = "articulo")
    @JsonManagedReference("articulo-imagen")
    private List<ImgArtUni> imagenes;

    @OneToMany(mappedBy = "articulo")
    @JsonManagedReference("articulo-unidad")
    private List<Unidad> unidades;
}

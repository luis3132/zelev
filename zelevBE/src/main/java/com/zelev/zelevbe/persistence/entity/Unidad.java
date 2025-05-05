package com.zelev.zelevbe.persistence.entity;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.zelev.zelevbe.constants.EstadoUnidad;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "unidad")
public class Unidad {
    
    @Id
    private Long upc;
    private String label;
    private String precio;
    private Integer cantidad;

    @Column(name = "fecha_creacion")
    private Date fechaCreacion;

    @Enumerated(EnumType.STRING)
    private EstadoUnidad estado;
    
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "articulo", referencedColumnName = "id_articulo")
    @JsonBackReference("articulo-unidad")
    private Articulo articulo;

}

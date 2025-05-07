package com.zelev.zelevbe.persistence.entity.Pedido;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.zelev.zelevbe.persistence.entity.Unidad;

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
@Table(name = "pedi_unid")
public class PediUnid {
    
    @EmbeddedId
    private PediUnidPK pediUnidPK;

    @ManyToOne
    @MapsId("pedido")
    @JoinColumn(name = "pedido", referencedColumnName = "id_pedido")
    @JsonBackReference("pedido-pediUnid")
    private Pedido pedido;

    @ManyToOne
    @MapsId("unidad")
    @JoinColumn(name = "unidad", referencedColumnName = "upc")
    private Unidad unidad;

    private Integer cantidad;
    private String precio;
}

package com.zelev.zelevbe.persistence.entity.Pedido;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.zelev.zelevbe.constants.EstadoPedido;
import com.zelev.zelevbe.persistence.entity.Usuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
@Table(name = "pedido")
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Integer idPedido;

    @OneToOne
    @JoinColumn(name = "cliente", referencedColumnName = "cedula")
    private Usuario cliente;

    @OneToOne
    @JoinColumn(name = "empleado", referencedColumnName = "cedula")
    private Usuario empleado;

    @Column(name = "fecha_pedido")
    private Date fechaPedido;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado;

    @OneToMany(mappedBy = "pedido")
    @JsonManagedReference("pedido-pediUnid")
    private List<PediUnid> pediUnidList;
}

package com.zelev.zelevbe.domain.dto.Pedido;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.zelev.zelevbe.constants.EstadoPedido;
import com.zelev.zelevbe.persistence.entity.Usuario;
import com.zelev.zelevbe.persistence.entity.Pedido.PediUnid;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PedidoGraficaDTO {
    private Integer idPedido;
    private Usuario empleado;
    private String ciudad;
    private String departamento;

    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date fechaPedido;

    private EstadoPedido estado;
    private List<PediUnid> pediUnidList;
}

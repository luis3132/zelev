package com.zelev.zelevbe.domain.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zelev.zelevbe.constants.EstadoPedido;
import com.zelev.zelevbe.constants.EstadoUnidad;
import com.zelev.zelevbe.domain.dto.Pedido.PedidoCreateDTO;
import com.zelev.zelevbe.domain.dto.Pedido.PedidoUpdateDTO;
import com.zelev.zelevbe.domain.dto.articulo.UnidadCreateDTO;
import com.zelev.zelevbe.domain.service.interfaces.IPedidoService;
import com.zelev.zelevbe.persistence.entity.Unidad;
import com.zelev.zelevbe.persistence.entity.Usuario;
import com.zelev.zelevbe.persistence.entity.Pedido.PediUnid;
import com.zelev.zelevbe.persistence.entity.Pedido.PediUnidPK;
import com.zelev.zelevbe.persistence.entity.Pedido.Pedido;
import com.zelev.zelevbe.persistence.repository.Pedido.PediUnidRepository;
import com.zelev.zelevbe.persistence.repository.Pedido.PedidoRepository;

import jakarta.transaction.Transactional;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Service
@Transactional
public class PedidoService implements IPedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private PediUnidRepository pediUnidRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ArticuloService articuloService;

    @Override
    public List<Pedido> findAllPedido() {
        return pedidoRepository.findAll();
    }

    @Override
    public List<Pedido> findAllPedidoByClienteId(String cedula) {
        return pedidoRepository.findAllByClienteId(cedula);
    }

    @Override
    public Pedido savePedido(List<PedidoCreateDTO> pedido) {
        Pedido temp = new Pedido();
        Pedido Creado;
        // validar si el Usuario existe
        Optional<Usuario> usuario = usuarioService.findById(pedido.get(0).getUsuario());
        if (usuario.isPresent()) {
            temp.setCliente(usuario.get());
            temp.setEstado(EstadoPedido.PROCESO);
            temp.setFechaPedido(new Date());
            // crea el pedido
            Creado = pedidoRepository.save(temp);
        } else {
            return null;
        }
        // Crear pediUnid una por cada unidad que se haya pedido
        for (PedidoCreateDTO item : pedido) {
            PediUnid pediUnid = new PediUnid();
            PediUnidPK pediUnidPK = new PediUnidPK();
            // crear PediUnid 
            pediUnidPK.setPedido(Creado.getIdPedido());
            pediUnidPK.setUnidad(item.getUnidad());

            pediUnid.setPediUnidPK(pediUnidPK);
            pediUnid.setPrecio(item.getPrecio());
            pediUnid.setCantidad(item.getCantidad());
            pediUnid.setPedido(Creado);
            // Validar si la unidad existe
            Optional<Unidad> unidad = articuloService.findByIdUnidad(item.getUnidad());
            if (unidad.isPresent()) {
                pediUnid.setUnidad(unidad.get());
                // actualizar la cantidad de la unidad
                // si la cantidad es menor a 0 no se puede realizar el pedido
                // si la cantidad es 0 se cambia el estado a NOSTOCK
                UnidadCreateDTO unidadTemp = new UnidadCreateDTO(unidad.get().getUpc(), unidad.get().getLabel(),
                        unidad.get().getPrecio(), unidad.get().getArticulo().getIdArticulo(), unidad.get().getCantidad(), unidad.get().getEstado(),
                        unidad.get().getDescripcion(), null); 
                Integer restante = unidadTemp.getCantidad() - item.getCantidad();
                if (restante < 0) {
                    return null;
                }
                unidadTemp.setCantidad(restante);
                if (restante == 0) {
                    unidadTemp.setEstado(EstadoUnidad.NOSTOCK);
                }
                // guardar la unidad
                articuloService.updateUnidad(unidadTemp);
            } else {
                return null;
            }
            // guardar pediUnid
            pediUnidRepository.save(pediUnid);
        }
        return Creado;
    }

    @Override
    public Pedido updatePedido(PedidoUpdateDTO pedido) {
        Optional<Pedido> pedidoExistente = pedidoRepository.findById(pedido.getIdPedido());
        if (pedidoExistente.isPresent()) {
            Pedido pedidoActualizado = pedidoExistente.get();
            pedidoActualizado.setEstado(pedido.getEstado());

            Optional<Usuario> usuario = usuarioService.findById(pedido.getEmpleado());
            if (usuario.isPresent()) {
                pedidoActualizado.setEmpleado(usuario.get());
            } else {
                return null;
            }

            if (pedido.getEstado() == EstadoPedido.CANCELADO) {
                List<PediUnid> items = pedidoExistente.get().getPediUnidList();
                for (PediUnid item : items) {
                    // Actualizar la cantidad de la unidad
                    Optional<Unidad> unidad = articuloService.findByIdUnidad(item.getUnidad().getUpc());
                    if (unidad.isPresent()) {
                        UnidadCreateDTO unidadTemp = new UnidadCreateDTO(unidad.get().getUpc(), unidad.get().getLabel(),
                                unidad.get().getPrecio(), unidad.get().getArticulo().getIdArticulo(), unidad.get().getCantidad(), unidad.get().getEstado(),
                                unidad.get().getDescripcion(), null);
                        Integer restante = unidadTemp.getCantidad() + item.getCantidad();
                        unidadTemp.setCantidad(restante);
                        if (restante > 0) {
                            unidadTemp.setEstado(EstadoUnidad.STOCK);
                        }
                        // guardar la unidad
                        articuloService.updateUnidad(unidadTemp);
                    }
                }
            }

            return pedidoRepository.save(pedidoActualizado);
        }
        return null;
    }
}

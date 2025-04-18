package com.zelev.zelevbe.domain.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zelev.zelevbe.persistence.entity.Unidad;
import com.zelev.zelevbe.persistence.entity.Articulo.Articulo;
import com.zelev.zelevbe.persistence.repository.ArticuloRepository;
import com.zelev.zelevbe.persistence.repository.UnidadRepository;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class UnidadService {

    @Autowired private UnidadRepository unidadRepository;
    @Autowired private ArticuloRepository articuloRepository;

    public List<Unidad> listarTodos() {
        return unidadRepository.findAll();
    }

    public Unidad buscarPorUpc(String upc) {
        return unidadRepository.findById(upc).orElse(null);
    }

    public Unidad crearUnidad(Unidad unidad) {
        unidad.setFechaCreacion(new Date());
        return unidadRepository.save(unidad);
    }

    public Unidad actualizarUnidad(Unidad unidad) {
        return unidadRepository.save(unidad);
    }

    public void eliminarUnidad(String upc) {
        unidadRepository.deleteById(upc);
    }

    public Articulo obtenerArticuloPorUnidad(String upc) {
        // Implement the logic to retrieve the article based on the UPC
        // For example:
        Unidad unidad = buscarPorUpc(upc);
        return unidad != null ? unidad.getArticulo() : null;
    }

    public Unidad cambiarEstado(String upc, String estado) {
        Unidad unidad = buscarPorUpc(upc);
        if (unidad != null) {
            unidad.setEstado(estado);
            return unidadRepository.save(unidad);
        }
        return null;
    }

    public List<Unidad> buscarPorArticulo(Long idArticulo) {
        return unidadRepository.findByArticuloId(idArticulo);
    }
}
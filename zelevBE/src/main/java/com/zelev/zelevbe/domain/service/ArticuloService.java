package com.zelev.zelevbe.domain.service;

import com.zelev.zelevbe.persistence.entity.Categoria;
import com.zelev.zelevbe.persistence.entity.Articulo.ArtiCate;
import com.zelev.zelevbe.persistence.entity.Articulo.Articulo;
import com.zelev.zelevbe.persistence.repository.ArticuloRepository;
import com.zelev.zelevbe.persistence.repository.CategoriaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@Transactional
public class ArticuloService {

    @Autowired private ArticuloRepository articuloRepository;
    @Autowired private CategoriaRepository categoriaRepository;

    public List<Articulo> listarTodos() {
        return articuloRepository.findAll();
    }

    public Articulo buscarPorId(Long id) {
        return articuloRepository.findById(id).orElse(null);
    }

    public Articulo crearArticulo(Articulo articulo) {
        return articuloRepository.save(articulo);
    }

    public Articulo actualizarArticulo(Articulo articulo) {
        return articuloRepository.save(articulo);
    }

    public void eliminarArticulo(Long id) {
        articuloRepository.deleteById(id);
    }

    public Set<ArtiCate> obtenerCategoriasDeArticulo(Long idArticulo) {
        Articulo articulo = buscarPorId(idArticulo);
        return articulo != null ? articulo.getCategorias() : null;
    }

    public boolean agregarCategoriaAArticulo(Long idArticulo, Long idCategoria) {
        Articulo articulo = articuloRepository.findById(idArticulo).orElse(null);
        Categoria categoria = categoriaRepository.findById(idCategoria).orElse(null);
        
        if (articulo != null && categoria != null) {
            articulo.agregarCategoria(categoria);
            articuloRepository.save(articulo);
            return true;
        }
        return false;
    }


    public List<Categoria> obtenerCategoriasPorArticulo(Long idArticulo) {
        Articulo articulo = articuloRepository.findById(idArticulo).orElse(null);
        
        if (articulo != null) {
            return articulo.getCategorias().stream()
                    .map(ArtiCate::getCategoria)
                    .toList();
        }
        
        return List.of(); // Retorna una lista vacía si el artículo no existe
    }
    

    
}
package com.zelev.zelevbe.domain.service;


import com.zelev.zelevbe.persistence.entity.Categoria;
import com.zelev.zelevbe.persistence.entity.Articulo.ArtiCate;
import com.zelev.zelevbe.persistence.entity.Articulo.Articulo;
import com.zelev.zelevbe.persistence.repository.ArticuloRepository;
import com.zelev.zelevbe.persistence.repository.CategoriaRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoriaService {

    @Autowired private CategoriaRepository categoriaRepository;
    @Autowired private ArticuloRepository articuloRepository;

    public List<Categoria> listarTodos() {
        return categoriaRepository.findAll();
    }

    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id).orElse(null);
    }

    public Categoria crearCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public Categoria actualizarCategoria(Long id, Categoria nuevaCategoria) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Categoría con id " + id + " no encontrada"));
    
        // Asigna los nuevos valores solo si nuevaCategoria no es nulo
        if (nuevaCategoria != null) {
            categoria.setSubcategoria(nuevaCategoria.getSubcategoria());
            categoria.setCategoria(nuevaCategoria.getCategoria());
        }
    
        return categoriaRepository.save(categoria);
    }
    

    public void eliminarCategoria(Long id) {
        categoriaRepository.deleteById(id);
    }

    public Set<ArtiCate> obtenerArticulosDeCategoria(Long idCategoria) {
        Categoria categoria = buscarPorId(idCategoria);
        return categoria != null ? categoria.getArticulos() : null;
    }
    public List<Articulo> obtenerArticulosPorCategoria(Long id) {
        Categoria categoria = buscarPorId(id);
        if (categoria == null) return new ArrayList<>();
    
        return categoria.getArticulos()
                        .stream()
                        .map(ArtiCate::getArticulo)  // Extraer artículos de la relación
                        .distinct()  // Filtrar duplicados
                        .collect(Collectors.toList());
    }
    
}
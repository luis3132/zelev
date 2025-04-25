package com.zelev.zelevbe.domain.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zelev.zelevbe.domain.dto.CategoriaCreateDTO;
import com.zelev.zelevbe.domain.service.interfaces.ICategoriaService;
import com.zelev.zelevbe.persistence.entity.Categoria.Categoria;
import com.zelev.zelevbe.persistence.repository.Categoria.CategoriaRepository;

import jakarta.transaction.Transactional;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Service
@Transactional
public class CategoriaService implements ICategoriaService {
    
    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    public List<Categoria> findAllBySubcategoria(String categoria) {
        return categoriaRepository.findAllBySubcategoria(categoria);
    }

    @Override
    public List<Categoria> findAllByCategoria() {
        return categoriaRepository.findAllByCategoria();
    }

    @Override
    public Optional<Categoria> findById(Integer id) {
        return categoriaRepository.findById(id);
    }

    @Override
    public Categoria save(CategoriaCreateDTO categoria) {
        return categoriaRepository.save(mapToEntity(categoria));
    }

    @Override
    public Categoria update(Categoria categoria) {
        Optional<Categoria> existingCategoria = categoriaRepository.findById(categoria.getIdCategoria());
        if (existingCategoria.isPresent()) {
            Categoria updatedCategoria = existingCategoria.get();

            if (categoria.getSubcategoria() == "" || categoria.getSubcategoria() == null) {
                List<Categoria> subcategorias = categoriaRepository.findAllBySubcategoria(updatedCategoria.getCategoria());
                List<Categoria> subcategoriasToUpdate = subcategorias.stream()
                        .map(subcategoria -> {
                            subcategoria.setCategoria(categoria.getCategoria());
                            return subcategoria;
                        })
                        .toList();
                categoriaRepository.saveAll(subcategoriasToUpdate);
            }

            updatedCategoria.setCategoria(categoria.getCategoria());
            updatedCategoria.setSubcategoria(categoria.getSubcategoria());
            return categoriaRepository.save(updatedCategoria);
        }
        return null;
    }

    @Override
    public Boolean deleteById(Integer id) {
        Optional<Categoria> categoria = categoriaRepository.findById(id);
        if (categoria.isPresent()) {
            categoriaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private Categoria mapToEntity(CategoriaCreateDTO categoria) {
        Categoria entity = new Categoria();
        entity.setCategoria(categoria.getCategoria());
        entity.setSubcategoria(categoria.getSubcategoria());
        return entity;
    }
}

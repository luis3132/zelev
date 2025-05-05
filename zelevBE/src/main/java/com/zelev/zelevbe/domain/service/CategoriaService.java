package com.zelev.zelevbe.domain.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.zelev.zelevbe.domain.dto.CategoriaCreateDTO;
import com.zelev.zelevbe.domain.service.interfaces.ICategoriaService;
import com.zelev.zelevbe.persistence.entity.Articulo;
import com.zelev.zelevbe.persistence.entity.Categoria.ArtiCate;
import com.zelev.zelevbe.persistence.entity.Categoria.ArtiCatePK;
import com.zelev.zelevbe.persistence.entity.Categoria.Categoria;
import com.zelev.zelevbe.persistence.repository.Categoria.ArtiCateRepository;
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

    @Autowired
    private ArtiCateRepository artiCateRepository;

    @Autowired
    @Lazy
    private ArticuloService articuloService;

    @Override
    public List<Categoria> findAll() {
        return categoriaRepository.findAll();
    }

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

    @Override
    public Optional<ArtiCate> findByIdArtiCate(ArtiCatePK id) {
        return artiCateRepository.findById(id);
    }

    @Override
    public ArtiCate saveArtiCate(ArtiCatePK id) {
        ArtiCate artiCate = new ArtiCate();
        artiCate.setId(id);

        Optional<Categoria> categoria = categoriaRepository.findById(id.getCategoria());
        if (!categoria.isPresent()) {
            return null;
        }
        Optional<Articulo> articulo = articuloService.findByIdArticulo(id.getArticulo());
        if (!articulo.isPresent()) {
            return null;
        }
        artiCate.setArticulo(articulo.get());
        artiCate.setCategoria(categoria.get());
        return artiCateRepository.save(artiCate);
    }

    @Override
    public Boolean deleteByIdArtiCate(ArtiCatePK id) {
        Optional<ArtiCate> artiCate = artiCateRepository.findById(id);
        if (artiCate.isPresent()) {
            artiCateRepository.deleteById(id);
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

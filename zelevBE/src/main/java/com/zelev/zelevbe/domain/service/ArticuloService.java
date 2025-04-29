package com.zelev.zelevbe.domain.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.zelev.zelevbe.constants.EstadoArticulo;
import com.zelev.zelevbe.constants.EstadoUnidad;
import com.zelev.zelevbe.domain.dto.articulo.ArticuloCreateDTO;
import com.zelev.zelevbe.domain.dto.articulo.ArticuloListDTO;
import com.zelev.zelevbe.domain.dto.articulo.UnidadCreateDTO;
import com.zelev.zelevbe.domain.service.interfaces.IArticuloService;
import com.zelev.zelevbe.persistence.entity.Articulo;
import com.zelev.zelevbe.persistence.entity.Unidad;
import com.zelev.zelevbe.persistence.entity.Categoria.ArtiCatePK;
import com.zelev.zelevbe.persistence.entity.Categoria.Categoria;
import com.zelev.zelevbe.persistence.repository.ArticuloRepository;
import com.zelev.zelevbe.persistence.repository.UnidadRepository;

import jakarta.transaction.Transactional;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Service
@Transactional
public class ArticuloService implements IArticuloService {
    
    @Autowired
    private ArticuloRepository articuloRepository;

    @Autowired
    private UnidadRepository unidadRepository;

    @Autowired
    @Lazy
    private CategoriaService categoriaService;

    @Override
    public List<ArticuloListDTO> findAllArticulos(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Articulo> articulos = articuloRepository.findAll(pageable).getContent();

        return articulos.stream()
                .map(this::mapArticuloList)
                .toList();
    }

    @Override
    public Optional<Articulo> findByIdArticulo(Integer id) {
        return articuloRepository.findById(id);
    }

    @Override
    public Articulo saveArticulo(ArticuloCreateDTO articulo) {
        Articulo temp = articuloRepository.save(mapArticulo(articulo));

        articulo.getUnidades().forEach(unidad -> {
            saveUnidad(unidad);
        });

        articulo.getCategorias().forEach(categoria -> {
            ArtiCatePK artiCatePK = new ArtiCatePK();
            artiCatePK.setArticulo(temp.getIdArticulo());
            artiCatePK.setCategoria(categoria);
            
            categoriaService.saveArtiCate(artiCatePK);
        });

        return temp;
    }

    @Override
    public Articulo updateArticulo(Articulo articulo) {
        return articuloRepository.save(articulo);
    }

    @Override
    public Boolean deleteArticulo(Integer id) {
        Optional<Articulo> articulo = findByIdArticulo(id);
        if (articulo.isPresent()) {
            Articulo articuloToDelete = articulo.get();
            articuloToDelete.setEstado(EstadoArticulo.NOACTIVO);
            articuloRepository.save(articuloToDelete);
            return true;
        }
        return false;
    }

    @Override
    public Optional<Unidad> findByIdUnidad(Long id) {
        return unidadRepository.findById(id);
    }

    @Override
    public Unidad saveUnidad(UnidadCreateDTO unidad) {
        return unidadRepository.save(mapUnidad(unidad));
    }

    @Override
    public Unidad updateUnidad(Unidad unidad) {
        return unidadRepository.save(unidad);
    }

    @Override
    public Boolean deleteUnidad(Long id) {
        Optional<Unidad> unidad = findByIdUnidad(id);
        if (unidad.isPresent()) {
            Unidad unidadToDelete = unidad.get();
            unidadToDelete.setEstado(EstadoUnidad.NOSTOCK);
            unidadRepository.save(unidadToDelete);
            return true;
        }
        return false;
    }

    private Articulo mapArticulo(ArticuloCreateDTO articulo) {
        Articulo articuloEntity = new Articulo();
        articuloEntity.setNombre(articulo.getNombre());
        articuloEntity.setDescripcion(articulo.getDescripcion());
        articuloEntity.setImpuesto(articulo.getImpuesto());
        articuloEntity.setEstado(EstadoArticulo.ACTIVO);
        return articuloEntity;
    }

    private ArticuloListDTO mapArticuloList(Articulo articulo) {
        ArticuloListDTO articuloListDTO = new ArticuloListDTO();
        articuloListDTO.setIdArticulo(articulo.getIdArticulo());
        articuloListDTO.setNombre(articulo.getNombre());
        articuloListDTO.setDescripcion(articulo.getDescripcion());
        articuloListDTO.setImpuesto(articulo.getImpuesto());
        articuloListDTO.setEstado(articulo.getEstado().toString());

        List<Categoria> categorias = articulo.getCategorias().stream()
                .map(artiCate -> artiCate.getCategoria())
                .toList();

        articuloListDTO.setCategorias(categorias);

        List<Unidad> unidades = articulo.getUnidades().stream()
                .filter(unidad -> unidad.getEstado() == EstadoUnidad.STOCK)
                .toList();
        articuloListDTO.setUnidades(unidades);

        return articuloListDTO;
    }

    private Unidad mapUnidad(UnidadCreateDTO unidad) {
        Unidad unidadEntity = new Unidad();
        unidadEntity.setUpc(unidad.getUpc());
        unidadEntity.setLabel(unidad.getLabel());
        unidadEntity.setPrecio(unidad.getPrecio());

        Optional<Articulo> articulo = findByIdArticulo(unidad.getArticulo());
        if (articulo.isPresent()) {
            unidadEntity.setArticulo(articulo.get());
        } else {
            throw new RuntimeException("Articulo not found");
        }

        unidadEntity.setCantidad(unidad.getCantidad());
        unidadEntity.setEstado(EstadoUnidad.STOCK);
        return unidadEntity;
    }

}

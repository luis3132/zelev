package com.zelev.zelevbe.domain.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.zelev.zelevbe.constants.EstadoArticulo;
import com.zelev.zelevbe.constants.EstadoUnidad;
import com.zelev.zelevbe.domain.dto.Imagen.ImgArtUniCreateDTO;
import com.zelev.zelevbe.domain.dto.articulo.ArticuloCreateDTO;
import com.zelev.zelevbe.domain.dto.articulo.ArticuloListDTO;
import com.zelev.zelevbe.domain.dto.articulo.ArticuloUpdateDTO;
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

    @Autowired
    @Lazy
    private ImagenService imagenService;

    @Override
    public List<ArticuloListDTO> findAllArticulos(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Articulo> articulos = articuloRepository.findAll(pageable).getContent();

        return articulos.stream()
                .map(articulo -> this.mapArticuloList(articulo, false))
                .toList();
    }

    @Override
    public List<ArticuloListDTO> findAllArticulosByCategorie(Integer id, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Articulo> articulos = articuloRepository.findByCategoria(id, pageable).getContent();

        return articulos.stream()
                .map(articulo -> this.mapArticuloList(articulo, false))
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
            unidad.setArticulo(temp.getIdArticulo());
            saveUnidad(unidad);
        });

        articulo.getCategorias().forEach(categoria -> {
            ArtiCatePK artiCatePK = new ArtiCatePK();
            artiCatePK.setArticulo(temp.getIdArticulo());
            artiCatePK.setCategoria(categoria);

            categoriaService.saveArtiCate(artiCatePK);
        });

        if (articulo.getImagen() != null) {
            ImgArtUniCreateDTO imgArtUni = articulo.getImagen();
            imgArtUni.setArticulo(temp.getIdArticulo());

            imagenService.saveImgArtUni(imgArtUni);
        }

        return temp;
    }

    @Override
    public Articulo updateArticulo(ArticuloUpdateDTO articulo) {
        Articulo temp = articuloRepository.save(mapArticulo(articulo));

        if (articulo.getImagen() != null) {
            ImgArtUniCreateDTO imgArtUni = articulo.getImagen();
            imgArtUni.setArticulo(temp.getIdArticulo());

            imagenService.saveImgArtUni(imgArtUni);
        }

        return temp;
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
        Optional<Unidad> unidadEntity = findByIdUnidad(unidad.getUpc());
        if (unidadEntity.isPresent()) {
            return null;
        } else {
            Unidad temp = unidadRepository.save(mapUnidad(unidad, null));
            if (unidad.getImagen() != null) {
                ImgArtUniCreateDTO imgArtUni = unidad.getImagen();
                imgArtUni.setUnidad(temp.getUpc());
                imgArtUni.setArticulo(temp.getArticulo().getIdArticulo());

                imagenService.saveImgArtUni(imgArtUni);
            }
            return temp;
        }
    }

    @Override
    public Unidad updateUnidad(UnidadCreateDTO unidad) {
        Unidad unidadEntity = findByIdUnidad(unidad.getUpc())
                .orElseThrow(() -> new RuntimeException("Unidad not found"));
        Unidad temp = unidadRepository.save(mapUnidad(unidad, unidadEntity));

        if (unidad.getImagen() != null) {
            ImgArtUniCreateDTO imgArtUni = unidad.getImagen();
            imgArtUni.setUnidad(temp.getUpc());
            imgArtUni.setArticulo(temp.getArticulo().getIdArticulo());

            imagenService.saveImgArtUni(imgArtUni);
        }

        return temp;
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

    private Articulo mapArticulo(ArticuloUpdateDTO articulo) {
        Articulo articuloEntity = new Articulo();
        articuloEntity.setIdArticulo(articulo.getIdArticulo());
        articuloEntity.setNombre(articulo.getNombre());
        articuloEntity.setDescripcion(articulo.getDescripcion());
        articuloEntity.setImpuesto(articulo.getImpuesto());
        articuloEntity.setEstado(articulo.getEstado());

        if (articulo.getCategoriasNuevas() != null) {
            articulo.getCategoriasNuevas().forEach(categoria -> {
                ArtiCatePK artiCatePK = new ArtiCatePK();
                artiCatePK.setArticulo(articulo.getIdArticulo());
                artiCatePK.setCategoria(categoria);

                categoriaService.saveArtiCate(artiCatePK);
            });
        }

        if (articulo.getCategoriasEliminar() != null) {
            articulo.getCategoriasEliminar().forEach(categoria -> {
                ArtiCatePK artiCatePK = new ArtiCatePK();
                artiCatePK.setArticulo(articulo.getIdArticulo());
                artiCatePK.setCategoria(categoria);

                categoriaService.deleteByIdArtiCate(artiCatePK);
            });
        }

        if (articulo.getUnidades() != null) {
            articulo.getUnidades().forEach(unidad -> {
                if (unidad.getUpc() != null) {
                    Optional<Unidad> unidadEntity = findByIdUnidad(unidad.getUpc());
                    if (!unidadEntity.isPresent()) {
                        saveUnidad(unidad);
                    }
                }
            });
        }

        return articuloEntity;
    }

    public ArticuloListDTO mapArticuloList(Articulo articulo, Boolean admin) {
        ArticuloListDTO articuloListDTO = new ArticuloListDTO();
        articuloListDTO.setIdArticulo(articulo.getIdArticulo());
        articuloListDTO.setNombre(articulo.getNombre());
        articuloListDTO.setDescripcion(articulo.getDescripcion());
        articuloListDTO.setImpuesto(articulo.getImpuesto());
        articuloListDTO.setEstado(articulo.getEstado().toString());
        articuloListDTO.setImagenes(articulo.getImagenes());

        List<Categoria> categorias = articulo.getCategorias().stream()
                .map(artiCate -> artiCate.getCategoria())
                .toList();

        articuloListDTO.setCategorias(categorias);

        List<Unidad> unidades = articulo.getUnidades().stream()
                .filter(unidad -> {
                    if (admin) {
                        return true;
                    } else {
                        return unidad.getEstado() == EstadoUnidad.STOCK;
                    }
                })
                .toList();
        articuloListDTO.setUnidades(unidades);

        return articuloListDTO;
    }

    private Unidad mapUnidad(UnidadCreateDTO unidad, Unidad init) {
        Unidad unidadEntity = init != null ? init : new Unidad();
        unidadEntity.setUpc(unidad.getUpc());
        unidadEntity.setLabel(unidad.getLabel());
        unidadEntity.setPrecio(unidad.getPrecio());
        unidadEntity.setCantidad(unidad.getCantidad());
        unidadEntity.setDescripcion(unidad.getDescripcion());

        if (unidadEntity.getFechaCreacion() == null) {
            unidadEntity.setFechaCreacion(new Date());
        } else {
            unidadEntity.setFechaCreacion(unidadEntity.getFechaCreacion());
        }

        Optional<Articulo> articulo = findByIdArticulo(unidad.getArticulo());
        if (articulo.isPresent()) {
            unidadEntity.setArticulo(articulo.get());
        } else {
            throw new RuntimeException("Articulo not found");
        }

        unidadEntity.setEstado(unidad.getEstado());

        return unidadEntity;
    }

}

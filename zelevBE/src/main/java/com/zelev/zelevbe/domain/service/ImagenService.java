package com.zelev.zelevbe.domain.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.zelev.zelevbe.domain.dto.Imagen.ImagenCreateDTO;
import com.zelev.zelevbe.domain.dto.Imagen.ImgArtUniCreateDTO;
import com.zelev.zelevbe.domain.service.interfaces.IImagenService;
import com.zelev.zelevbe.persistence.entity.Articulo;
import com.zelev.zelevbe.persistence.entity.Unidad;
import com.zelev.zelevbe.persistence.entity.imagen.Imagen;
import com.zelev.zelevbe.persistence.entity.imagen.ImgArtUni;
import com.zelev.zelevbe.persistence.repository.imagen.ImagenRepository;
import com.zelev.zelevbe.persistence.repository.imagen.ImgArtUniRepository;

import jakarta.transaction.Transactional;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Service
@Transactional
public class ImagenService implements IImagenService {

    @Autowired
    private ImagenRepository imagenRepository;

    @Autowired
    private ImgArtUniRepository imgArtUniRepository;

    @Autowired
    @Lazy
    private ArticuloService articuloService;

    @Override
    public Optional<Imagen> findById(Integer id) {
        return imagenRepository.findById(id);
    }

    @Override
    public Imagen save(ImagenCreateDTO imagen) {
        return imagenRepository.save(convertDTOtoEntity(imagen));
    }

    @Override
    public Imagen update(Imagen imagen) {
        Optional<Imagen> imagenOptional = imagenRepository.findById(imagen.getIdImagen());
        if (imagenOptional.isPresent()) {
            Imagen imagenEntity = imagenOptional.get();
            imagenEntity.setAlt(imagen.getAlt());
            imagenEntity.setUrl(imagen.getUrl());
            return imagenRepository.save(imagenEntity);
        }
        return null;
    }

    @Override
    public Boolean delete(Integer id) {
        Optional<Imagen> imagenOptional = imagenRepository.findById(id);
        if (imagenOptional.isPresent()) {
            imagenRepository.delete(imagenOptional.get());
            return true;
        }
        return false;
    }

    @Override
    public Optional<ImgArtUni> findByIdImgArtUni(Integer id) {
        return imgArtUniRepository.findById(id);
    }

    @Override
    public ImgArtUni saveImgArtUni(ImgArtUniCreateDTO imgArtUni) {
        return imgArtUniRepository.save(convertDTOtoEntity(imgArtUni));
    }

    @Override
    public ImgArtUni updateImgArtUni(ImgArtUni imgArtUni) {
        Optional<ImgArtUni> imgArtUniOptional = imgArtUniRepository.findById(imgArtUni.getIdImgArtUni());
        if (imgArtUniOptional.isPresent()) {
            ImgArtUni imgArtUniEntity = imgArtUniOptional.get();
            imgArtUniEntity.setArticulo(imgArtUni.getArticulo());
            imgArtUniEntity.setUnidad(imgArtUni.getUnidad());
            imgArtUniEntity.setImagen(imgArtUni.getImagen());
            return imgArtUniRepository.save(imgArtUniEntity);
        }
        return null;
    }

    @Override
    public Boolean deleteImgArtUni(Integer id) {
        Optional<ImgArtUni> imgArtUniOptional = imgArtUniRepository.findById(id);
        if (imgArtUniOptional.isPresent()) {
            imgArtUniRepository.delete(imgArtUniOptional.get());
            return true;
        }
        return false;
    }

    private Imagen convertDTOtoEntity(ImagenCreateDTO imagen) {
        Imagen imagenEntity = new Imagen();
        imagenEntity.setAlt(imagen.getAlt());
        imagenEntity.setUrl(imagen.getUrl());
        return imagenEntity;
    }

    private ImgArtUni convertDTOtoEntity(ImgArtUniCreateDTO imgArtUni) {
        ImgArtUni imgArtUniEntity = new ImgArtUni();

        Optional<Articulo> articuloOptional = articuloService.findByIdArticulo(imgArtUni.getArticulo());
        if (articuloOptional.isPresent()) {
            imgArtUniEntity.setArticulo(articuloOptional.get());
        } else {
            throw new RuntimeException("Articulo not found");
        }

        Optional<Imagen> imagenOptional = findById(imgArtUni.getImagen());
        if (imagenOptional.isPresent()) {
            imgArtUniEntity.setImagen(imagenOptional.get());
        } else {
            throw new RuntimeException("Imagen not found");
        }

        if (imgArtUni.getUnidad() != null) {
            Optional<Unidad> unidadOptional = articuloService.findByIdUnidad(imgArtUni.getUnidad());
            if (unidadOptional.isPresent()) {
                imgArtUniEntity.setUnidad(unidadOptional.get());
            } else {
                throw new RuntimeException("Unidad not found");
            }
        } else {
            System.out.println("Warning: Unidad not found");
        }

        return imgArtUniEntity;
    }
}

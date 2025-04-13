package com.zelev.zelevbe.domain.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zelev.zelevbe.domain.dto.Imagen.ImagenCreateDTO;
import com.zelev.zelevbe.domain.service.interfaces.IImagenService;
import com.zelev.zelevbe.persistence.entity.imagen.Imagen;
import com.zelev.zelevbe.persistence.repository.imagen.ImagenRepository;

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

    private Imagen convertDTOtoEntity(ImagenCreateDTO imagen) {
        Imagen imagenEntity = new Imagen();
        imagenEntity.setAlt(imagen.getAlt());
        imagenEntity.setUrl(imagen.getUrl());
        return imagenEntity;
    }
}

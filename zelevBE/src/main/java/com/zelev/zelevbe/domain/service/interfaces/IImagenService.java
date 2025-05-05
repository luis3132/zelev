package com.zelev.zelevbe.domain.service.interfaces;

import java.util.Optional;

import com.zelev.zelevbe.domain.dto.Imagen.ImagenCreateDTO;
import com.zelev.zelevbe.domain.dto.Imagen.ImgArtUniCreateDTO;
import com.zelev.zelevbe.persistence.entity.imagen.Imagen;
import com.zelev.zelevbe.persistence.entity.imagen.ImgArtUni;

public interface IImagenService {
    Optional<Imagen> findById(Integer id);
    Imagen save(ImagenCreateDTO imagen);
    Boolean delete(Integer id);
    Imagen update(Imagen imagen);
    Optional<ImgArtUni> findByIdImgArtUni(Integer id);
    ImgArtUni saveImgArtUni(ImgArtUniCreateDTO imgArtUni);
    Boolean deleteImgArtUni(Integer id);
    ImgArtUni updateImgArtUni(ImgArtUni imgArtUni);
}

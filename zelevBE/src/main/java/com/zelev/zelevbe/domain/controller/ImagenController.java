package com.zelev.zelevbe.domain.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.zelev.zelevbe.domain.dto.Imagen.ImagenCreateDTO;
import com.zelev.zelevbe.domain.service.ImagenService;
import com.zelev.zelevbe.persistence.entity.imagen.Imagen;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/imagen")
public class ImagenController {

    private final String UPLOAD_DIR = "./uploads/";

    @Autowired
    private ImagenService imagenService;

    // Subir imagen
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, path = "/upload")
    public ResponseEntity<Imagen> uploadImage(@RequestParam("imagen") MultipartFile file,
            @RequestParam("ruta") String ruta,
            @RequestParam("existe") String existe) {
        try {

            // Validar que el archivo no esté vacío
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            // Crear directorio si no existe
            Path uploadPath = Paths.get(UPLOAD_DIR + ruta + "/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Validar que es una imagen
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().build();
            }

            // Generar nombre único
            String nullableFilename = file.getOriginalFilename();
            if (nullableFilename == null) {
                return ResponseEntity.badRequest().build();
            }

            Path destinationFile;
            if (!existe.equals("false")) {
                Integer id = Integer.parseInt(existe);
                Imagen imagen = imagenService.findById(id).get();
                destinationFile = Paths.get(imagen.getUrl());
            } else {
                String originalFilename = StringUtils.cleanPath(nullableFilename);
                String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
                String filename = UUID.randomUUID() + extension;

                destinationFile = uploadPath.resolve(filename);
            }

            // Guardar archivo
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            ImagenCreateDTO imagenDto = new ImagenCreateDTO();
            imagenDto.setUrl(destinationFile.toString());
            imagenDto.setAlt("Imagen de usuario");

            // Guardar en la base de datos

            return ResponseEntity.ok(imagenService.save(imagenDto));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
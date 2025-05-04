package com.zelev.zelevbe.domain.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zelev.zelevbe.domain.dto.articulo.ArticuloCreateDTO;
import com.zelev.zelevbe.domain.dto.articulo.ArticuloListDTO;
import com.zelev.zelevbe.domain.dto.articulo.ArticuloUpdateDTO;
import com.zelev.zelevbe.domain.dto.articulo.UnidadCreateDTO;
import com.zelev.zelevbe.domain.service.ArticuloService;
import com.zelev.zelevbe.persistence.entity.Articulo;
import com.zelev.zelevbe.persistence.entity.Unidad;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@RestController
@RequestMapping("/api")
public class ArticuloController {
    
    @Autowired
    private ArticuloService articuloService;

    @GetMapping("/articulo/list/{page}/{size}")
    public ResponseEntity<List<ArticuloListDTO>> listAllArticulo(@PathVariable("page") Integer page, @PathVariable("size") Integer size) {
        if (page == null || size == null) {
            return ResponseEntity.badRequest().build();
        }
        if (page < 0 || size <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(articuloService.findAllArticulos(page, size));
    }

    @GetMapping("/articulo/{categoria}/list/{page}/{size}")
    public ResponseEntity<List<ArticuloListDTO>> listAllArticuloByCategorie(@PathVariable("categoria") Integer categoria, @PathVariable("page") Integer page, @PathVariable("size") Integer size) {
        if (page == null || size == null) {
            return ResponseEntity.badRequest().build();
        }
        if (page < 0 || size <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(articuloService.findAllArticulosByCategorie(categoria, page, size));
    }
    
    @GetMapping("/articulo/{id}")
    public ResponseEntity<ArticuloListDTO> findArticulo(@PathVariable("id") Integer id) {
        Optional<Articulo> articulo = articuloService.findByIdArticulo(id);
        if (articulo.isPresent()) {
            return ResponseEntity.ok(articuloService.mapArticuloList(articulo.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/articulo/new")
    @Secured({"ADMIN", "INVENTARIO"})
    public ResponseEntity<Articulo> createArticulo(@RequestBody ArticuloCreateDTO articuloCreateDTO) {
        return ResponseEntity.ok(articuloService.saveArticulo(articuloCreateDTO));
    }

    @PostMapping("/articulo/update")
    @Secured({"ADMIN", "INVENTARIO"})
    public ResponseEntity<Articulo> updateArticulo(@RequestBody ArticuloUpdateDTO articulo) {
        return ResponseEntity.ok(articuloService.updateArticulo(articulo));
    }
    
    @PostMapping("/articulo/delete/{id}")
    @Secured({"ADMIN", "INVENTARIO"})
    public ResponseEntity<Boolean> deleteArticulo(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(articuloService.deleteArticulo(id));
    }

    @PostMapping("/unidad/new")
    @Secured({"ADMIN", "INVENTARIO"})
    public ResponseEntity<Unidad> createUnidad(@RequestBody UnidadCreateDTO unidad) {
        Unidad temp = articuloService.saveUnidad(unidad);
        if (temp == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(temp);
    }
    
    @PutMapping("/unidad/{id}")
    @Secured({"ADMIN", "INVENTARIO"})
    public ResponseEntity<Unidad> updateUnidad(@RequestBody UnidadCreateDTO unidad) {
        return ResponseEntity.ok(articuloService.updateUnidad(unidad));
    }

    @DeleteMapping("/unidad/delete/{id}")
    @Secured({"ADMIN", "INVENTARIO"})
    public ResponseEntity<Boolean> deleteUnidad(@PathVariable("id") Long id) {
        return ResponseEntity.ok(articuloService.deleteUnidad(id));
    }

}

package com.zelev.zelevbe.domain.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zelev.zelevbe.domain.dto.articulo.ArticuloCreateDTO;
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

    @GetMapping("/articulo/list")
    public ResponseEntity<List<Articulo>> listAllArticulo() {
        return ResponseEntity.ok(articuloService.findAllArticulos());
    }
    
    @GetMapping("/articulo/{id}")
    public ResponseEntity<Articulo> findArticulo(@PathVariable("id") Integer id) {
        Optional<Articulo> articulo = articuloService.findByIdArticulo(id);
        if (articulo.isPresent()) {
            return ResponseEntity.ok(articulo.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/articulo/new")
    @Secured("ADMIN")
    public ResponseEntity<Articulo> createArticulo(@RequestBody ArticuloCreateDTO articuloCreateDTO) {
        return ResponseEntity.ok(articuloService.saveArticulo(articuloCreateDTO));
    }

    @PostMapping("/articulo/update")
    @Secured("ADMIN")
    public ResponseEntity<Articulo> updateArticulo(@RequestBody Articulo articulo) {
        return ResponseEntity.ok(articuloService.updateArticulo(articulo));
    }
    
    @PostMapping("/articulo/delete/{id}")
    @Secured("ADMIN")
    public ResponseEntity<Boolean> deleteArticulo(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(articuloService.deleteArticulo(id));
    }

    @PostMapping("/unidad/new")
    @Secured("ADMIN")
    public ResponseEntity<Unidad> createUnidad(@RequestBody UnidadCreateDTO unidad) {
        return ResponseEntity.ok(articuloService.saveUnidad(unidad));
    }
    
    @PutMapping("/unidad/{id}")
    @Secured("ADMIN")
    public ResponseEntity<Unidad> updateUnidad(@RequestBody Unidad unidad) {
        return ResponseEntity.ok(articuloService.updateUnidad(unidad));
    }

    @DeleteMapping("/unidad/delete/{id}")
    @Secured("ADMIN")
    public ResponseEntity<Boolean> deleteUnidad(@PathVariable("id") Long id) {
        return ResponseEntity.ok(articuloService.deleteUnidad(id));
    }

}

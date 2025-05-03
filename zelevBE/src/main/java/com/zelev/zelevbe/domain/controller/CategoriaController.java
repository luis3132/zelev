package com.zelev.zelevbe.domain.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zelev.zelevbe.domain.dto.CategoriaCreateDTO;
import com.zelev.zelevbe.domain.service.CategoriaService;
import com.zelev.zelevbe.persistence.entity.Categoria.Categoria;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@RestController
@RequestMapping("/api/categoria")
public class CategoriaController {
    
    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/list")
    public ResponseEntity<List<Categoria>> listAllCategoria() {
        return ResponseEntity.ok(categoriaService.findAll());
    }

    @GetMapping("/list/{categoria}")
    public ResponseEntity<List<Categoria>> findAllBySubcategoria(@PathVariable("categoria") String categoria) {
        return ResponseEntity.ok(categoriaService.findAllBySubcategoria(categoria));
    }

    @GetMapping("/list/categoria")
    public ResponseEntity<List<Categoria>> findAllByCategoria() {
        return ResponseEntity.ok(categoriaService.findAllByCategoria());
    }

    @PostMapping("/new")
    @Secured({"ADMIN", "INVENTARIO"})
    public ResponseEntity<String> createCategoria(@RequestBody CategoriaCreateDTO categoria) {
        Categoria newCategoria = categoriaService.save(categoria);
        if (newCategoria != null) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(400).build();
        }
    }

    @PutMapping("/update")
    @Secured({"ADMIN", "INVENTARIO"})
    public ResponseEntity<String> updateCategoria(@RequestBody Categoria categoria) {
        Categoria updatedCategoria = categoriaService.update(categoria);
        if (updatedCategoria != null) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(400).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    @Secured({"ADMIN", "INVENTARIO"})
    public ResponseEntity<String> deleteCategoria(@PathVariable("id") Integer id) {
        Boolean deleted = categoriaService.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(400).build();
        }
    }
    
}

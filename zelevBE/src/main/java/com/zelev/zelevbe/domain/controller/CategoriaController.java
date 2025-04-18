package com.zelev.zelevbe.domain.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.zelev.zelevbe.domain.service.CategoriaService;
import com.zelev.zelevbe.persistence.entity.Categoria;
import com.zelev.zelevbe.persistence.entity.Articulo.Articulo;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    // Obtener todas las categorías
    @GetMapping
    public ResponseEntity<List<Categoria>> listarCategorias() {
        return new ResponseEntity<>(categoriaService.listarTodos(), HttpStatus.OK);
    }

    // Obtener categoría por ID
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerCategoria(@PathVariable Long id) {
        Categoria categoria = categoriaService.buscarPorId(id);
        return categoria != null ? 
            new ResponseEntity<>(categoria, HttpStatus.OK) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Crear nueva categoría
    @PostMapping
    public ResponseEntity<Categoria> crearCategoria(@RequestBody Categoria categoria) {
        return new ResponseEntity<>(categoriaService.crearCategoria(categoria), HttpStatus.CREATED);
    }

    // Actualizar categoría
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizarCategoria(
            @PathVariable Long id, 
            @RequestBody Categoria categoria) {
        if (!categoria.getId().equals(id)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(categoriaService.actualizarCategoria(id, categoria), HttpStatus.OK);
               

    }

    // Obtener artículos de una categoría
    @GetMapping("/{id}/articulos")
    public ResponseEntity<List<Articulo>> obtenerArticulosDeCategoria(@PathVariable Long id) {
        List<Articulo> articulos = categoriaService.obtenerArticulosPorCategoria(id);
        return new ResponseEntity<>(articulos, HttpStatus.OK);
    }

    // Eliminar categoría
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Long id) {
        categoriaService.eliminarCategoria(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
}
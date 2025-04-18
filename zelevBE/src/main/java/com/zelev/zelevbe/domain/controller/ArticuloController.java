package com.zelev.zelevbe.domain.controller;

import com.zelev.zelevbe.domain.service.ArticuloService;
import com.zelev.zelevbe.persistence.entity.Categoria;
import com.zelev.zelevbe.persistence.entity.Articulo.Articulo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {

    @Autowired
    private ArticuloService articuloService;

    // Obtener todos los artículos
    @GetMapping
    public ResponseEntity<List<Articulo>> listarArticulos() {
        return new ResponseEntity<>(articuloService.listarTodos(), HttpStatus.OK);
    }

    // Obtener artículo por ID
    @GetMapping("/{id}")
    public ResponseEntity<Articulo> obtenerArticulo(@PathVariable Long id) {
        Articulo articulo = articuloService.buscarPorId(id);
        return articulo != null ? 
            new ResponseEntity<>(articulo, HttpStatus.OK) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Crear nuevo artículo
    @PostMapping
    public ResponseEntity<Articulo> crearArticulo(@RequestBody Articulo articulo) {
        return new ResponseEntity<>(articuloService.crearArticulo(articulo), HttpStatus.CREATED);
    }

    // Actualizar artículo
    @PutMapping("/{id}")
    public ResponseEntity<Articulo> actualizarArticulo(
            @PathVariable Long id, 
            @RequestBody Articulo articulo) {
        if (!articulo.getId().equals(id)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(articuloService.actualizarArticulo(articulo), HttpStatus.OK);
    }

    // Obtener categorías de un artículo
    @GetMapping("/{id}/categorias")
    public ResponseEntity<List<Categoria>> obtenerCategoriasDeArticulo(@PathVariable Long id) {
        List<Categoria> categorias = articuloService.obtenerCategoriasPorArticulo(id);
        return new ResponseEntity<>(categorias, HttpStatus.OK);
    }

    // Agregar categoría a artículo
    @PostMapping("/{idArticulo}/categorias/{idCategoria}")
    public ResponseEntity<Void> agregarCategoriaAArticulo(
            @PathVariable Long idArticulo, 
            @PathVariable Long idCategoria) {
        boolean resultado = articuloService.agregarCategoriaAArticulo(idArticulo, idCategoria);
        return resultado ? 
            new ResponseEntity<>(HttpStatus.CREATED) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
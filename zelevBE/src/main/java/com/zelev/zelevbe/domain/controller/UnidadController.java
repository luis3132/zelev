package com.zelev.zelevbe.domain.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.zelev.zelevbe.domain.service.UnidadService;
import com.zelev.zelevbe.persistence.entity.Unidad;
import com.zelev.zelevbe.persistence.entity.Articulo.Articulo;

import java.util.List;

@RestController
@RequestMapping("/api/unidades")
public class UnidadController {

    @Autowired
    private UnidadService unidadService;

    // Obtener todas las unidades
    @GetMapping
    public ResponseEntity<List<Unidad>> listarUnidades() {
        return new ResponseEntity<>(unidadService.listarTodos(), HttpStatus.OK);
    }

    // Obtener unidad por UPC
    @GetMapping("/{upc}")
    public ResponseEntity<Unidad> obtenerUnidad(@PathVariable String upc) {
        Unidad unidad = unidadService.buscarPorUpc(upc);
        return unidad != null ? 
            new ResponseEntity<>(unidad, HttpStatus.OK) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Crear nueva unidad
    @PostMapping
    public ResponseEntity<Unidad> crearUnidad(@RequestBody Unidad unidad) {
        return new ResponseEntity<>(unidadService.crearUnidad(unidad), HttpStatus.CREATED);
    }

    // Actualizar unidad
    @PutMapping("/{upc}")
    public ResponseEntity<Unidad> actualizarUnidad(
            @PathVariable String upc, 
            @RequestBody Unidad unidad) {
        if (!unidad.getUpc().equals(upc)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(unidadService.actualizarUnidad(unidad), HttpStatus.OK);
    }

    // Cambiar estado de unidad
    @PatchMapping("/{upc}/estado")
    public ResponseEntity<Unidad> cambiarEstadoUnidad(
            @PathVariable String upc, 
            @RequestParam String estado) {
        Unidad unidad = unidadService.cambiarEstado(upc, estado);
        return unidad != null ? 
            new ResponseEntity<>(unidad, HttpStatus.OK) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Obtener artículo de una unidad
    @GetMapping("/{upc}/articulo")
    public ResponseEntity<Articulo> obtenerArticuloDeUnidad(@PathVariable String upc) {
        Articulo articulo = unidadService.obtenerArticuloPorUnidad(upc);
        return articulo != null ? 
            new ResponseEntity<>(articulo, HttpStatus.OK) : 
            new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
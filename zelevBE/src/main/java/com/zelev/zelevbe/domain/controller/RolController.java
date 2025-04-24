package com.zelev.zelevbe.domain.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zelev.zelevbe.domain.dto.RolCreateDTO;
import com.zelev.zelevbe.domain.service.RolService;
import com.zelev.zelevbe.persistence.entity.Rol.Rol;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@RestController
@RequestMapping("/api/rol")
public class RolController {
   
    @Autowired
    private RolService rolService;

    @GetMapping("/list")
    public ResponseEntity<List<Rol>> getAllRol() {
        return ResponseEntity.ok(rolService.getAll());
    }
    
    @PostMapping("/new")
    public ResponseEntity<Rol> createRolEntity(@RequestBody RolCreateDTO entity) {
        Rol rol = rolService.save(entity);
        if (rol == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(rol);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteRol(@PathVariable("id") Integer id) {
        if (rolService.delete(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
}

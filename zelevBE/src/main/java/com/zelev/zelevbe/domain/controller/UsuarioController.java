package com.zelev.zelevbe.domain.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zelev.zelevbe.constants.EstadoUsuario;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioListDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioUpdateDTO;
import com.zelev.zelevbe.domain.service.UsuarioService;
import com.zelev.zelevbe.persistence.entity.Usuario;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/list")
    public ResponseEntity<List<UsuarioListDTO>> listUsuarios() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/list/{estado}")
    public ResponseEntity<List<Usuario>> listUsuariosByEstado(@PathVariable("estado") EstadoUsuario estado) {
        return ResponseEntity.ok(usuarioService.findByEstado(estado));
    }
    
    @PutMapping("/update")
    public ResponseEntity<Usuario> updateUsr(@RequestBody UsuarioUpdateDTO usuario) {
        return ResponseEntity.ok(usuarioService.update(usuario));
    }
    
}

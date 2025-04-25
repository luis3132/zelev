package com.zelev.zelevbe.domain.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zelev.zelevbe.constants.EstadoUsuario;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioCreateDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioListDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioUpdateDTO;
import com.zelev.zelevbe.domain.service.UsuarioService;
import com.zelev.zelevbe.persistence.entity.Usuario;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;


/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioService usuarioService;

    UsuarioController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/list")
    @Secured("ADMIN")
    public ResponseEntity<List<UsuarioListDTO>> listUsuarios() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/list/{estado}")
    @Secured("ADMIN")
    public ResponseEntity<List<Usuario>> listUsuariosByEstado(@PathVariable("estado") EstadoUsuario estado) {
        return ResponseEntity.ok(usuarioService.findByEstado(estado));
    }

    @PostMapping("/new")
    @Secured("ADMIN")
    public ResponseEntity<Usuario> createUserEntity(@RequestBody UsuarioCreateDTO usuario) {
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        return ResponseEntity.ok(usuarioService.save(usuario));
    }
    

    @PutMapping("/update")
    public ResponseEntity<UsuarioListDTO> updateUsr(@RequestBody UsuarioUpdateDTO usuario) {
        return ResponseEntity.ok(usuarioService.update(usuario));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUsr(@PathVariable("id") String cedula) {
        if (usuarioService.delete(cedula)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

}

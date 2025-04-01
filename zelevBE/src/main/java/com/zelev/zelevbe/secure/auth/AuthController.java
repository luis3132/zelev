package com.zelev.zelevbe.secure.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zelev.zelevbe.domain.dto.usuario.UsuarioCreateDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioLoginDTO;
import com.zelev.zelevbe.secure.jwt.JwtService;

import io.jsonwebtoken.Claims;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


/**
 * 
 * @autor Luis Andres Gonzalez Corzo
 */

@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UsuarioLoginDTO usuarioLoginDTO) {
        return ResponseEntity.ok(authService.login(usuarioLoginDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UsuarioCreateDTO usuarioLoginDTO) {
        AuthResponse response = authService.register(usuarioLoginDTO);
        if (response == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(authService.register(usuarioLoginDTO));
    }

    @PostMapping("/verify")
    public ResponseEntity<UsuarioLoginDTO> verify(@RequestBody AuthResponse authResponse){
        UsuarioLoginDTO loginDTO = new UsuarioLoginDTO(jwtService.getClaim(authResponse.getToken(), Claims::getSubject), "Encrypted");
        return ResponseEntity.ok(loginDTO);
    }


}

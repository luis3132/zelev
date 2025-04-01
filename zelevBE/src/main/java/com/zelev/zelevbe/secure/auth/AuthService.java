package com.zelev.zelevbe.secure.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zelev.zelevbe.domain.dto.usuario.UsuarioCreateDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioLoginDTO;
import com.zelev.zelevbe.domain.service.UsuarioService;
import com.zelev.zelevbe.persistence.entity.Usuario;
import com.zelev.zelevbe.secure.jwt.JwtService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * 
 * @autor Luis Andres Gonzalez Corzo
 */

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(UsuarioLoginDTO usuarioLoginDTO) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(usuarioLoginDTO.getEmail(),
                usuarioLoginDTO.getContrasena()));
        UserDetails userDetails = usuarioService.loadUserByUsername(usuarioLoginDTO.getEmail());

        return AuthResponse.builder()
                .token(jwtService.getToken(userDetails))
                .build();
    }

    public AuthResponse register(UsuarioCreateDTO usuarioLoginDTO) {
        usuarioLoginDTO.setContrasena(passwordEncoder.encode(usuarioLoginDTO.getContrasena()));
        Usuario usuario = usuarioService.save(usuarioLoginDTO);

        if (usuario == null) {
            return null;
        }

        UserDetails userDetails = usuarioService.loadUserByUsername(usuario.getEmail());

        return AuthResponse.builder()
                .token(jwtService.getToken(userDetails))
                .build();
    }

}

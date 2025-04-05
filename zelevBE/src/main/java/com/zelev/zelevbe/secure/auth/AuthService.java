package com.zelev.zelevbe.secure.auth;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zelev.zelevbe.domain.dto.Imagen.ImagenProfileDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioCreateDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioListDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioLoginDTO;
import com.zelev.zelevbe.domain.service.UsuarioService;
import com.zelev.zelevbe.persistence.entity.Usuario;
import com.zelev.zelevbe.secure.jwt.JwtService;

import io.jsonwebtoken.Claims;
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

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        usuarioLoginDTO.getNombreUsuario(),
                        usuarioLoginDTO.getContrasena()));

        UserDetails userDetails = usuarioService.loadUserByUsername(usuarioLoginDTO.getNombreUsuario());

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

        UserDetails userDetails = usuarioService.loadUserByUsername(usuario.getNombreUsuario());

        return AuthResponse.builder()
                .token(jwtService.getToken(userDetails))
                .build();
    }

    public UsuarioListDTO verify(String token) {
        String nombreUsuario = jwtService.getClaim(token, Claims::getSubject);
        Usuario usuario = usuarioService.findByUsername(nombreUsuario).get();

        if (usuario == null) {
            return null;
        }

        String imagenBase64 = null;
        ImagenProfileDTO imagen = null;
        if (usuario.getImagen() != null) {
            try {
                Path filePath = Paths.get(usuario.getImagen().getUrl());
                byte[] imageBytes = Files.readAllBytes(filePath);
                imagenBase64 = usuario.getImagen() != null ? Base64.getEncoder().encodeToString(imageBytes) : null;
            } catch (Exception e) {
                System.err.println("No hay una imagen disponible para el usuario.");
                imagenBase64 = "";
            }
            imagen = new ImagenProfileDTO();
            imagen.setIdImagen(usuario.getImagen().getIdImagen());
            imagen.setAlt(usuario.getImagen().getAlt());
            imagen.setUrl(imagenBase64);
            System.out.println("Imagen: " + imagenBase64);
        }

        return UsuarioListDTO.builder()
                .cedula(usuario.getCedula())
                .telefono(usuario.getTelefono())
                .direccion(usuario.getDireccion())
                .fechaNacimiento(usuario.getFechaNacimiento())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .nombreUsuario(usuario.getNombreUsuario())
                .email(usuario.getEmail())
                .roles(usuario.getRoles().stream().map(role -> role.getRol()).toList())
                .estado(usuario.getEstado())
                .ciudad(usuario.getCiudad())
                .zipcode(usuario.getZipcode())
                .imagen(imagen)
                .departamento(usuario.getDepartamento())
                .build();
    }

}

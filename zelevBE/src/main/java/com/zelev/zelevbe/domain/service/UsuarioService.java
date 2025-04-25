package com.zelev.zelevbe.domain.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.zelev.zelevbe.constants.EstadoUsuario;
import com.zelev.zelevbe.domain.dto.Imagen.ImagenProfileDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioCreateDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioListDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioUpdateDTO;
import com.zelev.zelevbe.domain.service.interfaces.IUsuarioService;
import com.zelev.zelevbe.persistence.entity.Usuario;
import com.zelev.zelevbe.persistence.entity.Rol.Rol;
import com.zelev.zelevbe.persistence.entity.imagen.Imagen;
import com.zelev.zelevbe.persistence.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Service
@Transactional
public class UsuarioService implements IUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    @Lazy
    private RolService rolService;

    @Autowired
    @Lazy
    private ImagenService imagenService;

    @Override
    public List<UsuarioListDTO> findAll() {
        List<UsuarioListDTO> temp = findByEstado(EstadoUsuario.ACTIVO).stream().map(usuario -> {
            return convertEntitytoDTOlist(usuario);
        }).toList();
        return temp;
    }

    @Override
    public Optional<Usuario> findById(String id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public List<Usuario> findByEstado(EstadoUsuario estado) {
        return usuarioRepository.findByEstado(estado);
    }

    @Override
    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    @Override
    public Usuario save(UsuarioCreateDTO usuarioCreateDTO) {
         Usuario temp = usuarioRepository.save(convertDTOtoEntity(usuarioCreateDTO));

        if (usuarioCreateDTO.getRoles() == null || usuarioCreateDTO.getRoles().isEmpty()) {
            rolService.linkUsrRol(usuarioCreateDTO.getCedula(), 2);
        } else {
            usuarioCreateDTO.getRoles().stream().forEach(rol -> {
                rolService.linkUsrRol(usuarioCreateDTO.getCedula(), rol);
            });
        }
        return temp;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        List<GrantedAuthority> authority = usuario.getRoles() != null ? 
            usuario.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority(role.getRol().getRol()))
                .collect(Collectors.toList()) : 
                List.of(new SimpleGrantedAuthority("USER"));

        Set<GrantedAuthority> grantedAuthorities = Set.copyOf(authority);

        return new User(usuario.getNombreUsuario(), usuario.getContrasena(), grantedAuthorities);
    }

    @Override
    public Boolean delete(String id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            usuario.get().setEstado(EstadoUsuario.INACTIVO);
            usuarioRepository.save(usuario.get());
            return true;
        }
        return false;
    }

    @Override
    public UsuarioListDTO update(UsuarioUpdateDTO usuarioUpdateDTO) {
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioUpdateDTO.getCedula());
        if (usuario.isPresent()) {
            Usuario usuarioEntity = convertDTOtoEntity(usuario.get(), usuarioUpdateDTO);
            usuarioRepository.save(usuarioEntity);
            UsuarioListDTO usuarioListDTO = convertEntitytoDTOlist(usuarioEntity);
            return usuarioListDTO;
        }
        return null;
    }

    private Usuario convertDTOtoEntity(Usuario usr, UsuarioUpdateDTO usuarioUpdateDTO) {
        Usuario usuario = usr;

        if (usuarioUpdateDTO.getCedula() != null) {
            usuario.setCedula(usuarioUpdateDTO.getCedula());
        }
        if (usuarioUpdateDTO.getNombres() != null) {
            usuario.setNombres(usuarioUpdateDTO.getNombres());
        }
        if (usuarioUpdateDTO.getApellidos() != null) {
            usuario.setApellidos(usuarioUpdateDTO.getApellidos());
        }
        if (usuarioUpdateDTO.getEmail() != null) {
            usuario.setEmail(usuarioUpdateDTO.getEmail());
        }
        if (usuarioUpdateDTO.getTelefono() != null) {
            usuario.setTelefono(usuarioUpdateDTO.getTelefono());
        }
        if (usuarioUpdateDTO.getDireccion() != null) {
            usuario.setDireccion(usuarioUpdateDTO.getDireccion());
        }
        if (usuarioUpdateDTO.getFechaNacimiento() != null) {
            usuario.setFechaNacimiento(usuarioUpdateDTO.getFechaNacimiento());
        }
        if (usuarioUpdateDTO.getDepartamento() != null) {
            usuario.setDepartamento(usuarioUpdateDTO.getDepartamento());
        }
        if (usuarioUpdateDTO.getCiudad() != null) {
            usuario.setCiudad(usuarioUpdateDTO.getCiudad());
        }
        if (usuarioUpdateDTO.getZipcode() != null) {
            usuario.setZipcode(usuarioUpdateDTO.getZipcode());
        }
        
        if (usuarioUpdateDTO.getImagen() != null) {
            Optional<Imagen> imagen = imagenService.findById(usuarioUpdateDTO.getImagen());
            if (imagen.isPresent()) {
            usuario.setImagen(imagen.get());
            } else {
            usuario.setImagen(null);
            }
        }

        if (usuarioUpdateDTO.getNuevosRoles() != null) {
            usuarioUpdateDTO.getNuevosRoles().stream().forEach(rol -> {
                rolService.linkUsrRol(usr.getCedula(), rol);
            });
        }

        if (usuarioUpdateDTO.getEliminarRoles() != null) {
            usuarioUpdateDTO.getEliminarRoles().stream().forEach(rol -> {
                rolService.unlinkUsrRol(usr.getCedula(), rol);
            });
        }

        return usuario;
    }

    private Usuario convertDTOtoEntity(UsuarioCreateDTO usuarioCreateDTO) {
        Usuario usuario = new Usuario();

        usuario.setCedula(usuarioCreateDTO.getCedula());
        usuario.setNombres(usuarioCreateDTO.getNombres());
        usuario.setApellidos(usuarioCreateDTO.getApellidos());
        usuario.setNombreUsuario(usuarioCreateDTO.getNombreUsuario());
        usuario.setEmail(usuarioCreateDTO.getEmail());
        usuario.setContrasena(usuarioCreateDTO.getContrasena());
        usuario.setFechaCreacion(usuarioCreateDTO.getFechaCreacion());
        usuario.setTelefono(usuarioCreateDTO.getTelefono());
        usuario.setDireccion(usuarioCreateDTO.getDireccion());
        usuario.setFechaNacimiento(usuarioCreateDTO.getFechaNacimiento());
        usuario.setFechaCreacion(Date.from(new Date().toInstant()));
        usuario.setZipcode(usuarioCreateDTO.getZipcode());
        usuario.setDepartamento(usuarioCreateDTO.getDepartamento());
        usuario.setCiudad(usuarioCreateDTO.getCiudad());
        usuario.setEstado(EstadoUsuario.ACTIVO);

        return usuario;
    }

    public UsuarioListDTO convertEntitytoDTOlist(Usuario usuario) {
        UsuarioListDTO usuarioListDTO = new UsuarioListDTO();

        usuarioListDTO.setCedula(usuario.getCedula());
        usuarioListDTO.setNombres(usuario.getNombres());
        usuarioListDTO.setApellidos(usuario.getApellidos());
        usuarioListDTO.setNombreUsuario(usuario.getNombreUsuario());
        usuarioListDTO.setEmail(usuario.getEmail());
        usuarioListDTO.setTelefono(usuario.getTelefono());
        usuarioListDTO.setDireccion(usuario.getDireccion());
        usuarioListDTO.setDepartamento(usuario.getDepartamento());
        usuarioListDTO.setCiudad(usuario.getCiudad());
        usuarioListDTO.setZipcode(usuario.getZipcode());
        usuarioListDTO.setFechaNacimiento(usuario.getFechaNacimiento());
        usuarioListDTO.setEstado(usuario.getEstado());
        
        ImagenProfileDTO imagenProfileDTO = new ImagenProfileDTO();
        if (usuario.getImagen() != null) {
            imagenProfileDTO.setIdImagen(usuario.getImagen().getIdImagen());
            imagenProfileDTO.setUrl(usuario.getImagen().getUrl());
            imagenProfileDTO.setAlt(usuario.getImagen().getAlt());
            
            usuarioListDTO.setImagen(imagenProfileDTO);
        }

        List<Rol> roles = usuario.getRoles().stream().map(rol -> {
            Rol rolDTO = rol.getRol();
            return rolDTO;
        }).toList();

        usuarioListDTO.setRoles(roles);

        return usuarioListDTO;
    }
}

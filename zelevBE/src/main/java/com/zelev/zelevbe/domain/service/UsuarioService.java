package com.zelev.zelevbe.domain.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zelev.zelevbe.constants.EstadoUsuario;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioCreateDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioListDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioUpdateDTO;
import com.zelev.zelevbe.domain.service.interfaces.IUsuarioService;
import com.zelev.zelevbe.persistence.entity.Usuario;
import com.zelev.zelevbe.persistence.entity.Rol.Rol;
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
    private RolService rolService;

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
    public Usuario save(UsuarioCreateDTO usuarioCreateDTO) {
        return usuarioRepository.save(convertDTOtoEntity(usuarioCreateDTO));
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
    public Usuario update(UsuarioUpdateDTO usuarioUpdateDTO) {
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioUpdateDTO.getCedula());
        if (usuario.isPresent()) {
            Usuario usuarioEntity = convertDTOtoEntity(usuario.get(), usuarioUpdateDTO);

            return usuarioRepository.save(usuarioEntity);
        }
        return null;
    }

    private Usuario convertDTOtoEntity(Usuario usr, UsuarioUpdateDTO usuarioUpdateDTO) {
        Usuario usuario = usr;

        usuario.setCedula(usuarioUpdateDTO.getCedula());
        usuario.setNombres(usuarioUpdateDTO.getNombres());
        usuario.setApellidos(usuarioUpdateDTO.getApellidos());
        usuario.setEmail(usuarioUpdateDTO.getEmail());
        usuario.setTelefono(usuarioUpdateDTO.getTelefono());
        usuario.setDireccion(usuarioUpdateDTO.getDireccion());
        usuario.setFechaNacimiento(usuarioUpdateDTO.getFechaNacimiento());
        usuario.setEstado(usuarioUpdateDTO.getEstado());

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
        usuario.setEmail(usuarioCreateDTO.getEmail());
        usuario.setConstrasena(usuarioCreateDTO.getConstrasena());
        usuario.setFechaCreacion(usuarioCreateDTO.getFechaCreacion());
        usuario.setTelefono(usuarioCreateDTO.getTelefono());
        usuario.setDireccion(usuarioCreateDTO.getDireccion());
        usuario.setFechaNacimiento(usuarioCreateDTO.getFechaNacimiento());
        usuario.setEstado(EstadoUsuario.ACTIVO);

        usuarioCreateDTO.getRoles().stream().forEach(rol -> {
            rolService.linkUsrRol(usuario.getCedula(), rol);
        });

        return usuario;
    }

    private UsuarioListDTO convertEntitytoDTOlist(Usuario usuario) {
        UsuarioListDTO usuarioListDTO = new UsuarioListDTO();

        usuarioListDTO.setCedula(usuario.getCedula());
        usuarioListDTO.setNombres(usuario.getNombres());
        usuarioListDTO.setApellidos(usuario.getApellidos());
        usuarioListDTO.setEmail(usuario.getEmail());
        usuarioListDTO.setTelefono(usuario.getTelefono());
        usuarioListDTO.setDireccion(usuario.getDireccion());
        usuarioListDTO.setFechaNacimiento(usuario.getFechaNacimiento());
        usuarioListDTO.setEstado(usuario.getEstado());

        List<Rol> roles = usuario.getRoles().stream().map(rol -> {
            Rol rolDTO = rol.getRol();
            return rolDTO;
        }).toList();

        usuarioListDTO.setRoles(roles);

        return usuarioListDTO;
    }
}

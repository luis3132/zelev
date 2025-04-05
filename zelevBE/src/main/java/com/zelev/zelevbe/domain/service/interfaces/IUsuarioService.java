package com.zelev.zelevbe.domain.service.interfaces;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;

import com.zelev.zelevbe.constants.EstadoUsuario;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioCreateDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioListDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioUpdateDTO;
import com.zelev.zelevbe.persistence.entity.Usuario;

public interface IUsuarioService {
    Usuario save(UsuarioCreateDTO usuarioCreateDTO);
    UsuarioListDTO update(UsuarioUpdateDTO usuarioUpdateDTO);
    List<UsuarioListDTO> findAll();
    Optional<Usuario> findById(String id);
    Optional<Usuario> findByUsername(String username);
    Boolean delete(String id);
    List<Usuario> findByEstado(EstadoUsuario estado);
    UserDetails loadUserByUsername(String username);
}

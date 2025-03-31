package com.zelev.zelevbe.domain.service.interfaces;

import java.util.List;
import java.util.Optional;

import com.zelev.zelevbe.constants.EstadoUsuario;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioCreateDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioListDTO;
import com.zelev.zelevbe.domain.dto.usuario.UsuarioUpdateDTO;
import com.zelev.zelevbe.persistence.entity.Usuario;

public interface IUsuarioService {
    Usuario save(UsuarioCreateDTO usuarioCreateDTO);
    Usuario update(UsuarioUpdateDTO usuarioUpdateDTO);
    List<UsuarioListDTO> findAll();
    Optional<Usuario> findById(String id);
    Boolean delete(String id);
    List<Usuario> findByEstado(EstadoUsuario estado);
}

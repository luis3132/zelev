package com.zelev.zelevbe.persistence.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zelev.zelevbe.persistence.entity.Usuario;
import com.zelev.zelevbe.constants.EstadoUsuario;


/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    @Query("SELECT u FROM Usuario u WHERE u.estado = :estado")
    List<Usuario> findByEstado(@Param("estado") EstadoUsuario estado);

    @Query("SELECT u FROM Usuario u WHERE u.email = :email")
    Optional<Usuario> findByEmail(@Param("email") String email);
}

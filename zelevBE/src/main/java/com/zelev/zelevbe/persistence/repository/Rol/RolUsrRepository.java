package com.zelev.zelevbe.persistence.repository.Rol;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zelev.zelevbe.persistence.entity.Rol.RolUsuario;
import com.zelev.zelevbe.persistence.entity.Rol.RolUsuarioPK;
import java.util.List;


/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

public interface RolUsrRepository extends JpaRepository<RolUsuario, RolUsuarioPK> {
    @Query("SELECT r FROM RolUsuario r WHERE r.id.rol = :rol")
    List<RolUsuario> findByRol(@Param("rol") Integer rol);
}

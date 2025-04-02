package com.zelev.zelevbe.domain.service.interfaces;

import java.util.List;
import java.util.Optional;

import com.zelev.zelevbe.domain.dto.RolCreateDTO;
import com.zelev.zelevbe.persistence.entity.Rol.Rol;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 * 
 * Interface for RolService
 */

public interface IRolService {
    List<Rol> getAll();
    Optional<Rol> getRol(Integer id);
    Rol save(RolCreateDTO rol);
    Boolean delete(Integer id);
    Boolean linkUsrRol(String cedula, Integer rol);
    Boolean unlinkUsrRol(String cedula, Integer rol);
}

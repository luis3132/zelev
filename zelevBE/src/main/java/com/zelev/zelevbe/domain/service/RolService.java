package com.zelev.zelevbe.domain.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zelev.zelevbe.domain.dto.RolCreateDTO;
import com.zelev.zelevbe.domain.service.interfaces.IRolService;
import com.zelev.zelevbe.persistence.entity.Rol.Rol;
import com.zelev.zelevbe.persistence.entity.Rol.RolUsuario;
import com.zelev.zelevbe.persistence.entity.Rol.RolUsuarioPK;
import com.zelev.zelevbe.persistence.repository.Rol.RolRepository;
import com.zelev.zelevbe.persistence.repository.Rol.RolUsrRepository;

import jakarta.transaction.Transactional;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Service
@Transactional
public class RolService implements IRolService {
    
    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private RolUsrRepository rolUsrRepository;

    @Override
    public List<Rol> getAll() {
        return rolRepository.findAll();
    }

    @Override
    public Optional<Rol> getRol(Integer id) {
        return rolRepository.findById(id);
    }

    @Override
    public Rol save(RolCreateDTO rol) {
        Rol newRol = new Rol();
        newRol.setRol(rol.getRol());
        return rolRepository.save(newRol);
    }

    @Override
    public Boolean delete(Integer id) {
        List<RolUsuario> rol = rolUsrRepository.findByRol(id);
        if (rol.isEmpty()) {
            rolRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Boolean linkUsrRol(String cedula, Integer rol) {
        RolUsuarioPK rolUsuarioPK = new RolUsuarioPK();
        rolUsuarioPK.setUsuario(cedula);
        rolUsuarioPK.setRol(rol);

        RolUsuario rolUsuario = new RolUsuario();
        rolUsuario.setId(rolUsuarioPK);

        RolUsuario temp = rolUsrRepository.save(rolUsuario);
        return temp != null;
    }

    @Override
    public Boolean unlinkUsrRol(String cedula, Integer rol) {
        RolUsuarioPK rolUsuarioPK = new RolUsuarioPK();
        rolUsuarioPK.setUsuario(cedula);
        rolUsuarioPK.setRol(rol);

        Optional<RolUsuario> temp = rolUsrRepository.findById(rolUsuarioPK);
        if (temp.isPresent()) {
            rolUsrRepository.delete(temp.get());
            return true;
        }
        return false;
    }

}

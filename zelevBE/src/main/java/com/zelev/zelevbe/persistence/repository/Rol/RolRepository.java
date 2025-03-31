package com.zelev.zelevbe.persistence.repository.Rol;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zelev.zelevbe.persistence.entity.Rol.Rol;

public interface RolRepository extends JpaRepository<Rol, Integer> {
    // Aquí puedes agregar métodos personalizados si es necesario
    
}

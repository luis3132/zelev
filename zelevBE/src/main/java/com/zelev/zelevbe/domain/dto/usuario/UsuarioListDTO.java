package com.zelev.zelevbe.domain.dto.usuario;

import java.util.Date;
import java.util.List;

import com.zelev.zelevbe.constants.EstadoUsuario;
import com.zelev.zelevbe.persistence.entity.Rol.Rol;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioListDTO {
    private String cedula;
    private String nombres;
    private String apellidos;
    private String nombreUsuario;
    private String email;
    private String telefono;
    private String departamento;
    private String ciudad;
    private Integer zipcode;
    private String direccion;
    private Date fechaNacimiento;
    private String imagen;
    private EstadoUsuario estado;
    private List<Rol> roles;
}

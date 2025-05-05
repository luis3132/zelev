package com.zelev.zelevbe.domain.dto.usuario;

import java.util.Date;
import java.util.List;

import com.zelev.zelevbe.constants.EstadoUsuario;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioCreateDTO {
    private String cedula;
    private String nombres;
    private String apellidos;
    private String nombreUsuario;
    private String email;
    private String telefono;
    private String direccion;
    private Date fechaNacimiento;
    private String contrasena;
    private Date fechaCreacion;
    private String departamento;
    private String ciudad;
    private Integer zipcode;
    private EstadoUsuario estado;
    private List<Integer> roles;
}

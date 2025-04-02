package com.zelev.zelevbe.persistence.entity;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.zelev.zelevbe.constants.EstadoUsuario;
import com.zelev.zelevbe.persistence.entity.Rol.RolUsuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuario")
public class Usuario {
    
    @Id
    private String cedula;
    private String nombres;
    private String apellidos;
    private String email;
    private String telefono;
    private String direccion;

    @Column(name = "nombre_usuario")
    private String nombreUsuario;

    @Column(name = "fecha_nacimiento")
    private Date fechaNacimiento;
    private String contrasena;

    @Column(name = "fecha_creacion")
    private Date fechaCreacion;

    @Enumerated(EnumType.STRING)
    private EstadoUsuario estado;

    @OneToMany(mappedBy = "usuario")
    @JsonManagedReference("usuario-rol")
    private List<RolUsuario> roles;

}

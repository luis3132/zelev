package com.zelev.zelevbe.persistence.entity.Rol;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.zelev.zelevbe.persistence.entity.Usuario;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
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
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "rol_usuario")
public class RolUsuario {
    
    @EmbeddedId
    private RolUsuarioPK id;

    @ManyToOne
    @MapsId("usuario")
    @JoinColumn(name = "usuario", referencedColumnName = "cedula")
    @JsonBackReference("usuario-rol")
    private Usuario usuario;

    @ManyToOne
    @MapsId("rol")
    @JoinColumn(name = "rol", referencedColumnName = "id_rol")
    private Rol rol;
}

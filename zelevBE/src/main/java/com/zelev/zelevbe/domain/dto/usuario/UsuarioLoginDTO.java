package com.zelev.zelevbe.domain.dto.usuario;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @autor Luis Andres Gonzalez Corzo
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioLoginDTO {
    private String nombreUsuario;
    private String contrasena;
}

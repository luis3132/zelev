package com.zelev.zelevbe.persistence.entity.Rol;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Luis Andres Gonzalez Corzo
 */

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RolUsuarioPK {
    private String usuario;
    private Integer rol;
}

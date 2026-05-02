package com.nsobrero.reservasTurnos.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO {
	
	private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String celular;
    private String role;              // ✅ agregar
    private LocalDateTime fechaRegistro;
}

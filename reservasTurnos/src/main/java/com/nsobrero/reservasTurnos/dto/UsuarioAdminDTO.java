package com.nsobrero.reservasTurnos.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioAdminDTO {
	
	private String nombre;
    private String apellido;
    private String email;
    private String celular;
    private String password;
}

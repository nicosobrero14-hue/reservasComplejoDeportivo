package com.nsobrero.reservasTurnos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioCreateDTO {

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotBlank(message = "El apellido no puede estar vacío")
    private String apellido;

    @NotBlank @Email(message = "El email no es válido")
    private String email;

    @NotBlank(message = "El celular no puede estar vacío")
    private String celular;

    @NotBlank @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;
}

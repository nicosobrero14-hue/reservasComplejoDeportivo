package com.nsobrero.reservasTurnos.dto;
 
import lombok.Getter;
import lombok.Setter;
 
@Getter @Setter
public class UsuarioUpdateDTO {
    private String nombre;
    private String apellido;
    private String email;
    private String celular;
    private String passwordActual;   // requerido solo si cambia contraseña
    private String passwordNueva;    // opcional
}

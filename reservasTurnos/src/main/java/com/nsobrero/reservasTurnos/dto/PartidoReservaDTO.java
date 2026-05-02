package com.nsobrero.reservasTurnos.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
 
@Getter @Setter
public class PartidoReservaDTO {
 
    @NotNull(message = "El turnoId es obligatorio")
    private Long turnoId;
 
    private String descripcion; // mensaje opcional para el rival
}

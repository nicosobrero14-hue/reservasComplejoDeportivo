package com.nsobrero.reservasTurnos.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReservaCreateDTO {
	
	@NotNull(message = "El ID del turno es obligatorio")
	private Long turnoId;

    
}

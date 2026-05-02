package com.nsobrero.reservasTurnos.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class TurnosPorCanchaDTO {
	
	private String cancha;
    private List<TurnoDTO> turnos;
}

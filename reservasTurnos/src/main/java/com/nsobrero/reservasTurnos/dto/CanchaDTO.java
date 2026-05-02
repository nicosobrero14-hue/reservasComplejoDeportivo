package com.nsobrero.reservasTurnos.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class CanchaDTO {
	
	private String nombre;
    private Long disciplinaId;
    private boolean activa;
    
}

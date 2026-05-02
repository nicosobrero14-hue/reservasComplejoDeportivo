package com.nsobrero.reservasTurnos.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class TurnoDTO {

    private Long id;
    private LocalDate fecha;  
    private String horaInicio;
    private String horaFin;
    private String estado;
    private String disciplina;
    private String cancha;
    private boolean esMio;
    private boolean modoPartido;
    private String equipoLocal;
 	private String equipoVisitante;
 	private BigDecimal precio;
}


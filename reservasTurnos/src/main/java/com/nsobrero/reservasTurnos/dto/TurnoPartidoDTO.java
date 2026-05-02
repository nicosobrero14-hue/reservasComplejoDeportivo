package com.nsobrero.reservasTurnos.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
 
@Getter @Setter
@AllArgsConstructor
public class TurnoPartidoDTO {
    private Long id;
    private LocalDate fecha;
    private String horaInicio;
    private String horaFin;
    private String cancha;
    private String disciplina;
    private String estado;
    private String equipoLocal;      // nombre del primer equipo
    private String equipoVisitante;  // null si busca rival
    private String descripcion;
    private boolean puedoUnirme;     // true si el usuario actual puede unirse
    private BigDecimal precio;
}
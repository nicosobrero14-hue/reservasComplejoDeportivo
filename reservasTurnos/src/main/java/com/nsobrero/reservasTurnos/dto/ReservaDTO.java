package com.nsobrero.reservasTurnos.dto;


import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class ReservaDTO {
    private Long id;
    private Long turnoId;
    private LocalDate fecha;
    private String horaInicio;
    private String horaFin;
    private String cancha;
    private String disciplina;
    private String estado;
    private LocalDateTime fechaReserva;
    private String metodoPago;
    private java.math.BigDecimal montoAbonado;
   
    
}

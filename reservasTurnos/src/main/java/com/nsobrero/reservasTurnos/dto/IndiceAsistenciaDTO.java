package com.nsobrero.reservasTurnos.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class IndiceAsistenciaDTO {
    private int totalReservas;
    private int activas;
    private int canceladas;
    private double porcentajeAsistencia;
    private String nivel; // EXCELENTE, BUENO, REGULAR, BAJO
}
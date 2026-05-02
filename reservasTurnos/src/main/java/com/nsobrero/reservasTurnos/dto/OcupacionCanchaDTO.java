package com.nsobrero.reservasTurnos.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class OcupacionCanchaDTO {
    private String cancha;
    private String disciplina;
    private int total;
    private int ocupados;
    private double porcentaje;
}
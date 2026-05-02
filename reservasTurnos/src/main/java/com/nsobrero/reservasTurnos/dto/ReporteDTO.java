package com.nsobrero.reservasTurnos.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class ReporteDTO {
    private int totalTurnos;
    private int turnosOcupados;
    private int turnosDisponibles;
    private double porcentajeOcupacion;
    private String disciplinaMasReservada;
    private List<OcupacionCanchaDTO> ocupacionPorCancha;
    
    private int turnosPendienteEfectivo;
    private BigDecimal ingresoOnline;
    private BigDecimal ingresoEfectivoEstimado;
}

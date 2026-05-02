package com.nsobrero.reservasTurnos.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
 
@Getter
@AllArgsConstructor
public class PagoResponseDTO {
    private Long reservaId;
    private String metodoPago;
    private BigDecimal monto;
    private BigDecimal descuento;
    private BigDecimal total;
    private String linkPago;    // null si es efectivo
    private String estado;
    private String mensaje;
}
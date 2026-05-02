package com.nsobrero.reservasTurnos.dto;

import com.nsobrero.reservasTurnos.enums.MetodoPago;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
 
@Getter @Setter
public class PagoRequestDTO {
 
    @NotNull
    private Long turnoId;
 
    @NotNull
    private MetodoPago metodoPago;
 
    // Solo para modo partido
    private boolean esPartido = false;
    
    private boolean esVisitante = false;
}
 
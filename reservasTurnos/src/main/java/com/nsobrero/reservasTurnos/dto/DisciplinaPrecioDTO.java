package com.nsobrero.reservasTurnos.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
 
@Getter @Setter
public class DisciplinaPrecioDTO {
    @NotNull
    private Long disciplinaId;
    @NotNull
    private BigDecimal precio;
}
 

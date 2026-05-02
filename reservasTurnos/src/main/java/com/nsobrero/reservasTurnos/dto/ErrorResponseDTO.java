package com.nsobrero.reservasTurnos.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ErrorResponseDTO {
    private int status;
    private String error;
    private String mensaje;
    private LocalDateTime timestamp;
    private List<String> detalles; // para errores de validación

    public ErrorResponseDTO(int status, String error, String mensaje) {
        this.status = status;
        this.error = error;
        this.mensaje = mensaje;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponseDTO(int status, String error,
                             String mensaje, List<String> detalles) {
        this(status, error, mensaje);
        this.detalles = detalles;
    }
}

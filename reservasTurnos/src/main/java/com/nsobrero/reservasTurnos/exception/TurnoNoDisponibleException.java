package com.nsobrero.reservasTurnos.exception;

public class TurnoNoDisponibleException extends RuntimeException {
    public TurnoNoDisponibleException(String mensaje) {
        super(mensaje);
    }
}
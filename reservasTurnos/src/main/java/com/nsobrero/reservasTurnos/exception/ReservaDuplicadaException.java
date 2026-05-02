package com.nsobrero.reservasTurnos.exception;

public class ReservaDuplicadaException extends RuntimeException {
    public ReservaDuplicadaException(String mensaje) {
        super(mensaje);
    }
}
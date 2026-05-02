package com.nsobrero.reservasTurnos.enums;

public enum EstadoTurno {
    DISPONIBLE,
    ESPERANDO_PAGO,   // ← nuevo
    ESPERANDO_RIVAL,
    RESERVADO,
    COMPLETO
}

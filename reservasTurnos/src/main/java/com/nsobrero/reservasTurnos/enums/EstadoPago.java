package com.nsobrero.reservasTurnos.enums;

public enum EstadoPago {
    PENDIENTE,   // esperando pago online o efectivo
    PAGADO,      // pago confirmado
    FALLIDO,     // pago rechazado
    NO_APLICA    // reserva sin pago (legacy)
}
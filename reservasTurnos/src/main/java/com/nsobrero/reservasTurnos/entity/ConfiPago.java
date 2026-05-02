package com.nsobrero.reservasTurnos.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
 
@Entity
@Getter @Setter
@NoArgsConstructor
public class ConfiPago {
 
    @Id
    private Long id = 1L; // singleton — siempre un solo registro
 
    @Column(nullable = false)
    private int descuentoOnlinePorcentaje = 10; // 10% por defecto
 
    public ConfiPago(int descuento) {
        this.id = 1L;
        this.descuentoOnlinePorcentaje = descuento;
    }
}
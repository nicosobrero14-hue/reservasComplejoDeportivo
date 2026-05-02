package com.nsobrero.reservasTurnos.entity;
 
import java.time.LocalDateTime;
 
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
 
@Entity
@Getter @Setter
@NoArgsConstructor
public class CodigoVerificacion {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false)
    private String codigo;
 
    @ManyToOne
    private Usuario usuario;
 
    @Column(nullable = false)
    private LocalDateTime expiracion;
 
    private boolean usado;
 
    public CodigoVerificacion(String codigo, Usuario usuario) {
        this.codigo = codigo;
        this.usuario = usuario;
        this.expiracion = LocalDateTime.now().plusMinutes(10);
        this.usado = false;
    }
 
    public boolean estaVigente() {
        return !usado && LocalDateTime.now().isBefore(expiracion);
    }
}
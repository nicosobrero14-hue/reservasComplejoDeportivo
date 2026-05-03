package com.nsobrero.reservasTurnos.entity;

import java.time.LocalDateTime;

import com.nsobrero.reservasTurnos.enums.EstadoReserva;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import com.nsobrero.reservasTurnos.enums.MetodoPago;
import com.nsobrero.reservasTurnos.enums.EstadoPago;

@Entity
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "reserva", uniqueConstraints = {
	    @UniqueConstraint(
	        name = "uk_turno_usuario",
	        columnNames = {"turno_id", "usuario_id"}
	    )
	})
public class Reserva {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	private Usuario usuario;
	
	@ManyToOne
	@JoinColumn(name = "turno_id")
	private Turno turno;

	@Column(nullable = false)
	private LocalDateTime fechaReserva;
	
	@Enumerated(EnumType.STRING)
	private EstadoReserva estado;
	
	@Enumerated(EnumType.STRING)
	private MetodoPago metodoPago;
	
	@Enumerated(EnumType.STRING)
	private EstadoPago estadoPago = EstadoPago.NO_APLICA;
	
	private BigDecimal montoAbonado;
	private String mercadoPagoId; // payment_id del webhook
}

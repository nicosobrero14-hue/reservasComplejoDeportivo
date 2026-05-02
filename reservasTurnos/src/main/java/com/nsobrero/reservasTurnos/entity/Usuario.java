package com.nsobrero.reservasTurnos.entity;

import java.time.LocalDateTime;

import com.nsobrero.reservasTurnos.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class Usuario {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String nombre;
	private String apellido;
	
	@Column(unique = true)
	private String celular;
	@Column(unique = true)
	private String email;
	
	private String password;
	
	private LocalDateTime fechaRegistro;
	
	@Enumerated(EnumType.STRING)
	private Role role;
	
	@Column(nullable = false)
	private boolean verificado = false;
	
	private String codigoVerificacion;
	
	private LocalDateTime expiracionCodigo;
}	



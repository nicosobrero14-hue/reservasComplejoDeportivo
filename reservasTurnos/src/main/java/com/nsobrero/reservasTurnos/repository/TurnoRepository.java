package com.nsobrero.reservasTurnos.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nsobrero.reservasTurnos.entity.Turno;

import jakarta.persistence.LockModeType;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
	
	// Método para encontrar turnos por cancha y fecha
	List<Turno> findByCanchaIdAndFecha(Long canchaId, LocalDate fecha);
	
	// Método para encontrar turnos por fecha
	List<Turno> findByFecha(LocalDate fecha);
	
	// Bloqueo para evitar doble reserva del mismo turno
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT t FROM Turno t WHERE t.id = :id")
	Optional<Turno> findByIdForUpdate(Long id);

	// Método para encontrar turnos por disciplina y fecha
	List<Turno> findByCanchaDisciplinaIdAndFecha(Long disciplinaId, LocalDate fecha);
	
	// Método para verificar si un turno ya existe para una cancha, fecha y hora de inicio
	boolean existsByCanchaIdAndFechaAndHoraInicio(Long canchaId, LocalDate fecha, LocalTime horaInicio);
	
	@Query("SELECT t FROM Turno t WHERE t.estado = 'ESPERANDO_RIVAL' AND t.fecha >= :hoy ORDER BY t.fecha, t.horaInicio")
	List<Turno> findEsperandoRival(@Param("hoy") LocalDate hoy);
	 
	// Turnos en modo partido por fecha
	@Query("SELECT t FROM Turno t WHERE t.modoPartido = true AND t.fecha = :fecha")
	List<Turno> findPartidosByFecha(@Param("fecha") LocalDate fecha);
	 
	
	
	
}

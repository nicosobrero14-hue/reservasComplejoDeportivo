package com.nsobrero.reservasTurnos.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.nsobrero.reservasTurnos.entity.Reserva;
import com.nsobrero.reservasTurnos.enums.EstadoPago;
import com.nsobrero.reservasTurnos.enums.EstadoReserva;



@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long>{
	
	// Método para encontrar una reserva por el ID del turno
	Optional<Reserva> findByTurnoId(Long turnoId);
	
	// Método para encontrar todas las reservas de un usuario específico
	List<Reserva> findByUsuarioId(Long usuarioId);
	
	// Método para encontrar una reserva por el ID del turno y el ID del usuario
	Optional<Reserva> findByTurnoIdAndUsuarioId(Long turnoId, Long usuarioId);
	
	// ReservaRepository — cambiar la query a nativa para evitar el caché de Hibernate
	@Query(value = "SELECT COUNT(*) > 0 FROM reserva r " +
            "INNER JOIN turno t ON r.turno_id = t.id " +
            "WHERE r.usuario_id = :usuarioId " +
            "AND t.fecha = :fecha " +
            "AND r.estado = 'ACTIVA'",
			    nativeQuery = true)
	Integer existsReservaActivaEnFecha(
			 @Param("usuarioId") Long usuarioId,
			 @Param("fecha") LocalDate fecha);
    
	// Método para encontrar los IDs de los turnos reservados por un usuario en una fecha específica
    @Query("SELECT r.turno.id FROM Reserva r " +
    	       "WHERE r.usuario.id = :usuarioId " +
    	       "AND r.turno.fecha = :fecha " +
    	       "AND r.estado = 'ACTIVA'")
    	List<Long> findTurnoIdsByUsuarioIdAndFecha(
    	    @Param("usuarioId") Long usuarioId,
    	    @Param("fecha") LocalDate fecha);
    
    // Método para encontrar una reserva por el ID de MercadoPago
    Optional<Reserva> findByMercadoPagoId(String mercadoPagoId);
    
    // Método para encontrar reservas por la fecha del turno
    @Query("SELECT r FROM Reserva r WHERE r.turno.fecha = :fecha")
    List<Reserva> findByTurnoFecha(@Param("fecha") LocalDate fecha);
    
    // Método para encontrar reservas activas con pago pendiente antes de una fecha dada
    List<Reserva> findByEstadoAndEstadoPagoAndFechaReservaBefore(
   	         EstadoReserva estado,
    	     EstadoPago estadoPago,
    	     LocalDateTime fecha
    );
	
	
}

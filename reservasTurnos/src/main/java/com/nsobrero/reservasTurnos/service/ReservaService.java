package com.nsobrero.reservasTurnos.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.nsobrero.reservasTurnos.exception.TurnoNoDisponibleException;
import com.nsobrero.reservasTurnos.dto.IndiceAsistenciaDTO;
import com.nsobrero.reservasTurnos.dto.ReservaCreateDTO;
import com.nsobrero.reservasTurnos.dto.ReservaDTO;
import com.nsobrero.reservasTurnos.entity.Reserva;
import com.nsobrero.reservasTurnos.entity.Turno;
import com.nsobrero.reservasTurnos.entity.Usuario;
import com.nsobrero.reservasTurnos.enums.EstadoReserva;
import com.nsobrero.reservasTurnos.enums.EstadoTurno;
import com.nsobrero.reservasTurnos.enums.Role;
import com.nsobrero.reservasTurnos.exception.AccesoDenegadoException;
import com.nsobrero.reservasTurnos.exception.RecursoNoEncontradoException;
import com.nsobrero.reservasTurnos.exception.ReservaDuplicadaException;
import com.nsobrero.reservasTurnos.repository.ReservaRepository;
import com.nsobrero.reservasTurnos.repository.TurnoRepository;
import com.nsobrero.reservasTurnos.repository.UsuarioRepository;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservaService {
	
	private final ReservaRepository reservaRepository;
	private final TurnoRepository turnoRepository;
	private final UsuarioRepository usuarioRepository; 
    
    // Método para reservar un turno
	@Transactional
	public String reservarTurno(ReservaCreateDTO dto, String email) {

	    Turno turno = turnoRepository.findById(dto.getTurnoId())
	        .orElseThrow(() -> new RecursoNoEncontradoException(
	            "Turno no encontrado con id: " + dto.getTurnoId()));

	    if (turno.getEstado() != EstadoTurno.DISPONIBLE) {
	        throw new TurnoNoDisponibleException(
	            "El turno ya está " + turno.getEstado().name().toLowerCase());
	    }

	    Usuario usuario = usuarioRepository.findByEmail(email)
	        .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

	    // ✅ 1. Validar duplicado PRIMERO — antes de tocar nada
	    boolean tieneReservaEseDia = reservaRepository
	    	    .existsReservaActivaEnFecha(usuario.getId(), turno.getFecha()) > 0;

	    	if (tieneReservaEseDia) {
	    	    throw new ReservaDuplicadaException(
	    	        "Ya tenés una reserva activa para el " + turno.getFecha());
	    	}

	    // ✅ 2. Recién ahora buscar o crear la reserva
	    Optional<Reserva> reservaExistente = reservaRepository
	        .findByTurnoIdAndUsuarioId(turno.getId(), usuario.getId());

	    Reserva reserva;
	    if (reservaExistente.isPresent()) {
	        reserva = reservaExistente.get();
	        reserva.setEstado(EstadoReserva.ACTIVA);
	        reserva.setFechaReserva(LocalDateTime.now());
	    } else {
	        reserva = new Reserva();
	        reserva.setTurno(turno);
	        reserva.setUsuario(usuario);
	        reserva.setFechaReserva(LocalDateTime.now());
	        reserva.setEstado(EstadoReserva.ACTIVA);
	    }

	    turno.setEstado(EstadoTurno.RESERVADO);
	    turnoRepository.save(turno);
	    reservaRepository.save(reserva);

	    return "Reserva realizada con éxito";
	}
    
    @Transactional
    public void cancelarPorTurno(Long turnoId, String email) {

    	Usuario usuario = usuarioRepository.findByEmail(email)
    	        .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        
        Reserva reserva = reservaRepository.findByTurnoId(turnoId)
        	    .orElseThrow(() -> new RecursoNoEncontradoException(
        	        "No existe una reserva para el turno: " + turnoId));


        // 🔥 SI ES ADMIN → puede cancelar todo
        if(usuario.getRole() == Role.ADMIN){
            reserva.setEstado(EstadoReserva.CANCELADA);

            Turno turno = reserva.getTurno();
            turno.setEstado(EstadoTurno.DISPONIBLE);

            turnoRepository.save(turno);
            reservaRepository.save(reserva);
            return;
        }

        if (!reserva.getUsuario().getId().equals(usuario.getId())) {
            throw new AccesoDenegadoException(
                "No tenés permiso para cancelar esta reserva");
        }

        reserva.setEstado(EstadoReserva.CANCELADA);

        Turno turno = reserva.getTurno();
        turno.setEstado(EstadoTurno.DISPONIBLE);

        turnoRepository.save(turno);
        reservaRepository.save(reserva);
    }
    
    // Método para obtener todas las reservas de un usuario específico
    public List<Reserva> obtenerReservasUsuario(Long usuarioId){

        return reservaRepository.findByUsuarioId(usuarioId);

    }
    
    // Método para obtener todas las reservas
	public List<Reserva> findAll() {
		
		return reservaRepository.findAll();
	}
	
	// Método para obtener una reserva por su ID
	public Optional<Reserva> findById(Long reservaId) {
		
		return reservaRepository.findById(reservaId);
	}

	public void save(Reserva reserva) {
		reservaRepository.save(reserva);
		
	}
	
	public List<ReservaDTO> obtenerMisReservas(String email) {
	    Usuario usuario = usuarioRepository.findByEmail(email)
	        .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

	    return reservaRepository.findByUsuarioId(usuario.getId())
	        .stream()
	        .map(r -> new ReservaDTO(
	        	    r.getId(),
	        	    r.getTurno().getId(),
	        	    r.getTurno().getFecha(),
	        	    r.getTurno().getHoraInicio().format(DateTimeFormatter.ofPattern("HH:mm")),
	        	    r.getTurno().getHoraFin().format(DateTimeFormatter.ofPattern("HH:mm")),
	        	    r.getTurno().getCancha().getNombre(),
	        	    r.getTurno().getCancha().getDisciplina().getNombre(),
	        	    r.getEstado().name(),
	        	    r.getFechaReserva(),
	        	    r.getMetodoPago() != null ? r.getMetodoPago().name() : null,  // ← nuevo
	        	    r.getMontoAbonado()  // ← nuevo
	        	))
	        .sorted(Comparator.comparing(ReservaDTO::getFecha).reversed())
	        .toList();
	}
	
	public IndiceAsistenciaDTO obtenerIndiceAsistencia(String email) {
	    Usuario usuario = usuarioRepository.findByEmail(email)
	        .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

	    List<Reserva> reservas = reservaRepository.findByUsuarioId(usuario.getId());

	    int total = reservas.size();
	    int activas = (int) reservas.stream()
	        .filter(r -> r.getEstado() == EstadoReserva.ACTIVA).count();
	    int canceladas = (int) reservas.stream()
	        .filter(r -> r.getEstado() == EstadoReserva.CANCELADA).count();

	    double porcentaje = total > 0 ? ((total - canceladas) * 100.0 / total) : 100.0;
	    porcentaje = Math.round(porcentaje * 10.0) / 10.0;

	    String nivel;
	    if (porcentaje >= 85) nivel = "EXCELENTE";
	    else if (porcentaje >= 65) nivel = "BUENO";
	    else if (porcentaje >= 40) nivel = "REGULAR";
	    else nivel = "BAJO";

	    return new IndiceAsistenciaDTO(total, activas, canceladas, porcentaje, nivel);
	}

}

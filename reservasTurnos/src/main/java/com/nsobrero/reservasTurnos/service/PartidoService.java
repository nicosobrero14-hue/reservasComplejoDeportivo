package com.nsobrero.reservasTurnos.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import com.nsobrero.reservasTurnos.dto.PartidoReservaDTO;
import com.nsobrero.reservasTurnos.dto.TurnoPartidoDTO;
import com.nsobrero.reservasTurnos.entity.Reserva;
import com.nsobrero.reservasTurnos.entity.Turno;
import com.nsobrero.reservasTurnos.entity.Usuario;
import com.nsobrero.reservasTurnos.enums.EstadoReserva;
import com.nsobrero.reservasTurnos.enums.EstadoTurno;
import com.nsobrero.reservasTurnos.enums.MetodoPago;
import com.nsobrero.reservasTurnos.exception.AccesoDenegadoException;
import com.nsobrero.reservasTurnos.exception.RecursoNoEncontradoException;
import com.nsobrero.reservasTurnos.exception.TurnoNoDisponibleException;
import com.nsobrero.reservasTurnos.repository.ReservaRepository;
import com.nsobrero.reservasTurnos.repository.TurnoRepository;
import com.nsobrero.reservasTurnos.repository.UsuarioRepository;
 
import lombok.RequiredArgsConstructor;
 
@Service
@RequiredArgsConstructor
public class PartidoService {
 
    private final TurnoRepository turnoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ReservaRepository reservaRepository;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("HH:mm");
 
    // Reservar como equipo local — turno pasa a ESPERANDO_RIVAL
    @Transactional
    public TurnoPartidoDTO reservarComoEquipo(PartidoReservaDTO dto, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        Turno turno = turnoRepository.findById(dto.getTurnoId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Turno no encontrado"));

        if (turno.getEstado() != EstadoTurno.DISPONIBLE) {
            throw new TurnoNoDisponibleException("El turno no está disponible");
        }

        // ✅ El turno queda en ESPERANDO_PAGO hasta que se confirme el pago
        turno.setModoPartido(true);
        turno.setEquipoLocal(usuario);
        turno.setEstado(EstadoTurno.ESPERANDO_PAGO); // no ESPERANDO_RIVAL todavía
        turnoRepository.save(turno);
        
     // Crear reserva para el equipo local
        Reserva reserva = new Reserva();
        reserva.setTurno(turno);
        reserva.setUsuario(usuario);
        reserva.setFechaReserva(LocalDateTime.now());
        reserva.setEstado(EstadoReserva.PENDIENTE_PAGO);
        reserva.setMetodoPago(MetodoPago.ONLINE);
        reservaRepository.save(reserva);

        return toDTO(turno, usuario);
    }
 
    // Unirse como equipo visitante
    @Transactional
    public TurnoPartidoDTO unirseComoRival(Long turnoId, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));

        Turno turno = turnoRepository.findById(turnoId)
            .orElseThrow(() -> new RecursoNoEncontradoException("Turno no encontrado"));

        if (turno.getEstado() != EstadoTurno.ESPERANDO_RIVAL) {
            throw new TurnoNoDisponibleException("Este turno ya no está buscando rival");
        }

        if (turno.getEquipoLocal().getId().equals(usuario.getId())) {
            throw new AccesoDenegadoException("No podés unirte a tu propio partido");
        }

        // ✅ El visitante queda registrado pero el turno espera su pago
        turno.setEquipoVisitante(usuario);
        turno.setEstado(EstadoTurno.ESPERANDO_PAGO); // espera pago del visitante
        turnoRepository.save(turno);

        return toDTO(turno, usuario);
    }
 
    // Cancelar como equipo local — solo hasta 2h antes
    @Transactional
    public void cancelarEquipo(Long turnoId, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
 
        Turno turno = turnoRepository.findById(turnoId)
            .orElseThrow(() -> new RecursoNoEncontradoException("Turno no encontrado"));
 
        if (turno.getEquipoLocal() == null ||
            !turno.getEquipoLocal().getId().equals(usuario.getId())) {
            throw new AccesoDenegadoException("No sos el equipo local de este turno");
        }
 
        if (turno.getEstado() == EstadoTurno.COMPLETO) {
            throw new AccesoDenegadoException(
                "El partido ya tiene dos equipos, no podés cancelar");
        }
 
        // Validar límite de 2 horas
        LocalDateTime limiteCancel = LocalDateTime.of(turno.getFecha(), turno.getHoraInicio())
            .minusHours(2);
 
        if (LocalDateTime.now().isAfter(limiteCancel)) {
            throw new AccesoDenegadoException(
                "No podés cancelar con menos de 2 horas de anticipación");
        }
 
        turno.setModoPartido(false);
        turno.setEquipoLocal(null);
        turno.setEquipoVisitante(null);
        turno.setEstado(EstadoTurno.DISPONIBLE);
        turnoRepository.save(turno);
    }
 
    // Listar turnos ESPERANDO_RIVAL desde hoy
    public List<TurnoPartidoDTO> listarBuscandoRival(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
 
        return turnoRepository.findEsperandoRival(LocalDate.now())
            .stream()
            .map(t -> toDTO(t, usuario))
            .toList();
    }
 
    // Mis turnos en modo partido
    public List<TurnoPartidoDTO> misPartidos(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
 
        return turnoRepository.findAll().stream()
            .filter(t -> t.isModoPartido() && (
                (t.getEquipoLocal() != null && t.getEquipoLocal().getId().equals(usuario.getId())) ||
                (t.getEquipoVisitante() != null && t.getEquipoVisitante().getId().equals(usuario.getId()))
            ))
            .map(t -> toDTO(t, usuario))
            .toList();
    }
 
    private TurnoPartidoDTO toDTO(Turno t, Usuario usuarioActual) {
        boolean puedoUnirme = t.getEstado() == EstadoTurno.ESPERANDO_RIVAL
            && (t.getEquipoLocal() == null || !t.getEquipoLocal().getId().equals(usuarioActual.getId()));
 
        return new TurnoPartidoDTO(
            t.getId(),
            t.getFecha(),
            t.getHoraInicio().format(FMT),
            t.getHoraFin().format(FMT),
            t.getCancha().getNombre(),
            t.getCancha().getDisciplina().getNombre(),
            
            t.getEstado().name(),
            t.getEquipoLocal() != null
                ? t.getEquipoLocal().getNombre() + " " + t.getEquipoLocal().getApellido() : null,
            t.getEquipoVisitante() != null
                ? t.getEquipoVisitante().getNombre() + " " + t.getEquipoVisitante().getApellido() : null,
            null, // descripcion — podés agregarlo si querés
            puedoUnirme,
            t.getCancha().getDisciplina().getPrecio()
        );
    }
}

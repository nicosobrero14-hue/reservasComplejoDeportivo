package com.nsobrero.reservasTurnos.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.stereotype.Service;
import com.nsobrero.reservasTurnos.dto.TurnoDTO;
import com.nsobrero.reservasTurnos.entity.Cancha;
import com.nsobrero.reservasTurnos.entity.HorarioComplejo;
import com.nsobrero.reservasTurnos.entity.Turno;
import com.nsobrero.reservasTurnos.enums.EstadoTurno;
import com.nsobrero.reservasTurnos.exception.RecursoNoEncontradoException;
import com.nsobrero.reservasTurnos.repository.CanchaRepository;
import com.nsobrero.reservasTurnos.repository.HorarioComplejoRepository;
import com.nsobrero.reservasTurnos.repository.ReservaRepository;
import com.nsobrero.reservasTurnos.repository.TurnoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TurnoService {
	
	private final CanchaRepository canchaRepository;

	private final TurnoRepository turnoRepository;

	private final HorarioComplejoRepository horarioRepository;
    
	private final ReservaRepository reservaRepository;
    
    

    // Método para obtener turnos disponibles por cancha y fecha
    public List<Turno> obtenerTurnos(Long canchaId, LocalDate fecha) {
        return turnoRepository.findByCanchaIdAndFecha(canchaId, fecha);
    }
    
    // Método para generar turnos automáticamente para todas las canchas en un día específico
    public void generarTurnos(LocalDate fecha) {

        // ✅ Buscar el horario del día específico
        HorarioComplejo horario = horarioRepository
            .findByDiaSemana(fecha.getDayOfWeek())
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "El complejo no abre el día: " + fecha.getDayOfWeek()));

        LocalTime horaInicio = horario.getHoraApertura();
        LocalTime horaFin    = horario.getHoraCierre();

        List<Cancha> canchas = canchaRepository.findAll();

        for (Cancha cancha : canchas) {

            int duracion = cancha.getDisciplina().getDuracionTurno();
            LocalTime horaActual = horaInicio;

            // ✅ Fix: compara el INICIO con el último inicio válido
            while (!horaActual.isAfter(horaFin.minusMinutes(duracion))) {

                boolean existe = turnoRepository
                    .existsByCanchaIdAndFechaAndHoraInicio(
                        cancha.getId(), fecha, horaActual);

                if (!existe) {
                    Turno turno = new Turno();
                    turno.setCancha(cancha);
                    turno.setFecha(fecha);
                    turno.setHoraInicio(horaActual);
                    turno.setHoraFin(horaActual.plusMinutes(duracion));
                    turno.setEstado(EstadoTurno.DISPONIBLE);
                    turnoRepository.save(turno);
                }

                horaActual = horaActual.plusMinutes(duracion);
            }
        }
    }
    
    
    // Método para obtener turnos por disciplina y fecha
    public List<Turno> obtenerTurnosPorDisciplina(Long id, LocalDate fechaTurno) {	
        return turnoRepository.findByCanchaDisciplinaIdAndFecha(id, fechaTurno);
    }

	public List<Turno> findAll() {
		return turnoRepository.findAll();
	}
	
	// Método para listar turnos por fecha, indicando si el turno es del usuario autenticado
	public List<TurnoDTO> listarPorFecha(LocalDate fecha, Long usuarioId) {
   
	    List<Turno> turnos = turnoRepository.findByFecha(fecha);
	    
	    // ✅ Filtrar turnos cuya hora ya pasó si es el día de hoy
	    LocalTime ahora = LocalTime.now();
	    if (fecha.equals(LocalDate.now())) {
	        turnos = turnos.stream()
	            .filter(t -> t.getHoraInicio().isAfter(ahora))
	            .collect(java.util.stream.Collectors.toList());
	    }

	    List<Long> turnosReservadosPorUsuario = (usuarioId != null)
	    	    ? reservaRepository.findTurnoIdsByUsuarioIdAndFecha(usuarioId, fecha)
	    	    : List.of();

	    return turnos.stream().map(turno -> {
	        TurnoDTO dto = new TurnoDTO();
	        dto.setId(turno.getId());
	        dto.setFecha(turno.getFecha());
	        dto.setModoPartido(turno.isModoPartido());
	        dto.setEquipoLocal(turno.getEquipoLocal() != null
	          ? turno.getEquipoLocal().getNombre() : null);

	        // ✅ LocalTime → String con formato HH:mm
	        dto.setHoraInicio(turno.getHoraInicio()
	            .format(DateTimeFormatter.ofPattern("HH:mm")));
	        dto.setHoraFin(turno.getHoraFin()
	            .format(DateTimeFormatter.ofPattern("HH:mm")));

	        // ✅ Enum → String
	        dto.setEstado(turno.getEstado().name());

	        dto.setCancha(turno.getCancha().getNombre());
	        dto.setDisciplina(turno.getCancha().getDisciplina().getNombre());
	        
	        dto.setPrecio(turno.getCancha().getDisciplina().getPrecio());

	        // ✅ nombre correcto: esMio
	        dto.setEsMio(turnosReservadosPorUsuario.contains(turno.getId()));

	        return dto;
	    }).toList();
	}

	public void save(Turno turno) {
		turnoRepository.save(turno);
		
	}
}

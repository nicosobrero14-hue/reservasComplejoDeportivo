package com.nsobrero.reservasTurnos.controller;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nsobrero.reservasTurnos.dto.IndiceAsistenciaDTO;
import com.nsobrero.reservasTurnos.dto.ReservaCreateDTO;
import com.nsobrero.reservasTurnos.dto.ReservaDTO;
import com.nsobrero.reservasTurnos.entity.Reserva;
import com.nsobrero.reservasTurnos.service.ReservaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;




@RestController
@RequestMapping("/reservas")
@RequiredArgsConstructor
public class ReservaController {
	
	private final ReservaService reservaService;
	

	@PostMapping
	public ResponseEntity<String> reservarTurno(
	        @Valid @RequestBody ReservaCreateDTO dto,
	        Authentication auth) {  // ← Spring inyecta esto automático
	    return ResponseEntity.status(HttpStatus.CREATED)
	        .body(reservaService.reservarTurno(dto, auth.getName()));
	}


	@DeleteMapping("/turno/{turnoId}")
	public ResponseEntity<String> cancelarReserva(
	        @PathVariable Long turnoId,
	        Authentication auth) {
	    reservaService.cancelarPorTurno(turnoId, auth.getName());
	    return ResponseEntity.ok("Reserva cancelada exitosamente");
	}
    
    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Reserva>> reservasUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(reservaService.obtenerReservasUsuario(id));
    }
    
    @GetMapping("/todos")
    public List<Reserva> listarTodas(){
		return reservaService.findAll();
	}
    
    @GetMapping("/mis-reservas")
    public ResponseEntity<List<ReservaDTO>> misReservas(Authentication auth) {
        return ResponseEntity.ok(reservaService.obtenerMisReservas(auth.getName()));
    }
    
    @GetMapping("/mi-indice")
    public ResponseEntity<IndiceAsistenciaDTO> miIndice(Authentication auth) {
        return ResponseEntity.ok(reservaService.obtenerIndiceAsistencia(auth.getName()));
    }
}

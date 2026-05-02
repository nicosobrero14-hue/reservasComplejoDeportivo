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
 
import com.nsobrero.reservasTurnos.dto.PartidoReservaDTO;
import com.nsobrero.reservasTurnos.dto.TurnoPartidoDTO;
import com.nsobrero.reservasTurnos.service.PartidoService;
 
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
 
@RestController
@RequestMapping("/partidos")
@RequiredArgsConstructor
public class PartidoController {
 
    private final PartidoService partidoService;
 
    // POST /partidos/reservar — reservar como equipo local
    @PostMapping("/reservar")
    public ResponseEntity<TurnoPartidoDTO> reservar(
            @Valid @RequestBody PartidoReservaDTO dto,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(partidoService.reservarComoEquipo(dto, auth.getName()));
    }
 
    // POST /partidos/{turnoId}/unirse — unirse como rival
    @PostMapping("/{turnoId}/unirse")
    public ResponseEntity<TurnoPartidoDTO> unirse(
            @PathVariable Long turnoId,
            Authentication auth) {
        return ResponseEntity.ok(partidoService.unirseComoRival(turnoId, auth.getName()));
    }
 
    // DELETE /partidos/{turnoId} — cancelar (solo equipo local, hasta 2h antes)
    @DeleteMapping("/{turnoId}")
    public ResponseEntity<String> cancelar(
            @PathVariable Long turnoId,
            Authentication auth) {
        partidoService.cancelarEquipo(turnoId, auth.getName());
        return ResponseEntity.ok("Reserva de partido cancelada");
    }
 
    // GET /partidos/buscando — tablero de equipos buscando rival
    @GetMapping("/buscando")
    public ResponseEntity<List<TurnoPartidoDTO>> buscando(Authentication auth) {
        return ResponseEntity.ok(partidoService.listarBuscandoRival(auth.getName()));
    }
 
    // GET /partidos/mis-partidos — mis partidos
    @GetMapping("/mis-partidos")
    public ResponseEntity<List<TurnoPartidoDTO>> misPartidos(Authentication auth) {
        return ResponseEntity.ok(partidoService.misPartidos(auth.getName()));
    }
}
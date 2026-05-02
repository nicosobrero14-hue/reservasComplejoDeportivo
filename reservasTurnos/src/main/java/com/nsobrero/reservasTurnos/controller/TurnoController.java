package com.nsobrero.reservasTurnos.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nsobrero.reservasTurnos.dto.TurnoDTO;
import com.nsobrero.reservasTurnos.entity.Turno;
import com.nsobrero.reservasTurnos.service.TurnoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/turnos")
@RequiredArgsConstructor
public class TurnoController {
	
	private final TurnoService turnoService;

    @GetMapping
    public List<Turno> obtenerTurnos(@RequestParam Long canchaId, @RequestParam String fecha){
  
        LocalDate fechaTurno = LocalDate.parse(fecha);
        return turnoService.obtenerTurnos(canchaId, fechaTurno);
    }
    
    @GetMapping("/disciplina/{id}")
    public List<Turno> obtenerTurnosPorDisciplina(@PathVariable Long id, @RequestParam String fecha){
  
		LocalDate fechaTurno = LocalDate.parse(fecha);
		return turnoService.obtenerTurnosPorDisciplina(id, fechaTurno);
    }
    
    @GetMapping("/todos")
    public List<Turno> listarTodos(){
        return turnoService.findAll();
    }
    
    @GetMapping("/por-fecha")
    public ResponseEntity<List<TurnoDTO>> listarPorFecha(
            @RequestParam LocalDate fecha,
            @RequestParam(required = false) Long usuarioId) {

        return ResponseEntity.ok(turnoService.listarPorFecha(fecha, usuarioId));
    }
}
package com.nsobrero.reservasTurnos.controller;

import java.time.LocalDate;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nsobrero.reservasTurnos.service.TurnoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/turnos")
@RequiredArgsConstructor
public class AdminTurnoController {
	
	private final TurnoService turnoService;

	// Endpoint para generar turnos automáticamente para un día específico
    @PostMapping("/generar")
    public String generarTurnos(@RequestParam String fecha){

        turnoService.generarTurnos(LocalDate.parse(fecha));

        return "Turnos generados";

    }

}
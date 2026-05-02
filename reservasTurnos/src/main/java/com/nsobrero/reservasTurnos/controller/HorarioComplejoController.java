package com.nsobrero.reservasTurnos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nsobrero.reservasTurnos.entity.HorarioComplejo;
import com.nsobrero.reservasTurnos.service.HorarioComplejoService;

@RestController
@RequestMapping("/horario")
public class HorarioComplejoController {
	
	@Autowired
	private HorarioComplejoService horarioComplejoService;
	
	@PostMapping
	public HorarioComplejo crearHorario(@RequestBody HorarioComplejo horario){
	    return horarioComplejoService.guardarHorario(horario);
	}

	@GetMapping
	public List<HorarioComplejo> listar(){
	    return horarioComplejoService.listarHorarios();
	}

}

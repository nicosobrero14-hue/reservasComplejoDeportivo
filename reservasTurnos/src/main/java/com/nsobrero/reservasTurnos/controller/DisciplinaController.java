package com.nsobrero.reservasTurnos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nsobrero.reservasTurnos.entity.Disciplina;
import com.nsobrero.reservasTurnos.service.DisciplinaService;

@RestController
@RequestMapping("/disciplinas")
public class DisciplinaController {
	
	@Autowired
	private DisciplinaService disciplinaService;

    @PostMapping
    public Disciplina crearDisciplina(@RequestBody Disciplina disciplina){
        return disciplinaService.crearDisciplina(disciplina);
    }

    @GetMapping
    public List<Disciplina> listarDisciplinas(){
        return disciplinaService.listarDisciplinas();
    }

}

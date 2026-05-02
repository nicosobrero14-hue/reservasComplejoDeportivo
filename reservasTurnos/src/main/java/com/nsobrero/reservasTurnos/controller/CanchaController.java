package com.nsobrero.reservasTurnos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nsobrero.reservasTurnos.dto.CanchaDTO;
import com.nsobrero.reservasTurnos.entity.Cancha;
import com.nsobrero.reservasTurnos.service.CanchaService;

@RestController
@RequestMapping("/canchas")
public class CanchaController {
	
	@Autowired
    private CanchaService canchaService;

    @PostMapping
    public Cancha crearCancha(@RequestBody CanchaDTO dto){
        return canchaService.crearCancha(dto);
    }

    @GetMapping("/disciplina/{id}")
    public List<Cancha> obtenerPorDisciplina(@PathVariable Long id){
        return canchaService.obtenerPorDisciplina(id);
    }
    
    @GetMapping
    public List<Cancha> listarCanchas(){
        return canchaService.listarCanchas();
    }
}

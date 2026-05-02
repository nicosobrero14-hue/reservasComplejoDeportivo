package com.nsobrero.reservasTurnos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nsobrero.reservasTurnos.entity.Disciplina;
import com.nsobrero.reservasTurnos.repository.DisciplinaRepository;

@Service
public class DisciplinaService {
	
	@Autowired
	private DisciplinaRepository disciplinaRepository;


    public Disciplina crearDisciplina(Disciplina disciplina) {
    	
        return disciplinaRepository.save(disciplina);
    }

    public List<Disciplina> listarDisciplinas() {
        return disciplinaRepository.findAll();
    }
}

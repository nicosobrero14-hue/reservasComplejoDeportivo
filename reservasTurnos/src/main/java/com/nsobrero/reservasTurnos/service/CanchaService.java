package com.nsobrero.reservasTurnos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nsobrero.reservasTurnos.dto.CanchaDTO;
import com.nsobrero.reservasTurnos.entity.Cancha;
import com.nsobrero.reservasTurnos.entity.Disciplina;
import com.nsobrero.reservasTurnos.repository.CanchaRepository;
import com.nsobrero.reservasTurnos.repository.DisciplinaRepository;

@Service
public class CanchaService {
	
	@Autowired
	private CanchaRepository canchaRepository;
	
	@Autowired
	private DisciplinaRepository disciplinaRepository;


    public Cancha crearCancha(CanchaDTO dto) {
        
    	Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
				.orElseThrow(() -> new RuntimeException("Disciplina no encontrada"));

		Cancha cancha = new Cancha();
		cancha.setNombre(dto.getNombre());
		cancha.setDisciplina(disciplina);

		return canchaRepository.save(cancha);
    }

    public List<Cancha> obtenerPorDisciplina(Long disciplinaId) {
        return canchaRepository.findByDisciplinaId(disciplinaId);
    }
    
    public List<Cancha> listarCanchas() {
		return canchaRepository.findAll();
	}
    
    
}

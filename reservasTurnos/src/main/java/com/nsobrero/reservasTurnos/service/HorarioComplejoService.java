package com.nsobrero.reservasTurnos.service;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nsobrero.reservasTurnos.entity.HorarioComplejo;
import com.nsobrero.reservasTurnos.repository.HorarioComplejoRepository;

@Service
public class HorarioComplejoService {
	
	@Autowired
	private HorarioComplejoRepository horarioRepository;
	
	
	 public HorarioComplejo guardarHorario(HorarioComplejo horario){

	        Optional<HorarioComplejo> existente =
	                horarioRepository.findByDiaSemana(horario.getDiaSemana());

	        if(existente.isPresent()){

	            HorarioComplejo h = existente.get();

	            h.setHoraApertura(horario.getHoraApertura());
	            h.setHoraCierre(horario.getHoraCierre());

	            return horarioRepository.save(h);
	        }
	        return horarioRepository.save(horario);
	    }
	 
	// Obtener horario por día
	    public HorarioComplejo obtenerHorarioPorDia(DayOfWeek dia){

	        return horarioRepository
	                .findByDiaSemana(dia)
	                .orElseThrow(() ->
	                        new RuntimeException("No hay horario configurado para " + dia));
	    }

	    // Listar todos los horarios
	    public List<HorarioComplejo> listarHorarios(){
	        return horarioRepository.findAll();
	    }

    public HorarioComplejo obtenerHorario(){

        return horarioRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Horario no configurado"));
    }

}

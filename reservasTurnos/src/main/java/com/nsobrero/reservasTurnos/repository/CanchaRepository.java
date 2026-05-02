package com.nsobrero.reservasTurnos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nsobrero.reservasTurnos.entity.Cancha;

@Repository
public interface CanchaRepository extends JpaRepository<Cancha, Long> {
	
	// Agrega un método para encontrar canchas por disciplina
	List<Cancha> findByDisciplinaId(Long disciplinaId);
}

package com.nsobrero.reservasTurnos.repository;

import java.time.DayOfWeek;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nsobrero.reservasTurnos.entity.HorarioComplejo;

@Repository
public interface HorarioComplejoRepository extends JpaRepository<HorarioComplejo, Long> {	
	
	Optional<HorarioComplejo> findByDiaSemana(DayOfWeek diaSemana);
}

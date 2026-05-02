package com.nsobrero.reservasTurnos.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
 
import com.nsobrero.reservasTurnos.entity.CodigoVerificacion;
import com.nsobrero.reservasTurnos.entity.Usuario;
 
public interface CodigoVerificacionRepository extends JpaRepository<CodigoVerificacion, Long> {
    Optional<CodigoVerificacion> findTopByUsuarioOrderByIdDesc(Usuario usuario);
}

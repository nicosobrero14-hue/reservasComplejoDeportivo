package com.nsobrero.reservasTurnos.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nsobrero.reservasTurnos.dto.UsuarioCreateDTO;
import com.nsobrero.reservasTurnos.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	
	// Método para encontrar un usuario por su email
	Optional<Usuario> findByEmail(String email);
	// Método para guardar un nuevo usuario a partir de un DTO
	Usuario save(UsuarioCreateDTO dto);
	
	
	
}

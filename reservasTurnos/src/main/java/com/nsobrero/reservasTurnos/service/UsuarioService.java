package com.nsobrero.reservasTurnos.service;


import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nsobrero.reservasTurnos.dto.UsuarioAdminDTO;
import com.nsobrero.reservasTurnos.dto.UsuarioCreateDTO;
import com.nsobrero.reservasTurnos.dto.UsuarioDTO;
import com.nsobrero.reservasTurnos.dto.UsuarioUpdateDTO;
import com.nsobrero.reservasTurnos.entity.Usuario;
import com.nsobrero.reservasTurnos.enums.Role;
import com.nsobrero.reservasTurnos.exception.AccesoDenegadoException;
import com.nsobrero.reservasTurnos.exception.RecursoNoEncontradoException;
import com.nsobrero.reservasTurnos.exception.ReservaDuplicadaException;
import com.nsobrero.reservasTurnos.repository.UsuarioRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {
	
	private final UsuarioRepository usuarioRepository;
	
	private final PasswordEncoder passwordEncoder;
	
	private final VerificacionService verificacionService;
	
	public UsuarioAdminDTO registrarAdmin(UsuarioAdminDTO dto) {
		
		Usuario usuario = new Usuario();
		usuario.setNombre(dto.getNombre());
		usuario.setApellido(dto.getApellido());
		usuario.setEmail(dto.getEmail());
		usuario.setCelular(dto.getCelular());
		usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
		usuario.setRole(Role.ADMIN);
		
		// Verificar si el email ya está registrado
		if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
			throw new RuntimeException("El email ya está registrado");
		}
		
		Usuario savedUsuario = usuarioRepository.save(usuario);
		usuario.setVerificado(false);
		usuarioRepository.save(usuario);
		verificacionService.enviarCodigo(dto.getEmail());
		
		return new UsuarioAdminDTO(savedUsuario.getNombre(), savedUsuario.getApellido(), savedUsuario.getEmail(), savedUsuario.getCelular(), savedUsuario.getPassword());
	}
	
	public UsuarioDTO registrarUsuario(UsuarioCreateDTO dto) {
		
		Usuario usuario = new Usuario();
		usuario.setNombre(dto.getNombre());
		usuario.setApellido(dto.getApellido());
		usuario.setEmail(dto.getEmail());
		usuario.setCelular(dto.getCelular());
		usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
		usuario.setRole(Role.USER);
		
		// Verificar si el email ya está registrado
		if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
			throw new RuntimeException("El email ya está registrado");
		}
		
		Usuario savedUsuario = usuarioRepository.save(usuario);
		
		// Retornar un DTO con los datos del usuario registrado (sin la contraseña)
		return new UsuarioDTO(savedUsuario.getId(), savedUsuario.getNombre(), savedUsuario.getApellido(), savedUsuario.getEmail(), savedUsuario.getCelular(), savedUsuario.getRole().name(), savedUsuario.getFechaRegistro());
	}
	
	public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
	
	//Listar todos los usuarios registrados mostrando datos de dto
    public List<UsuarioDTO> listarUsuarios() {
		List<Usuario> usuarios = usuarioRepository.findAll();
		return usuarios.stream()
				.map(usuario -> new UsuarioDTO(
						usuario.getId(),
						usuario.getNombre(),
						usuario.getApellido(),
						usuario.getEmail(),
						usuario.getCelular(),
						usuario.getRole().name(),
						usuario.getFechaRegistro()
				))
				.toList();
	}

	public Optional<Usuario> buscarPorId(Long usuarioId) {
	
		return usuarioRepository.findById(usuarioId);
	}
	
	 @Transactional
	 public UsuarioDTO actualizarPerfil(String emailActual, UsuarioUpdateDTO dto) {
	     Usuario usuario = usuarioRepository.findByEmail(emailActual)
	         .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
	
	     // Validar email único si lo cambia
	     if (dto.getEmail() != null 
	    		    && !dto.getEmail().isBlank() 
	    		    && !dto.getEmail().equals(emailActual)) {
	    		    if (usuarioRepository.findByEmail(dto.getEmail()).isPresent()) {
	    		        throw new ReservaDuplicadaException("El email ya está en uso");
	    		    }
	    		    usuario.setEmail(dto.getEmail());
	     }
	     
	     if (dto.getNombre() != null && !dto.getNombre().isBlank()) 
	    	    usuario.setNombre(dto.getNombre());
	    	    
	    	if (dto.getApellido() != null && !dto.getApellido().isBlank()) 
	    	    usuario.setApellido(dto.getApellido());
	    	    
	    	if (dto.getCelular() != null && !dto.getCelular().isBlank()) 
	    	    usuario.setCelular(dto.getCelular());
	
	     // Cambio de contraseña — validar la actual
	     if (dto.getPasswordNueva() != null && !dto.getPasswordNueva().isBlank()) {
	         if (dto.getPasswordActual() == null ||
	             !passwordEncoder.matches(dto.getPasswordActual(), usuario.getPassword())) {
	             throw new AccesoDenegadoException("La contraseña actual es incorrecta");
	         }
	         usuario.setPassword(passwordEncoder.encode(dto.getPasswordNueva()));
	     }
	
	     usuarioRepository.save(usuario);
	
	     return new UsuarioDTO(
	         usuario.getId(),
	         usuario.getNombre(),
	         usuario.getApellido(),
	         usuario.getEmail(),
	         usuario.getCelular(),
	         usuario.getRole().name(),
	         usuario.getFechaRegistro()
	         
	     );
	 }
}

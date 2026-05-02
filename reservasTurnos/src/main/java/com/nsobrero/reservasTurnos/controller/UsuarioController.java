package com.nsobrero.reservasTurnos.controller;

import java.util.List;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nsobrero.reservasTurnos.dto.UsuarioAdminDTO;
import com.nsobrero.reservasTurnos.dto.UsuarioCreateDTO;
import com.nsobrero.reservasTurnos.dto.UsuarioDTO;
import com.nsobrero.reservasTurnos.dto.UsuarioUpdateDTO;
import com.nsobrero.reservasTurnos.service.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
	
	private final UsuarioService usuarioService;

	@PostMapping("/admin")
	public UsuarioAdminDTO registrarAdmin(@RequestBody UsuarioAdminDTO dto){
		return usuarioService.registrarAdmin(dto);
	}
	
	@PostMapping
	public ResponseEntity<UsuarioDTO> registrarUsuario(@Valid @RequestBody UsuarioCreateDTO dto) {
	    return ResponseEntity
	        .status(HttpStatus.CREATED)
	        .body(usuarioService.registrarUsuario(dto));
	}

    @GetMapping
    public List<UsuarioDTO> listarUsuarios(){
        return usuarioService.listarUsuarios();
    }
    
  @PatchMapping("/perfil")
  public ResponseEntity<UsuarioDTO> actualizarPerfil(
          @RequestBody UsuarioUpdateDTO dto,
          Authentication auth) {
      return ResponseEntity.ok(usuarioService.actualizarPerfil(auth.getName(), dto));
  }
}

package com.nsobrero.reservasTurnos.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nsobrero.reservasTurnos.dto.UsuarioDTO;
import com.nsobrero.reservasTurnos.entity.Usuario;
import com.nsobrero.reservasTurnos.exception.AccesoDenegadoException;
import com.nsobrero.reservasTurnos.exception.RecursoNoEncontradoException;
import com.nsobrero.reservasTurnos.repository.UsuarioRepository;
import com.nsobrero.reservasTurnos.security.JwtUtil;
import com.nsobrero.reservasTurnos.security.LoginRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

	private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // POST /auth/login → devuelve token
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {

        Usuario usuario = usuarioRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "Email o contraseña incorrectos"));

        if (!passwordEncoder.matches(req.getPassword(), usuario.getPassword())) {
            throw new RecursoNoEncontradoException("Email o contraseña incorrectos");
        }
        
        if (!usuario.isVerificado()) {
        	throw new AccesoDenegadoException("Debés verificar tu cuenta antes de ingresar");
       }

        String token = jwtUtil.generarToken(usuario.getEmail(), usuario.getRole());

        return ResponseEntity.ok(Map.of(
            "token", token,
            "role", usuario.getRole().name(),
            "nombre", usuario.getNombre()
        ));
    }

    // GET /auth/me → devuelve datos del usuario autenticado (sin password)
    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> me(Authentication auth) {

        Usuario usuario = usuarioRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "Usuario no encontrado"));

        return ResponseEntity.ok(new UsuarioDTO(
            usuario.getId(), usuario.getNombre(),
            usuario.getApellido(), usuario.getEmail(),
            usuario.getCelular(),
            usuario.getRole().name(),  // <-- agregamos el rol al DTO para que se vea en la respuesta de /auth/me, aunque no es estrictamente necesario porque el rol ya está incluido en el token JWT y se puede extraer de ahí en el frontend si es necesario. Pero puede ser útil tenerlo directamente en la respuesta para mostrarlo en la interfaz o tomar decisiones de UI basadas en el rol del
            usuario.getFechaRegistro()
        ));
    }
    
    
}
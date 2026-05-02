package com.nsobrero.reservasTurnos.service;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import com.nsobrero.reservasTurnos.entity.TokenRecuperacion;
import com.nsobrero.reservasTurnos.entity.Usuario;
import com.nsobrero.reservasTurnos.exception.RecursoNoEncontradoException;
import com.nsobrero.reservasTurnos.repository.TokenRecuperacionRepository;
import com.nsobrero.reservasTurnos.repository.UsuarioRepository;
 
import lombok.RequiredArgsConstructor;
 
@Service
@RequiredArgsConstructor
public class RecuperacionService {
 
    private final UsuarioRepository usuarioRepository;
    private final TokenRecuperacionRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
 
    @Transactional
    public void solicitarRecuperacion(String email) {
        // Si el email no existe no informamos — evita enumeración de usuarios
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            String token = UUID.randomUUID().toString();
            tokenRepository.save(new TokenRecuperacion(token, usuario));
            emailService.enviarRecuperacion(email, token);
        });
    }
 
    @Transactional
    public void resetearPassword(String token, String nuevaPassword) {
        TokenRecuperacion tr = tokenRepository.findByToken(token)
            .orElseThrow(() -> new RecursoNoEncontradoException("Token inválido"));
 
        if (!tr.estaVigente()) {
            throw new RecursoNoEncontradoException("El token expiró o ya fue usado");
        }
 
        Usuario usuario = tr.getUsuario();
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
 
        tr.setUsado(true);
        tokenRepository.save(tr);
    }
}

package com.nsobrero.reservasTurnos.service;

import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import com.nsobrero.reservasTurnos.entity.CodigoVerificacion;
import com.nsobrero.reservasTurnos.entity.Usuario;
import com.nsobrero.reservasTurnos.exception.AccesoDenegadoException;
import com.nsobrero.reservasTurnos.exception.RecursoNoEncontradoException;
import com.nsobrero.reservasTurnos.repository.CodigoVerificacionRepository;
import com.nsobrero.reservasTurnos.repository.UsuarioRepository;
 
import lombok.RequiredArgsConstructor;
 
@Service
@RequiredArgsConstructor
public class VerificacionService {
 
    private final UsuarioRepository usuarioRepository;
    private final CodigoVerificacionRepository codigoRepository;
    private final EmailService emailService;
 
    @Transactional
    public void enviarCodigo(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
 
        if (usuario.isVerificado()) {
            throw new AccesoDenegadoException("La cuenta ya está verificada");
        }
 
        String codigo = String.format("%06d", new Random().nextInt(999999));
        codigoRepository.save(new CodigoVerificacion(codigo, usuario));
        emailService.enviarCodigoVerificacion(email, codigo);
    }
 
    @Transactional
    public void verificarCodigo(String email, String codigo) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
 
        CodigoVerificacion cv = codigoRepository
            .findTopByUsuarioOrderByIdDesc(usuario)
            .orElseThrow(() -> new RecursoNoEncontradoException("No hay código generado"));
 
        if (!cv.getCodigo().equals(codigo)) {
            throw new AccesoDenegadoException("Código incorrecto");
        }
 
        if (!cv.estaVigente()) {
            throw new AccesoDenegadoException("El código expiró. Solicitá uno nuevo.");
        }
 
        usuario.setVerificado(true);
        usuarioRepository.save(usuario);
 
        cv.setUsado(true);
        codigoRepository.save(cv);
    }
}

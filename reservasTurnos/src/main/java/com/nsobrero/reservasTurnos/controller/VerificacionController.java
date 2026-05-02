package com.nsobrero.reservasTurnos.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import com.nsobrero.reservasTurnos.service.VerificacionService;
 
import lombok.RequiredArgsConstructor;
 
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class VerificacionController {
 
    private final VerificacionService verificacionService;
 
    // POST /auth/enviar-codigo
    @PostMapping("/enviar-codigo")
    public ResponseEntity<String> enviar(@RequestBody Map<String, String> body) {
        verificacionService.enviarCodigo(body.get("email"));
        return ResponseEntity.ok("Código enviado");
    }
 
    // POST /auth/verificar
    @PostMapping("/verificar")
    public ResponseEntity<String> verificar(@RequestBody Map<String, String> body) {
        verificacionService.verificarCodigo(body.get("email"), body.get("codigo"));
        return ResponseEntity.ok("Cuenta verificada correctamente");
    }
}
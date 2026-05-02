package com.nsobrero.reservasTurnos.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import com.nsobrero.reservasTurnos.service.RecuperacionService;
 
import lombok.RequiredArgsConstructor;
 
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class RecuperacionController {
 
    private final RecuperacionService recuperacionService;
 
    // POST /auth/recuperar — solicitar email de recuperación
    @PostMapping("/recuperar")
    public ResponseEntity<String> solicitar(@RequestBody Map<String, String> body) {
        recuperacionService.solicitarRecuperacion(body.get("email"));
        // Siempre devuelve 200 aunque el email no exista (seguridad)
        return ResponseEntity.ok("Si el email existe, recibirás un link en breve");
    }
 
    // POST /auth/reset-password — cambiar la contraseña con el token
    @PostMapping("/reset-password")
    public ResponseEntity<String> reset(@RequestBody Map<String, String> body) {
        recuperacionService.resetearPassword(body.get("token"), body.get("password"));
        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }
}

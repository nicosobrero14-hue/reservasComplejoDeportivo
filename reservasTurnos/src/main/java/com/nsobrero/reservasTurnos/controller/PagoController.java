package com.nsobrero.reservasTurnos.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
 
import com.nsobrero.reservasTurnos.dto.PagoRequestDTO;
import com.nsobrero.reservasTurnos.dto.PagoResponseDTO;
import com.nsobrero.reservasTurnos.service.PagoService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
 
@RestController
@RequestMapping("/pagos")
@RequiredArgsConstructor
public class PagoController {
 
    private final PagoService pagoService;
 
    // POST /pagos/iniciar — inicia el proceso de pago
    @PostMapping("/iniciar")
    public ResponseEntity<PagoResponseDTO> iniciar(
            @Valid @RequestBody PagoRequestDTO dto,
            Authentication auth) {
        return ResponseEntity.ok(pagoService.iniciarPago(dto, auth.getName()));
    }
 
    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "ngrok-skip-browser-warning", required = false) String skip) {
        pagoService.procesarWebhook(payload);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/retorno")
    public void retorno(
            @RequestParam String estado,
            @RequestParam(required = false) String reservaId,
            HttpServletResponse response) throws IOException {
        
        String frontUrl = "http://localhost:5173";
        String destino = "exitoso".equals(estado) 
            ? frontUrl + "/pago-exitoso?reservaId=" + reservaId
            : frontUrl + "/pago-fallido?reservaId=" + reservaId;

        // ✅ Redirigir via JavaScript — evita la pantalla de ngrok
        response.setContentType("text/html");
        response.getWriter().write(
            "<html><head>" +
            "<meta http-equiv='refresh' content='0;url=" + destino + "'>" +
            "</head><body>" +
            "<script>window.location.href='" + destino + "';</script>" +
            "Redirigiendo..." +
            "</body></html>"
        );
    }
}
 
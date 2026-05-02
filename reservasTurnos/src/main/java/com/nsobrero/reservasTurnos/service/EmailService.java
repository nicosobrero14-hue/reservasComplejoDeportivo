package com.nsobrero.reservasTurnos.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
 
import lombok.RequiredArgsConstructor;
 
@Service
@RequiredArgsConstructor
public class EmailService {
 
    private final JavaMailSender mailSender;
 
    @Value("${app.frontend.url}")
    private String frontendUrl;
 
    @Value("${spring.mail.username}")
    private String fromEmail;
 
    public void enviarRecuperacion(String destinatario, String token) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(fromEmail);
        mensaje.setTo(destinatario);
        mensaje.setSubject("Recuperación de contraseña — Complejo Deportivo");
        mensaje.setText(
            "Hola,\n\n" +
            "Recibimos una solicitud para restablecer tu contraseña.\n\n" +
            "Hacé clic en el siguiente link para continuar:\n" +
            frontendUrl + "/reset-password?token=" + token + "\n\n" +
            "Este link expira en 15 minutos.\n\n" +
            "Si no solicitaste esto, ignorá este mensaje.\n\n" +
            "— Complejo Deportivo"
        );
        mailSender.send(mensaje);
    }
    
    public void enviarCodigoVerificacion(String destinatario, String codigo) {
      SimpleMailMessage mensaje = new SimpleMailMessage();
      mensaje.setFrom(fromEmail);
      mensaje.setTo(destinatario);
      mensaje.setSubject("Verificá tu cuenta — Complejo Deportivo");
      mensaje.setText(
          "Hola,\n\n" +
          "Tu código de verificación es:\n\n" +
          "        " + codigo + "\n\n" +
          "Este código expira en 10 minutos.\n\n" +
          "Si no creaste una cuenta, ignorá este mensaje.\n\n" +
          "— Complejo Deportivo"
      );
      mailSender.send(mensaje);
  }
}
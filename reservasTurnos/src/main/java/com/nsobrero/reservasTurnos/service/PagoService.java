package com.nsobrero.reservasTurnos.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import com.nsobrero.reservasTurnos.dto.PagoRequestDTO;
import com.nsobrero.reservasTurnos.dto.PagoResponseDTO;
import com.nsobrero.reservasTurnos.entity.ConfiPago;

import com.nsobrero.reservasTurnos.entity.Reserva;
import com.nsobrero.reservasTurnos.entity.Turno;
import com.nsobrero.reservasTurnos.entity.Usuario;
import com.nsobrero.reservasTurnos.enums.EstadoPago;
import com.nsobrero.reservasTurnos.enums.EstadoReserva;
import com.nsobrero.reservasTurnos.enums.EstadoTurno;
import com.nsobrero.reservasTurnos.enums.MetodoPago;
import com.nsobrero.reservasTurnos.exception.AccesoDenegadoException;
import com.nsobrero.reservasTurnos.exception.RecursoNoEncontradoException;
import com.nsobrero.reservasTurnos.exception.TurnoNoDisponibleException;
import com.nsobrero.reservasTurnos.repository.ConfiPagoRepository;

import com.nsobrero.reservasTurnos.repository.ReservaRepository;
import com.nsobrero.reservasTurnos.repository.TurnoRepository;
import com.nsobrero.reservasTurnos.repository.UsuarioRepository;
 
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
 
@Service
@RequiredArgsConstructor
public class PagoService {
 
    private final TurnoRepository turnoRepository;
    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ConfiPagoRepository confiPagoRepository;

    @Value("${mercadopago.webhook-url}")
    private String webhookUrl;
 
    @Value("${mercadopago.access-token}")
    private String accessToken;
 
    @Value("${mercadopago.success-url}")
    private String successUrl;
 
    @Value("${mercadopago.failure-url}")
    private String failureUrl;
 
    @Value("${mercadopago.pending-url}")
    private String pendingUrl;
 
    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
    }
 
    @Transactional
    public PagoResponseDTO iniciarPago(PagoRequestDTO dto, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
 
        Turno turno = turnoRepository.findById(dto.getTurnoId())
            .orElseThrow(() -> new RecursoNoEncontradoException("Turno no encontrado"));
 
        // ✅ Después — acepta DISPONIBLE o ESPERANDO_RIVAL (para visitante)
        if (turno.getEstado() == EstadoTurno.RESERVADO 
            || turno.getEstado() == EstadoTurno.COMPLETO
            || turno.getEstado() == EstadoTurno.ESPERANDO_PAGO) {
            throw new TurnoNoDisponibleException("El turno no está disponible");
        }
        
        // Si es visitante uniéndose, el turno tiene que estar ESPERANDO_RIVAL
        if (dto.isEsVisitante() && turno.getEstado() != EstadoTurno.ESPERANDO_RIVAL) {
            throw new TurnoNoDisponibleException("Este turno ya no está buscando rival");
        }

        // Si no es visitante, tiene que estar DISPONIBLE
        if (!dto.isEsVisitante() && turno.getEstado() != EstadoTurno.DISPONIBLE) {
            throw new TurnoNoDisponibleException("El turno ya está " + turno.getEstado().name().toLowerCase());
        }
 
        // Calcular monto
        BigDecimal precioBase = turno.getCancha().getDisciplina().getPrecio();
        if (precioBase == null || precioBase.compareTo(BigDecimal.ZERO) == 0) {
            throw new AccesoDenegadoException("Esta disciplina no tiene precio configurado");
        }
 
        // Si es modo partido, cobrar mitad
        BigDecimal monto = dto.isEsPartido()
            ? precioBase.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP)
            : precioBase;
 
        BigDecimal descuento = BigDecimal.ZERO;
        BigDecimal total = monto;
        
        
        Reserva reserva;
        Optional<Reserva> reservaExistente = reservaRepository
            .findByTurnoIdAndUsuarioId(turno.getId(), usuario.getId());

        if (reservaExistente.isPresent()) {
            reserva = reservaExistente.get();
            reserva.setEstado(EstadoReserva.PENDIENTE_PAGO);
            reserva.setFechaReserva(LocalDateTime.now());
            reserva.setMetodoPago(dto.getMetodoPago());
            reserva.setMontoAbonado(total);
            reserva.setEstadoPago(EstadoPago.PENDIENTE);
            reserva.setMercadoPagoId(null);
        } else {
            reserva = new Reserva();
            reserva.setTurno(turno);
            reserva.setUsuario(usuario);
            reserva.setFechaReserva(LocalDateTime.now());
            reserva.setEstado(EstadoReserva.PENDIENTE_PAGO);
            reserva.setMetodoPago(dto.getMetodoPago());
            reserva.setMontoAbonado(total);
            reserva.setEstadoPago(EstadoPago.PENDIENTE);
        }

        // Para efectivo:
        if (dto.getMetodoPago() == MetodoPago.EFECTIVO) {
            reserva.setEstado(EstadoReserva.ACTIVA);
            turno.setEstado(EstadoTurno.RESERVADO);
            turnoRepository.save(turno);
            reservaRepository.save(reserva);
            return new PagoResponseDTO(
				reserva.getId(),
				dto.getMetodoPago().name(),
				monto,
				descuento,
				total,
				null, // linkPago es null para efectivo
				reserva.getEstadoPago().name(),
				"Reserva confirmada. Por favor, abona en efectivo antes de jugar."
			);
        }

      // Antes de poner ESPERANDO_PAGO, si es partido marcar el equipo local:
        if (dto.isEsPartido()) {
            turno.setModoPartido(true);
            turno.setEquipoLocal(usuario);
        }
        turno.setEstado(EstadoTurno.ESPERANDO_PAGO);
        
        if (dto.isEsVisitante()) {
            turno.setEquipoVisitante(usuario);
            turno.setEstado(EstadoTurno.ESPERANDO_PAGO);
        } else if (dto.isEsPartido()) {
            turno.setModoPartido(true);
            turno.setEquipoLocal(usuario);
            turno.setEstado(EstadoTurno.ESPERANDO_PAGO);
        } else {
            turno.setEstado(EstadoTurno.ESPERANDO_PAGO);
        }
        turnoRepository.save(turno);
        reservaRepository.save(reserva);

        // ✅ Crear preferencia en MercadoPago y devolver link de pago
        if (dto.getMetodoPago() == MetodoPago.ONLINE) {
            // Calcular descuento
            ConfiPago config = confiPagoRepository.findById(1L)
                .orElse(new ConfiPago(10));
            BigDecimal pctDescuento = BigDecimal.valueOf(config.getDescuentoOnlinePorcentaje())
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            descuento = monto.multiply(pctDescuento).setScale(2, RoundingMode.HALF_UP);
            total = monto.subtract(descuento);
            reserva.setMontoAbonado(total);
            reservaRepository.save(reserva);

            String linkPago = crearPreferencia(reserva, turno, total);

            return new PagoResponseDTO(
                reserva.getId(),
                "ONLINE",
                monto,
                descuento,
                total,
                linkPago,
                "PENDIENTE_PAGO",
                "Descuento aplicado: $" + descuento + ". Total: $" + total
            );
        }

        // No debería llegar acá
        throw new RuntimeException("Método de pago no reconocido");
       
    }
 
    // Webhook de MercadoPago — confirma el pago
    @Transactional
    public void procesarWebhook(Map<String, Object> payload) {
        try {
            System.out.println("WEBHOOK: " + payload);
            String type = (String) payload.get("type");
            if (!"payment".equals(type)) return;

            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            String paymentId = data.get("id").toString();

            com.mercadopago.client.payment.PaymentClient client =
                new com.mercadopago.client.payment.PaymentClient();
            com.mercadopago.resources.payment.Payment payment =
                client.get(Long.valueOf(paymentId));

            String externalRef = payment.getExternalReference();
            if (externalRef == null) return;

            reservaRepository.findById(Long.valueOf(externalRef)).ifPresent(reserva -> {
                reserva.setEstadoPago(EstadoPago.PAGADO);
                reserva.setEstado(EstadoReserva.ACTIVA);
                reserva.setMercadoPagoId(paymentId);

                Turno turno = reserva.getTurno();

                // ✅ Lógica de estado según modo partido
                if (turno.isModoPartido()) {
                    if (turno.getEquipoVisitante() != null) {
                        // Visitante pagó → partido completo
                        turno.setEstado(EstadoTurno.COMPLETO);
                    } else {
                        // Local pagó → esperando rival
                        turno.setEstado(EstadoTurno.ESPERANDO_RIVAL);
                    }
                } else {
                    turno.setEstado(EstadoTurno.RESERVADO);
                }

                turnoRepository.save(turno);
                reservaRepository.save(reserva);
                System.out.println("Reserva " + reserva.getId() + " activada, turno: " + turno.getEstado());
            });

        } catch (Exception e) {
            System.err.println("Error webhook: " + e.getMessage());
        }
    }
 
    private String crearPreferencia(Reserva reserva, Turno turno, BigDecimal total) {
        try {
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");
            String titulo = turno.getCancha().getDisciplina().getNombre()
                + " — " + turno.getCancha().getNombre()
                + " | " + turno.getFecha()
                + " " + turno.getHoraInicio().format(fmt)
                + "-" + turno.getHoraFin().format(fmt);
 
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                .title(titulo)
                .quantity(1)
                .unitPrice(total)
                .currencyId("ARS")
                .build();
 
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
            	    .success(webhookUrl.replace("/pagos/webhook", "") + "/pagos/retorno?estado=exitoso&reservaId=" + reserva.getId())
            	    .failure(webhookUrl.replace("/pagos/webhook", "") + "/pagos/retorno?estado=fallido&reservaId=" + reserva.getId())
            	    .pending(webhookUrl.replace("/pagos/webhook", "") + "/pagos/retorno?estado=pendiente&reservaId=" + reserva.getId())
            	    .build();
 
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
            	    .items(List.of(item))
            	    .backUrls(backUrls)
            	    .autoReturn("approved")
            	    .externalReference(reserva.getId().toString())
            	    .notificationUrl(webhookUrl) // ← agregar esta línea
            	    .build();
 
            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);
 
            // Guardar el id de preferencia en la reserva
            
            reservaRepository.save(reserva);
 
            return preference.getInitPoint();
        } catch (Exception e) {
            throw new RuntimeException("Error creando preferencia en MercadoPago: " + e.getMessage());
        }
    }
}
 

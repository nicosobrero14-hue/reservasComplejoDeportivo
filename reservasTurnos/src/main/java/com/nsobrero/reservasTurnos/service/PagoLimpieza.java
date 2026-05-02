package com.nsobrero.reservasTurnos.service;
 
import java.time.LocalDateTime;
import java.util.List;
 
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import com.nsobrero.reservasTurnos.entity.Reserva;
import com.nsobrero.reservasTurnos.enums.EstadoPago;
import com.nsobrero.reservasTurnos.enums.EstadoReserva;
import com.nsobrero.reservasTurnos.enums.EstadoTurno;
import com.nsobrero.reservasTurnos.repository.ReservaRepository;
import com.nsobrero.reservasTurnos.repository.TurnoRepository;
 
import lombok.RequiredArgsConstructor;
 
@Service
@RequiredArgsConstructor
public class PagoLimpieza {
 
    private final ReservaRepository reservaRepository;
    private final TurnoRepository turnoRepository;
 
    // Ejecutar cada 15 minutos
    @Scheduled(fixedRate = 900000)
    @Transactional
    public void limpiarPagosPendientes() {
        LocalDateTime limite = LocalDateTime.now().minusMinutes(30);
 
        List<Reserva> pendientes = reservaRepository
            .findByEstadoAndEstadoPagoAndFechaReservaBefore(
                EstadoReserva.ACTIVA,
                EstadoPago.PENDIENTE,
                limite
            );
 
        for (Reserva r : pendientes) {
            // Solo cancelar las que son pago online (las de efectivo no expiran)
            if (r.getMetodoPago() != null &&
                r.getMetodoPago().name().equals("ONLINE")) {
                r.setEstado(EstadoReserva.CANCELADA);
                r.getTurno().setEstado(EstadoTurno.DISPONIBLE);
                turnoRepository.save(r.getTurno());
                reservaRepository.save(r);
                System.out.println("Reserva expirada limpiada: " + r.getId());
            }
        }
    }
}
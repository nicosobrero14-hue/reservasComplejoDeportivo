package com.nsobrero.reservasTurnos.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.nsobrero.reservasTurnos.dto.OcupacionCanchaDTO;
import com.nsobrero.reservasTurnos.dto.ReporteDTO;
import com.nsobrero.reservasTurnos.entity.Reserva;
import com.nsobrero.reservasTurnos.entity.Turno;
import com.nsobrero.reservasTurnos.enums.EstadoPago;
import com.nsobrero.reservasTurnos.enums.EstadoTurno;
import com.nsobrero.reservasTurnos.enums.MetodoPago;
import com.nsobrero.reservasTurnos.repository.ReservaRepository;
import com.nsobrero.reservasTurnos.repository.TurnoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final TurnoRepository turnoRepository;
    private final ReservaRepository reservaRepository;

    public ReporteDTO generarReporte(LocalDate fecha) {

        List<Turno> turnos = turnoRepository.findByFecha(fecha);
        List<Reserva> reservas = reservaRepository.findByTurnoFecha(fecha);

        int total = turnos.size();
        int ocupados = (int) turnos.stream()
            .filter(t -> t.getEstado() == EstadoTurno.RESERVADO
                      || t.getEstado() == EstadoTurno.COMPLETO
                      || t.getEstado() == EstadoTurno.ESPERANDO_PAGO)
            .count();
        
        int disponibles = total - ocupados;
        double porcentaje = total > 0 ? (ocupados * 100.0 / total) : 0;
        porcentaje = Math.round(porcentaje * 10.0) / 10.0;

        // Disciplina más reservada
        String disciplinaMasReservada = turnos.stream()
            .filter(t -> t.getEstado() == EstadoTurno.RESERVADO
                      || t.getEstado() == EstadoTurno.COMPLETO)
            .collect(Collectors.groupingBy(
                t -> t.getCancha().getDisciplina().getNombre(),
                Collectors.counting()
            ))
            .entrySet().stream()
            .max(java.util.Map.Entry.comparingByValue())
            .map(java.util.Map.Entry::getKey)
            .orElse("Sin datos");

        // Ocupación por cancha
        List<OcupacionCanchaDTO> ocupacionPorCancha = turnos.stream()
            .collect(Collectors.groupingBy(t -> t.getCancha().getNombre()))
            .entrySet().stream()
            .map(entry -> {
                List<Turno> tc = entry.getValue();
                int totalCancha = tc.size();
                int ocupadosCancha = (int) tc.stream()
                    .filter(t -> t.getEstado() == EstadoTurno.RESERVADO
                              || t.getEstado() == EstadoTurno.COMPLETO).count();
                double pct = totalCancha > 0 ? (ocupadosCancha * 100.0 / totalCancha) : 0;
                String disciplina = tc.get(0).getCancha().getDisciplina().getNombre();
                return new OcupacionCanchaDTO(
                    entry.getKey(), disciplina, totalCancha, ocupadosCancha,
                    Math.round(pct * 10.0) / 10.0
                );
            })
            .sorted((a, b) -> Double.compare(b.getPorcentaje(), a.getPorcentaje()))
            .toList();
        
        

        // ✅ Pendientes en efectivo
        int pendienteEfectivo = (int) reservas.stream()
            .filter(r -> r.getMetodoPago() == MetodoPago.EFECTIVO
                      && r.getEstadoPago() == EstadoPago.PENDIENTE)
            .count();

        // ✅ Ingreso online confirmado
        BigDecimal ingresoOnline = reservas.stream()
            .filter(r -> r.getMetodoPago() == MetodoPago.ONLINE
                      && r.getEstadoPago() == EstadoPago.PAGADO
                      && r.getMontoAbonado() != null)
            .map(Reserva::getMontoAbonado)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // ✅ Ingreso efectivo estimado (aún no cobrado)
        BigDecimal ingresoEfectivo = reservas.stream()
            .filter(r -> r.getMetodoPago() == MetodoPago.EFECTIVO
                      && r.getMontoAbonado() != null)
            .map(Reserva::getMontoAbonado)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ReporteDTO(
            total, ocupados, disponibles, porcentaje,
            disciplinaMasReservada, ocupacionPorCancha,
            pendienteEfectivo, ingresoOnline, ingresoEfectivo
        );
    }
}
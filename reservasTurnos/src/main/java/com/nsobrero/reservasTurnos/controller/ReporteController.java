package com.nsobrero.reservasTurnos.controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nsobrero.reservasTurnos.dto.ReporteDTO;
import com.nsobrero.reservasTurnos.service.ReporteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping
    public ResponseEntity<ReporteDTO> getReporte(@RequestParam LocalDate fecha) {
        return ResponseEntity.ok(reporteService.generarReporte(fecha));
    }
}

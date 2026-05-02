package com.nsobrero.reservasTurnos.service;

import java.math.BigDecimal;
import java.util.List;
 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nsobrero.reservasTurnos.entity.ConfiPago;

import com.nsobrero.reservasTurnos.entity.Disciplina;
import com.nsobrero.reservasTurnos.exception.RecursoNoEncontradoException;
import com.nsobrero.reservasTurnos.repository.ConfiPagoRepository;

import com.nsobrero.reservasTurnos.repository.DisciplinaRepository;
 
import lombok.RequiredArgsConstructor;
 
@Service
@RequiredArgsConstructor
public class AdminPagoService {
 
    private final DisciplinaRepository disciplinaRepository;
    private final ConfiPagoRepository confiPagoRepository;
 
    @Transactional
    public void actualizarPrecio(Long disciplinaId, BigDecimal precio) {
        Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
            .orElseThrow(() -> new RecursoNoEncontradoException("Disciplina no encontrada"));
        disciplina.setPrecio(precio);
        disciplinaRepository.save(disciplina);
    }
 
    @Transactional
    public void actualizarDescuento(int porcentaje) {
        if (porcentaje < 0 || porcentaje > 100) {
            throw new IllegalArgumentException("El descuento debe ser entre 0 y 100");
        }
        ConfiPago config = confiPagoRepository.findById(1L)
            .orElse(new ConfiPago(porcentaje));
        config.setDescuentoOnlinePorcentaje(porcentaje);
        confiPagoRepository.save(config);
    }
 
    public int obtenerDescuento() {
        return confiPagoRepository.findById(1L)
            .map(ConfiPago::getDescuentoOnlinePorcentaje)
            .orElse(10);
    }
 
    public List<Disciplina> listarConPrecios() {
        return disciplinaRepository.findAll();
    }
}
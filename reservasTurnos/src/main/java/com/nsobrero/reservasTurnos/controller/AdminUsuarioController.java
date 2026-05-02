package com.nsobrero.reservasTurnos.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nsobrero.reservasTurnos.dto.UsuarioDTO;
import com.nsobrero.reservasTurnos.service.AdminUsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/usuarios")
@RequiredArgsConstructor
public class AdminUsuarioController {

    private final AdminUsuarioService adminUsuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listar(
            @RequestParam(required = false) String buscar) {
        return ResponseEntity.ok(adminUsuarioService.listar(buscar));
    }

    @PatchMapping("/{id}/rol")
    public ResponseEntity<String> cambiarRol(@PathVariable Long id) {
        return ResponseEntity.ok(adminUsuarioService.cambiarRol(id));
    }
}
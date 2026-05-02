package com.nsobrero.reservasTurnos.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nsobrero.reservasTurnos.dto.UsuarioDTO;
import com.nsobrero.reservasTurnos.entity.Usuario;
import com.nsobrero.reservasTurnos.enums.Role;
import com.nsobrero.reservasTurnos.exception.RecursoNoEncontradoException;
import com.nsobrero.reservasTurnos.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUsuarioService {

    private final UsuarioRepository usuarioRepository;

    public List<UsuarioDTO> listar(String buscar) {
        List<Usuario> usuarios = usuarioRepository.findAll();

        return usuarios.stream()
            .filter(u -> {
                if (buscar == null || buscar.isBlank()) return true;
                String q = buscar.toLowerCase();
                return u.getNombre().toLowerCase().contains(q)
                    || u.getApellido().toLowerCase().contains(q)
                    || u.getEmail().toLowerCase().contains(q);
            })
            .map(u -> new UsuarioDTO(
                u.getId(),
                u.getNombre(),
                u.getApellido(),
                u.getEmail(),
                u.getCelular(),
                u.getRole().name(),
                u.getFechaRegistro()
            ))
            .toList();
    }

    public String cambiarRol(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RecursoNoEncontradoException(
                "Usuario no encontrado con id: " + id));

        if (usuario.getRole() == Role.ADMIN) {
            usuario.setRole(Role.USER);
        } else {
            usuario.setRole(Role.ADMIN);
        }

        usuarioRepository.save(usuario);
        return "Rol actualizado a " + usuario.getRole().name();
    }
}

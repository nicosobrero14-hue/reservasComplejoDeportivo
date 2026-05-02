package com.nsobrero.reservasTurnos.config;
 
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
 
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
 
import com.nsobrero.reservasTurnos.entity.Cancha;
import com.nsobrero.reservasTurnos.entity.Disciplina;
import com.nsobrero.reservasTurnos.entity.HorarioComplejo;
import com.nsobrero.reservasTurnos.entity.Usuario;
import com.nsobrero.reservasTurnos.enums.Role;
import com.nsobrero.reservasTurnos.repository.CanchaRepository;
import com.nsobrero.reservasTurnos.repository.DisciplinaRepository;
import com.nsobrero.reservasTurnos.repository.HorarioComplejoRepository;
import com.nsobrero.reservasTurnos.repository.UsuarioRepository;
 
import lombok.RequiredArgsConstructor;
 
import java.math.BigDecimal;
import java.time.LocalDateTime;
 
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
 
    private final UsuarioRepository usuarioRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final CanchaRepository canchaRepository;
    private final HorarioComplejoRepository horarioRepository;
    private final PasswordEncoder passwordEncoder;
 
    @Override
    public void run(String... args) {
 
        // Solo seedear si la BD está vacía
        if (usuarioRepository.count() > 0) return;
 
        System.out.println("=== Seeding datos de demo ===");
 
        // Admin
        Usuario admin = new Usuario();
        admin.setNombre("Admin");
        admin.setApellido("Sistema");
        admin.setEmail("admin@complejo.com");
        admin.setCelular("1100000000");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        admin.setVerificado(true);
        admin.setFechaRegistro(LocalDateTime.now());
        usuarioRepository.save(admin);
 
        // Usuario demo
        Usuario user = new Usuario();
        user.setNombre("Nicolás");
        user.setApellido("Sobrero");
        user.setEmail("nico@demo.com");
        user.setCelular("1199999999");
        user.setPassword(passwordEncoder.encode("nico123"));
        user.setRole(Role.USER);
        user.setVerificado(true);
        user.setFechaRegistro(LocalDateTime.now());
        usuarioRepository.save(user);
 
        // Disciplinas
        Disciplina padel = new Disciplina();
        padel.setNombre("Padel");
        padel.setDuracionTurno(60);
        padel.setPrecio(new BigDecimal("15000"));
        disciplinaRepository.save(padel);
 
        Disciplina futbol5 = new Disciplina();
        futbol5.setNombre("Fútbol 5");
        futbol5.setDuracionTurno(60);
        futbol5.setPrecio(new BigDecimal("20000"));
        disciplinaRepository.save(futbol5);
 
        Disciplina tenis = new Disciplina();
        tenis.setNombre("Tenis");
        tenis.setDuracionTurno(60);
        tenis.setPrecio(new BigDecimal("12000"));
        disciplinaRepository.save(tenis);
 
        // Canchas
        Cancha p1 = new Cancha(); p1.setNombre("Cancha 1"); p1.setDisciplina(padel); p1.setActiva(true);
        Cancha p2 = new Cancha(); p2.setNombre("Cancha 2"); p2.setDisciplina(padel); p2.setActiva(true);
        Cancha f1 = new Cancha(); f1.setNombre("Cancha 1"); f1.setDisciplina(futbol5); f1.setActiva(true);
        Cancha f2 = new Cancha(); f2.setNombre("Cancha 2"); f2.setDisciplina(futbol5); f2.setActiva(true);
        Cancha t1 = new Cancha(); t1.setNombre("Cancha 1"); t1.setDisciplina(tenis); t1.setActiva(true);
        canchaRepository.saveAll(List.of(p1, p2, f1, f2, t1));
 
        // Horarios (Lunes a Domingo 08:00-23:00)
        for (DayOfWeek dia : DayOfWeek.values()) {
            HorarioComplejo h = new HorarioComplejo();
            h.setDiaSemana(dia);
            h.setHoraApertura(LocalTime.of(8, 0));
            h.setHoraCierre(LocalTime.of(23, 0));
            horarioRepository.save(h);
        }
 
        System.out.println("=== Seed completo ===");
        System.out.println("Admin: admin@complejo.com / admin123");
        System.out.println("User:  nico@demo.com / nico123");
    }
}
package com.nsobrero.reservasTurnos.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.MediaType;
import org.springframework.security.web.AuthenticationEntryPoint;

import com.nsobrero.reservasTurnos.security.JwtFilter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .cors(c -> c.configure(http))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Públicas: login y registro de usuario
                .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()
                .requestMatchers(HttpMethod.POST, "/usuarios/admin").permitAll()
                .requestMatchers("/pagos/webhook").permitAll()  // MP no manda token
            	.requestMatchers("/pagos/**").authenticated()
             	.requestMatchers("/admin/pagos/**").hasRole("ADMIN")
                // Ver turnos disponibles: cualquier autenticado
                .requestMatchers(HttpMethod.GET, "/turnos/**").authenticated()
                // Reservas: cualquier autenticado
                .requestMatchers("/reservas/**").authenticated()
                // Solo ADMIN
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/disciplinas/**").hasRole("ADMIN")
                .requestMatchers("/canchas/**").hasRole("ADMIN")
                .requestMatchers("/horario/**").hasRole("ADMIN")
                .requestMatchers("/usuarios").hasRole("ADMIN")
                .requestMatchers("/auth/recuperar").permitAll()
                .requestMatchers("/auth/reset-password").permitAll()
                .requestMatchers("/auth/enviar-codigo").permitAll()
                .requestMatchers("/auth/verificar").permitAll()
                .requestMatchers("/partidos/**").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/usuarios/perfil").authenticated()
                .requestMatchers(HttpMethod.POST, "/usuarios/admin").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(unauthorizedHandler())
                )
            .addFilterBefore(jwtFilter,
                UsernamePasswordAuthenticationFilter.class)
            .build();
    }
    
    @Bean
    public AuthenticationEntryPoint unauthorizedHandler() {
        return (request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(
                "{\"status\":401,\"error\":\"No autenticado\"," +
                "\"mensaje\":\"Token requerido o inválido\"}"
            );
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
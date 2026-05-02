package com.nsobrero.reservasTurnos.exception;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.nsobrero.reservasTurnos.dto.ErrorResponseDTO;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 404 - recurso no encontrado
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(
            RecursoNoEncontradoException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponseDTO(404, "No encontrado", ex.getMessage()));
    }

    // 409 - turno ya reservado
    @ExceptionHandler(TurnoNoDisponibleException.class)
    public ResponseEntity<ErrorResponseDTO> handleTurnoNoDisponible(
            TurnoNoDisponibleException ex) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(new ErrorResponseDTO(409, "Conflicto", ex.getMessage()));
    }

    // 409 - reserva duplicada
    @ExceptionHandler(ReservaDuplicadaException.class)
    public ResponseEntity<ErrorResponseDTO> handleReservaDuplicada(
            ReservaDuplicadaException ex) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(new ErrorResponseDTO(409, "Reserva duplicada", ex.getMessage()));
    }

    // 400 - errores de @Valid (campos inválidos)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidacion(
            MethodArgumentNotValidException ex) {
        List<String> errores = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .toList();
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponseDTO(
                400, "Datos inválidos", "Revisá los campos enviados", errores));
    }

    // 403 - sin permiso
    @ExceptionHandler(AccesoDenegadoException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccesoDenegado(
            AccesoDenegadoException ex) {
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(new ErrorResponseDTO(403, "Acceso denegado", ex.getMessage()));
    }

    // 500 - cualquier otra excepción no manejada
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneral(Exception ex) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponseDTO(
                500, "Error interno", "Ocurrió un error inesperado"));
    }
}

package com.nsobrero.reservasTurnos.controller;

import java.util.List;
import java.util.Map;
 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import com.nsobrero.reservasTurnos.entity.Disciplina;
import com.nsobrero.reservasTurnos.service.AdminPagoService;
 
import lombok.RequiredArgsConstructor;
 
@RestController
@RequestMapping("/admin/pagos")
@RequiredArgsConstructor
public class AdminPagoController {
 
    private final AdminPagoService adminPagoService;
 
    // GET /admin/pagos/disciplinas — listar disciplinas con precios
    @GetMapping("/disciplinas")
    public ResponseEntity<List<Disciplina>> disciplinas() {
        return ResponseEntity.ok(adminPagoService.listarConPrecios());
    }
 
    // PATCH /admin/pagos/precio — actualizar precio de disciplina
    @PatchMapping("/precio")
    public ResponseEntity<String> precio(@RequestBody Map<String, Object> body) {
        Long id = Long.valueOf(body.get("disciplinaId").toString());
        java.math.BigDecimal precio = new java.math.BigDecimal(body.get("precio").toString());
        adminPagoService.actualizarPrecio(id, precio);
        return ResponseEntity.ok("Precio actualizado");
    }
 
    // PATCH /admin/pagos/descuento — actualizar descuento online
    @PatchMapping("/descuento")
    public ResponseEntity<String> descuento(@RequestBody Map<String, Object> body) {
        int pct = Integer.parseInt(body.get("porcentaje").toString());
        adminPagoService.actualizarDescuento(pct);
        return ResponseEntity.ok("Descuento actualizado a " + pct + "%");
    }
 
    // GET /admin/pagos/descuento — obtener descuento actual
    @GetMapping("/descuento")
    public ResponseEntity<Map<String, Integer>> getDescuento() {
        return ResponseEntity.ok(Map.of("porcentaje", adminPagoService.obtenerDescuento()));
    }
}

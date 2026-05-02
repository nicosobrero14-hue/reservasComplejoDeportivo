# 🏟 Sistema de Reservas — Complejo Deportivo

Sistema web full-stack para la gestión de turnos de un complejo deportivo. Permite a los usuarios reservar canchas por disciplina, gestionar pagos online y buscar rivales para partidos.

---

## 📸 Stack tecnológico

**Backend**
- Java 25 + Spring Boot 4
- Spring Security + JWT
- Spring Data JPA + MySQL
- MercadoPago SDK
- JavaMailSender (Gmail SMTP)
- Lombok

**Frontend**
- React 19 + Vite
- CSS Variables (dark mode)
- DM Sans (Google Fonts)

---

## ✨ Funcionalidades

### Usuario
- Registro con verificación por email (código de 6 dígitos)
- Login con JWT — sesión persistente
- Recuperación de contraseña por email
- Ver turnos disponibles por fecha y disciplina
- Reservar turnos — pago online (MercadoPago) o efectivo
- Modo partido — reservar como equipo y buscar rival
- Historial de reservas con filtros
- Índice de asistencia (velocímetro de confiabilidad)
- Cancelación de reservas (con límite de 2hs antes para partidos)

### Admin
- Panel de administración completo
- Crear disciplinas, canchas y horarios del complejo
- Generar turnos por fecha según horario configurado
- Gestión de usuarios (listar, buscar, cambiar roles)
- Reportes de ocupación por cancha y disciplina
- Configuración de precios y descuentos por pago online
- Limpieza automática de pagos pendientes (cada 15 minutos)

---

## 🚀 Levantar el proyecto localmente

### Requisitos
- Java 25+
- Node.js 18+
- MySQL 8+
- Maven

### Backend

```bash
# 1. Crear la base de datos
mysql -u root -p
CREATE DATABASE reservascomplejo;
exit;

# 2. Configurar application.properties
# Ver sección de variables de entorno

# 3. Levantar
cd reservasTurnos
./mvnw spring-boot:run
```

El seeder crea automáticamente al arrancar:
- **Admin:** admin@complejo.com / admin123
- **Usuario demo:** nico@demo.com / nico123
- Disciplinas, canchas y horarios preconfigurados

### Frontend

```bash
cd reservas-front
npm install
npm run dev
```

Abre en http://localhost:5173

---

## 🔐 Variables de entorno

Crear `src/main/resources/application.properties`:

```properties
# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/reservascomplejo?serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Mail (Gmail)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
app.frontend.url=http://localhost:5173

# MercadoPago
mercadopago.access-token=${MP_ACCESS_TOKEN}
mercadopago.success-url=http://localhost:5173/pago-exitoso
mercadopago.failure-url=http://localhost:5173/pago-fallido
mercadopago.pending-url=http://localhost:5173/pago-pendiente
mercadopago.webhook-url=${MP_WEBHOOK_URL}
```

---

## 📡 Endpoints principales

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | /auth/login | Login → devuelve JWT | Público |
| POST | /usuarios | Registro | Público |
| POST | /auth/verificar | Verificar cuenta | Público |
| POST | /auth/recuperar | Solicitar reset password | Público |
| GET | /turnos/por-fecha | Ver turnos disponibles | 🔒 |
| POST | /reservas | Reservar turno | 🔒 |
| DELETE | /reservas/turno/{id} | Cancelar reserva | 🔒 |
| GET | /reservas/mis-reservas | Historial del usuario | 🔒 |
| GET | /reservas/mi-indice | Índice de asistencia | 🔒 |
| POST | /partidos/reservar | Reservar modo partido | 🔒 |
| POST | /partidos/{id}/unirse | Unirse como rival | 🔒 |
| GET | /partidos/buscando | Partidos buscando rival | 🔒 |
| POST | /pagos/iniciar | Iniciar pago MP | 🔒 |
| POST | /pagos/webhook | Webhook MercadoPago | Público |
| GET | /admin/reportes | Reportes de ocupación | 👑 Admin |
| PATCH | /admin/usuarios/{id}/rol | Cambiar rol | 👑 Admin |
| PATCH | /admin/pagos/precio | Configurar precios | 👑 Admin |

---

## 🏗 Arquitectura

```
reservasTurnos/
├── config/          # CORS, Security, DataSeeder
├── controller/      # REST Controllers
├── dto/             # Data Transfer Objects
├── entity/          # JPA Entities
├── enums/           # EstadoTurno, Role, etc.
├── exception/       # Excepciones + GlobalExceptionHandler
├── repository/      # Spring Data JPA Repositories
├── security/        # JWT Filter + JwtUtil
└── service/         # Lógica de negocio

reservas-front/
├── src/
│   ├── api/         # api.js — todas las llamadas al backend
│   ├── components/  # PagoModal
│   └── pages/       # Una página por funcionalidad
```

---

## 👤 Autor

**Nicolás Sobrero**
- GitHub: https://github.com/nicosobrero14-hue

---

## 📄 Licencia

MIT

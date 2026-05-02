const API_URL = "http://localhost:8080";

// ─── Token helpers ───────────────────────────────────────────────

export function getToken() {
    return localStorage.getItem("token");
}

export function getUsuarioGuardado() {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
}

export function getAuthHeaders() {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
}

// ─── Auth ────────────────────────────────────────────────────────

export async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Credenciales incorrectas");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);

    // ✅ Obtener el id del usuario desde /auth/me
    const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: { "Authorization": `Bearer ${data.token}` }
    });
    const me = await meRes.json();

    const usuario = {
        id: me.id,
        nombre: data.nombre,
        role: data.role
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));
    return usuario;
}

export async function registrarUsuario(data) {
    const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al registrar");
    }

    return res.json();
}

// ─── Turnos ──────────────────────────────────────────────────────

export async function obtenerTurnos(fecha, usuarioId) {
    const res = await fetch(
        `${API_URL}/turnos/por-fecha?fecha=${fecha}&usuarioId=${usuarioId}`,
        { headers: getAuthHeaders() }
    );

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al cargar turnos");
    }

    return res.json();
}

export async function reservarTurno(turnoId) {
    const res = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ turnoId })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al reservar");
    }

    return res.text();
}

export async function cancelarTurno(turnoId) {
    const res = await fetch(`${API_URL}/reservas/turno/${turnoId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al cancelar");
    }

    return res.text();
}

export async function obtenerMisReservas() {
    const res = await fetch(`${API_URL}/reservas/mis-reservas`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al cargar historial");
    }
    return res.json();
}

// ─── Admin ───────────────────────────────────────────────────────

export async function apiGet(path) {
    const res = await fetch(`${API_URL}${path}`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error");
    }
    return res.json();
}

export async function apiPost(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error");
    }
    return res.ok;
}

export async function obtenerReporte(fecha) {
    const res = await fetch(`${API_URL}/admin/reportes?fecha=${fecha}`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al cargar reporte");
    }
    return res.json();
}

export async function listarUsuarios(buscar = "") {
    const url = buscar
        ? `${API_URL}/admin/usuarios?buscar=${buscar}`
        : `${API_URL}/admin/usuarios`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al cargar usuarios");
    }
    return res.json();
}

export async function cambiarRolUsuario(id) {
    const res = await fetch(`${API_URL}/admin/usuarios/${id}/rol`, {
        method: "PATCH",
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al cambiar rol");
    }
    return res.text();
}

export async function obtenerIndiceAsistencia() {
    const res = await fetch(`${API_URL}/reservas/mi-indice`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al cargar índice");
    }
    return res.json();
}

export async function solicitarRecuperacion(email) {
    const res = await fetch(`${API_URL}/auth/recuperar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al enviar email");
    }
    return res.text();
}

export async function resetearPassword(token, password) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Token inválido o expirado");
    }
    return res.text();
}

export async function enviarCodigoVerificacion(email) {
    const res = await fetch(`${API_URL}/auth/enviar-codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Error al enviar código");
    }
    return res.text();
}

export async function verificarCodigo(email, codigo) {
    const res = await fetch(`${API_URL}/auth/verificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.mensaje || "Código incorrecto");
    }
    return res.text();
}

export async function reservarComoEquipo(turnoId) {
    const res = await fetch(`${API_URL}/partidos/reservar`, {
        method: "POST", headers: getAuthHeaders(),
        body: JSON.stringify({ turnoId })
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.mensaje); }
    return res.json();
}

export async function unirseComoRival(turnoId) {
    const res = await fetch(`${API_URL}/partidos/${turnoId}/unirse`, {
        method: "POST", headers: getAuthHeaders()
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.mensaje); }
    return res.json();
}

export async function cancelarPartido(turnoId) {
    const res = await fetch(`${API_URL}/partidos/${turnoId}`, {
        method: "DELETE", headers: getAuthHeaders()
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.mensaje); }
    return res.text();
}

export async function listarBuscandoRival() {
    const res = await fetch(`${API_URL}/partidos/buscando`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.mensaje); }
    return res.json();
}

export async function misPartidos() {
    const res = await fetch(`${API_URL}/partidos/mis-partidos`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.mensaje); }
    return res.json();
}

export async function iniciarPago(turnoId, metodoPago, esPartido = false, esVisitante = false) {
    const res = await fetch(`${API_URL}/pagos/iniciar`, {
        method: "POST", headers: getAuthHeaders(),
        body: JSON.stringify({ turnoId, metodoPago, esPartido, esVisitante })
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.mensaje); }
    return res.json();
}

export async function apiPatch(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
        method: "PATCH", headers: getAuthHeaders(),
        body: JSON.stringify(body)
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.mensaje); }
    return res.ok;
}

export async function actualizarPerfil(datos) {
    const res = await fetch(`${API_URL}/usuarios/perfil`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(datos)
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.mensaje); }
    return res.json();
}


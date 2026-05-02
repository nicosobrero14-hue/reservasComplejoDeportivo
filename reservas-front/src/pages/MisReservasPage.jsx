import { useEffect, useState } from "react";
import { obtenerMisReservas, cancelarTurno } from "../api/api";

function MisReservasPage({ usuario }) {
    const [reservas, setReservas] = useState([]);
    const [filtro, setFiltro] = useState("TODAS");
    const [cargando, setCargando] = useState(true);

    const cargar = async () => {
        setCargando(true);
        try {
            const data = await obtenerMisReservas();
            setReservas(data);
        } catch (e) {
            alert(e.message);
        } finally {
            setCargando(false);
        }
    };

    const cancelar = async (turnoId) => {
        if (!confirm("¿Cancelar esta reserva?")) return;
        try {
            await cancelarTurno(turnoId);
            await cargar();
        } catch (e) {
            alert(e.message);
        }
    };

    useEffect(() => { cargar(); }, []);

    const reservasFiltradas = reservas.filter(r => {
        if (filtro === "TODAS") return true;
        return r.estado === filtro;
    });

    const activas = reservas.filter(r => r.estado === "ACTIVA").length;
    const canceladas = reservas.filter(r => r.estado === "CANCELADA").length;
    const pendientes = reservas.filter(r => r.estado === "PENDIENTE_PAGO").length;

    const hoy = new Date().toISOString().split("T")[0];

    function esFutura(fecha) { return fecha >= hoy; }

    function formatDateTime(dt) {
        if (!dt) return "";
        const d = new Date(dt);
        return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
            + " " + d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    }

    // ✅ Funciones auxiliares que reciben el estado como parámetro
    function getBadgeColor(estado) {
        if (estado === "ACTIVA") return "badge-green";
        if (estado === "PENDIENTE_PAGO") return "badge-blue";
        return "badge-gray";
    }

    function getEstadoLabel(estado) {
        if (estado === "ACTIVA") return "Activa";
        if (estado === "PENDIENTE_PAGO") return "⏳ Pendiente pago";
        return "Cancelada";
    }

    return (
        <div className="fade-up">

            <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ marginBottom: "4px" }}>Mis reservas</h1>
                <p style={{ fontSize: "13px" }}>Historial completo de tus turnos</p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "600", color: "var(--text-primary)" }}>{reservas.length}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>totales</span>
                </div>
                <div style={{ background: "var(--green-dim)", border: "1px solid var(--green-border)", borderRadius: "var(--r-md)", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "600", color: "var(--green)" }}>{activas}</span>
                    <span style={{ fontSize: "12px", color: "var(--green)" }}>activas</span>
                </div>
                {pendientes > 0 && (
                    <div style={{ background: "var(--blue-dim)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: "var(--r-md)", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "20px", fontWeight: "600", color: "var(--blue-light)" }}>{pendientes}</span>
                        <span style={{ fontSize: "12px", color: "var(--blue-light)" }}>pendientes</span>
                    </div>
                )}
                <div style={{ background: "var(--gray-dim)", border: "1px solid var(--gray-border)", borderRadius: "var(--r-md)", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "600", color: "var(--text-secondary)" }}>{canceladas}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>canceladas</span>
                </div>
            </div>

            {/* Filtros */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem" }}>
                {["TODAS", "ACTIVA", "PENDIENTE_PAGO", "CANCELADA"].map(f => (
                    <button key={f} className={`btn-ghost ${filtro === f ? "active" : ""}`}
                        onClick={() => setFiltro(f)} style={{ fontSize: "12px" }}>
                        {f === "TODAS" ? "Todas" : f === "ACTIVA" ? "Activas" : f === "PENDIENTE_PAGO" ? "Pendientes" : "Canceladas"}
                    </button>
                ))}
            </div>

            {cargando && (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-tertiary)" }}>Cargando...</div>
            )}

            {!cargando && reservasFiltradas.length === 0 && (
                <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-tertiary)" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
                    <p>No tenés reservas en este filtro</p>
                </div>
            )}

            {/* Lista */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {reservasFiltradas.map(r => (
                    <div key={r.id} style={{
                        background: "var(--bg-card)",
                        border: `1px solid ${r.estado === "ACTIVA" ? "var(--green-border)" : r.estado === "PENDIENTE_PAGO" ? "rgba(59,130,246,0.25)" : "var(--border)"}`,
                        borderRadius: "var(--r-md)",
                        padding: "1rem 1.25rem",
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px", flexWrap: "wrap"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            {/* Fecha */}
                            <div style={{
                                background: r.estado === "ACTIVA" ? "var(--blue-dim)" : "var(--gray-dim)",
                                border: `1px solid ${r.estado === "ACTIVA" ? "rgba(59,130,246,0.25)" : "var(--gray-border)"}`,
                                borderRadius: "var(--r-sm)", padding: "8px 12px",
                                textAlign: "center", minWidth: "60px"
                            }}>
                                <div style={{ fontSize: "18px", fontWeight: "600", color: r.estado === "ACTIVA" ? "var(--blue-light)" : "var(--text-tertiary)", lineHeight: 1 }}>
                                    {r.fecha?.split("-")[2]}
                                </div>
                                <div style={{ fontSize: "10px", color: "var(--text-secondary)", marginTop: "2px", textTransform: "uppercase" }}>
                                    {new Date(r.fecha + "T00:00:00").toLocaleDateString("es-AR", { month: "short" })}
                                </div>
                            </div>

                            {/* Detalles */}
                            <div>
                                <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)", marginBottom: "3px" }}>
                                    {r.disciplina} — {r.cancha}
                                </div>
                                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                    🕐 {r.horaInicio} – {r.horaFin}
                                    <span style={{ margin: "0 8px", color: "var(--text-tertiary)" }}>·</span>
                                    Reservado el {formatDateTime(r.fechaReserva)}
                                </div>
                                {r.metodoPago && (
                                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "3px" }}>
                                        {r.metodoPago === "ONLINE" ? "💳 Pago online" : "💵 Efectivo en el complejo"}
                                        {r.montoAbonado && ` · $${Number(r.montoAbonado).toLocaleString("es-AR")}`}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Estado + acción */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {/* ✅ Dentro del map — getBadgeColor y getEstadoLabel reciben r.estado */}
                            <span className={`badge ${getBadgeColor(r.estado)}`}>
                                {getEstadoLabel(r.estado)}
                            </span>
                            {r.estado === "ACTIVA" && esFutura(r.fecha) && (
                                <button className="btn-secondary"
                                    onClick={() => cancelar(r.turnoId)}
                                    style={{ fontSize: "12px", padding: "5px 12px", color: "var(--red)", borderColor: "var(--red-border)" }}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MisReservasPage;

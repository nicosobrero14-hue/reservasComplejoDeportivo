import { useState, useEffect } from "react";
import { PagoModal } from "../components/PagoModal";
import {
    reservarComoEquipo,
    unirseComoRival,
    cancelarPartido,
    listarBuscandoRival,
    misPartidos
} from "../api/api";

function EstadoBadge({ estado }) {
    const cfg = {
        ESPERANDO_RIVAL: { label: "Buscando rival", color: "var(--blue-light)", bg: "var(--blue-dim)", border: "rgba(59,130,246,0.3)" },
        COMPLETO:        { label: "Completo ✓",      color: "var(--green)",      bg: "var(--green-dim)", border: "var(--green-border)" },
        DISPONIBLE:      { label: "Disponible",      color: "var(--text-secondary)", bg: "var(--gray-dim)", border: "var(--gray-border)" },
    }[estado] || { label: estado, color: "var(--text-tertiary)", bg: "var(--gray-dim)", border: "var(--gray-border)" };

    return (
        <span style={{
            fontSize: "11px", fontWeight: "500", padding: "3px 8px",
            borderRadius: "20px", background: cfg.bg,
            color: cfg.color, border: `1px solid ${cfg.border}`
        }}>
            {cfg.label}
        </span>
    );
}

function TarjetaPartido({ t, onUnirse, onCancelar, usuarioNombre }) {
    const soyLocal = t.equipoLocal?.startsWith(usuarioNombre);
    const limiteCancel = t.fecha
        ? new Date(`${t.fecha}T${t.horaInicio}:00`).getTime() - 2 * 60 * 60 * 1000 > Date.now()
        : false;

    return (
        <div style={{
            background: "var(--bg-card)",
            border: `1px solid ${t.estado === "ESPERANDO_RIVAL" ? "rgba(59,130,246,0.2)" : "var(--border)"}`,
            borderRadius: "var(--r-lg)",
            padding: "1.25rem",
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", flexWrap: "wrap", gap: "12px"
        }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)" }}>
                        {t.disciplina} — {t.cancha}
                    </span>
                    <EstadoBadge estado={t.estado} />
                </div>

                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                    📅 {t.fecha}
                    <span style={{ margin: "0 8px", color: "var(--text-tertiary)" }}>·</span>
                    🕐 {t.horaInicio} – {t.horaFin}
                </div>

                {/* Equipos */}
                <div style={{
                    display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap"
                }}>
                    <div style={{
                        background: t.equipoLocal ? "var(--blue-dim)" : "var(--gray-dim)",
                        border: `1px solid ${t.equipoLocal ? "rgba(59,130,246,0.25)" : "var(--gray-border)"}`,
                        borderRadius: "var(--r-sm)", padding: "6px 12px",
                        fontSize: "12px", color: t.equipoLocal ? "var(--blue-light)" : "var(--text-tertiary)"
                    }}>
                        🏠 {t.equipoLocal || "Sin equipo"}
                        {soyLocal && <span style={{ fontSize: "10px", marginLeft: "4px", opacity: 0.7 }}>(vos)</span>}
                    </div>
                    <div style={{
                        background: t.equipoVisitante ? "var(--green-dim)" : "var(--gray-dim)",
                        border: `1px solid ${t.equipoVisitante ? "var(--green-border)" : "var(--gray-border)"}`,
                        borderRadius: "var(--r-sm)", padding: "6px 12px",
                        fontSize: "12px", color: t.equipoVisitante ? "var(--green)" : "var(--text-tertiary)"
                    }}>
                        ✈️ {t.equipoVisitante || "Buscando rival..."}
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                {t.puedoUnirme && (
                    <button className="btn-primary" style={{ fontSize: "13px", whiteSpace: "nowrap" }}
                        onClick={() => onUnirse(t)}>
                        Unirme como rival
                    </button>
                )}
                {soyLocal && t.estado === "ESPERANDO_RIVAL" && (
                    <button
                        className="btn-secondary"
                        style={{ fontSize: "12px", color: limiteCancel ? "var(--red)" : "var(--text-tertiary)",
                            borderColor: limiteCancel ? "var(--red-border)" : "var(--border-med)" }}
                        onClick={() => limiteCancel ? onCancelar(t.id) : alert("No podés cancelar con menos de 2 horas de anticipación")}
                    >
                        {limiteCancel ? "Cancelar partido" : "⏰ Sin tiempo para cancelar"}
                    </button>
                )}
            </div>
        </div>
    );
}

function PartidosPage({ usuario }) {
    const [vista, setVista] = useState("buscar");
    const [buscando, setBuscando] = useState([]);
    const [misList, setMisList] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [modalPagoPartido, setModalPagoPartido] = useState(null);

    const cargarBuscando = async () => {
        setCargando(true);
        try { setBuscando(await listarBuscandoRival()); }
        catch (e) { alert(e.message); }
        finally { setCargando(false); }
    };

    const cargarMis = async () => {
        setCargando(true);
        try { setMisList(await misPartidos()); }
        catch (e) { alert(e.message); }
        finally { setCargando(false); }
    };

    useEffect(() => {
        if (vista === "buscar") cargarBuscando();
        if (vista === "mis") cargarMis();
    }, [vista]);

    const handleUnirse = async (turno) => {
        // Abrir modal de pago con esPartido=true y esVisitante=true
        setModalPagoPartido(turno);
        
    };

    const handleCancelar = async (turnoId) => {
        if (!confirm("¿Cancelar tu reserva de partido?")) return;
        try {
            await cancelarPartido(turnoId);
            if (vista === "buscar") cargarBuscando();
            else cargarMis();
        } catch (e) { alert(e.message); }
    };

    return (
        <div className="fade-up">

            <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ marginBottom: "4px" }}>Partidos</h1>
                <p style={{ fontSize: "13px" }}>
                    Reservá un turno en modo partido desde la pantalla de Turnos, o unite a uno existente acá
                </p>
            </div>

            {/* Info box */}
            <div style={{
                background: "var(--blue-dim)", border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: "var(--r-md)", padding: "12px 16px", marginBottom: "1.5rem",
                fontSize: "13px", color: "var(--blue-light)"
            }}>
                💡 Para crear un partido, andá a <strong>Turnos</strong>, elegí una fecha y usá el botón <strong>"⚽ Reservar como equipo"</strong> en cualquier turno disponible.
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem" }}>
                <button className={`btn-ghost ${vista === "buscar" ? "active" : ""}`}
                    onClick={() => setVista("buscar")}>
                    🔍 Buscando rival ({buscando.length})
                </button>
                <button className={`btn-ghost ${vista === "mis" ? "active" : ""}`}
                    onClick={() => setVista("mis")}>
                    ⚽ Mis partidos
                </button>
            </div>

            {cargando && (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-tertiary)" }}>
                    Cargando...
                </div>
            )}
        
            
            {modalPagoPartido && (
                <PagoModal
                    turno={modalPagoPartido}
                    esPartido={true}
                    esVisitante={true}
                    onExito={() => { setModalPagoPartido(null); cargarBuscando(); }}
                    onCerrar={() => setModalPagoPartido(null)}
                />
            )}
        
            {/* Buscando rival */}
            {vista === "buscar" && !cargando && (
                <>
                    {buscando.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-tertiary)" }}>
                            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
                            <p>No hay equipos buscando rival en este momento</p>
                            <p style={{ fontSize: "12px", marginTop: "4px" }}>
                                Sé el primero — reservá un turno en modo partido desde Turnos
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {buscando.map(t => (
                                <TarjetaPartido key={t.id} t={t}
                                    onUnirse={handleUnirse}
                                    onCancelar={handleCancelar}
                                    usuarioNombre={usuario.nombre}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Mis partidos */}
            {vista === "mis" && !cargando && (
                <>
                    {misList.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-tertiary)" }}>
                            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚽</div>
                            <p>Todavía no participás en ningún partido</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {misList.map(t => (
                                <TarjetaPartido key={t.id} t={t}
                                    onUnirse={handleUnirse}
                                    onCancelar={handleCancelar}
                                    usuarioNombre={usuario.nombre}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default PartidosPage;

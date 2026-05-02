import { useEffect, useState } from "react";
import { obtenerTurnos, reservarTurno, cancelarTurno, reservarComoEquipo } from "../api/api";
import { PagoModal } from "../components/PagoModal";

function PartidoModal({ turno, onConfirmar, onCerrar }) {
    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem"
        }}>
            <div className="fade-up" style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-xl)",
                padding: "1.5rem",
                maxWidth: "420px", width: "100%",
                boxShadow: "var(--shadow-md)"
            }}>
                <div style={{ fontSize: "28px", textAlign: "center", marginBottom: "12px" }}>⚽</div>
                <h2 style={{ textAlign: "center", marginBottom: "6px", fontSize: "17px" }}>
                    Reservar como equipo
                </h2>
                <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
                    {turno.horaInicio} – {turno.horaFin} · {turno.cancha}
                </p>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                    El turno quedará en modo <strong style={{ color: "var(--blue-light)" }}>Buscando rival</strong>.
                    Otros usuarios podrán unirse como equipo visitante desde la sección <strong>Partidos</strong>.
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn-secondary" style={{ flex: 1 }} onClick={onCerrar}>
                        Cancelar
                    </button>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={onConfirmar}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

function TurnosPage({ usuario, fechaInicial = ""}) {
    const [turnos, setTurnos] = useState([]);
    const [fecha, setFecha] = useState(fechaInicial);
    const [cargando, setCargando] = useState(false);
    const [modalPartido, setModalPartido] = useState(null); // turno seleccionado para partido
    const [modalPago, setModalPago] = useState(null);

    const hoy = new Date().toISOString().split("T")[0];

    const cargarTurnos = async () => {
        setCargando(true);
        try {
            const data = await obtenerTurnos(fecha, usuario.id);
            setTurnos(data);
        } catch (e) {
            alert(e.message);
        } finally {
            setCargando(false);
        }
    };

    const reservar = async (turnoId) => {
        try {
            await reservarTurno(turnoId);
            await cargarTurnos();
        } catch (e) {
            alert(e.message);
        }
    };

    const cancelar = async (turnoId) => {
        if (!confirm("¿Cancelar esta reserva?")) return;
        try {
            await cancelarTurno(turnoId);
            await cargarTurnos();
        } catch (e) {
            alert(e.message);
        }
    };

    

    useEffect(() => {
        if (fecha) cargarTurnos();
        else setTurnos([]);
    }, [fecha]);

    function agruparTurnos(turnos) {
        const resultado = {};
        turnos.forEach(t => {
            if (!resultado[t.disciplina]) resultado[t.disciplina] = {};
            if (!resultado[t.disciplina][t.cancha]) resultado[t.disciplina][t.cancha] = [];
            resultado[t.disciplina][t.cancha].push(t);
        });
        return resultado;
    }

    const agrupados = agruparTurnos(turnos);
    const libres = turnos.filter(t => t.estado === "DISPONIBLE").length;
    const ocupados = turnos.filter(t => t.estado !== "DISPONIBLE").length;
    const misTurnos = turnos.filter(t => t.esMio).length;

    return (
        <div className="fade-up">

            {/* Modal partido */}
            {modalPartido && (
                <PartidoModal
                    turno={modalPartido}
                    onConfirmar={handleReservarPartido}
                    onCerrar={() => setModalPartido(null)}
                />
            )}

            {modalPago && (
                <PagoModal
                    turno={modalPago.turno}
                    esPartido={modalPago.esPartido}
                    esVisitante={modalPago.esVisitante || false}  // ← agregar esto
                    onExito={() => { setModalPago(null); cargarTurnos(); }}
                    onCerrar={() => setModalPago(null)}
                />
            )}

            <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ marginBottom: "4px" }}>Turnos disponibles</h1>
                <p style={{ fontSize: "13px" }}>Seleccioná una fecha y reservá tu turno</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
                <div style={{ maxWidth: "200px" }}>
                    <label className="field-label">Fecha</label>
                    <input type="date" value={fecha} min={hoy}
                        onChange={e => setFecha(e.target.value)} />
                </div>
                {fecha && (
                    <button className="btn-secondary" onClick={cargarTurnos}
                        style={{ marginTop: "18px" }} disabled={cargando}>
                        {cargando ? "Cargando..." : "↻ Actualizar"}
                    </button>
                )}
            </div>

            {/* Stats */}
            {fecha && turnos.length > 0 && (
                <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                    <div style={{
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        borderRadius: "var(--r-md)", padding: "10px 16px",
                        display: "flex", alignItems: "center", gap: "8px"
                    }}>
                        <span style={{ fontSize: "18px", fontWeight: "600", color: "var(--green)" }}>{libres}</span>
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>disponibles</span>
                    </div>
                    <div style={{
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        borderRadius: "var(--r-md)", padding: "10px 16px",
                        display: "flex", alignItems: "center", gap: "8px"
                    }}>
                        <span style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-tertiary)" }}>{ocupados}</span>
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>ocupados</span>
                    </div>
                    {misTurnos > 0 && (
                        <div style={{
                            background: "var(--red-dim)", border: "1px solid var(--red-border)",
                            borderRadius: "var(--r-md)", padding: "10px 16px",
                            display: "flex", alignItems: "center", gap: "8px"
                        }}>
                            <span style={{ fontSize: "18px", fontWeight: "600", color: "var(--red)" }}>{misTurnos}</span>
                            <span style={{ fontSize: "12px", color: "var(--red)" }}>mis reservas</span>
                        </div>
                    )}
                </div>
            )}

            {!fecha && (
                <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-tertiary)" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>📅</div>
                    <p>Seleccioná una fecha para ver los turnos</p>
                </div>
            )}

            {fecha && !cargando && turnos.length === 0 && (
                <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-tertiary)" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚫</div>
                    <p>No hay turnos para esta fecha</p>
                    <p style={{ fontSize: "12px", marginTop: "4px" }}>El complejo puede estar cerrado este día</p>
                </div>
            )}

            {Object.keys(agrupados).map(disciplina => (
                <div key={disciplina} style={{ marginBottom: "1.5rem" }}>
                    <div style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        marginBottom: "1rem", paddingBottom: "10px",
                        borderBottom: "1px solid var(--border)"
                    }}>
                        <h2 style={{ fontSize: "16px" }}>{disciplina}</h2>
                        <span className="badge badge-blue">
                            {Object.keys(agrupados[disciplina]).length} canchas
                        </span>
                    </div>

                    {Object.keys(agrupados[disciplina]).map(cancha => (
                        <div key={cancha} style={{
                            background: "var(--bg-card)", border: "1px solid var(--border)",
                            borderRadius: "var(--r-md)", padding: "1rem 1.25rem", marginBottom: "8px"
                        }}>
                            <p style={{
                                fontSize: "12px", fontWeight: "500", color: "var(--text-secondary)",
                                marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em"
                            }}>
                                {cancha}
                            </p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {agrupados[disciplina][cancha].map(t => {

                                    // Turno en modo partido esperando rival
                                    if (t.estado === "ESPERANDO_RIVAL") {
                                        return (
                                            <div key={t.id} style={{
                                                display: "flex", flexDirection: "column", gap: "4px"
                                            }}>
                                                <button
                                                    className="turno-btn"
                                                    style={{
                                                        background: "var(--blue-dim)",
                                                        borderColor: "rgba(59,130,246,0.4)",
                                                        color: "var(--blue-light)"
                                                    }}
                                                    onClick={() => {/* solo info */}}
                                                    disabled
                                                >
                                                    {t.horaInicio} – {t.horaFin} · ⚽ Buscando rival
                                                </button>
                                            </div>
                                        );
                                    }
                                    // Esperando pago (modo partido o normal)
                                    if (t.estado === "ESPERANDO_PAGO") {
                                        return (
                                            <button key={t.id} className="turno-btn turno-ocupado" disabled>
                                                {t.horaInicio} – {t.horaFin} · ⏳ Pendiente pago
                                            </button>
                                        );
                                    }

                                    // Turno completo (dos equipos)
                                    if (t.estado === "COMPLETO") {
                                        return (
                                            <button key={t.id} className="turno-btn turno-ocupado" disabled>
                                                {t.horaInicio} – {t.horaFin} · ⚽ Completo
                                            </button>
                                        );
                                    }

                                    // Turno ocupado normalmente
                                    if (t.estado !== "DISPONIBLE" && !t.esMio) {
                                        return (
                                            <button key={t.id} className="turno-btn turno-ocupado" disabled>
                                                {t.horaInicio} – {t.horaFin} · Ocupado
                                            </button>
                                        );
                                    }

                                    // Turno que es mío (cancelar)
                                    if (t.esMio) {
                                        return (
                                            <button key={t.id} className="turno-btn turno-mio"
                                                onClick={() => cancelar(t.id)}>
                                                {t.horaInicio} – {t.horaFin} · Cancelar
                                            </button>
                                        );
                                    }

                                    // Turno disponible — dos opciones
                                    return (
                                        <div key={t.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                            {/* ✅ Reserva normal — esPartido: false */}
                                            <button className="turno-btn turno-libre"
                                                onClick={() => setModalPago({ turno: t, esPartido: false })}>
                                                {t.horaInicio} – {t.horaFin} · Reservar
                                            </button>

                                            {/* ✅ Modo partido — esPartido: true, abre PagoModal */}
                                            <button
                                                onClick={() => setModalPago({ turno: t, esPartido: true })}
                                                style={{
                                                    fontSize: "11px", padding: "4px 8px",
                                                    borderRadius: "var(--r-sm)",
                                                    background: "transparent",
                                                    border: "1px solid rgba(59,130,246,0.3)",
                                                    color: "var(--blue-light)",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                ⚽ Reservar como equipo
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default TurnosPage;

import { useState } from "react";
import { obtenerReporte } from "../api/api";

function StatCard({ label, value, color, sub }) {
    return (
        <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "1.25rem",
            flex: "1 1 140px"
        }}>
            <div style={{ fontSize: "28px", fontWeight: "600", color: color || "var(--text-primary)", marginBottom: "4px", letterSpacing: "-0.03em" }}>
                {value}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{label}</div>
            {sub && <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "2px" }}>{sub}</div>}
        </div>
    );
}

function BarRow({ cancha, disciplina, ocupados, total, porcentaje }) {
    const color = porcentaje >= 75 ? "var(--red)" : porcentaje >= 40 ? "var(--blue)" : "var(--green)";
    return (
        <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div>
                    <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: "500" }}>{cancha}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-tertiary)", marginLeft: "8px" }}>{disciplina}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{ocupados}/{total}</span>
                    <span style={{ fontSize: "12px", fontWeight: "600", color, minWidth: "40px", textAlign: "right" }}>{porcentaje}%</span>
                </div>
            </div>
            <div style={{
                height: "6px",
                background: "var(--bg-input)",
                borderRadius: "3px",
                overflow: "hidden"
            }}>
                <div style={{
                    height: "100%",
                    width: `${porcentaje}%`,
                    background: color,
                    borderRadius: "3px",
                    transition: "width .6s ease",
                    opacity: 0.8
                }} />
            </div>
        </div>
    );
}

function ReportesPage() {
    const [fecha, setFecha] = useState("");
    const [reporte, setReporte] = useState(null);
    const [cargando, setCargando] = useState(false);

    const cargar = async (f) => {
        setCargando(true);
        setReporte(null);
        try {
            const data = await obtenerReporte(f);
            setReporte(data);
        } catch (e) {
            alert(e.message);
        } finally {
            setCargando(false);
        }
    };

    const handleFecha = (e) => {
        setFecha(e.target.value);
        if (e.target.value) cargar(e.target.value);
    };

    return (
        <div className="fade-up">

            {/* Header */}
            <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ marginBottom: "4px" }}>Reportes</h1>
                <p style={{ fontSize: "13px" }}>Estadísticas de ocupación del complejo</p>
            </div>

            {/* Date picker */}
            <div style={{ maxWidth: "200px", marginBottom: "1.5rem" }}>
                <label className="field-label">Fecha</label>
                <input type="date" value={fecha} onChange={handleFecha} />
            </div>

            {/* Loading */}
            {cargando && (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-tertiary)" }}>
                    Cargando reporte...
                </div>
            )}

            {/* Empty state */}
            {!fecha && !cargando && (
                <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-tertiary)" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>📊</div>
                    <p>Seleccioná una fecha para ver el reporte</p>
                </div>
            )}

            {reporte && (
                <>
                    {/* Stats */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                        <StatCard
                            label="Turnos totales"
                            value={reporte.totalTurnos}
                            color="var(--text-primary)"
                        />
                        <StatCard
                            label="Ocupados"
                            value={reporte.turnosOcupados}
                            color="var(--red)"
                        />
                        <StatCard
                            label="Disponibles"
                            value={reporte.turnosDisponibles}
                            color="var(--green)"
                        />
                        <StatCard
                            label="Ocupación"
                            value={`${reporte.porcentajeOcupacion}%`}
                            color="var(--blue-light)"
                            sub="del total del día"
                        />
                    </div>

                    {/* Disciplina más reservada */}
                    {reporte.disciplinaMasReservada !== "Sin datos" && (
                        <div style={{
                            background: "var(--blue-dim)",
                            border: "1px solid rgba(59,130,246,0.25)",
                            borderRadius: "var(--r-md)",
                            padding: "12px 16px",
                            marginBottom: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                        }}>
                            <span style={{ fontSize: "20px" }}>🏆</span>
                            <div>
                                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "2px" }}>
                                    Disciplina más reservada
                                </div>
                                <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--blue-light)" }}>
                                    {reporte.disciplinaMasReservada}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sin datos */}
                    {reporte.totalTurnos === 0 && (
                        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-tertiary)" }}>
                            <div style={{ fontSize: "36px", marginBottom: "10px" }}>📭</div>
                            <p>No hay turnos generados para esta fecha</p>
                        </div>
                    )}

                    {/* Ocupación por cancha */}
                    {reporte.ocupacionPorCancha?.length > 0 && (
                        <div style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--r-lg)",
                            padding: "1.25rem"
                        }}>
                            <h3 style={{ marginBottom: "1.25rem", fontSize: "13px" }}>
                                Ocupación por cancha
                            </h3>
                            {reporte.ocupacionPorCancha.map((c, i) => (
                                <BarRow
                                    key={i}
                                    cancha={c.cancha}
                                    disciplina={c.disciplina}
                                    ocupados={c.ocupados}
                                    total={c.total}
                                    porcentaje={c.porcentaje}
                                />
                            ))}

                            {/* Leyenda */}
                            <div style={{
                                display: "flex", gap: "16px", marginTop: "1rem",
                                paddingTop: "12px", borderTop: "1px solid var(--border)"
                            }}>
                                {[
                                    { color: "var(--green)", label: "< 40% — Baja ocupación" },
                                    { color: "var(--blue)", label: "40-75% — Media" },
                                    { color: "var(--red)", label: "> 75% — Alta" },
                                ].map(l => (
                                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                        <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: l.color, opacity: 0.8 }} />
                                        <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{l.label}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Stats de pago */}
                            {(reporte.ingresoOnline > 0 || reporte.turnosPendienteEfectivo > 0) && (
                                <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                                    <StatCard
                                        label="Ingreso online"
                                        value={`$${Number(reporte.ingresoOnline).toLocaleString("es-AR")}`}
                                        color="var(--green)"
                                        sub="pagos confirmados"
                                    />
                                    <StatCard
                                        label="Efectivo estimado"
                                        value={`$${Number(reporte.ingresoEfectivoEstimado).toLocaleString("es-AR")}`}
                                        color="var(--blue-light)"
                                        sub="pendiente de cobro"
                                    />
                                    {reporte.turnosPendienteEfectivo > 0 && (
                                        <StatCard
                                            label="Pendientes efectivo"
                                            value={reporte.turnosPendienteEfectivo}
                                            color="#f59e0b"
                                            sub="sin cobrar aún"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ReportesPage;
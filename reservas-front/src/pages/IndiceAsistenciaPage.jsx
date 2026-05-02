import { useEffect, useState } from "react";
import { obtenerIndiceAsistencia } from "../api/api";

function Velocimetro({ porcentaje, nivel }) {
    const size = 220;
    const cx = size / 2;
    const cy = size / 2 + 20;
    const r = 80;
    const strokeWidth = 14;

    // Arco de 210 grados (de -210/2 a 210/2 respecto al centro inferior)
    const startAngle = -210;
    const endAngle = 30;
    const totalAngle = endAngle - startAngle;

    function polarToCartesian(angle) {
        const rad = (angle - 90) * (Math.PI / 180);
        return {
            x: cx + r * Math.cos(rad),
            y: cy + r * Math.sin(rad)
        };
    }

    function describeArc(start, end) {
        const s = polarToCartesian(start);
        const e = polarToCartesian(end);
        const large = end - start > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
    }

    const [animado, setAnimado] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => setAnimado(porcentaje), 300);
        return () => clearTimeout(timeout);
    }, [porcentaje]);

    const angulo = startAngle + (animado / 100) * totalAngle;

    const color = nivel === "EXCELENTE" ? "#22c55e"
        : nivel === "BUENO" ? "#3b82f6"
        : nivel === "REGULAR" ? "#f59e0b"
        : "#ef4444";

    const colorFondo = nivel === "EXCELENTE" ? "rgba(34,197,94,0.1)"
        : nivel === "BUENO" ? "rgba(59,130,246,0.1)"
        : nivel === "REGULAR" ? "rgba(245,158,11,0.1)"
        : "rgba(239,68,68,0.1)";

    const needle = polarToCartesian(angulo);

    return (
        <div style={{ textAlign: "center" }}>
            <svg width={size} height={size * 0.75} style={{ overflow: "visible" }}>
                {/* Fondo del arco */}
                <path
                    d={describeArc(startAngle, endAngle)}
                    fill="none"
                    stroke="var(--bg-input)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Arco de zonas de color */}
                <path d={describeArc(startAngle, startAngle + totalAngle * 0.4)}
                    fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth={strokeWidth} strokeLinecap="round" />
                <path d={describeArc(startAngle + totalAngle * 0.4, startAngle + totalAngle * 0.65)}
                    fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth={strokeWidth} />
                <path d={describeArc(startAngle + totalAngle * 0.65, startAngle + totalAngle * 0.85)}
                    fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth={strokeWidth} />
                <path d={describeArc(startAngle + totalAngle * 0.85, endAngle)}
                    fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth={strokeWidth} strokeLinecap="round" />

                {/* Arco de progreso animado */}
                <path
                    d={describeArc(startAngle, angulo)}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    style={{ transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)", filter: `drop-shadow(0 0 6px ${color})` }}
                />

                {/* Aguja */}
                <line
                    x1={cx}
                    y1={cy}
                    x2={needle.x}
                    y2={needle.y}
                    stroke={color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    style={{ transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                />

                {/* Centro de la aguja */}
                <circle cx={cx} cy={cy} r={6} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
                <circle cx={cx} cy={cy} r={3} fill="var(--bg-card)" />

                {/* Porcentaje */}
                <text x={cx} y={cy - 28} textAnchor="middle"
                    style={{ fontSize: "26px", fontWeight: "600", fill: color, fontFamily: "DM Sans, sans-serif", transition: "fill 0.5s" }}>
                    {animado}%
                </text>
            </svg>
        </div>
    );
}

function IndiceAsistenciaPage() {
    const [indice, setIndice] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        obtenerIndiceAsistencia()
            .then(setIndice)
            .catch(e => alert(e.message))
            .finally(() => setCargando(false));
    }, []);

    const nivelConfig = {
        EXCELENTE: { label: "Excelente", color: "var(--green)", emoji: "🏆", desc: "Sos un usuario muy confiable. Tus reservas siempre se cumplen." },
        BUENO:     { label: "Bueno",     color: "var(--blue-light)", emoji: "👍", desc: "Buen historial. Pocas cancelaciones." },
        REGULAR:   { label: "Regular",   color: "#f59e0b", emoji: "⚠️", desc: "Tenés varias cancelaciones. Intentá respetar tus reservas." },
        BAJO:      { label: "Bajo",      color: "var(--red)", emoji: "❌", desc: "Alto índice de cancelaciones. El complejo puede restringir tu acceso." },
    };

    const config = indice ? nivelConfig[indice.nivel] : null;

    return (
        <div className="fade-up" style={{ maxWidth: "520px", margin: "0 auto" }}>

            <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ marginBottom: "4px" }}>Mi índice de asistencia</h1>
                <p style={{ fontSize: "13px" }}>Tu nivel de confiabilidad como usuario del complejo</p>
            </div>

            {cargando && (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-tertiary)" }}>
                    Cargando...
                </div>
            )}

            {indice && config && (
                <>
                    {/* Velocímetro */}
                    <div style={{
                        background: "var(--bg-card)",
                        border: `1px solid ${config.color}40`,
                        borderRadius: "var(--r-xl)",
                        padding: "2rem 1.5rem 1.5rem",
                        marginBottom: "1rem",
                        textAlign: "center"
                    }}>
                        <Velocimetro porcentaje={indice.porcentajeAsistencia} nivel={indice.nivel} />

                        <div style={{ marginTop: "3rem" }}>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: "8px",
                                background: `${config.color}20`,
                                border: `1px solid ${config.color}40`,
                                borderRadius: "20px",
                                padding: "6px 16px",
                                marginBottom: "10px"
                            }}>
                                <span style={{ fontSize: "16px" }}>{config.emoji}</span>
                                <span style={{ fontSize: "14px", fontWeight: "600", color: config.color }}>
                                    {config.label}
                                </span>
                            </div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "300px", margin: "0 auto" }}>
                                {config.desc}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "1rem" }}>
                        {[
                            { label: "Totales", value: indice.totalReservas, color: "var(--text-primary)" },
                            { label: "Activas", value: indice.activas, color: "var(--green)" },
                            { label: "Canceladas", value: indice.canceladas, color: "var(--red)" },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border)",
                                borderRadius: "var(--r-md)",
                                padding: "12px",
                                textAlign: "center"
                            }}>
                                <div style={{ fontSize: "22px", fontWeight: "600", color: s.color, marginBottom: "2px" }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Escala */}
                    <div style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--r-md)",
                        padding: "1rem"
                    }}>
                        <p style={{ fontSize: "11px", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                            Escala de niveles
                        </p>
                        {[
                            { nivel: "EXCELENTE", label: "Excelente", rango: "85% – 100%", color: "var(--green)" },
                            { nivel: "BUENO",     label: "Bueno",     rango: "65% – 84%",  color: "var(--blue-light)" },
                            { nivel: "REGULAR",   label: "Regular",   rango: "40% – 64%",  color: "#f59e0b" },
                            { nivel: "BAJO",      label: "Bajo",      rango: "0% – 39%",   color: "var(--red)" },
                        ].map(n => (
                            <div key={n.nivel} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "6px 0",
                                borderBottom: "1px solid var(--border)",
                                opacity: indice.nivel === n.nivel ? 1 : 0.45
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: n.color }} />
                                    <span style={{ fontSize: "12px", color: n.color, fontWeight: indice.nivel === n.nivel ? "600" : "400" }}>
                                        {n.label}
                                    </span>
                                    {indice.nivel === n.nivel && (
                                        <span style={{ fontSize: "10px", background: `${n.color}20`, color: n.color, padding: "1px 6px", borderRadius: "10px" }}>
                                            tu nivel
                                        </span>
                                    )}
                                </div>
                                <span style={{ fontSize: "12px", color: "var(--text-tertiary)", fontFamily: "DM Mono, monospace" }}>
                                    {n.rango}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Sin reservas */}
            {indice && indice.totalReservas === 0 && (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-tertiary)" }}>
                    <p>Todavía no tenés reservas registradas.</p>
                </div>
            )}
        </div>
    );
}

export default IndiceAsistenciaPage;

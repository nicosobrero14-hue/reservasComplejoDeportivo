import { useState } from "react";
import { iniciarPago } from "../api/api";

export function PagoModal({ turno, esPartido = false, esVisitante = false, onExito, onCerrar }) {
    const [metodo, setMetodo] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [descuentoInfo, setDescuentoInfo] = useState(null);
    console.log("PagoModal props:", { esPartido, esVisitante, turnoId: turno?.id });


    const handleConfirmar = async () => {
        if (!metodo) { alert("Seleccioná un método de pago"); return; }
        setCargando(true);
        try {
            // ✅ pasar esVisitante al iniciarPago
            const data = await iniciarPago(turno.id, metodo, esPartido, esVisitante);

            if (metodo === "ONLINE" && data.linkPago) {
                window.location.href = data.linkPago;
            } else {
                alert(`✅ Reserva confirmada\n\nTotal a abonar en el complejo: $${data.total}\n\n${data.mensaje}`);
                onExito();
            }
        } catch (e) {
            alert(e.message);
        } finally {
            setCargando(false);
        }
    };
    const precioBase = turno.precio || 0;
    const precioPartido = esPartido ? precioBase / 2 : precioBase;
    const descuentoOnline = descuentoInfo || 10; // % de descuento
    const totalOnline = precioPartido * (1 - descuentoOnline / 100);

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem"
        }}>
            <div className="fade-up" style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-xl)",
                padding: "1.5rem",
                maxWidth: "440px", width: "100%",
                boxShadow: "var(--shadow-md)"
            }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>💳</div>
                    <h2 style={{ fontSize: "17px", marginBottom: "4px" }}>Confirmar reserva</h2>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                        {turno.horaInicio} – {turno.horaFin} · {turno.disciplina} · {turno.cancha}
                    </p>
                    {esPartido && (
                        <span style={{
                            display: "inline-block", marginTop: "6px",
                            fontSize: "11px", background: "var(--blue-dim)",
                            color: "var(--blue-light)", padding: "2px 8px",
                            borderRadius: "20px", border: "1px solid rgba(59,130,246,0.25)"
                        }}>
                            ⚽ Modo partido — precio por equipo
                        </span>

                        
                    )}
                </div>

                {/* Opciones de pago */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.25rem" }}>

                    {/* Online */}
                    <div
                        onClick={() => setMetodo("ONLINE")}
                        style={{
                            background: metodo === "ONLINE" ? "var(--blue-dim)" : "var(--bg-input)",
                            border: `1px solid ${metodo === "ONLINE" ? "rgba(59,130,246,0.5)" : "var(--border-med)"}`,
                            borderRadius: "var(--r-md)", padding: "14px 16px",
                            cursor: "pointer", transition: "all .15s"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)", marginBottom: "4px" }}>
                                    💳 Pagar online
                                </div>
                                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                    MercadoPago — tarjeta, débito o saldo
                                </div>
                                <div style={{
                                    display: "inline-block", marginTop: "6px",
                                    fontSize: "11px", background: "rgba(34,197,94,0.15)",
                                    color: "var(--green)", padding: "2px 8px",
                                    borderRadius: "20px"
                                }}>
                                    🎉 {descuentoOnline}% de descuento
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "11px", color: "var(--text-tertiary)", textDecoration: "line-through" }}>
                                    ${precioPartido.toLocaleString("es-AR")}
                                </div>
                                <div style={{ fontSize: "18px", fontWeight: "600", color: "var(--green)" }}>
                                    ${totalOnline.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Aviso modo partido */}
                    {esPartido && (
                        <div style={{
                            background: "var(--blue-dim)", border: "1px solid rgba(59,130,246,0.25)",
                            borderRadius: "var(--r-sm)", padding: "10px 12px",
                            fontSize: "12px", color: "var(--blue-light)", marginBottom: "1rem"
                        }}>
                            ⚽ Modo partido — solo disponible con pago online.
                        </div>
                    )}

                    {/* ✅ Efectivo solo si NO es partido */}
                    {!esPartido && (
                        <div
                            onClick={() => setMetodo("EFECTIVO")}
                            style={{
                                background: metodo === "EFECTIVO" ? "rgba(148,163,184,0.08)" : "var(--bg-input)",
                                border: "1px solid var(--border-med)",
                                borderRadius: "var(--r-md)", padding: "14px 16px",
                                cursor: "pointer", transition: "all .15s"
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)", marginBottom: "4px" }}>
                                        💵 Pagar en el complejo
                                    </div>
                                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                                        Efectivo al llegar — sin descuento
                                    </div>
                                </div>
                                <div style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-primary)" }}>
                                    ${precioPartido.toLocaleString("es-AR")}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                {/* Aviso cancelación */}
                <div style={{
                    background: "var(--red-dim)", border: "1px solid var(--red-border)",
                    borderRadius: "var(--r-sm)", padding: "10px 12px",
                    fontSize: "12px", color: "var(--red)", marginBottom: "1.25rem"
                }}>
                    ⚠️ Las cancelaciones no tienen reembolso. El pago online es definitivo.
                </div>

                {/* Botones */}
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn-secondary" style={{ flex: 1 }} onClick={onCerrar} disabled={cargando}>
                        Cancelar
                    </button>
                    <button
                        className="btn-primary" style={{ flex: 1 }}
                        onClick={handleConfirmar}
                        disabled={!metodo || cargando}
                    >
                        {cargando ? "Procesando..." : metodo === "ONLINE" ? "Ir a MercadoPago" : "Confirmar reserva"}
                    </button>
                </div>
            </div>
        </div>
    );
}

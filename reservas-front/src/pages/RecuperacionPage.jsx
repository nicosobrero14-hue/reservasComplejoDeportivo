import { useState } from "react";
import { solicitarRecuperacion } from "../api/api";

export function RecuperacionPage({ onVolver }) {
    const [email, setEmail] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const handleEnviar = async () => {
        if (!email) { setError("Ingresá tu email"); return; }
        setCargando(true);
        setError("");
        try {
            await solicitarRecuperacion(email);
            setEnviado(true);
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "radial-gradient(ellipse at 60% 20%, rgba(59,130,246,0.08) 0%, transparent 60%), var(--bg-base)",
            padding: "1rem"
        }}>
            <div className="fade-up" style={{ width: "100%", maxWidth: "380px" }}>

                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{
                        width: "52px", height: "52px",
                        background: "var(--blue-dim)", border: "1px solid rgba(59,130,246,0.3)",
                        borderRadius: "14px", margin: "0 auto 14px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "22px"
                    }}>🔑</div>
                    <h1 style={{ fontSize: "20px", marginBottom: "4px" }}>Recuperar contraseña</h1>
                    <p style={{ fontSize: "13px" }}>Te enviamos un link a tu email</p>
                </div>

                <div className="card" style={{ boxShadow: "var(--shadow-md)" }}>

                    {enviado ? (
                        <div style={{ textAlign: "center", padding: "1rem 0" }}>
                            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📬</div>
                            <p style={{ fontSize: "14px", color: "var(--green)", fontWeight: "500", marginBottom: "8px" }}>
                                ¡Email enviado!
                            </p>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                Revisá tu bandeja. El link expira en 15 minutos.
                            </p>
                            <button
                                onClick={onVolver}
                                style={{
                                    marginTop: "1.5rem", background: "transparent",
                                    border: "none", color: "var(--blue-light)",
                                    fontSize: "13px", cursor: "pointer"
                                }}
                            >
                                ← Volver al login
                            </button>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div style={{
                                    background: "var(--red-dim)", border: "1px solid var(--red-border)",
                                    borderRadius: "var(--r-sm)", padding: "10px 14px",
                                    marginBottom: "1rem", fontSize: "13px", color: "var(--red)"
                                }}>{error}</div>
                            )}

                            <div style={{ marginBottom: "1.25rem" }}>
                                <label className="field-label">Tu email</label>
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleEnviar()}
                                />
                            </div>

                            <button className="btn-primary" onClick={handleEnviar} disabled={cargando}>
                                {cargando ? "Enviando..." : "Enviar link de recuperación"}
                            </button>

                            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                                <button
                                    onClick={onVolver}
                                    style={{
                                        background: "transparent", border: "none",
                                        color: "var(--blue-light)", fontSize: "13px", cursor: "pointer"
                                    }}
                                >
                                    ← Volver al login
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}




import { useState } from "react";
import { resetearPassword } from "../api/api";

export function ResetPasswordPage({ token, onExito }) {
    const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const [listo, setListo] = useState(false);

    const handleReset = async () => {
        if (!password || !confirmar) { setError("Completá todos los campos"); return; }
        if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
        if (password !== confirmar) { setError("Las contraseñas no coinciden"); return; }
        setCargando(true);
        setError("");
        try {
            await resetearPassword(token, password);
            setListo(true);
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
                    }}>🔒</div>
                    <h1 style={{ fontSize: "20px", marginBottom: "4px" }}>Nueva contraseña</h1>
                    <p style={{ fontSize: "13px" }}>Elegí una contraseña segura</p>
                </div>

                <div className="card" style={{ boxShadow: "var(--shadow-md)" }}>

                    {listo ? (
                        <div style={{ textAlign: "center", padding: "1rem 0" }}>
                            <div style={{ fontSize: "36px", marginBottom: "12px" }}>✅</div>
                            <p style={{ fontSize: "14px", color: "var(--green)", fontWeight: "500", marginBottom: "8px" }}>
                                ¡Contraseña actualizada!
                            </p>
                            <button className="btn-primary" onClick={onExito} style={{ marginTop: "1rem" }}>
                                Ir al login
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

                            {!token && (
                                <div style={{
                                    background: "var(--red-dim)", border: "1px solid var(--red-border)",
                                    borderRadius: "var(--r-sm)", padding: "10px 14px",
                                    marginBottom: "1rem", fontSize: "13px", color: "var(--red)"
                                }}>
                                    Token inválido o expirado. Solicitá un nuevo link.
                                </div>
                            )}

                            <div style={{ marginBottom: "1rem" }}>
                                <label className="field-label">Nueva contraseña</label>
                                <input
                                    type="password" placeholder="Mínimo 6 caracteres"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            <div style={{ marginBottom: "1.25rem" }}>
                                <label className="field-label">Confirmar contraseña</label>
                                <input
                                    type="password" placeholder="Repetí la contraseña"
                                    value={confirmar} onChange={e => setConfirmar(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleReset()}
                                />
                            </div>

                            <button className="btn-primary" onClick={handleReset} disabled={cargando || !token}>
                                {cargando ? "Actualizando..." : "Cambiar contraseña"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
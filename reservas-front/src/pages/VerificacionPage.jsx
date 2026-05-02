import { useState, useRef } from "react";
import { enviarCodigoVerificacion, verificarCodigo } from "../api/api";

function VerificacionPage({ email, onVerificado }) {
    const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
    const [cargando, setCargando] = useState(false);
    const [reenviando, setReenviando] = useState(false);
    const [error, setError] = useState("");
    const [exito, setExito] = useState(false);
    const inputs = useRef([]);

    const handleChange = (i, val) => {
        if (!/^\d*$/.test(val)) return; // solo números
        const nuevo = [...codigo];
        nuevo[i] = val.slice(-1); // solo un dígito
        setCodigo(nuevo);
        if (val && i < 5) inputs.current[i + 1]?.focus();
    };

    const handleKeyDown = (i, e) => {
        if (e.key === "Backspace" && !codigo[i] && i > 0) {
            inputs.current[i - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (paste.length === 6) {
            setCodigo(paste.split(""));
            inputs.current[5]?.focus();
        }
        e.preventDefault();
    };

    const handleVerificar = async () => {
        const codigoStr = codigo.join("");
        if (codigoStr.length !== 6) { setError("Ingresá los 6 dígitos"); return; }
        setCargando(true);
        setError("");
        try {
            await verificarCodigo(email, codigoStr);
            setExito(true);
            setTimeout(() => onVerificado(), 1800);
        } catch (e) {
            setError(e.message);
            setCodigo(["", "", "", "", "", ""]);
            inputs.current[0]?.focus();
        } finally {
            setCargando(false);
        }
    };

    const handleReenviar = async () => {
        setReenviando(true);
        setError("");
        try {
            await enviarCodigoVerificacion(email);
            setCodigo(["", "", "", "", "", ""]);
            inputs.current[0]?.focus();
        } catch (e) {
            setError(e.message);
        } finally {
            setReenviando(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "radial-gradient(ellipse at 60% 20%, rgba(59,130,246,0.08) 0%, transparent 60%), var(--bg-base)",
            padding: "1rem"
        }}>
            <div className="fade-up" style={{ width: "100%", maxWidth: "400px" }}>

                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{
                        width: "52px", height: "52px",
                        background: exito ? "rgba(34,197,94,0.15)" : "var(--blue-dim)",
                        border: `1px solid ${exito ? "rgba(34,197,94,0.3)" : "rgba(59,130,246,0.3)"}`,
                        borderRadius: "14px", margin: "0 auto 14px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "22px", transition: "all 0.4s"
                    }}>
                        {exito ? "✅" : "📧"}
                    </div>
                    <h1 style={{ fontSize: "20px", marginBottom: "4px" }}>
                        {exito ? "¡Cuenta verificada!" : "Verificá tu cuenta"}
                    </h1>
                    <p style={{ fontSize: "13px" }}>
                        {exito
                            ? "Redirigiendo al login..."
                            : <>Ingresá el código que enviamos a <strong style={{ color: "var(--blue-light)" }}>{email}</strong></>
                        }
                    </p>
                </div>

                {!exito && (
                    <div className="card" style={{ boxShadow: "var(--shadow-md)" }}>

                        {error && (
                            <div style={{
                                background: "var(--red-dim)", border: "1px solid var(--red-border)",
                                borderRadius: "var(--r-sm)", padding: "10px 14px",
                                marginBottom: "1rem", fontSize: "13px", color: "var(--red)"
                            }}>{error}</div>
                        )}

                        {/* Input de 6 dígitos */}
                        <div style={{
                            display: "flex", gap: "8px", justifyContent: "center",
                            marginBottom: "1.5rem"
                        }}>
                            {codigo.map((d, i) => (
                                <input
                                    key={i}
                                    ref={el => inputs.current[i] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={d}
                                    onChange={e => handleChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    onPaste={handlePaste}
                                    style={{
                                        width: "44px", height: "52px",
                                        textAlign: "center",
                                        fontSize: "20px", fontWeight: "600",
                                        background: d ? "var(--blue-dim)" : "var(--bg-input)",
                                        border: `1px solid ${d ? "rgba(59,130,246,0.5)" : "var(--border-med)"}`,
                                        borderRadius: "var(--r-md)",
                                        color: d ? "var(--blue-light)" : "var(--text-primary)",
                                        transition: "all .15s",
                                        outline: "none",
                                        caretColor: "var(--blue)"
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handleVerificar}
                            disabled={cargando || codigo.join("").length !== 6}
                        >
                            {cargando ? "Verificando..." : "Verificar cuenta"}
                        </button>

                        <div style={{ textAlign: "center", marginTop: "1rem" }}>
                            <button
                                onClick={handleReenviar}
                                disabled={reenviando}
                                style={{
                                    background: "transparent", border: "none",
                                    color: "var(--text-secondary)", fontSize: "12px", cursor: "pointer"
                                }}
                            >
                                {reenviando ? "Enviando..." : "¿No recibiste el código? Reenviar"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerificacionPage;

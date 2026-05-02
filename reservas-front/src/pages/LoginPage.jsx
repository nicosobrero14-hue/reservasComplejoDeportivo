import { useState } from "react";
import { login } from "../api/api";
import RegisterPage from "./RegisterPage";
import { RecuperacionPage } from "./RecuperacionPage";


function LoginPage({ onLogin }) {
    const [modo, setModo] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    if (modo === "register") {
        return <RegisterPage onRegister={() => setModo("login")} />;
    }

    if (modo === "recuperar") {
        return <RecuperacionPage onVolver={() => setModo("login")} />;
    }

    const handleLogin = async () => {
        if (!email || !password) { setError("Completá todos los campos"); return; }
        setCargando(true);
        setError("");
        try {
            const data = await login(email, password);
            onLogin(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(ellipse at 60% 20%, rgba(59,130,246,0.08) 0%, transparent 60%), var(--bg-base)",
            padding: "1rem"
        }}>
            <div className="fade-up" style={{ width: "100%", maxWidth: "380px" }}>

                {/* Brand */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{
                        width: "52px", height: "52px",
                        background: "var(--blue-dim)",
                        border: "1px solid rgba(59,130,246,0.3)",
                        borderRadius: "14px",
                        margin: "0 auto 14px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "22px"
                    }}>⚽</div>
                    <h1 style={{ fontSize: "20px", marginBottom: "4px" }}>Complejo Deportivo</h1>
                    <p style={{ fontSize: "13px" }}>Iniciá sesión para reservar tu turno</p>
                </div>

                {/* Card */}
                <div className="card" style={{ boxShadow: "var(--shadow-md)" }}>

                    {error && (
                        <div style={{
                            background: "var(--red-dim)",
                            border: "1px solid var(--red-border)",
                            borderRadius: "var(--r-sm)",
                            padding: "10px 14px",
                            marginBottom: "1rem",
                            fontSize: "13px",
                            color: "var(--red)"
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: "1rem" }}>
                        <label className="field-label">Email</label>
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleLogin()}
                        />
                    </div>

                    <div style={{ marginBottom: "1.25rem" }}>
                        <label className="field-label">Contraseña</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleLogin()}
                        />
                    </div>

                    <button className="btn-primary" onClick={handleLogin} disabled={cargando}>
                        {cargando ? "Ingresando..." : "Ingresar"}
                    </button>

                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                        <button
                            onClick={() => setModo("register")}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "var(--blue-light)",
                                fontSize: "13px",
                                cursor: "pointer"
                            }}
                        >
                            ¿No tenés cuenta? <strong>Registrate</strong>
                        </button>
                        
                        <button onClick={() => setModo("recuperar")} style={{
                            background: "transparent", border: "none",
                            color: "var(--text-tertiary)", fontSize: "12px", cursor: "pointer"
                            }}
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;


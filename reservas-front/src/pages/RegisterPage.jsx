import { useState } from "react";
import { registrarUsuario } from "../api/api";
import VerificacionPage from "./VerificacionPage";

function RegisterPage({ onRegister }) {
    const [form, setForm] = useState({ nombre: "", apellido: "", email: "", celular: "", password: "" });
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [emailRegistrado, setEmailRegistrado] = useState("");
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    if (emailRegistrado) {
        return <VerificacionPage
            email={emailRegistrado}
            onVerificado={() => {
                alert("¡Cuenta verificada! Ya podés iniciar sesión.");
                onRegister();
            }}
        />;
    }

    const handleRegister = async () => {
        if (!form.nombre || !form.apellido || !form.email || !form.password) {
            setError("Completá todos los campos obligatorios");
            return;
        }
        setCargando(true);
        setError("");
        try {
            await registrarUsuario(form);
            setEmailRegistrado(form.email);
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    };

    const fields = [
        { key: "nombre", label: "Nombre", placeholder: "Juan" },
        { key: "apellido", label: "Apellido", placeholder: "García" },
        { key: "email", label: "Email", placeholder: "juan@email.com", type: "email" },
        { key: "celular", label: "Celular", placeholder: "11 1234-5678" },
        { key: "password", label: "Contraseña", placeholder: "••••••••", type: "password" },
    ];

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(ellipse at 60% 20%, rgba(59,130,246,0.08) 0%, transparent 60%), var(--bg-base)",
            padding: "1rem"
        }}>
            <div className="fade-up" style={{ width: "100%", maxWidth: "400px" }}>

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
                    <h1 style={{ fontSize: "20px", marginBottom: "4px" }}>Crear cuenta</h1>
                    <p style={{ fontSize: "13px" }}>Registrate para empezar a reservar</p>
                </div>

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

                    {fields.map(f => (
                        <div key={f.key} style={{ marginBottom: "1rem" }}>
                            <label className="field-label">{f.label}</label>
                            <input
                                type={f.type || "text"}
                                placeholder={f.placeholder}
                                value={form[f.key]}
                                onChange={e => set(f.key, e.target.value)}
                            />
                        </div>
                    ))}

                    <button className="btn-primary" onClick={handleRegister} disabled={cargando} style={{ marginTop: "0.25rem" }}>
                        {cargando ? "Creando cuenta..." : "Crear cuenta"}
                    </button>

                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                        <button
                            onClick={onRegister}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "var(--blue-light)",
                                fontSize: "13px",
                                cursor: "pointer"
                            }}
                        >
                            ← Volver al login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;

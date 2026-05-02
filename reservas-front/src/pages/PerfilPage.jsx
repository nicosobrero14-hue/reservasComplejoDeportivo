import { useState } from "react";
import { actualizarPerfil } from "../api/api";

export function PerfilPage({ usuario, onActualizar, onCerrar }) {
    const [form, setForm] = useState({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
        celular: usuario.celular || "",
        passwordActual: "",
        passwordNueva: "",
    });
    const [cargando, setCargando] = useState(false);
    const [exito, setExito] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError("");
        setExito(false);
    };

    const handleGuardar = async () => {
        setCargando(true);
        setError("");
        try {
            const data = await actualizarPerfil(form);
            setExito(true);
            onActualizar(data); // actualizar usuario en App
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 300,
            background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem"
        }}>
            <div className="fade-up" style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-xl)",
                padding: "1.75rem",
                maxWidth: "460px", width: "100%",
                boxShadow: "var(--shadow-md)",
                maxHeight: "90vh", overflowY: "auto"
            }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                    <div>
                        <h2 style={{ fontSize: "17px", marginBottom: "2px" }}>Mi cuenta</h2>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                            Editá tus datos personales
                        </p>
                    </div>
                    <button onClick={onCerrar} style={{
                        background: "var(--bg-input)", border: "1px solid var(--border)",
                        borderRadius: "50%", width: "28px", height: "28px",
                        cursor: "pointer", color: "var(--text-secondary)", fontSize: "14px"
                    }}>✕</button>
                </div>

                {/* Avatar */}
                <div style={{
                    width: "52px", height: "52px",
                    background: "var(--blue-dim)",
                    border: "2px solid rgba(59,130,246,0.3)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", fontWeight: "600", color: "var(--blue-light)",
                    marginBottom: "1.5rem"
                }}>
                    {usuario.nombre?.charAt(0).toUpperCase()}
                </div>

                {/* Campos */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                        <label className="field-label">Nombre</label>
                        <input name="nombre" value={form.nombre} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="field-label">Apellido</label>
                        <input name="apellido" value={form.apellido} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label className="field-label">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} />
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                    <label className="field-label">Celular</label>
                    <input name="celular" value={form.celular} onChange={handleChange} placeholder="Ej: 1123456789" />
                </div>

                {/* Cambio contraseña */}
                <div style={{
                    borderTop: "1px solid var(--border)",
                    paddingTop: "1.25rem", marginBottom: "1.25rem"
                }}>
                    <p style={{ fontSize: "12px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "12px" }}>
                        Cambiar contraseña — dejá vacío para no modificar
                    </p>
                    <div style={{ marginBottom: "12px" }}>
                        <label className="field-label">Contraseña actual</label>
                        <input name="passwordActual" type="password" value={form.passwordActual}
                            onChange={handleChange} placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="field-label">Contraseña nueva</label>
                        <input name="passwordNueva" type="password" value={form.passwordNueva}
                            onChange={handleChange} placeholder="••••••••" />
                    </div>
                </div>

                {/* Feedback */}
                {error && (
                    <div style={{
                        background: "var(--red-dim)", border: "1px solid var(--red-border)",
                        borderRadius: "var(--r-sm)", padding: "10px 12px",
                        fontSize: "13px", color: "var(--red)", marginBottom: "1rem"
                    }}>
                        ❌ {error}
                    </div>
                )}
                {exito && (
                    <div style={{
                        background: "var(--green-dim)", border: "1px solid var(--green-border)",
                        borderRadius: "var(--r-sm)", padding: "10px 12px",
                        fontSize: "13px", color: "var(--green)", marginBottom: "1rem"
                    }}>
                        ✅ Datos actualizados correctamente
                    </div>
                )}

                {/* Botones */}
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn-secondary" style={{ flex: 1 }} onClick={onCerrar}>
                        Cancelar
                    </button>
                    <button className="btn-primary" style={{ flex: 1 }}
                        onClick={handleGuardar} disabled={cargando}>
                        {cargando ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
}

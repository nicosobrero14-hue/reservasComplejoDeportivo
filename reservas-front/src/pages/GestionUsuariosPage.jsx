import { useState, useEffect } from "react";
import { listarUsuarios, cambiarRolUsuario } from "../api/api";

function GestionUsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [buscar, setBuscar] = useState("");
    const [cargando, setCargando] = useState(true);

    const cargar = async (q = "") => {
        setCargando(true);
        try {
            const data = await listarUsuarios(q);
            setUsuarios(data);
        } catch (e) {
            alert(e.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const handleBuscar = (e) => {
        setBuscar(e.target.value);
        cargar(e.target.value);
    };

    const handleCambiarRol = async (id, nombreActual) => {
        if (!confirm(`¿Cambiar el rol de ${nombreActual}?`)) return;
        try {
            await cambiarRolUsuario(id);
            await cargar(buscar);
        } catch (e) {
            alert(e.message);
        }
    };

    function formatFecha(dt) {
        if (!dt) return "-";
        return new Date(dt).toLocaleDateString("es-AR", {
            day: "2-digit", month: "2-digit", year: "numeric"
        });
    }

    const admins = usuarios.filter(u => u.role === "ADMIN").length;
    const users = usuarios.filter(u => u.role === "USER").length;

    return (
        <div className="fade-up">

            {/* Header */}
            <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ marginBottom: "4px" }}>Gestión de usuarios</h1>
                <p style={{ fontSize: "13px" }}>Administrá los roles y accesos del sistema</p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "var(--r-md)", padding: "10px 16px",
                    display: "flex", alignItems: "center", gap: "8px"
                }}>
                    <span style={{ fontSize: "20px", fontWeight: "600", color: "var(--text-primary)" }}>{usuarios.length}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>usuarios totales</span>
                </div>
                <div style={{
                    background: "var(--blue-dim)", border: "1px solid rgba(59,130,246,0.25)",
                    borderRadius: "var(--r-md)", padding: "10px 16px",
                    display: "flex", alignItems: "center", gap: "8px"
                }}>
                    <span style={{ fontSize: "20px", fontWeight: "600", color: "var(--blue-light)" }}>{admins}</span>
                    <span style={{ fontSize: "12px", color: "var(--blue-light)" }}>admins</span>
                </div>
                <div style={{
                    background: "var(--gray-dim)", border: "1px solid var(--gray-border)",
                    borderRadius: "var(--r-md)", padding: "10px 16px",
                    display: "flex", alignItems: "center", gap: "8px"
                }}>
                    <span style={{ fontSize: "20px", fontWeight: "600", color: "var(--text-secondary)" }}>{users}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>usuarios</span>
                </div>
            </div>

            {/* Buscador */}
            <div style={{ maxWidth: "320px", marginBottom: "1.25rem" }}>
                <label className="field-label">Buscar</label>
                <input
                    placeholder="Nombre, apellido o email..."
                    value={buscar}
                    onChange={handleBuscar}
                />
            </div>

            {/* Loading */}
            {cargando && (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-tertiary)" }}>
                    Cargando usuarios...
                </div>
            )}

            {/* Empty */}
            {!cargando && usuarios.length === 0 && (
                <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-tertiary)" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
                    <p>No se encontraron usuarios</p>
                </div>
            )}

            {/* Tabla */}
            {!cargando && usuarios.length > 0 && (
                <div style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r-lg)",
                    overflow: "hidden"
                }}>
                    {/* Header tabla */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
                        padding: "10px 16px",
                        borderBottom: "1px solid var(--border)",
                        background: "var(--bg-surface)"
                    }}>
                        {["Usuario", "Email", "Registro", "Rol", "Acción"].map(h => (
                            <span key={h} style={{
                                fontSize: "11px", fontWeight: "500",
                                color: "var(--text-tertiary)",
                                textTransform: "uppercase", letterSpacing: "0.05em"
                            }}>{h}</span>
                        ))}
                    </div>

                    {/* Filas */}
                    {usuarios.map((u, i) => (
                        <div key={u.id} style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
                            padding: "12px 16px",
                            borderBottom: i < usuarios.length - 1 ? "1px solid var(--border)" : "none",
                            alignItems: "center",
                            transition: "background .15s"
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                            {/* Nombre */}
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{
                                    width: "30px", height: "30px",
                                    background: u.role === "ADMIN" ? "var(--blue-dim)" : "var(--gray-dim)",
                                    border: `1px solid ${u.role === "ADMIN" ? "rgba(59,130,246,0.25)" : "var(--gray-border)"}`,
                                    borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "11px", fontWeight: "600",
                                    color: u.role === "ADMIN" ? "var(--blue-light)" : "var(--text-secondary)",
                                    flexShrink: 0
                                }}>
                                    {u.nombre?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-primary)" }}>
                                        {u.nombre} {u.apellido}
                                    </div>
                                    {u.celular && (
                                        <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                                            {u.celular}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {u.email}
                            </div>

                            {/* Fecha */}
                            <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                                {formatFecha(u.fechaRegistro)}
                            </div>

                            {/* Rol */}
                            <div>
                                <span className={`badge ${u.role === "ADMIN" ? "badge-blue" : "badge-gray"}`}>
                                    {u.role === "ADMIN" ? "Admin" : "Usuario"}
                                </span>
                            </div>

                            {/* Acción */}
                            <div>
                                <button
                                    className="btn-secondary"
                                    onClick={() => handleCambiarRol(u.id, u.nombre)}
                                    style={{ fontSize: "11px", padding: "4px 10px" }}
                                >
                                    {u.role === "ADMIN" ? "→ Usuario" : "→ Admin"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GestionUsuariosPage;

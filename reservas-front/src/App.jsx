import { useState, useRef, useEffect } from "react";
import { getUsuarioGuardado, logout } from "./api/api";
import LoginPage from "./pages/LoginPage";
import TurnosPage from "./pages/TurnosPage";
import AdminPage from "./pages/AdminPage";
import MisReservasPage from "./pages/MisReservasPage";
import ReportesPage from "./pages/ReportesPage";
import GestionUsuariosPage from "./pages/GestionUsuariosPage";
import IndiceAsistenciaPage from "./pages/IndiceAsistenciaPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import PartidosPage from "./pages/PartidosPage";
import { PagoExitosoPage } from "./pages/PagoExitosoPage";
import { PagoFallidoPage } from "./pages/PagoFallidoPage";
import { ConfigPagosPage } from "./pages/ConfigPagosPage";
import { PerfilPage } from "./pages/PerfilPage";

// ─── User Menu Dropdown ───────────────────────────────────────
function UserMenu({ usuario, onLogout, onPerfil }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: open ? "var(--bg-input)" : "var(--bg-card)",
                    border: `1px solid ${open ? "rgba(59,130,246,0.4)" : "var(--border)"}`,
                    borderRadius: "20px", padding: "5px 12px 5px 5px",
                    cursor: "pointer", transition: "all .15s"
                }}
            >
                {/* Avatar */}
                <div style={{
                    width: "26px", height: "26px",
                    background: "linear-gradient(135deg, var(--blue-dim), rgba(59,130,246,0.2))",
                    border: "1px solid rgba(59,130,246,0.35)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "700", color: "var(--blue-light)"
                }}>
                    {usuario.nombre?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {usuario.nombre}
                </span>
                {usuario.role === "ADMIN" && (
                    <span style={{
                        fontSize: "9px", background: "var(--blue-dim)",
                        color: "var(--blue-light)", padding: "1px 6px",
                        borderRadius: "20px", border: "1px solid rgba(59,130,246,0.25)",
                        fontWeight: "600", letterSpacing: "0.05em"
                    }}>ADMIN</span>
                )}
                <span style={{ fontSize: "10px", color: "var(--text-tertiary)", transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
            </button>

            {/* Dropdown */}
            {open && (
                <div style={{
                    position: "absolute", right: 0, top: "calc(100% + 8px)",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r-lg)",
                    boxShadow: "var(--shadow-md)",
                    minWidth: "200px", zIndex: 999,
                    overflow: "hidden",
                    animation: "fadeUp .15s ease both"
                }}>
                    {/* Info */}
                    <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
                        <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-primary)" }}>
                            {usuario.nombre} {usuario.apellido}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "2px" }}>
                            {usuario.email}
                        </div>
                    </div>

                    {/* Opciones */}
                    <div style={{ padding: "6px" }}>
                        <button
                            onClick={() => { setOpen(false); onPerfil(); }}
                            style={{
                                width: "100%", textAlign: "left",
                                background: "transparent", border: "none",
                                padding: "8px 10px", borderRadius: "var(--r-sm)",
                                fontSize: "13px", color: "var(--text-secondary)",
                                cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                                transition: "background .1s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-input)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                            👤 Mi cuenta
                        </button>
                        <button
                            onClick={() => { setOpen(false); onLogout(); }}
                            style={{
                                width: "100%", textAlign: "left",
                                background: "transparent", border: "none",
                                padding: "8px 10px", borderRadius: "var(--r-sm)",
                                fontSize: "13px", color: "var(--red)",
                                cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                                transition: "background .1s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--red-dim)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                            🚪 Cerrar sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Navbar ───────────────────────────────────────────────────
function Navbar({ usuario, vista, setVista, onLogout, onPerfil }) {
    const navItems = [
        { key: "turnos",      label: "Turnos",       icon: "📅", adminOnly: false },
        { key: "misreservas", label: "Mis Reservas",  icon: "🎫", adminOnly: false },
        { key: "partidos",    label: "Partidos",      icon: "⚽", adminOnly: false },
        { key: "indice",      label: "Mi índice",     icon: "📊", adminOnly: false },
        { key: "admin",       label: "Admin",         icon: "⚙️", adminOnly: true },
        { key: "reportes",    label: "Reportes",      icon: "📈", adminOnly: true },
        { key: "usuarios",    label: "Usuarios",      icon: "👥", adminOnly: true },
        { key: "pagos",       label: "Pagos",         icon: "💰", adminOnly: true },
    ];

    return (
        <nav style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem", height: "58px",
            background: "var(--bg-surface)",
            borderBottom: "1px solid var(--border)",
            position: "sticky", top: 0, zIndex: 100,
            backdropFilter: "blur(12px)",
        }}>
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <div style={{
                    width: "32px", height: "32px",
                    background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))",
                    border: "1px solid rgba(59,130,246,0.3)",
                    borderRadius: "9px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "15px", boxShadow: "0 0 12px rgba(59,130,246,0.1)"
                }}>⚽</div>
                <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                        Complejo
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-tertiary)", letterSpacing: "0.05em" }}>
                        DEPORTIVO
                    </div>
                </div>
            </div>

            {/* Nav links — centro */}
            <div style={{ display: "flex", gap: "2px", flexWrap: "wrap", justifyContent: "center" }}>
                {navItems.map(item => {
                    if (item.adminOnly && usuario.role !== "ADMIN") return null;
                    const isActive = vista === item.key;
                    return (
                        <button
                            key={item.key}
                            onClick={() => setVista(item.key)}
                            style={{
                                display: "flex", alignItems: "center", gap: "5px",
                                padding: "6px 10px", borderRadius: "var(--r-md)",
                                border: "none", cursor: "pointer",
                                fontSize: "12px", fontWeight: isActive ? "500" : "400",
                                background: isActive ? "var(--blue-dim)" : "transparent",
                                color: isActive ? "var(--blue-light)" : "var(--text-secondary)",
                                transition: "all .15s",
                                position: "relative"
                            }}
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-input)"; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                        >
                            <span style={{ fontSize: "13px" }}>{item.icon}</span>
                            {item.label}
                            {isActive && (
                                <div style={{
                                    position: "absolute", bottom: "-1px", left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "16px", height: "2px",
                                    background: "var(--blue-light)",
                                    borderRadius: "2px"
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* User menu */}
            <UserMenu usuario={usuario} onLogout={onLogout} onPerfil={onPerfil} />
        </nav>
    );
}

// ─── App ──────────────────────────────────────────────────────
function App() {
    const [usuario, setUsuario] = useState(() => getUsuarioGuardado());
    const [vista, setVista] = useState("turnos");
    const [mostrarPerfil, setMostrarPerfil] = useState(false);

    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get("token");

    if (path === "/pago-exitoso") {
        return <PagoExitosoPage onVolver={() => {
            window.history.pushState({}, "", "/");
            window.location.reload();
        }} />;
    }
    if (path === "/pago-fallido") {
        return <PagoFallidoPage onVolver={() => {
            window.history.pushState({}, "", "/");
            window.location.reload();
        }} />;
    }

    if (resetToken && !usuario) {
        return <ResetPasswordPage token={resetToken} onExito={() => {
            window.history.replaceState({}, "", "/");
            window.location.reload();
        }} />;
    }

    const handleLogin = (userData) => {
        setUsuario(userData);
        setVista("turnos"); // ← redirige a turnos al login
    };

    const handleLogout = () => {
        logout();
        setUsuario(null);
    };

    const handleActualizarPerfil = (datosNuevos) => {
        // Actualizar usuario en localStorage y estado
        const actualizado = { ...usuario, ...datosNuevos };
        localStorage.setItem("usuario", JSON.stringify(actualizado));
        setUsuario(actualizado);
    };

    if (!usuario) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
            <Navbar
                usuario={usuario}
                vista={vista}
                setVista={setVista}
                onLogout={handleLogout}
                onPerfil={() => setMostrarPerfil(true)}
            />

            {/* Modal perfil */}
            {mostrarPerfil && (
                <PerfilPage
                    usuario={usuario}
                    onActualizar={handleActualizarPerfil}
                    onCerrar={() => setMostrarPerfil(false)}
                />
            )}

            <main style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
                {/* ✅ Punto 3: TurnosPage recibe fechaInicial = hoy */}
                {vista === "turnos"      && <TurnosPage usuario={usuario} fechaInicial={new Date().toISOString().split("T")[0]} />}
                {vista === "misreservas" && <MisReservasPage usuario={usuario} />}
                {vista === "partidos"    && <PartidosPage usuario={usuario} />}
                {vista === "indice"      && <IndiceAsistenciaPage />}
                {vista === "admin"       && usuario.role === "ADMIN" && <AdminPage />}
                {vista === "reportes"    && usuario.role === "ADMIN" && <ReportesPage />}
                {vista === "usuarios"    && usuario.role === "ADMIN" && <GestionUsuariosPage />}
                {vista === "pagos"       && usuario.role === "ADMIN" && <ConfigPagosPage />}
            </main>
        </div>
    );
}

export default App;

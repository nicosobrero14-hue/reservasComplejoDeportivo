import { useState, useEffect } from "react";
import { apiGet, apiPatch } from "../api/api";

export function ConfigPagosPage() {
    const [disciplinas, setDisciplinas] = useState([]);
    const [descuento, setDescuento] = useState(10);
    const [editando, setEditando] = useState({});
    const [cargando, setCargando] = useState(true);

    const cargar = async () => {
        setCargando(true);
        try {
            const [discs, desc] = await Promise.all([
                apiGet("/admin/pagos/disciplinas"),
                apiGet("/admin/pagos/descuento")
            ]);
            setDisciplinas(discs);
            setDescuento(desc.porcentaje);
        } catch (e) {
            alert(e.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const guardarPrecio = async (disciplinaId, precio) => {
        try {
            await apiPatch("/admin/pagos/precio", { disciplinaId, precio: Number(precio) });
            setEditando(e => ({ ...e, [disciplinaId]: false }));
            cargar();
        } catch (e) { alert(e.message); }
    };

    const guardarDescuento = async () => {
        try {
            await apiPatch("/admin/pagos/descuento", { porcentaje: Number(descuento) });
            alert("Descuento actualizado");
        } catch (e) { alert(e.message); }
    };

    if (cargando) return <p style={{ color: "var(--text-tertiary)" }}>Cargando...</p>;

    return (
        <div className="fade-up">
            <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ marginBottom: "4px" }}>Configuración de pagos</h1>
                <p style={{ fontSize: "13px" }}>Administrá precios y descuentos del complejo</p>
            </div>

            {/* Descuento online */}
            <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--r-lg)", padding: "1.25rem", marginBottom: "1rem"
            }}>
                <h3 style={{ fontSize: "13px", marginBottom: "1rem", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
                    🎉 Descuento por pago online
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ maxWidth: "120px" }}>
                        <label className="field-label">Porcentaje (%)</label>
                        <input
                            type="number" min="0" max="100"
                            value={descuento}
                            onChange={e => setDescuento(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn-primary"
                        style={{ marginTop: "18px", maxWidth: "160px" }}
                        onClick={guardarDescuento}
                    >
                        Guardar descuento
                    </button>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px" }}>
                    Los usuarios que paguen online reciben un {descuento}% de descuento automático.
                </p>
            </div>

            {/* Precios por disciplina */}
            <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--r-lg)", padding: "1.25rem"
            }}>
                <h3 style={{ fontSize: "13px", marginBottom: "1rem", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
                    💰 Precios por disciplina
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                    El precio de partido (buscar rival) se cobra automáticamente a la mitad por equipo.
                </p>

                {disciplinas.map(d => (
                    <div key={d.id} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "12px 0", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: "10px"
                    }}>
                        <div>
                            <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-primary)" }}>
                                {d.nombre}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                                {d.duracionTurno} min · partido: ${d.precio ? (d.precio / 2).toLocaleString("es-AR") : "—"} por equipo
                            </div>
                        </div>

                        {editando[d.id] ? (
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <input
                                    type="number"
                                    defaultValue={d.precio || 0}
                                    id={`precio-${d.id}`}
                                    style={{ width: "120px" }}
                                />
                                <button
                                    className="btn-primary"
                                    style={{ fontSize: "12px", padding: "6px 12px" }}
                                    onClick={() => guardarPrecio(d.id, document.getElementById(`precio-${d.id}`).value)}
                                >
                                    Guardar
                                </button>
                                <button
                                    className="btn-secondary"
                                    style={{ fontSize: "12px", padding: "6px 12px" }}
                                    onClick={() => setEditando(e => ({ ...e, [d.id]: false }))}
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)" }}>
                                    ${d.precio ? Number(d.precio).toLocaleString("es-AR") : "Sin precio"}
                                </span>
                                <button
                                    className="btn-secondary"
                                    style={{ fontSize: "12px", padding: "5px 12px" }}
                                    onClick={() => setEditando(e => ({ ...e, [d.id]: true }))}
                                >
                                    Editar
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

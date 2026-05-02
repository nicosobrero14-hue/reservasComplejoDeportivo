import { useState, useEffect } from "react";
import { apiGet, apiPost } from "../api/api";

function SectionCard({ icon, title, children }) {
    return (
        <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "1.25rem",
        }}>
            <h3 style={{
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1rem",
                paddingBottom: "10px",
                borderBottom: "1px solid var(--border)"
            }}>
                <span>{icon}</span> {title}
            </h3>
            {children}
        </div>
    );
}

function AdminPage() {
    const [nombreDisciplina, setNombreDisciplina] = useState("");
    const [duracion, setDuracion] = useState("");
    const [disciplinas, setDisciplinas] = useState([]);
    const [precio, setPrecio] = useState("");

    const [nombreCancha, setNombreCancha] = useState("");
    const [disciplinaId, setDisciplinaId] = useState("");

    const [fechaTurnos, setFechaTurnos] = useState("");

    const [diaSemana, setDiaSemana] = useState("MONDAY");
    const [horaApertura, setHoraApertura] = useState("");
    const [horaCierre, setHoraCierre] = useState("");
    const [horarios, setHorarios] = useState([]);

    const dias = {
        MONDAY: "Lunes", TUESDAY: "Martes", WEDNESDAY: "Miércoles",
        THURSDAY: "Jueves", FRIDAY: "Viernes", SATURDAY: "Sábado", SUNDAY: "Domingo"
    };

    async function cargarDisciplinas() {
        try { setDisciplinas(await apiGet("/disciplinas")); }
        catch (e) { alert(e.message); }
    }

    async function cargarHorarios() {
        try { setHorarios(await apiGet("/horario")); }
        catch (e) { alert(e.message); }
    }

    useEffect(() => {
        cargarDisciplinas();
        cargarHorarios();
    }, []);

    const crearDisciplina = async () => {
        if (!nombreDisciplina || !duracion) { alert("Completá todos los campos"); return; }
        try {
            await apiPost("/disciplinas", { nombre: nombreDisciplina, duracionTurno: Number(duracion), precio: Number(precio) });
            setNombreDisciplina(""); setDuracion(""); setPrecio("");
            cargarDisciplinas();
        } catch (e) { alert(e.message); }
    };

    const crearCancha = async () => {
        if (!nombreCancha || !disciplinaId) { alert("Completá todos los campos"); return; }
        try {
            await apiPost("/canchas", { nombre: nombreCancha, disciplinaId: Number(disciplinaId), activa: true });
            setNombreCancha(""); setDisciplinaId("");
        } catch (e) { alert(e.message); }
    };

    const generarTurnos = async () => {
        if (!fechaTurnos) { alert("Seleccioná una fecha"); return; }
        try {
            await apiPost(`/admin/turnos/generar?fecha=${fechaTurnos}`, {});
            alert("Turnos generados correctamente");
            setFechaTurnos("");
        } catch (e) { alert(e.message); }
    };

    const crearHorario = async () => {
        if (!horaApertura || !horaCierre) { alert("Completá los horarios"); return; }
        try {
            await apiPost("/horario", { diaSemana, horaApertura, horaCierre });
            setHoraApertura(""); setHoraCierre("");
            cargarHorarios();
        } catch (e) { alert(e.message); }
    };

    const inputStyle = { marginBottom: "10px" };

    return (
        <div className="fade-up">

            <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ marginBottom: "4px" }}>Panel de administración</h1>
                <p style={{ fontSize: "13px" }}>Gestioná canchas, disciplinas, horarios y turnos</p>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "12px"
            }}>

                <SectionCard icon="🏓" title="Nueva disciplina">
                    <div style={inputStyle}>
                        <label className="field-label">Nombre</label>
                        <input placeholder="Ej: Padel, Tenis..." value={nombreDisciplina}
                            onChange={e => setNombreDisciplina(e.target.value)} />
                    </div>
                    <div style={inputStyle}>
                        <label className="field-label">Duración (minutos)</label>
                        <input type="number" placeholder="60" value={duracion}
                            onChange={e => setDuracion(e.target.value)} />
                    </div>
                    <div style={inputStyle}>
                        <label className="field-label">Precio del turno</label>
                        <input type="number" placeholder="Ej: 500" value={precio}
                            onChange={e => setPrecio(e.target.value)} />
                    </div>
                    
                    <button className="btn-primary" onClick={crearDisciplina}>Crear disciplina</button>

                    {disciplinas.length > 0 && (
                        <div style={{ marginTop: "1rem" }}>
                            <p style={{ fontSize: "11px", color: "var(--text-tertiary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Disciplinas existentes
                            </p>
                            {disciplinas.map(d => (
                                <div key={d.id} style={{
                                    display: "flex", justifyContent: "space-between",
                                    fontSize: "12px", padding: "6px 0",
                                    borderBottom: "1px solid var(--border)",
                                    color: "var(--text-primary)"
                                }}>
                                    <span>{d.nombre}</span>
                                    <span className="badge badge-gray">{d.duracionTurno} min</span>
                                </div>
                            ))}
                        </div>
                    )}
                </SectionCard>

                <SectionCard icon="🏟" title="Nueva cancha">
                    <div style={inputStyle}>
                        <label className="field-label">Nombre</label>
                        <input placeholder="Ej: Cancha 1" value={nombreCancha}
                            onChange={e => setNombreCancha(e.target.value)} />
                    </div>
                    <div style={inputStyle}>
                        <label className="field-label">Disciplina</label>
                        <select value={disciplinaId} onChange={e => setDisciplinaId(e.target.value)}>
                            <option value="">Seleccionar...</option>
                            {disciplinas.map(d => (
                                <option key={d.id} value={d.id}>{d.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn-primary" onClick={crearCancha}>Crear cancha</button>
                </SectionCard>

                <SectionCard icon="📅" title="Generar turnos">
                    <p style={{ fontSize: "12px", marginBottom: "1rem" }}>
                        Genera todos los turnos del día según las canchas y horarios configurados.
                    </p>
                    <div style={inputStyle}>
                        <label className="field-label">Fecha</label>
                        <input type="date" value={fechaTurnos}
                            onChange={e => setFechaTurnos(e.target.value)} />
                    </div>
                    <button className="btn-primary" onClick={generarTurnos}>Generar turnos</button>
                </SectionCard>

                <SectionCard icon="🕐" title="Horario del complejo">
                    <div style={inputStyle}>
                        <label className="field-label">Día</label>
                        <select value={diaSemana} onChange={e => setDiaSemana(e.target.value)}>
                            {Object.entries(dias).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
                        <div>
                            <label className="field-label">Apertura</label>
                            <input type="time" value={horaApertura}
                                onChange={e => setHoraApertura(e.target.value)} />
                        </div>
                        <div>
                            <label className="field-label">Cierre</label>
                            <input type="time" value={horaCierre}
                                onChange={e => setHoraCierre(e.target.value)} />
                        </div>
                    </div>
                    <button className="btn-primary" onClick={crearHorario}>Guardar horario</button>

                    {horarios.length > 0 && (
                        <div style={{ marginTop: "1rem" }}>
                            <p style={{ fontSize: "11px", color: "var(--text-tertiary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Horarios configurados
                            </p>
                            {horarios.map(h => (
                                <div key={h.id} style={{
                                    display: "flex", justifyContent: "space-between",
                                    fontSize: "12px", padding: "6px 0",
                                    borderBottom: "1px solid var(--border)"
                                }}>
                                    <span style={{ color: "var(--text-secondary)" }}>{dias[h.diaSemana] || h.diaSemana}</span>
                                    <span style={{ color: "var(--blue-light)", fontFamily: "DM Mono, monospace" }}>
                                        {h.horaApertura} — {h.horaCierre}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </SectionCard>

            </div>
        </div>
    );
}

export default AdminPage;

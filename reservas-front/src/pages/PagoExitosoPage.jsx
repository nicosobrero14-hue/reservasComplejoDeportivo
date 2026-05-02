export function PagoExitosoPage({ onVolver }) {
    const params = new URLSearchParams(window.location.search);
    const reservaId = params.get("reservaId");

    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            background: "radial-gradient(ellipse at 60% 20%, rgba(34,197,94,0.08) 0%, transparent 60%), var(--bg-base)",
            padding: "1rem"
        }}>
            <div className="fade-up" style={{ textAlign: "center", maxWidth: "380px" }}>
                <div style={{
                    width: "64px", height: "64px", background: "var(--green-dim)",
                    border: "1px solid var(--green-border)", borderRadius: "50%",
                    margin: "0 auto 1.25rem",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px"
                }}>✅</div>
                <h1 style={{ fontSize: "22px", marginBottom: "8px" }}>¡Pago exitoso!</h1>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                    Tu reserva #{reservaId} fue confirmada. Te mandamos los detalles por WhatsApp.
                </p>
                <button className="btn-primary" onClick={onVolver}>
                    Ir a mis turnos
                </button>
            </div>
        </div>
    );
}

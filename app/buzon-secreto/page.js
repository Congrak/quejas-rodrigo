"use client";

import { useState } from "react";

export default function Buzon() {
  const [pass, setPass] = useState("");
  const [quejas, setQuejas] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function cargar(e) {
    e?.preventDefault();
    setError("");
    setCargando(true);
    try {
      const r = await fetch("/api/quejas", { headers: { "x-admin-password": pass } });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setQuejas(d.quejas);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setCargando(false);
    }
  }

  async function borrar(id) {
    if (!window.confirm("¿Borrar esta queja? (borrarla no la hace menos cierta)")) return;
    await fetch("/api/quejas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": pass },
      body: JSON.stringify({ id }),
    });
    setQuejas((qs) => qs.filter((q) => q.id !== id));
  }

  const promedio = quejas?.length
    ? (quejas.reduce((s, q) => s + Number(q.intensidad || 0), 0) / quejas.length).toFixed(1)
    : 0;

  return (
    <main className="pagina">
      <header className="encabezado">
        <p className="kicker">Acceso restringido · Solo personal autorizado (Rodrigo)</p>
        <h1>
          Buzón <span>secreto</span>
        </h1>
        <p className="bajada">Respira hondo antes de entrar.</p>
      </header>

      {quejas === null ? (
        <form className="papel login" onSubmit={cargar}>
          <label className="campo-label">Contraseña</label>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoFocus />
          {error && <p className="error">⚠️ {error}</p>}
          <button className="btn principal" disabled={cargando}>
            {cargando ? "Abriendo…" : "Ver las quejas 😰"}
          </button>
        </form>
      ) : (
        <>
          <div className="contador">
            <div>
              <strong>{quejas.length}</strong>
              <small>quejas en tu contra</small>
            </div>
            <div>
              <strong>{promedio}</strong>
              <small>indignación promedio</small>
            </div>
            <div>
              <button className="btn chico" onClick={cargar}>
                Actualizar ↻
              </button>
            </div>
          </div>
          {quejas.length === 0 && (
            <div className="papel">
              <p>Todavía no hay quejas. Disfrútalo mientras dure.</p>
            </div>
          )}
          {quejas.map((q) => (
            <article key={q.id} className="papel queja">
              <div className="queja-top">
                <span className="ticket-chico">{q.ticket}</span>
                <span>{new Date(q.fecha).toLocaleString("es")}</span>
              </div>
              <h3>{q.categoria}</h3>
              <p className="queja-texto">{q.queja}</p>
              <div className="queja-meta">
                <span>🔥 Indignación: {q.intensidad}/10</span>
                <span>⚖️ Castigo: {q.castigo}</span>
                <span>✍️ {q.firma || "Anónimo (ajá)"}</span>
              </div>
              <button className="borrar" onClick={() => borrar(q.id)}>
                borrar
              </button>
            </article>
          ))}
        </>
      )}
    </main>
  );
}

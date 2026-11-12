"use client";

import { useEffect, useRef, useState } from "react";

const CATEGORIAS = [
  { e: "📱", t: "Intenso nivel experto" },
  { e: "📵", t: "Nunca contestaba los mensajes" },
  { e: "⏰", t: "Llegaba tarde a TODO" },
  { e: "😴", t: "Roncaba como licuadora" },
  { e: "🍟", t: "Se comía mis papas fritas" },
  { e: "🛋️", t: "Decía “ya voy” y nunca iba" },
  { e: "🚗", t: "Su forma de manejar" },
  { e: "🤡", t: "Sus chistes malos" },
  { e: "🧦", t: "Dejaba todo tirado" },
  { e: "📜", t: "Otra (la lista es larga)" },
];

const NIVELES = [
  "",
  "Me molestó tantito",
  "Puse los ojos en blanco",
  "Suspiro profundo",
  "Lo pensé en la ducha",
  "Les conté a mis amigas",
  "Hubo audio de 4 minutos",
  "Le conté a mi mamá",
  "Captura de pantalla enviada",
  "Lo dije en el grupo familiar",
  "Nivel telenovela de 300 capítulos",
  "Veía mis historias a los 0.2 segundos de subirlas"
];

const CASTIGOS = [
  "Que admita por escrito que yo tenía razón",
  "Que lave los platos durante un año",
  "Que vea mi serie favorita completa sin quejarse",
  "Que escuche mi playlist entera, sin saltar canciones",
  "Que se le acabe la batería del cel en el peor momento",
  "Que solo pueda mandar 1 mensaje al día, sin stickers",
  "Disculpa pública con mariachi incluido",
  "Que pise un Lego descalzo (solo uno, no soy mala)",
  "Nada, con que lo lea y sufra tantito es suficiente",
];

const RESPUESTAS = [
  "Tras una exhaustiva investigación de 0.3 segundos, el comité concluye: sí, fue culpa de Rodrigo.",
  "Su queja ha sido clasificada como “totalmente válida” y archivada en la carpeta “Rodrigo, ¿en serio?”.",
  "Rodrigo ha sido notificado. Se reporta que está mirando al techo pensando en lo que hizo.",
  "Esta queja fue revisada por un panel de expertas (sus amigas). Veredicto unánime: tiene razón.",
  "Su reclamo entra a la fila detrás de otros 47 igualitos. Rodrigo es muy constante.",
  "Hemos verificado los hechos. No hay apelación posible. Rodrigo puede llorar en la ventanilla 3.",
  "El celular de Rodrigo fue enviado a terapia.”,
];

const TIEMPOS = [
  "entre 3 y ∞ años",
  "cuando Rodrigo conteste los mensajes",
  "después del próximo eclipse",
  "en cuanto Rodrigo encuentre sus llaves",
  "próximamente™",
];

const BURLAS_PERDON = ["Jaja, no 🙃", "¿Segura? 🤨", "Ni lo intentes", "Muy rápido 🏃‍♂️", "Todavía no 😌", "Aquí no 👀"];

const azar = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function Home() {
  const [categoria, setCategoria] = useState("");
  const [intensidad, setIntensidad] = useState(5);
  const [queja, setQueja] = useState("");
  const [castigo, setCastigo] = useState(CASTIGOS[0]);
  const [firma, setFirma] = useState("");
  const [jura, setJura] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(null);
  const [perdon, setPerdon] = useState({ x: 0, y: 0, txt: "Perdonar a Rodrigo", intentos: 0 });
  const zonaRef = useRef(null);

  useEffect(() => {
    fetch("/api/quejas?solo=contador")
      .then((r) => r.json())
      .then((d) => setTotal(d.total))
      .catch(() => {});
  }, []);

  function huir() {
    const zona = zonaRef.current?.getBoundingClientRect();
    const ancho = zona ? zona.width / 2 - 90 : 120;
    setPerdon((p) => ({
      x: (Math.random() * 2 - 1) * Math.max(ancho, 60),
      y: (Math.random() * 2 - 1) * 60,
      txt: azar(BURLAS_PERDON),
      intentos: p.intentos + 1,
    }));
  }

  function mensajeLargo() {
    const n = queja.length;
    if (n === 0) return "Sin miedo, aquí nadie la juzga.";
    if (n < 80) return "Buen comienzo. Siga, siga…";
    if (n < 250) return "Ok, ok, esto se está poniendo bueno 🍿";
    if (n < 600) return "Rodrigo, ¿qué hiciste? 😬";
    if (n < 1200) return "Vamos a necesitar otro escritorio.";
    return "Esto ya es un libro. Considere publicarlo.";
  }

  async function enviar(e) {
    e.preventDefault();
    setError("");
    if (!categoria) return setError("Elija una categoría. Sabemos que es difícil elegir solo una.");
    if (queja.trim().length < 3) return setError("La queja está vacía. Imposible: con Rodrigo siempre hay algo.");
    if (!jura) return setError("Falta marcar la declaración jurada. Es puro trámite (pero obligatorio).");
    setEnviando(true);
    try {
      const r = await fetch("/api/quejas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria, intensidad, queja, castigo, firma }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Error");
      setTotal(d.total);
      setResultado({ ticket: d.ticket, respuesta: azar(RESPUESTAS), tiempo: azar(TIEMPOS) });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError("El sistema se cayó (seguro también es culpa de Rodrigo). Intente de nuevo en un momento.");
    } finally {
      setEnviando(false);
    }
  }

  function otra() {
    setResultado(null);
    setQueja("");
    setCategoria("");
    setIntensidad(5);
    setJura(false);
  }

  return (
    <main className="pagina">
      <div className="cinta">
        ATENCIÓN 24/7 · RESOLUCIÓN: NUNCA · ATENCIÓN 24/7 · RESOLUCIÓN: NUNCA · ATENCIÓN 24/7 · RESOLUCIÓN: NUNCA ·
      </div>

      <header className="encabezado">
        <p className="kicker">República Independiente de los Reclamos · Ventanilla única</p>
        <h1>
          Oficina Nacional de
          <br />
          <span>Quejas contra Rodrigo</span>
        </h1>
        <p className="bajada">
          Por fin, un lugar oficial para decir todo lo que siempre quiso decir. Rodrigo leerá cada palabra.
          Probablemente con cara de 😬.
        </p>
        <div className="contador">
          <div>
            <strong>{total === null ? "…" : total}</strong>
            <small>quejas registradas</small>
          </div>
          <div>
            <strong>0</strong>
            <small>quejas resueltas</small>
          </div>
          <div>
            <strong>100%</strong>
            <small>culpa de Rodrigo</small>
          </div>
        </div>
      </header>

      {resultado ? (
        <section className="papel recibido">
          <div className="sello">RECIBIDO</div>
          <p className="etiqueta">Comprobante de queja</p>
          <h2 className="ticket">{resultado.ticket}</h2>
          <p className="respuesta">{resultado.respuesta}</p>
          <dl className="datos">
            <div>
              <dt>Estado</dt>
              <dd>En revisión eterna</dd>
            </div>
            <div>
              <dt>Tiempo estimado de resolución</dt>
              <dd>{resultado.tiempo}</dd>
            </div>
            <div>
              <dt>Probabilidad de que Rodrigo diga “no fue para tanto”</dt>
              <dd>97%</dd>
            </div>
          </dl>
          <button className="btn principal" onClick={otra}>
            Tengo otra queja 📝
          </button>
          <p className="nota">Puede radicar todas las quejas que quiera. No hay límite. Rodrigo dio mucho material.</p>
        </section>
      ) : (
        <form className="papel" onSubmit={enviar}>
          <div className="formulario-num">Formulario RDG-001 · Rev. 2026</div>

          <fieldset>
            <legend>
              <b>1.</b> Categoría de la queja
            </legend>
            <div className="chips">
              {CATEGORIAS.map((c) => (
                <button
                  type="button"
                  key={c.t}
                  className={"chip" + (categoria === c.t ? " activa" : "")}
                  onClick={() => setCategoria(c.t)}
                >
                  <span>{c.e}</span> {c.t}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <b>2.</b> Nivel de indignación
            </legend>
            <input
              type="range"
              min="1"
              max="10"
              value={intensidad}
              onChange={(e) => setIntensidad(Number(e.target.value))}
              className="rango"
              style={{ "--pct": `${((intensidad - 1) / 9) * 100}%` }}
            />
            <div className="nivel">
              <span className="num">{intensidad}/10</span> {NIVELES[intensidad]}
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <b>3.</b> Describa los hechos
            </legend>
            <textarea
              value={queja}
              onChange={(e) => setQueja(e.target.value)}
              maxLength={3000}
              rows={7}
              placeholder="Con lujo de detalle. Fechas, lugares, testigos. Sabemos que tiene memoria de elefante."
            />
            <div className="pie-texto">
              <span>{mensajeLargo()}</span>
              <span>{queja.length}/3000</span>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <b>4.</b> Castigo sugerido
            </legend>
            <select value={castigo} onChange={(e) => setCastigo(e.target.value)}>
              {CASTIGOS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <legend>
              <b>5.</b> Firma <em>(opcional)</em>
            </legend>
            <input
              type="text"
              value={firma}
              onChange={(e) => setFirma(e.target.value)}
              maxLength={80}
              placeholder="Anónimo (aunque los dos sabemos quién eres 😏)"
            />
          </fieldset>

          <label className="jura">
            <input type="checkbox" checked={jura} onChange={(e) => setJura(e.target.checked)} />
            <span>
              Declaro bajo juramento que Rodrigo tuvo la culpa, aunque sea un poquito, aunque él diga que no.
            </span>
          </label>

          {error && <p className="error">⚠️ {error}</p>}

          <div className="acciones" ref={zonaRef}>
            <button type="submit" className="btn principal" disabled={enviando}>
              {enviando ? "Sellando…" : "Radicar queja 🖋️"}
            </button>
            <button
              type="button"
              className="btn huidizo"
              onMouseEnter={huir}
              onTouchStart={(e) => {
                e.preventDefault();
                huir();
              }}
              onClick={huir}
              style={{ transform: `translate(${perdon.x}px, ${perdon.y}px)` }}
            >
              {perdon.txt}
            </button>
          </div>
          {perdon.intentos >= 3 && (
            <p className="nota centro">
              Intentó perdonar a Rodrigo {perdon.intentos} veces. Qué corazón tan noble. El sistema no lo permite.
            </p>
          )}
        </form>
      )}

      <footer className="pie">
        <p>
          Esta oficina no se hace responsable si Rodrigo se pone a reflexionar sobre su vida.
          <br />
          Ningún Rodrigo fue lastimado en la creación de este formulario (todavía).
        </p>
      </footer>
    </main>
  );
}

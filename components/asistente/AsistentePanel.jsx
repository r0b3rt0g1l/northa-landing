"use client";

import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { StarIcon } from "@/components/ui/StarIcon";
import { EnlaceWhatsapp } from "@/components/ui/EnlaceWhatsapp";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getNora, textoDe } from "@/lib/nora";
import { getUi } from "@/lib/i18n/ui";
import { hrefSeccion } from "@/lib/i18n/config";
import { irASeccion } from "@/lib/acciones";

// Conversación guardada en la sesión del navegador, una por idioma.
const CLAVE = "northa-nora-v1";
const MAX_MENSAJES = 80;
// Escritura progresiva: ~18 ms por paso, sin pasar de ~2,4 s por mensaje.
const MS_POR_PASO = 18;
const PASOS_MAX = 130;

// Colores del chat (iMessage, modo oscuro).
const SUPERFICIE = "bg-[#1C1C1E]";
const SEPARADOR = "border-[#38383A]";
const SECUNDARIO = "text-[rgba(235,235,245,0.6)]";
const FUENTE = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

let contador = 0;
const nuevoId = (p) => `${p}${Date.now().toString(36)}${(contador++).toString(36)}`;
// Con movimiento reducido, el mensaje nace completo (sin escritura progresiva).
const deNora = (partes, animar = false) => ({ id: nuevoId("n"), autor: "nora", partes, animar: animar && !reducido() });
const delVisitante = (texto) => ({ id: nuevoId("u"), autor: "usuario", partes: [{ t: "texto", v: texto }] });

/** Recorta por caracteres reales (no parte un emoji por la mitad). */
const recortar = (t, n) => Array.from(t).slice(0, n).join("");
const reducido = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function estadoInicial(locale) {
  const r = getNora(locale).saludo();
  return { mensajes: [deNora(r.partes)], memoria: r.memoria };
}

function leerEstado(locale) {
  try {
    const g = JSON.parse(sessionStorage.getItem(`${CLAVE}-${locale}`) || "null");
    if (g && Array.isArray(g.mensajes) && g.mensajes.length && g.memoria && typeof g.memoria === "object") {
      // Lo guardado ya no se anima.
      return { mensajes: g.mensajes.map((m) => ({ ...m, animar: false })), memoria: g.memoria };
    }
  } catch {}
  return estadoInicial(locale);
}

function guardarEstado(locale, estado) {
  try {
    sessionStorage.setItem(`${CLAVE}-${locale}`, JSON.stringify({ ...estado, mensajes: estado.mensajes.slice(-MAX_MENSAJES) }));
  } catch {}
}

const enlace = "font-medium text-[#0A84FF] underline underline-offset-2 hover:text-[#409CFF]";

/**
 * Las partes de un mensaje (texto y enlaces). Con `limite`, solo los primeros
 * caracteres: así se ve la escritura progresiva. Un enlace a medio escribir
 * se muestra como texto con su estilo y se vuelve enlace al completarse.
 */
function Partes({ partes, limite = Infinity, locale, onSeccion }) {
  let restante = limite;
  return partes.map((p, i) => {
    if (restante <= 0) return null;
    const v = p.v.slice(0, restante);
    restante -= p.v.length;
    if (p.t === "texto") return <Fragment key={i}>{v}</Fragment>;
    if (v.length < p.v.length) {
      return (
        <span key={i} className={enlace}>
          {v}
        </span>
      );
    }
    if (p.t === "whatsapp") {
      return (
        <EnlaceWhatsapp key={i} texto={p.mensaje} className={enlace}>
          {p.v}
        </EnlaceWhatsapp>
      );
    }
    if (p.t === "seccion") {
      return (
        <a
          key={i}
          href={hrefSeccion(locale, p.id)}
          className={enlace}
          onClick={(e) => {
            if (!document.getElementById(p.id)) return;
            e.preventDefault();
            onSeccion(p.id);
          }}
        >
          {p.v}
        </a>
      );
    }
    return (
      <a key={i} href={p.href} className={enlace}>
        {p.v}
      </a>
    );
  });
}

/**
 * Chat con Nora, con el aspecto de iMessage en modo oscuro: solo texto, sin
 * botones de servicios ni menús. Al enviar, aparece «Nora está escribiendo…»
 * y su respuesta se escribe de forma progresiva (al instante con movimiento
 * reducido). Si el visitante manda varios mensajes seguidos mientras Nora
 * escribe, se responden juntos. Los enlaces (WhatsApp, correo, secciones) van
 * dentro del texto. Nada se envía solo: WhatsApp se abre cuando el visitante
 * toca el enlace.
 */
export default function AsistentePanel({ onCerrar, peticion, onPeticionUsada }) {
  const uid = useId();
  const locale = useLocale();
  const ui = getUi(locale).panel;
  const nora = getNora(locale);
  const [estado, setEstado] = useState(() => leerEstado(locale));
  const [texto, setTexto] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const [revelado, setRevelado] = useState(null); // { id, n }
  const [anuncio, setAnuncio] = useState("");
  const panelRef = useRef(null);
  const listaRef = useRef(null);
  const inputRef = useRef(null);
  const cola = useRef([]);
  const timer = useRef(null);

  const { mensajes } = estado;
  const ultimo = mensajes[mensajes.length - 1];

  useEffect(() => {
    guardarEstado(locale, estado);
  }, [locale, estado]);

  // Foco al campo al abrir (solo con puntero fino: en táctil no se abre el teclado solo).
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });
    return () => clearTimeout(timer.current);
  }, []);

  // Escape cierra el chat; devuelve el foco al botón de origen si estaba dentro.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      const activo = document.activeElement;
      onCerrar(!activo || activo === document.body || !!panelRef.current?.contains(activo));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCerrar]);

  // Siempre al último mensaje.
  useLayoutEffect(() => {
    const lista = listaRef.current;
    if (lista) lista.scrollTop = lista.scrollHeight;
  }, [mensajes.length, escribiendo, revelado?.n]);

  // Escritura progresiva del último mensaje de Nora.
  useEffect(() => {
    if (!ultimo?.animar) return;
    const id = ultimo.id;
    const total = textoDe(ultimo.partes).length;
    const terminar = () => {
      setRevelado(null);
      setEstado((prev) => ({ ...prev, mensajes: prev.mensajes.map((m) => (m.id === id ? { ...m, animar: false } : m)) }));
    };
    // Mientras no hay `revelado`, el mensaje que se anima se pinta vacío (límite 0).
    const paso = Math.max(1, Math.ceil(total / PASOS_MAX));
    let n = 0;
    const intervalo = setInterval(() => {
      n += paso;
      if (n >= total) {
        clearInterval(intervalo);
        terminar();
      } else setRevelado({ id, n });
    }, MS_POR_PASO);
    return () => clearInterval(intervalo);
  }, [ultimo]);

  /** Anuncia una respuesta completa, una sola vez, a lectores de pantalla. */
  const anunciar = (partes) => setAnuncio(`${ui.nora}${textoDe(partes)}`);

  const responderCola = () => {
    const junto = cola.current.join("\n");
    cola.current = [];
    setEscribiendo(false);
    setEstado((prev) => {
      const r = nora.procesar(prev.memoria, junto);
      if (!r) return prev;
      anunciar(r.partes);
      return { mensajes: [...prev.mensajes, deNora(r.partes, true)], memoria: r.memoria };
    });
  };

  const enviar = (valor) => {
    const limpio = recortar(valor.trim(), 500);
    if (!limpio) return;
    setTexto("");
    // Lo que Nora estuviera escribiendo se completa al instante.
    setRevelado(null);
    setEstado((prev) => ({
      ...prev,
      mensajes: [...prev.mensajes.map((m) => (m.animar ? { ...m, animar: false } : m)), delVisitante(limpio)],
    }));
    cola.current.push(limpio);
    clearTimeout(timer.current);
    if (reducido()) {
      responderCola();
      return;
    }
    // «Nora está escribiendo…» de inmediato; la respuesta llega en menos de 1,4 s.
    // Si el visitante sigue escribiendo, se espera y se responde a todo junto.
    setEscribiendo(true);
    setAnuncio(ui.escribiendo);
    const largo = cola.current.join(" ").length;
    timer.current = setTimeout(responderCola, 600 + Math.min(800, largo * 6));
  };

  const reiniciar = () => {
    clearTimeout(timer.current);
    cola.current = [];
    setEscribiendo(false);
    setRevelado(null);
    setTexto("");
    setEstado(estadoInicial(locale));
    inputRef.current?.focus();
  };

  const irA = (id) => {
    irASeccion(id);
    if (window.matchMedia("(max-width: 639px)").matches) onCerrar(false);
  };

  // Una petición desde la página: un servicio, «hablar con una persona» o una pregunta.
  useEffect(() => {
    if (!peticion) return;
    const t = setTimeout(() => {
      setEstado((prev) => {
        const fresco = !prev.mensajes.some((m) => m.autor === "usuario");
        if (peticion.pregunta && peticion.modo !== "consulta") {
          const p = recortar(String(peticion.pregunta), 500);
          const r = nora.procesar(prev.memoria, p);
          if (!r) return prev;
          anunciar(r.partes);
          return { mensajes: [...prev.mensajes, delVisitante(p), deNora(r.partes, true)], memoria: r.memoria };
        }
        let r = null;
        if (peticion.modo === "consulta" && peticion.servicio) {
          r = nora.abrirServicio(fresco ? {} : prev.memoria, peticion.servicio, fresco);
        } else if (peticion.modo === "persona") {
          r = nora.pedirPersona(prev.memoria);
        }
        if (!r) return prev;
        anunciar(r.partes);
        const msg = deNora(r.partes, true);
        // Recién abierto desde un servicio: ese saludo reemplaza al genérico.
        const reemplaza = fresco && peticion.modo === "consulta";
        return { mensajes: reemplaza ? [msg] : [...prev.mensajes, msg], memoria: r.memoria };
      });
      onPeticionUsada?.();
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peticion]);

  const iconoBoton = cn(
    "grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-[#2C2C2E] hover:text-white",
    SECUNDARIO,
  );

  return (
    <div
      ref={panelRef}
      id="asistente-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${uid}-titulo`}
      aria-describedby={`${uid}-aviso`}
      data-asistente=""
      style={FUENTE}
      className={cn(
        "panel-in fixed inset-x-3 bottom-3 z-[60] flex max-h-[min(86svh,700px)] flex-col overflow-hidden rounded-[24px] border bg-black text-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.9)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:max-h-[min(680px,calc(100svh-110px))] [@media(max-height:480px)]:top-2 [@media(max-height:480px)]:bottom-2! [@media(max-height:480px)]:max-h-[calc(100svh-16px)]!",
        SEPARADOR,
      )}
    >
      <div className={cn("flex shrink-0 items-center gap-3 border-b py-2.5 pl-4 pr-2", SUPERFICIE, SEPARADOR)}>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2C2C2E]" aria-hidden="true">
          <StarIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`${uid}-titulo`} className="text-[1rem] font-semibold leading-tight tracking-normal" style={FUENTE}>
            {ui.nombre}
          </h2>
          <p className={cn("m-0 text-[0.8125rem] leading-snug", SECUNDARIO)}>{ui.descripcion}</p>
        </div>
        <button type="button" onClick={reiniciar} aria-label={ui.reiniciar} title={ui.reiniciar} className={iconoBoton}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => onCerrar(true)} aria-label={ui.cerrar} title={ui.cerrar} className={iconoBoton}>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* El historial no se anuncia solo: cada respuesta se anuncia una vez, completa, en la región de abajo. */}
      <div
        ref={listaRef}
        role="log"
        aria-live="off"
        aria-label={ui.conversacion}
        className="flex min-h-[min(160px,24svh)] flex-1 flex-col overflow-y-auto overscroll-contain bg-black px-3 py-4"
      >
        {mensajes.map((m, i) => {
          const esVisitante = m.autor === "usuario";
          const mismoQueAntes = mensajes[i - 1]?.autor === m.autor;
          const limite = revelado?.id === m.id ? revelado.n : m.animar ? 0 : Infinity;
          return (
            <p
              key={m.id}
              className={cn(
                "nora-burbuja mensaje-in m-0 max-w-[78%] whitespace-pre-line wrap-anywhere rounded-[19px] px-[14px] py-[8px] text-[1.0625rem] leading-[1.3]",
                mismoQueAntes ? "mt-1" : i > 0 ? "mt-3" : "",
                esVisitante
                  ? "ml-auto rounded-br-[6px] bg-[#007AFF] text-white"
                  : "mr-auto rounded-bl-[6px] bg-[#26262A] text-white",
              )}
            >
              <span className="sr-only">{esVisitante ? ui.tu : ui.nora}</span>
              <Partes partes={m.partes} limite={limite} locale={locale} onSeccion={irA} />
            </p>
          );
        })}

        {escribiendo ? (
          <div
            className={cn(
              "nora-burbuja mensaje-in mr-auto flex items-center gap-1 rounded-[19px] rounded-bl-[6px] bg-[#26262A] px-[14px] py-[13px]",
              ultimo?.autor === "nora" ? "mt-1" : "mt-3",
            )}
          >
            <span className="nora-punto" aria-hidden="true" />
            <span className="nora-punto" aria-hidden="true" />
            <span className="nora-punto" aria-hidden="true" />
            <span className="sr-only">{ui.escribiendo}</span>
          </div>
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {anuncio}
      </p>

      <div className={cn("shrink-0 border-t px-3 pb-2.5 pt-2.5", SUPERFICIE, SEPARADOR)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviar(texto);
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor={`${uid}-texto`} className="sr-only">
            {ui.campo}
          </label>
          <input
            ref={inputRef}
            id={`${uid}-texto`}
            type="text"
            autoComplete="off"
            enterKeyHint="send"
            maxLength={500}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={ui.placeholder}
            style={FUENTE}
            className="h-11 min-w-0 flex-1 rounded-full border border-transparent bg-[#2C2C2E] px-4 text-[1rem] text-white outline-hidden transition-[border-color,box-shadow] placeholder:text-[#8E8E93] focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/30"
          />
          <button
            type="submit"
            aria-label={ui.enviar}
            disabled={!texto.trim()}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#007AFF] text-white transition-[opacity,scale] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </form>
        <p id={`${uid}-aviso`} className={cn("m-0 mt-2 px-1 text-[0.75rem] leading-snug", SECUNDARIO)}>
          {ui.aviso}
        </p>
      </div>
    </div>
  );
}

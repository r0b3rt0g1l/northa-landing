import Link from "next/link";

export default function PortalNotFound() {
  return (
    <main id="contenido" className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="eyebrow">Portal de Amplía</p>
        <h1 className="mt-4 text-4xl text-ink">Esta sección no existe.</h1>
        <p className="mt-3 text-dim">Revisa la dirección o vuelve al inicio del portal.</p>
        <Link
          href="/amplia/portal"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-accent-strong px-6 font-semibold text-accent-contrast"
        >
          Ir al inicio del portal
        </Link>
      </div>
    </main>
  );
}

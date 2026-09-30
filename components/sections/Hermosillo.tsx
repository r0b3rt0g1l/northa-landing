import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { cerroFacts, cerroNameFact } from "@/content/hermosillo";
import { CerroStage } from "@/components/three/CerroStage";

const sources = [
  { label: "Wikipedia", href: "https://en.wikipedia.org/wiki/Cerro_de_la_Campana" },
  { label: "Sonora Star", href: "https://sonorastar.com/2020/08/04/10-datos-historicos-sobre-el-cerro-de-la-campana/" },
  { label: "Noro", href: "https://noro.mx/hermosillo/por-que-el-cerro-de-la-campana-tiene-ese-nombre/" },
];

export function Hermosillo({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const s = dict.sections.hermosillo;
  return (
    <CerroStage
      canvasLabel={s.canvasLabel}
      fallbackLabel={s.fallback}
      hint={s.dragHint}
      dayLabel={locale === "es" ? "Día" : "Day"}
      nightLabel={locale === "es" ? "Noche" : "Night"}
      loadingLabel={locale === "es" ? "Cargando el Cerro en 3D…" : "Loading the 3D Cerro…"}
    >
      <div className="max-w-md rounded-[1.75rem] border border-white/10 bg-[#060a16]/60 p-7 backdrop-blur-xl md:p-9 [@media(max-height:820px)]:md:p-7">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-northa-2">{s.eyebrow}</p>
        <h2 id="hermosillo-title" className="mt-4 text-[clamp(2rem,1.4rem+2.4vw,3.2rem)] text-white">
          {s.title}
        </h2>
        <p className="mt-4 text-white/75">{s.lead}</p>
        {/* En pantallas bajitas se ocultan los datos extra para que la tarjeta quepa. */}
        <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-white/65 [@media(max-height:700px)]:hidden">
          {s.factsTitle}
        </p>
        <dl className="mt-3 grid gap-3 [@media(max-height:700px)]:hidden">
          {cerroFacts.map((fact) => (
            <div key={fact.value} className="flex items-baseline gap-3 border-t border-white/10 pt-3">
              <dt className="w-16 shrink-0 font-display text-lg font-bold tracking-[-0.02em] text-white">{fact.value}</dt>
              <dd className="text-sm text-white/75">{fact.label[locale]}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-white/75 [@media(max-height:800px)]:hidden">{cerroNameFact[locale]}</p>
        <p className="mt-4 text-[0.72rem] text-white/65">
          {locale === "es" ? "Fuentes:" : "Sources:"}{" "}
          {sources.map((src, i) => (
            <span key={src.href}>
              <a href={src.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
                {src.label}
              </a>
              {i < sources.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </div>
    </CerroStage>
  );
}

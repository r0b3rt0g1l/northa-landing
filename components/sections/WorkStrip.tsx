import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { flota } from "@/content/gov";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Portafolio corto del inicio: los 14 portales municipales en una cinta que
 * corre sola (se pausa al pasar el cursor) y una liga al portafolio completo.
 */
export function WorkStrip({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const w = dict.sections.work;
  const shotAlt = dict.sections.portfolio.screenshotAlt;
  return (
    <section id="trabajo" aria-labelledby="trabajo-title" className="relative py-12 md:py-16">
      <div className="container-x">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">{w.eyebrow}</p>
            <h2 id="trabajo-title" className="text-[length:var(--text-h2)] text-ink">
              {w.title}
            </h2>
            <p className="mt-4 max-w-md text-dim">{w.lead}</p>
          </div>
          <Link
            href={href(locale, "/portfolio")}
            className="group inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full border border-line-2 px-6 font-semibold text-ink transition-colors hover:border-accent-line hover:bg-accent-soft md:self-auto"
          >
            {w.seeAll}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </Reveal>
      </div>

      <Marquee className="mt-12" duration={70} label={w.eyebrow}>
        {flota.map((m) => (
          <figure key={m.slug} className="mx-3 w-[15rem] shrink-0 md:w-[17rem]">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_50px_-28px_rgb(0_0_0/0.7)]">
              <div className="flex items-center gap-1.5 border-b border-line px-3 py-2" aria-hidden>
                <span className="size-2 rounded-full bg-line-2" />
                <span className="size-2 rounded-full bg-line-2" />
                <span className="size-2 rounded-full bg-line-2" />
                <span className="ml-2 truncate font-mono text-[0.62rem] text-faint">{m.dominio.replace(/^www\./, "")}</span>
              </div>
              <div className="relative aspect-[4/3]">
                <Image
                  src={`/portfolio/${m.slug}.webp`}
                  alt={shotAlt.replace("{name}", m.nombre)}
                  fill
                  sizes="(min-width: 768px) 272px, 240px"
                  className="object-cover object-top"
                />
              </div>
            </div>
            <figcaption className="mt-3 text-sm font-semibold text-ink">{m.nombre}</figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  );
}

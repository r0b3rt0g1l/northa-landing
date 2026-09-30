import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { escudoAlt, flota } from "@/content/gov";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";

/** Apartado de gobierno en el home: presente, pero sin robarle el protagonismo a los servicios. */
export function GovBand({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const g = dict.sections.gov;
  return (
    <Section id="gobierno-digital" labelledBy="gov-title" className="py-20 md:py-24" defer={[740, 680]}>
      <div className="container-x">
        <Reveal className="overflow-hidden rounded-[2rem]">
          {/* Bloque azul marino: siempre en tema oscuro, sin importar el tema de la página. */}
          <div
            data-theme="dark"
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(120%_140%_at_0%_0%,var(--navy-2)_0%,var(--navy)_45%,#060a16_100%)] text-ink"
          >
            <div className="grid gap-8 p-8 md:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="eyebrow">{g.eyebrow}</p>
                <h2 id="gov-title" className="mt-4 text-[clamp(1.75rem,1.3rem+1.6vw,2.6rem)] text-ink">
                  {g.title}
                </h2>
                <p className="mt-4 max-w-xl text-dim">{g.lead}</p>
                <p className="mt-4 text-sm text-faint">
                  {g.ampliaNote}{" "}
                  <Link href={href(locale, "/amplia")} className="text-accent-ink underline underline-offset-4">
                    Amplía Consultoría
                  </Link>
                </p>
              </div>
              <div className="flex lg:justify-end">
                <Link
                  href={href(locale, "/gobierno")}
                  className="group inline-flex h-12 items-center gap-2 rounded-full border border-line-2 px-6 font-semibold text-ink transition-colors hover:border-accent-line hover:bg-accent-soft"
                >
                  {g.cta}
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>
            </div>
            <div className="border-t border-line bg-bg/40 py-6">
              <Marquee
                duration={55}
                label={
                  locale === "es"
                    ? "Escudos de los municipios con portal"
                    : "Coats of arms of municipalities with a portal"
                }
              >
                {flota.map((m) => (
                  <span key={m.slug} className="mx-3 grid size-20 place-items-center rounded-2xl bg-paper p-2.5">
                    <Image
                      src={`/escudos/${m.slug}.png`}
                      alt={escudoAlt(m.nombre, locale)}
                      width={64}
                      height={64}
                      className="h-full w-auto object-contain"
                      sizes="64px"
                    />
                  </span>
                ))}
              </Marquee>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

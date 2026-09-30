import { Plus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { L } from "@/lib/l10n";
import { JsonLd, faqJsonLd } from "@/lib/jsonld";
import { deferRender } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Acordeón nativo (<details>): accesible con teclado y lector de pantalla sin
 * JavaScript. También publica FAQPage en datos estructurados.
 */
export function Faq({
  items,
  locale,
  eyebrow,
  title,
  id = "preguntas",
}: {
  items: { q: L; a: L }[];
  locale: Locale;
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative py-24 md:py-32" {...deferRender(880, 770)}>
      <JsonLd data={faqJsonLd(items, locale)} />
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h2 id={`${id}-title`} className="text-[length:var(--text-h2)] text-ink">
            {title}
          </h2>
        </Reveal>
        <div className="divide-y divide-line border-y border-line">
          {items.map((item, i) => (
            <details key={i} className="group py-2 [&[open]_.faq-icon]:rotate-45">
              <summary className="flex items-center justify-between gap-6 rounded-xl py-4 text-left font-display text-lg font-semibold text-ink md:text-xl">
                {item.q[locale]}
                <span className="faq-icon grid size-9 shrink-0 place-items-center rounded-full border border-line-2 text-accent-ink transition-transform duration-300">
                  <Plus className="size-4" aria-hidden />
                </span>
              </summary>
              <p className="max-w-2xl pb-5 pr-12 text-dim">{item.a[locale]}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

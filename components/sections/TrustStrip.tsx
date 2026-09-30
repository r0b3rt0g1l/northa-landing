import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { homeStats, techStack } from "@/content/stats";
import { Marquee } from "@/components/ui/Marquee";
import { StarGlyph } from "@/components/ui/Icons";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function TrustStrip({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <section aria-label={dict.sections.trust.label} className="relative border-y border-line bg-bg-2">
      <RevealGroup as="ul" className="container-x grid grid-cols-2 md:grid-cols-4">
        {homeStats.map((stat, i) => (
          <RevealItem
            as="li"
            key={i}
            className="border-line py-8 pr-4 max-md:[&:nth-child(-n+2)]:border-b md:border-l md:pl-8 md:first:border-l-0 md:first:pl-0"
          >
            <p className="font-display text-[clamp(2.25rem,1.6rem+2vw,3.25rem)] font-bold leading-none tracking-[-0.04em] text-ink tabular-nums">
              {stat.value}
              {stat.suffix}
            </p>
            <p className="mt-2 text-sm text-faint">{stat.label[locale]}</p>
          </RevealItem>
        ))}
      </RevealGroup>
      <div className="border-t border-line py-5">
        <Marquee label={dict.sections.trust.techLabel} duration={48}>
          {techStack.map((tech) => (
            <span key={tech} className="mx-7 inline-flex items-center gap-3 font-mono text-[0.8rem] tracking-[0.08em] text-faint">
              <StarGlyph className="size-2.5 text-accent" />
              {tech}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

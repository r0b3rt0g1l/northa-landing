import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { processSteps } from "@/content/process";
import { Section } from "@/components/ui/Section";
import { Process } from "./Process";

export function ProcessSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <Section id="proceso" labelledBy="proceso-title">
      <Process
        eyebrow={dict.sections.process.eyebrow}
        title={dict.sections.process.title}
        lead={dict.sections.process.lead}
        bearingLabel={dict.sections.process.bearing}
        steps={processSteps.map((s) => ({
          bearing: s.bearing,
          heading: s.heading[locale],
          title: s.title[locale],
          body: s.body[locale],
        }))}
      />
    </Section>
  );
}

import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ScopeBuilder } from "./ScopeBuilder";

export function Scope({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <Section id="arma-tu-proyecto" labelledBy="scope-title" className="pb-16 pt-4 md:pb-20 md:pt-8" defer={[930, 820]}>
      <div className="container-x">
        <SectionHeading
          id="scope-title"
          eyebrow={dict.sections.scope.eyebrow}
          title={dict.sections.scope.title}
          lead={dict.sections.scope.lead}
        />
        <Reveal className="mt-12">
          <ScopeBuilder
            dict={dict.sections.scope}
            formDict={dict.form}
            locale={locale}
            privacyHref={href(locale, "/privacidad")}
            newTabLabel={dict.a11y.newTab}
          />
        </Reveal>
      </div>
    </Section>
  );
}

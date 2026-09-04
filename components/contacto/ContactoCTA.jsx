import { Mail, MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ContactoForm } from "./ContactoForm";
import { site, WEB3FORMS_KEY } from "@/lib/site";

const linkClasses =
  "group flex items-center gap-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-bright)]/40";

export function ContactoCTA() {
  return (
    <Section id="contacto" labelledBy="contacto-title">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <SectionHeader
            eyebrow="Contacto"
            titleId="contacto-title"
            title="Hablemos."
            description="Respondemos el mismo día."
          />

          <Reveal delay={0.06} className="mt-8 flex flex-col gap-3">
            <a
              href={site.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/5 text-[var(--color-bright)]">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[var(--color-text)]">
                  WhatsApp
                </span>
                <span className="block text-sm text-[var(--color-muted)]">
                  {site.contact.whatsappDisplay}
                </span>
              </span>
            </a>

            <a href={site.contact.emailHref} className={linkClasses}>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/5 text-[var(--color-bright)]">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[var(--color-text)]">
                  Correo
                </span>
                <span className="block text-sm text-[var(--color-muted)]">
                  {site.contact.email}
                </span>
              </span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <ContactoForm accessKey={WEB3FORMS_KEY} />
        </Reveal>
      </div>
    </Section>
  );
}

export default ContactoCTA;

import { Mail, MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlowBadge } from "@/components/ui/GlowBadge";
import { Reveal } from "@/components/ui/Reveal";
import { ContactoForm } from "./ContactoForm";
import { site, WEB3FORMS_KEY } from "@/lib/site";

export function ContactoCTA() {
  return (
    <Section id="contacto" labelledBy="contacto-title">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <GlowBadge>Hablemos</GlowBadge>
          <h2
            id="contacto-title"
            className="mt-6 text-[length:var(--text-h2)] font-semibold"
          >
            Lleva tu municipio al norte
          </h2>
          <p className="mt-5 text-[length:var(--text-lead)] text-[var(--color-muted)]">
            Cuéntanos sobre tu municipio y te preparamos una propuesta a la
            medida. Sin compromiso.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={site.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-bright)]/40"
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

            <a
              href={site.contact.emailHref}
              className="group flex items-center gap-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-bright)]/40"
            >
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
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <ContactoForm accessKey={WEB3FORMS_KEY} />
        </Reveal>
      </div>
    </Section>
  );
}

export default ContactoCTA;

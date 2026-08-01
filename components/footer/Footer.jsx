import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";
import { navSections } from "@/lib/content/nav";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface)]/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)]">
            Estudio especializado en gobierno municipal de Sonora. Portales de
            última generación e inteligencia artificial al servicio del
            ciudadano.
          </p>
        </div>

        <nav aria-label="Enlaces del pie de página">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            Secciones
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {navSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            Contacto
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-[var(--color-muted)]">
            <li>
              <a
                href={site.contact.emailHref}
                className="transition-colors hover:text-[var(--color-text)]"
              >
                {site.contact.email}
              </a>
            </li>
            <li>
              <a
                href={site.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--color-text)]"
              >
                WhatsApp {site.contact.whatsappDisplay}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-[var(--color-muted)] sm:flex-row">
          <p>
            © {year} {site.name}. Hecho en {site.location}.
          </p>
          <p>Fundado por {site.founder}.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";

/**
 * Pie de página en una sola franja: marca, contacto y crédito. Nada más.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-line)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <a href="#inicio" aria-label={`${site.name} — inicio`} className="rounded-lg">
          <Logo />
        </a>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--color-muted)]">
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

        <p className="text-xs text-[var(--color-muted)]">
          © {year} {site.name} · {site.location}
        </p>
      </div>
    </footer>
  );
}

export default Footer;

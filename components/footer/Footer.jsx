import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { BotonAsistente } from "@/components/ui/BotonAsistente";
import { BotonWhatsapp } from "@/components/ui/BotonWhatsapp";
import { getSite } from "@/lib/site";
import { getNav } from "@/lib/content/nav";
import { getUi } from "@/lib/i18n/ui";
import { hrefSeccion } from "@/lib/i18n/config";
import { SelectorIdioma } from "@/components/i18n/SelectorIdioma";

const enlace =
  "group inline-flex min-h-11 items-center gap-3 rounded-full pr-2 text-[15px] text-text-2 transition-colors hover:text-text";
const icono =
  "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong bg-white/[0.04] transition-colors group-hover:border-white/25";

/**
 * Pie con el contacto directo (#contacto): el botón de WhatsApp (abre el chat
 * directo, sin mostrar el número), el correo y el asistente. Todos los datos
 * salen de lib/site.js.
 */
export function Footer({ locale }) {
  const year = new Date().getFullYear();
  const site = getSite(locale);
  const { navSections } = getNav(locale);
  const ui = getUi(locale);
  const { contact } = site;

  return (
    <footer id="contacto" aria-labelledby="contacto-title" className="relative z-10 px-5 pb-28 pt-10 sm:px-8 sm:pt-12">
      <div className="glass mx-auto grid w-full max-w-[1200px] gap-10 rounded-[32px] p-6 sm:p-10 md:grid-cols-[1fr_1.2fr_auto] md:gap-12">
        <div className="flex flex-col gap-4">
          {/* Ancla dentro de la página; desde la 404 lleva al inicio. */}
          <a href={hrefSeccion(locale, "inicio")} aria-label={ui.logoInicio} className="inline-flex min-h-11 w-fit items-center rounded-full">
            <Logo />
          </a>
          <p className="m-0 max-w-[32ch] text-[14.5px] leading-relaxed text-muted">{site.tagline}.</p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 id="contacto-title" className="eyebrow m-0 text-[13px] font-normal tracking-[0.08em]">
            {ui.footer.contacto}
          </h2>
          <div>
            <BotonWhatsapp size="sm" magnetic={false} className="pl-2.5">
              {ui.footer.whatsapp}
            </BotonWhatsapp>
          </div>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            <li>
              <a href={contact.emailHref} className={enlace}>
                <span className={icono}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-text">{contact.email}</span>
              </a>
            </li>
          </ul>
          <div>
            <BotonAsistente size="sm">{ui.footer.asistente}</BotonAsistente>
          </div>
        </div>

        <nav aria-label={ui.footer.aria}>
          <ul className="m-0 flex list-none flex-col gap-0 p-0 text-sm">
            {navSections.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-text"
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <SelectorIdioma completo className="-ml-1 border-transparent" />
            </li>
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-6 w-full max-w-[1200px] px-2 text-[13px] text-faint">
        © {year} {site.name}
      </p>
    </footer>
  );
}

export default Footer;

import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";

/**
 * Aviso de privacidad integral — PLANTILLA.
 * Revísalo con un abogado antes de publicar: razón social, domicilio completo y
 * los encargados que realmente uses (según las variables de entorno activas).
 * Última revisión del texto base: 29-sep-2026.
 */
const UPDATED = "2026-09-29";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacidad">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "/privacidad",
    title: dict.nav.privacy,
    description:
      locale === "es"
        ? "Aviso de privacidad de Northa Digital: qué datos recabamos, para qué, con quién los compartimos y cómo ejercer tus derechos ARCO."
        : "Northa Digital privacy notice: what data we collect, why, who we share it with and how to exercise your rights.",
  });
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacidad">) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "es";
  const dict = getDictionary(locale);
  const email = site.contact.email;

  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ name: dict.nav.privacy, path: "/privacidad" }]}
        eyebrow={locale === "es" ? "Legal" : "Legal"}
        title={dict.nav.privacy}
        lead={
          locale === "es"
            ? `Última actualización: ${UPDATED}.`
            : `Last updated: ${UPDATED}.`
        }
      />
      <article className="container-x pb-24">
        {locale === "es" ? (
          <div className="prose-northa mx-auto max-w-[70ch]">
            <h2>Responsable</h2>
            <p>
              <strong>Northa Digital</strong>, representada por {site.founder}, con domicilio en Hermosillo, Sonora, México, es
              responsable del tratamiento de los datos personales que nos proporcionas a través de este sitio. Contacto para
              temas de privacidad: <a href={`mailto:${email}`}>{email}</a>.
            </p>

            <h2>Datos que recabamos</h2>
            <ul>
              <li>
                <strong>Formulario de contacto y “Arma tu proyecto”:</strong> nombre, correo electrónico y/o teléfono, empresa u
                organización (opcional) y el mensaje que escribas.
              </li>
              <li>
                <strong>Chat con Nort (asistente con IA):</strong> el texto de la conversación y, solo si aceptas que te
                contactemos, tu nombre y un medio de contacto. Para que puedas retomarla, la conversación se guarda{" "}
                <strong>solo en tu navegador</strong> durante 7 días; la borras con “Nueva conversación”.
              </li>
              <li>
                <strong>Navegación:</strong> métricas de uso agregadas y anónimas (páginas vistas, rendimiento). No usamos
                cookies de publicidad.
              </li>
            </ul>
            <p>No solicitamos datos personales sensibles. Por favor no los compartas en el chat ni en el formulario.</p>

            <h2>Finalidades</h2>
            <p>Usamos tus datos para:</p>
            <ol>
              <li>Responder tu solicitud y darle seguimiento.</li>
              <li>Preparar y enviarte una propuesta o cotización.</li>
              <li>Contactarte por el medio que elegiste (WhatsApp, teléfono o correo).</li>
            </ol>
            <p>No usamos tus datos para publicidad ni los vendemos.</p>

            <h2>Con quién se comparten</h2>
            <p>
              Para operar el sitio nos apoyamos en proveedores que tratan datos por cuenta nuestra (encargados), bajo sus
              propios términos de confidencialidad y seguridad:
            </p>
            <ul>
              <li>Alojamiento y analítica sin cookies: Vercel.</li>
              <li>Modelos de inteligencia artificial para el chat: proveedores accesibles vía Vercel AI Gateway.</li>
              <li>Registro de solicitudes: Supabase (base de datos) y, en su caso, HubSpot (CRM).</li>
              <li>Avisos por correo: Resend.</li>
              <li>Protección contra spam en formularios (si está activa): Cloudflare Turnstile.</li>
            </ul>
            <p>Fuera de estos casos, solo compartiremos datos cuando una autoridad competente lo requiera conforme a la ley.</p>

            <h2>Tus derechos (ARCO) y revocación del consentimiento</h2>
            <p>
              Puedes solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos, o revocar tu
              consentimiento, escribiendo a <a href={`mailto:${email}`}>{email}</a> con tu nombre, el derecho que quieres
              ejercer y un medio para responderte. Te responderemos dentro de los plazos que marca la ley.
            </p>

            <h2>Conservación</h2>
            <p>
              Conservamos tus datos solo el tiempo necesario para atender tu solicitud y la relación comercial que, en su caso,
              se derive de ella.
            </p>

            <h2>Cookies y tecnologías similares</h2>
            <p>
              El sitio guarda en tu navegador preferencias como el tema claro/oscuro, la pausa de animaciones y, por 7 días, la
              conversación con Nort. La analítica de Vercel no usa cookies. Si en el futuro activamos otra herramienta de analítica que las use, lo indicaremos aquí.
            </p>

            <h2>Cambios a este aviso</h2>
            <p>Cualquier cambio se publicará en esta misma página, con su fecha de actualización.</p>
          </div>
        ) : (
          <div className="prose-northa mx-auto max-w-[70ch]">
            <p>
              <em>
                This English version is provided for convenience. The Spanish version governs, in accordance with Mexican
                law.
              </em>
            </p>
            <h2>Data controller</h2>
            <p>
              <strong>Northa Digital</strong>, represented by {site.founder}, based in Hermosillo, Sonora, Mexico, is
              responsible for the personal data you provide through this site. Privacy contact:{" "}
              <a href={`mailto:${email}`}>{email}</a>.
            </p>
            <h2>What we collect</h2>
            <ul>
              <li>
                <strong>Contact form and “Scope your project”:</strong> name, email and/or phone, company (optional) and your
                message.
              </li>
              <li>
                <strong>Chat with Nort (AI assistant):</strong> the conversation text and, only if you agree to be contacted,
                your name and a contact method. So you can pick it up again, the conversation is stored{" "}
                <strong>only in your browser</strong> for 7 days; “New conversation” erases it.
              </li>
              <li>
                <strong>Browsing:</strong> aggregated, anonymous usage metrics. We don’t use advertising cookies.
              </li>
            </ul>
            <p>We don’t request sensitive personal data. Please don’t share it in the chat or the form.</p>
            <h2>Purposes</h2>
            <ol>
              <li>Answering and following up on your request.</li>
              <li>Preparing and sending you a proposal or quote.</li>
              <li>Contacting you through the channel you chose.</li>
            </ol>
            <p>We don’t use your data for advertising and we don’t sell it.</p>
            <h2>Who we share it with</h2>
            <ul>
              <li>Hosting and cookie-free analytics: Vercel.</li>
              <li>AI models for the chat: providers accessed through Vercel AI Gateway.</li>
              <li>Request records: Supabase (database) and, where applicable, HubSpot (CRM).</li>
              <li>Email notifications: Resend.</li>
              <li>Spam protection on forms (when enabled): Cloudflare Turnstile.</li>
            </ul>
            <h2>Your rights</h2>
            <p>
              You can request access, rectification, cancellation or objection, or revoke your consent, by writing to{" "}
              <a href={`mailto:${email}`}>{email}</a>.
            </p>
            <h2>Changes</h2>
            <p>Any change will be published on this page with its update date.</p>
          </div>
        )}
      </article>
    </>
  );
}

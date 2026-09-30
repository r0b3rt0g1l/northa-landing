import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
import { href } from "@/lib/i18n/href";
import { CerroMark } from "@/components/brand/CerroMark";
import { buttonClasses } from "@/components/ui/Button";

export default async function NotFound() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return (
    <section className="relative grid min-h-[80svh] place-items-center overflow-hidden pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-line-2 opacity-30 [mask:url(/brand/contours.svg)_center/1100px_no-repeat]"
      />
      <div className="container-x relative text-center">
        <CerroMark id="nf" size={88} animate className="mx-auto" />
        <p className="eyebrow mt-8">404</p>
        <h1 className="mt-4 text-[length:var(--text-h1)]">{dict.notFound.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-dim">{dict.notFound.lead}</p>
        <Link href={href(locale, "/")} className={buttonClasses("primary", "lg", "mt-10")}>
          {dict.cta.backHome}
        </Link>
      </div>
    </section>
  );
}

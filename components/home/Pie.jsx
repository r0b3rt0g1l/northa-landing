import { site } from "@/lib/site";

/**
 * Pie: contacto de las dos empresas, en texto plano (no enlaces — así está
 * en la dirección C). Sin barra de copyright: el flujo termina aquí.
 */
export function Pie() {
  const telNortha = site.contact.whatsappDisplay.replace("+52 ", "");

  return (
    <footer className="grid grid-cols-1 gap-px border-t border-[#17171E] bg-[#17171E] sm:grid-cols-2">
      <div className="flex flex-col gap-[5px] bg-[var(--color-bg)] px-6 py-6 sm:px-[60px] sm:py-[30px]">
        <span className="font-mono text-[10.5px] tracking-[0.16em] text-[var(--color-amplia)]">
          AMPLÍA CONSULTORÍA
        </span>
        <span className="text-[14px] font-light text-[#9A9AA6]">
          {site.amplia.presenta} · {site.amplia.contact.tel} ·{" "}
          {site.amplia.contact.email}
        </span>
      </div>
      <div className="flex flex-col gap-[5px] bg-[var(--color-bg)] px-6 py-6 sm:px-[60px] sm:py-[30px]">
        <span className="font-mono text-[10.5px] tracking-[0.16em] text-[var(--color-glow)]">
          NORTHA DIGITAL
        </span>
        <span className="text-[14px] font-light text-[#9A9AA6]">
          {site.founder} · {telNortha} · {site.contact.email}
        </span>
      </div>
    </footer>
  );
}

export default Pie;

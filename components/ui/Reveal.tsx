import { Children, cloneElement, isValidElement, type CSSProperties, type ReactElement } from "react";
import { cn } from "@/lib/utils";

/*
 * Apariciones al hacer scroll SIN JavaScript.
 *
 * Usan animaciones ligadas al scroll de CSS (`animation-timeline: view()`, ver
 * app/globals.css → "Reveal"). Ventajas frente a animar con JS:
 *  - No esperan a la hidratación: el contenido nunca nace invisible, así que el
 *    LCP no se retrasa y sin JavaScript todo se ve.
 *  - Cero JS en el navegador para esto.
 *  - Donde el navegador no soporta la función, el contenido simplemente aparece.
 *  - Con "reducir movimiento" o la pausa manual no hay animación.
 *
 * La API es la misma que la versión anterior (Motion), así que los componentes
 * que las usan no cambian.
 */

type Variant = "up" | "fade" | "scale";
type RevealStyle = CSSProperties & { "--reveal-i"?: number };

export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  /** Segundos (compatibilidad): se traduce en un pequeño retraso del rango de scroll. */
  delay?: number;
  as?: "div" | "li" | "article" | "span";
}) {
  const style: RevealStyle | undefined = delay ? { "--reveal-i": Math.round(delay / 0.08) } : undefined;
  return (
    <Tag className={cn(variant !== "up" && `reveal-${variant}`, className)} style={style} data-reveal="">
      {children}
    </Tag>
  );
}

/** Contenedor que escalona a sus hijos `RevealItem` (cada uno entra un poco después). */
export function RevealGroup({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Compatibilidad con la versión anterior; el escalonado lo da el índice. */
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  let i = 0;
  const items = Children.map(children, (child) => {
    if (!isValidElement(child) || child.type !== RevealItem) return child;
    const el = child as ReactElement<{ index?: number }>;
    return cloneElement(el, { index: i++ % 4 });
  });
  return <Tag className={className}>{items}</Tag>;
}

export function RevealItem({
  children,
  className,
  as: Tag = "div",
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  /** Lo pone RevealGroup. */
  index?: number;
}) {
  const style: RevealStyle | undefined = index ? { "--reveal-i": index } : undefined;
  return (
    <Tag className={className} style={style} data-reveal="">
      {children}
    </Tag>
  );
}

/**
 * Titular que aparece palabra por palabra al cargar (CSS puro, como el hero).
 * El texto sigue siendo texto: SEO y lectores de pantalla lo leen completo.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
  highlight,
}: {
  text: string;
  className?: string;
  delay?: number;
  highlight?: string;
}) {
  const words = text.split(" ");
  const hl = new Set((highlight ?? "").split(" ").filter(Boolean));
  return (
    <span className={cn("inline", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span
            className={cn("hero-word inline-block", hl.has(word) && "text-gradient")}
            style={{ "--i": i + Math.round(delay / 0.07) } as CSSProperties}
          >
            {word}
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

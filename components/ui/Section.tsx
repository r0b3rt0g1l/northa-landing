import { cn, deferRender } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Section({
  id,
  className,
  children,
  as: Tag = "section",
  labelledBy,
  defer,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  as?: "section" | "div" | "aside";
  labelledBy?: string;
  /** Altura estimada [celular, escritorio] si la sección va debajo del primer pantallazo. */
  defer?: readonly [number, number];
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative py-24 md:py-32", className)}
      {...(defer ? deferRender(defer[0], defer[1]) : {})}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  as: Heading = "h2",
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <Heading
        id={id}
        className={cn(Heading === "h1" ? "text-[length:var(--text-h1)]" : "text-[length:var(--text-h2)]", "text-ink")}
      >
        {title}
      </Heading>
      {lead && (
        <p className={cn("mt-5 text-[length:var(--text-lead)] leading-relaxed text-dim", align === "center" && "mx-auto")}>
          {lead}
        </p>
      )}
    </Reveal>
  );
}

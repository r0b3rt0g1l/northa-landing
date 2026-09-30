import { cn } from "@/lib/utils";

/**
 * Cinta infinita en CSS puro. Se pausa al pasar el cursor, con el foco,
 * con "Pausar animaciones" (data-motion) y con movimiento reducido.
 */
export function Marquee({
  children,
  className,
  duration = 40,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]",
        className,
      )}
      role={label ? "region" : undefined}
      aria-label={label}
    >
      <div
        className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

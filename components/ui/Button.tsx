import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.005em] transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-out-expo focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-strong text-accent-contrast shadow-[0_10px_40px_-12px_var(--accent)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-14px_var(--accent)] active:translate-y-0",
  secondary:
    "border border-line-2 bg-surface/60 text-ink backdrop-blur hover:border-accent-line hover:bg-accent-soft",
  ghost: "text-ink hover:bg-accent-soft",
  light: "bg-white text-[#0b0c10] hover:-translate-y-0.5 hover:bg-white/90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.875rem]",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-[1rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  /** Muestra la flecha diagonal que se desplaza al pasar el cursor. */
  arrow?: boolean;
}

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  newTabLabel?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

type ButtonAsButton = CommonProps & { href?: undefined } & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

function Arrow() {
  return (
    <ArrowUpRight
      aria-hidden
      className="size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    />
  );
}

export function Button(props: ButtonAsLink | ButtonAsButton) {
  if (props.href !== undefined) {
    const { variant, size, className, children, arrow, href, external, newTabLabel, ...rest } = props;
    const classes = buttonClasses(variant, size, className);
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
    if (isExternal) {
      const opensTab = href.startsWith("http");
      return (
        <a
          href={href}
          className={classes}
          {...(opensTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...rest}
        >
          {children}
          {opensTab && newTabLabel && <span className="sr-only"> {newTabLabel}</span>}
          {arrow && <Arrow />}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
        {arrow && <Arrow />}
      </Link>
    );
  }
  const { variant, size, className, children, arrow, type = "button", ...rest } = props;
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}

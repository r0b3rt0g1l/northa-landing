"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Revela su contenido con un fade-up al entrar en viewport (una sola vez).
 * Respeta prefers-reduced-motion: si está activo, renderiza el estado final
 * sin animación, conservando la etiqueta semántica (`as`).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
  ...props
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Tag = as;
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as] ?? motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;

"use client";

import { useScroll, useTransform } from "framer-motion";

/**
 * Parallax hook anclado al ref dado.
 * Genera un translateY que va de 0 a (-200 * factor) mientras el target
 * se desplaza desde "start start" a "end start" del viewport.
 */
export function useParallax(ref, factor = 0.5) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [0, -200 * factor]);

  return { scrollYProgress, translateY };
}

export default useParallax;

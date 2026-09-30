"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Transición entre pasos de "Arma tu proyecto" con Motion (Framer Motion):
 * el paso que sale se desliza a la izquierda y el nuevo entra desde la derecha.
 *
 * Este módulo se descarga aparte (import dinámico desde ScopeBuilder) cuando la
 * sección se acerca a la pantalla, así Motion no pesa en la carga inicial.
 * `initial={false}`: al montarse no anima, para que el cambio desde la versión
 * sin Motion sea invisible.
 */
export default function ScopeStepMotion({
  stepKey,
  calm,
  children,
}: {
  stepKey: number;
  calm: boolean;
  children: React.ReactNode;
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={calm ? "always" : "user"}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={stepKey}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {children}
          </m.div>
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
}

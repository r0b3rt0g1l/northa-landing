"use client";

import { createContext, useContext } from "react";
import { defaultLocale } from "@/lib/i18n/config";
import { getUi } from "@/lib/i18n/ui";

const LocaleContext = createContext(defaultLocale);

/** Entrega el idioma de la página a los componentes de cliente. */
export function LocaleProvider({ locale, children }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);

/** Idioma y textos de la interfaz en uno. */
export function useUi() {
  const locale = useContext(LocaleContext);
  return { locale, ui: getUi(locale) };
}

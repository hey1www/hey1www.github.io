import { createContext, useContext } from "react";
import type { LocaleCode, LocaleText } from "../types/portfolio";

export type LocaleContextValue = {
  locale: LocaleCode;
  setLocale: (next: LocaleCode) => void;
  t: (text: LocaleText | undefined) => string;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocaleContext must be used inside <LocaleProvider>");
  return ctx;
}
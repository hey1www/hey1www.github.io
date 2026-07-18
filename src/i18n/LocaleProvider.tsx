import { useCallback, useEffect, useMemo, useState } from "react";
import {
  detectLocale,
  persistLocale,
  pickLocaleText,
  readStoredLocale,
  LOCALE_HTML_LANG,
} from "./locale";
import { LocaleContext, type LocaleContextValue } from "./LocaleContext";
import type { LocaleCode, LocaleText } from "../types/portfolio";

/**
 * Top-level provider that keeps the current language in a single React
 * context. All child components read from this provider via
 * useLocaleContext() so that switching languages re-renders everything.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    return readStoredLocale() ?? detectLocale();
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = LOCALE_HTML_LANG[locale];
    }
  }, [locale]);

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const t = useCallback(
    (text: LocaleText | undefined) => pickLocaleText(text, locale),
    [locale]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
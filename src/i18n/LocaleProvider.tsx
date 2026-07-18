import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const initialLocale = useRef<{ locale: LocaleCode; followsDevice: boolean } | null>(null);
  if (!initialLocale.current) {
    const storedLocale = readStoredLocale();
    initialLocale.current = {
      locale: storedLocale ?? detectLocale(),
      followsDevice: storedLocale === null,
    };
  }

  const [locale, setLocaleState] = useState<LocaleCode>(initialLocale.current.locale);
  const [followsDevice, setFollowsDevice] = useState(initialLocale.current.followsDevice);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = LOCALE_HTML_LANG[locale];
    }
  }, [locale]);

  useEffect(() => {
    if (!followsDevice || typeof window === "undefined") return;

    const syncWithDeviceLanguage = () => {
      setLocaleState(detectLocale());
    };

    window.addEventListener("languagechange", syncWithDeviceLanguage);
    return () => {
      window.removeEventListener("languagechange", syncWithDeviceLanguage);
    };
  }, [followsDevice]);

  const setLocale = useCallback((next: LocaleCode) => {
    setFollowsDevice(false);
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

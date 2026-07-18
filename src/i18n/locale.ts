import type { LocaleCode, LocaleText } from "../types/portfolio";

export const SUPPORTED_LOCALES: LocaleCode[] = ["en", "zhHans", "zhHant"];

export const LOCALE_LABELS: Record<LocaleCode, string> = {
  en: "EN",
  zhHans: "简",
  zhHant: "繁",
};

export const LOCALE_HTML_LANG: Record<LocaleCode, string> = {
  en: "en",
  zhHans: "zh-Hans",
  zhHant: "zh-Hant",
};

export const LOCALE_STORAGE_KEY = "heyi-portal:locale";

/**
 * Resolve the user's preferred locale by inspecting the browser language
 * preferences. Traditional Chinese variants (zh-Hant/TW/HK/MO) take priority
 * over Simplified Chinese; everything else falls back to English.
 */
export function detectLocale(): LocaleCode {
  if (typeof navigator === "undefined") return "en";
  const candidates = [navigator.language, ...(navigator.languages || [])]
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());

  for (const tag of candidates) {
    if (
      tag === "zh-hant" ||
      tag === "zh-tw" ||
      tag === "zh-hk" ||
      tag === "zh-mo"
    ) {
      return "zhHant";
    }
  }
  for (const tag of candidates) {
    if (tag.startsWith("zh")) return "zhHans";
  }
  return "en";
}

export function readStoredLocale(): LocaleCode | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (raw && (SUPPORTED_LOCALES as string[]).includes(raw)) {
    return raw as LocaleCode;
  }
  return null;
}

export function persistLocale(locale: LocaleCode): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function pickLocaleText(text: LocaleText | undefined, locale: LocaleCode): string {
  if (!text) return "";
  return text[locale] || text.en || "";
}

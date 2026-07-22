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

export const PAGE_TITLES: Record<LocaleCode, string> = {
  en: "Interactive Resume - Zouheyi WANG",
  zhHans: "互动式主页 - 王邹鹤仪",
  zhHant: "互動式主頁 - 王鄒鶴儀",
};

export const LOCALE_STORAGE_KEY = "heyi-portal:locale";

const TRADITIONAL_CHINESE_REGIONS = new Set(["tw", "hk", "mo"]);

/**
 * Map a BCP 47 browser language tag to one of the locales supported by the
 * portal. Returning null lets detectLocale() continue through the visitor's
 * ordered language preference list when the current tag is unsupported.
 */
export function localeFromLanguageTag(rawTag: string): LocaleCode | null {
  const subtags = rawTag
    .trim()
    .replace(/_/g, "-")
    .toLowerCase()
    .split("-")
    .filter(Boolean);

  const [language, ...qualifiers] = subtags;
  if (language === "en") return "en";
  if (language !== "zh") return null;

  // An explicit script is more precise than the region when both are present.
  if (qualifiers.includes("hant")) return "zhHant";
  if (qualifiers.includes("hans")) return "zhHans";

  if (qualifiers.some((part) => TRADITIONAL_CHINESE_REGIONS.has(part))) {
    return "zhHant";
  }

  // Bare zh and other Chinese regions use Simplified Chinese by default.
  return "zhHans";
}

/**
 * Resolve the user's preferred locale by inspecting the browser language
 * preferences in order. Unsupported languages are skipped; if none of the
 * visitor's preferences are supported, the portal falls back to English.
 */
export function detectLocale(languagePreferences?: readonly string[]): LocaleCode {
  const candidates = languagePreferences ?? (
    typeof navigator === "undefined"
      ? []
      : [navigator.language, ...(navigator.languages || [])]
  );

  for (const tag of new Set(candidates.filter(Boolean))) {
    const locale = localeFromLanguageTag(tag);
    if (locale) return locale;
  }

  return "en";
}

export function readStoredLocale(): LocaleCode | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw && (SUPPORTED_LOCALES as string[]).includes(raw)) {
      return raw as LocaleCode;
    }
  } catch {
    // Some privacy modes expose localStorage but deny access to it.
  }
  return null;
}

export function persistLocale(locale: LocaleCode): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Language switching still works for the current tab without persistence.
  }
}

export function pickLocaleText(text: LocaleText | undefined, locale: LocaleCode): string {
  if (!text) return "";
  return text[locale] || text.en || "";
}

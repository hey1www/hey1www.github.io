import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_HTML_LANG } from "../../i18n/locale";
import type { LocaleCode } from "../../types/portfolio";

type Props = {
  locale: LocaleCode;
  onChange: (next: LocaleCode) => void;
  compact?: boolean;
};

export function LanguageSwitcher({ locale, onChange, compact = false }: Props) {
  return (
    <div
      role="group"
      aria-label="Language switcher"
      className={[
        "inline-flex flex-none items-center rounded-full border border-border-soft bg-white/70 font-mono tracking-wider",
        compact ? "px-0.5 py-0.5 text-[10px]" : "px-1 py-1 text-xs",
      ].join(" ")}
    >
      {SUPPORTED_LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            aria-pressed={active}
            aria-label={`Switch language to ${LOCALE_HTML_LANG[code]}`}
            className={[
              compact
                ? "min-w-[1.75rem] rounded-full px-1.5 py-0.5 transition-colors"
                : "min-w-[2.25rem] rounded-full px-2 py-1 transition-colors",
              active
                ? "bg-navy text-white shadow"
                : "text-text-muted hover:text-text-main",
            ].join(" ")}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}

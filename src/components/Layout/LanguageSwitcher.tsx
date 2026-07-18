import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_HTML_LANG } from "../../i18n/locale";
import type { LocaleCode } from "../../types/portfolio";

type Props = {
  locale: LocaleCode;
  onChange: (next: LocaleCode) => void;
};

export function LanguageSwitcher({ locale, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Language switcher"
      className="inline-flex items-center rounded-full border border-border-soft bg-white/70 px-1 py-1 text-xs font-mono tracking-wider"
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
              "min-w-[2.25rem] rounded-full px-2 py-1 transition-colors",
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

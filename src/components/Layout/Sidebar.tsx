import { useMemo } from "react";
import type { Card, CardGroup, LocaleCode, Portfolio, SkillFilter } from "../../types/portfolio";
import { useLocale } from "../../i18n/useLocale";
import { classNames } from "../../utils/classNames";
import type { CardBoundsMap } from "../../hooks/useCardRegistry";
import { LanguageSwitcher } from "./LanguageSwitcher";

export type SidebarProps = {
  portfolio: Portfolio;
  activeCardId: string | null;
  onSelectGroup: (group: CardGroup) => void;
  onSelectCard: (cardId: string) => void;
  highlightedCardIds: Set<string> | null;
  activeFilter: SkillFilter;
  boundsByCard: CardBoundsMap;
  locale: LocaleCode;
  setLocale: (l: LocaleCode) => void;
  onFilterClick: (filter: Exclude<SkillFilter, null>) => void;
};

const GROUP_ORDER: CardGroup[] = ["profile", "education", "internship", "project"];

const GROUP_LABELS: Record<CardGroup, Record<LocaleCode, string>> = {
  profile: { en: "Profile", zhHans: "个人信息", zhHant: "個人資訊" },
  education: { en: "Education", zhHans: "教育经历", zhHant: "教育經歷" },
  internship: { en: "Internships", zhHans: "实习经历", zhHant: "實習經歷" },
  project: { en: "Projects", zhHans: "项目经历", zhHant: "項目經歷" },
};

/**
 * Sidebar header lines:
 *  - EN  : "WANG Zouheyi" (single line, sentence case)
 *  - zhHans / zhHant : two lines, native name on top, latin transliteration below.
 */
const SIDEBAR_NAME_EN = "WANG Zouheyi";
const SIDEBAR_NAME_CJK: Record<Exclude<LocaleCode, "en">, { native: string; latin: string }> = {
  zhHans: { native: "王邹鹤仪", latin: "WANG Zouheyi" },
  zhHant: { native: "王鄒鶴儀", latin: "WANG Zouheyi" },
};

export function Sidebar({
  portfolio,
  activeCardId,
  onSelectGroup,
  onSelectCard,
  highlightedCardIds,
  activeFilter,
  locale,
  setLocale,
  onFilterClick,
}: SidebarProps) {
  const { t } = useLocale();

  const grouped = useMemo(() => {
    const out: Record<CardGroup, Card[]> = {
      profile: [],
      education: [],
      internship: [],
      project: [],
    };
    for (const card of portfolio.cards) out[card.group].push(card);
    return out;
  }, [portfolio]);

  return (
    <nav
      aria-label="Career navigation"
      className="flex h-full w-[300px] flex-col border-r border-border-soft bg-white/85 backdrop-blur"
    >
      {/* Header: native name (or EN) on top, latin transliteration below. */}
      <div className="px-5 pb-4 pt-5">
        {locale === "en" ? (
          <h1 className="font-title font-title-strong text-[20px] leading-tight text-text-main">
            {SIDEBAR_NAME_EN}
          </h1>
        ) : (
          <>
            <h1 className="font-title font-title-strong text-[20px] leading-tight text-text-main">
              {SIDEBAR_NAME_CJK[locale].native}
            </h1>
            <p className="mt-0.5 font-title text-[15px] text-text-muted">
              {SIDEBAR_NAME_CJK[locale].latin}
            </p>
          </>
        )}
        <a
          href={`mailto:${portfolio.profile.email}`}
          className="mt-2 inline-block font-sans-cjk text-[12px] text-text-muted hover:text-navy"
        >
          {portfolio.profile.email}
        </a>
      </div>

      {/* Section list */}
      <div className="thin-scroll flex-1 overflow-y-auto px-2 pb-2 font-sans-cjk">
        {GROUP_ORDER.map((group) => {
          const cards = grouped[group];
          if (!cards.length) return null;
          const groupActive = cards.some((c) => c.id === activeCardId);
          return (
            <section key={group} className="mt-2">
              <button
                type="button"
                onClick={() => onSelectGroup(group)}
                aria-label={`Center on ${GROUP_LABELS[group][locale]} group`}
                className={classNames(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[15px] transition-colors",
                  groupActive
                    ? "bg-navy/5 text-navy"
                    : "text-text-main hover:bg-slate-100"
                )}
              >
                <span className="font-semibold tracking-wide">
                  {GROUP_LABELS[group][locale]}
                </span>
                <span className="font-mono text-xs text-text-muted">
                  {cards.length}
                </span>
              </button>
              <ul className="ml-3 border-l border-border-soft/60 pl-2">
                {cards.map((card) => {
                  const isActive = card.id === activeCardId;
                  const isDimmed =
                    highlightedCardIds && !highlightedCardIds.has(card.id);
                  return (
                    <li key={card.id}>
                      <button
                        type="button"
                        onClick={() => onSelectCard(card.id)}
                        aria-current={isActive ? "true" : undefined}
                        className={classNames(
                          "my-0.5 block w-full break-words rounded-md px-2 py-1.5 text-left text-[13px] leading-snug transition-colors [overflow-wrap:anywhere]",
                          isActive
                            ? "bg-navy text-white"
                            : isDimmed
                            ? "text-text-muted/60 hover:text-text-muted"
                            : "text-text-main hover:bg-slate-100"
                        )}
                      >
                        {t(card.title)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <section className="mt-4 border-t border-border-soft/60 pt-3">
          <p className="px-3 pb-1 font-mono text-[10px] uppercase text-text-muted">
            {t({ en: "Capability Tracks", zhHans: "能力主线", zhHant: "能力主線" })}
          </p>
          <div className="space-y-1 px-1">
            {portfolio.skillTracks.map((track) => {
              const active = activeFilter?.kind === "track" && activeFilter.id === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onFilterClick({ kind: "track", id: track.id })}
                  className={classNames(
                    "w-full rounded-md border px-2.5 py-2 text-left text-[12px] leading-snug transition-colors",
                    active
                      ? "border-navy bg-navy text-white"
                      : "border-border-soft bg-white text-text-main hover:border-navy"
                  )}
                >
                  {t(track.label)}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Bottom: language switcher */}
      <div className="border-t border-border-soft/60 px-4 py-3">
        <LanguageSwitcher locale={locale} onChange={setLocale} />
      </div>
    </nav>
  );
}

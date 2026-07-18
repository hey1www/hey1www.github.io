import { useMemo, useState } from "react";
import type { CardGroup, Portfolio, SkillFilter } from "../../types/portfolio";
import { useLocale } from "../../i18n/useLocale";
import { classNames } from "../../utils/classNames";
import { visibleSummary } from "../../utils/text";

type Props = {
  portfolio: Portfolio;
  activeFilter: SkillFilter;
  matchedCardIds: Set<string> | null;
  onFilterClick: (filter: Exclude<SkillFilter, null>) => void;
  onOpenDetails: (cardId: string) => void;
};

const TABS: Array<{ key: CardGroup | "skills"; label: Record<string, string> }> = [
  { key: "profile", label: { en: "Profile", zhHans: "个人信息", zhHant: "個人資訊" } },
  { key: "education", label: { en: "Education", zhHans: "教育", zhHant: "教育" } },
  { key: "internship", label: { en: "Internships", zhHans: "实习", zhHant: "實習" } },
  { key: "project", label: { en: "Projects", zhHans: "项目", zhHant: "項目" } },
  { key: "skills", label: { en: "Skills", zhHans: "技能", zhHant: "技能" } },
];

export function MobileListView({
  portfolio,
  activeFilter,
  matchedCardIds,
  onFilterClick,
  onOpenDetails,
}: Props) {
  const { locale, t } = useLocale();
  const [tab, setTab] = useState<CardGroup | "skills">("profile");

  const cards = useMemo(
    () => portfolio.cards.filter((card) => card.group === tab),
    [portfolio.cards, tab]
  );

  return (
    <div className="min-w-0 px-4 pb-24 pt-3">
      <div
        role="tablist"
        aria-label={locale === "en" ? "Section" : "分区"}
        className="thin-scroll sticky top-0 z-10 -mx-4 flex gap-1 overflow-x-auto bg-bg-outer/90 px-4 py-2 backdrop-blur"
      >
        {TABS.map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setTab(item.key)}
              className={classNames(
                "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-mono transition-colors",
                active
                  ? "border-navy bg-navy text-white"
                  : "border-border-soft bg-white text-text-muted"
              )}
            >
              {item.label[locale]}
            </button>
          );
        })}
      </div>

      {tab === "skills" ? (
        <div className="mt-3 space-y-5">
          {portfolio.skillTracks.map((track) => {
            const trackActive = activeFilter?.kind === "track" && activeFilter.id === track.id;
            const skillIds = new Set(
              portfolio.cards
                .filter((card) => card.trackIds.includes(track.id))
                .flatMap((card) => card.skills)
            );
            const skills = portfolio.skills.filter((skill) => skillIds.has(skill.id));
            return (
              <section key={track.id} className="border-t border-border-soft pt-4 first:border-t-0 first:pt-0">
                <button
                  type="button"
                  aria-pressed={trackActive}
                  onClick={() => onFilterClick({ kind: "track", id: track.id })}
                  className={classNames(
                    "w-full rounded-md border px-3 py-2 text-left text-sm font-semibold transition-colors",
                    trackActive
                      ? "border-navy bg-navy text-white"
                      : "border-navy/35 bg-white text-navy"
                  )}
                >
                  {t(track.label)}
                </button>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  {track.keywords.map((keyword) => t(keyword)).join(" · ")}
                </p>
                {skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((skill) => {
                      const active = activeFilter?.kind === "skill" && activeFilter.id === skill.id;
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => onFilterClick({ kind: "skill", id: skill.id })}
                          aria-pressed={active}
                          className={classNames(
                            "rounded-full border px-2.5 py-1 text-[11px] font-mono transition-colors",
                            active
                              ? "border-navy bg-navy text-white"
                              : "border-border-soft bg-white text-text-muted"
                          )}
                        >
                          {t(skill.label)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {cards.map((card) => {
            const isDimmed = matchedCardIds ? !matchedCardIds.has(card.id) : false;
            const titleText = t(card.title);
            const subtitleText = t(card.subtitle);
            const roleText = t(card.role);
            const summaryText = visibleSummary(t(card.summary), titleText, subtitleText, roleText);
            const tracks = card.trackIds
              .map((id) => portfolio.skillTracks.find((track) => track.id === id))
              .filter((track): track is NonNullable<typeof track> => Boolean(track));
            const skills = card.skills
              .map((id) => portfolio.skills.find((skill) => skill.id === id))
              .filter((skill): skill is NonNullable<typeof skill> => Boolean(skill));
            return (
              <li
                key={card.id}
                className={classNames(
                  "rounded-lg border border-solid border-border-soft bg-card-bg p-4 shadow-card transition-opacity",
                  isDimmed && "opacity-30"
                )}
              >
                <p className="text-[10px] font-mono uppercase text-text-muted">
                  {t(card.timeLabel)}
                </p>
                <h3 className="font-title font-title-strong mt-1 break-words text-[18px] leading-snug text-text-main">
                  {titleText}
                </h3>
                {card.subtitle && (
                  <p className="font-title mt-0.5 break-words text-sm leading-snug text-text-muted">
                    {subtitleText}
                  </p>
                )}
                {card.role && (
                  <p className="mt-1 break-words text-xs font-semibold leading-snug text-navy">
                    {roleText}
                  </p>
                )}
                {summaryText && (
                  <p className="mt-2 text-[15px] leading-relaxed text-text-main/90">
                    {summaryText}
                  </p>
                )}
                {tracks.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tracks.map((track) => (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => onFilterClick({ kind: "track", id: track.id })}
                        className="rounded border border-navy/35 bg-navy/5 px-2 py-0.5 text-[10px] font-semibold text-navy"
                      >
                        {t(track.label)}
                      </button>
                    ))}
                  </div>
                )}
                {skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {skills.map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => onFilterClick({ kind: "skill", id: skill.id })}
                        className="rounded-full border border-border-soft px-2 py-0.5 text-[10px] font-mono text-text-muted"
                      >
                        {t(skill.label)}
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => onOpenDetails(card.id)}
                    className="rounded-md border border-navy px-3 py-1 font-mono text-[11px] uppercase text-navy"
                  >
                    {t({ en: "Expand Details", zhHans: "查看详情", zhHant: "查看詳情" })}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

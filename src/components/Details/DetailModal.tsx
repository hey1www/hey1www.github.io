import { useEffect, useRef } from "react";
import { useLocale } from "../../i18n/useLocale";
import type { Card, DetailSection, LocaleText, Portfolio } from "../../types/portfolio";
import { useResponsiveMode } from "../../hooks/useResponsiveMode";
import { classNames } from "../../utils/classNames";

type Props = {
  card: Card;
  portfolio: Portfolio;
  onClose: () => void;
};

const LABELS = {
  overview: { en: "Overview", zhHans: "概述", zhHant: "概述" } satisfies LocaleText,
  whatIDid: { en: "What I did", zhHans: "做了什么", zhHant: "做了什麼" } satisfies LocaleText,
  tech: { en: "Tech", zhHans: "技术栈", zhHant: "技術棧" } satisfies LocaleText,
  outcomes: { en: "Outcomes", zhHans: "产出与指标", zhHant: "產出與指標" } satisfies LocaleText,
  contact: { en: "Contact", zhHans: "联系方式", zhHant: "聯絡方式" } satisfies LocaleText,
};

export function DetailModal({ card, portfolio, onClose }: Props) {
  const { t } = useLocale();
  const mode = useResponsiveMode();
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = drawerRef.current;
    if (!node) return;
    node.querySelector<HTMLButtonElement>("[data-autofocus]")?.focus();
    return () => previous?.focus();
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const skills = card.skills
    .map((id) => portfolio.skills.find((skill) => skill.id === id))
    .filter((skill): skill is NonNullable<typeof skill> => Boolean(skill));
  const tracks = card.trackIds
    .map((id) => portfolio.skillTracks.find((track) => track.id === id))
    .filter((track): track is NonNullable<typeof track> => Boolean(track));
  const sections = card.details.sections ?? [];
  const hasStructuredSections = sections.length > 0;
  const isMobile = mode === "mobile";
  const isProfile = card.group === "profile";

  const containerClass = classNames(
    "fixed z-50 flex flex-col bg-white shadow-2xl font-sans-cjk",
    isMobile
      ? "inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl"
      : "right-0 top-0 h-full w-[50vw] border-l border-border-soft"
  );

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="detail-title" className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label={t({ en: "Close details", zhHans: "关闭详情", zhHant: "關閉詳情" })}
        onClick={onClose}
        className="absolute inset-0 bg-navy/30 backdrop-blur-sm"
      />
      <div ref={drawerRef} className={containerClass} onClick={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between border-b border-border-soft px-6 pb-4 pt-5">
          <div className="min-w-0 pr-3">
            <p className="font-mono text-[11px] uppercase text-text-muted">{t(card.timeLabel)}</p>
            <h2 id="detail-title" className="font-title font-title-strong mt-1 break-words text-[27px] leading-snug text-text-main">
              {t(card.title)}
            </h2>
            {card.subtitle && (
              <p className="font-title mt-1 break-words text-[17px] leading-snug text-text-muted">
                {t(card.subtitle)}
              </p>
            )}
            {card.role && (
              <p className={classNames(
                "mt-2 break-words leading-snug text-navy",
                isProfile ? "text-[16px] font-semibold" : "font-mono text-[12px] uppercase"
              )}>
                {t(card.role)}
              </p>
            )}
          </div>
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-md text-lg text-text-muted transition-colors hover:bg-slate-100 hover:text-text-main"
            aria-label={t({ en: "Close", zhHans: "关闭", zhHant: "關閉" })}
          >
            ×
          </button>
        </header>

        <div className="thin-scroll flex-1 overflow-y-auto px-6 pb-6 pt-4">
          {hasStructuredSections ? (
            sections.map((section) => (
              <StructuredSection key={section.id} section={section} />
            ))
          ) : (
            <LegacyDetails card={card} />
          )}

          {(tracks.length > 0 || skills.length > 0) && (
            <section className="mt-6 border-t border-border-soft pt-5">
              <SectionTitle>{t({ en: "Capabilities", zhHans: "能力与技能", zhHant: "能力與技能" })}</SectionTitle>
              {tracks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tracks.map((track) => (
                    <span key={track.id} className="rounded border border-navy/35 bg-navy/5 px-2.5 py-1 text-[11px] font-semibold text-navy">
                      {t(track.label)}
                    </span>
                  ))}
                </div>
              )}
              {skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span key={skill.id} className="rounded-full border border-border-soft bg-white px-2.5 py-1 font-mono text-[11px] text-text-muted">
                      {t(skill.label)}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {isProfile && (
            <section className="mt-6 border-t border-border-soft pt-5">
              <SectionTitle>{t(LABELS.contact)}</SectionTitle>
              <div className="mt-3 space-y-2 text-[14px]">
                <a href={`mailto:${portfolio.profile.email}`} className="block break-all text-navy hover:underline">
                  {portfolio.profile.email}
                </a>
                {portfolio.profile.github && <ExternalLink href={portfolio.profile.github}>GitHub</ExternalLink>}
                {portfolio.profile.linkedin && <ExternalLink href={portfolio.profile.linkedin}>LinkedIn</ExternalLink>}
              </div>
            </section>
          )}

          {!hasStructuredSections && !isProfile && card.details.links?.length ? (
            <section className="mt-5">
              <SectionTitle>{t({ en: "Links", zhHans: "相关链接", zhHant: "相關連結" })}</SectionTitle>
              <LinkList links={card.details.links} />
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StructuredSection({ section }: { section: DetailSection }) {
  const { t } = useLocale();
  return (
    <section className="mb-6 last:mb-0">
      <SectionTitle>{t(section.title)}</SectionTitle>
      {section.paragraphs?.map((paragraph, index) => (
        <p key={index} className="mt-2 text-[15px] leading-relaxed text-text-main/90">
          {t(paragraph)}
        </p>
      ))}
      {section.items?.length ? (
        <ul className="mt-2 space-y-2 text-[15px] leading-relaxed text-text-main/90">
          {section.items.map((item, index) => (
            <li key={index} className="flex gap-2">
              <span aria-hidden className="mt-2.5 h-1 w-1 flex-none rounded-full bg-navy" />
              <span>{t(item)}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {section.metrics?.length ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {section.metrics.map((metric, index) => (
            <div key={index} className="rounded-md border border-amber/30 bg-amber/5 px-3 py-2 font-mono text-[12px] leading-relaxed text-text-main">
              {t(metric)}
            </div>
          ))}
        </div>
      ) : null}
      {section.media?.map((media, index) => (
        <figure key={`${media.src}-${index}`} className="mt-4 overflow-hidden rounded-md border border-border-soft bg-bg-outer">
          <img src={media.src} alt={t(media.alt)} className="block h-auto w-full" loading="lazy" />
          {media.caption && <figcaption className="px-3 py-2 text-xs leading-relaxed text-text-muted">{t(media.caption)}</figcaption>}
        </figure>
      ))}
      {section.links?.length ? <LinkList links={section.links} /> : null}
    </section>
  );
}

function LegacyDetails({ card }: { card: Card }) {
  const { t } = useLocale();
  return (
    <>
      <section>
        <SectionTitle>{t(LABELS.overview)}</SectionTitle>
        <p className="mt-2 text-[14px] leading-relaxed text-text-main/90">{t(card.details.overview)}</p>
      </section>
      {card.details.whatIDid?.length ? (
        <section className="mt-5">
          <SectionTitle>{t(LABELS.whatIDid)}</SectionTitle>
          <ul className="mt-2 space-y-2 text-[14px] leading-relaxed text-text-main/90">
            {card.details.whatIDid.map((line, index) => (
              <li key={index} className="flex gap-2"><span aria-hidden className="mt-2 h-1 w-1 flex-none rounded-full bg-navy" /><span>{t(line)}</span></li>
            ))}
          </ul>
        </section>
      ) : null}
      {card.details.tech && <section className="mt-5"><SectionTitle>{t(LABELS.tech)}</SectionTitle><p className="mt-2 text-[13px] leading-relaxed text-text-muted">{t(card.details.tech)}</p></section>}
      {card.details.outcomes?.length ? (
        <section className="mt-5"><SectionTitle>{t(LABELS.outcomes)}</SectionTitle><ul className="mt-2 space-y-1.5 text-[14px] leading-relaxed text-text-main/90">{card.details.outcomes.map((line, index) => <li key={index}>{t(line)}</li>)}</ul></section>
      ) : null}
    </>
  );
}

function LinkList({ links }: { links: NonNullable<Card["details"]["links"]> }) {
  const { t } = useLocale();
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {links.map((link, index) => (
        <a key={`${link.url}-${index}`} href={link.url} target="_blank" rel="noreferrer noopener" className="rounded-md border border-navy bg-navy px-3 py-1.5 font-mono text-xs text-white transition-colors hover:bg-[#16304f]">
          {t(link.label)} ↗
        </a>
      ))}
    </div>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer noopener" className="block text-navy hover:underline">{children} ↗</a>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-title font-title-strong text-[19px] leading-snug text-text-main">{children}</h3>;
}

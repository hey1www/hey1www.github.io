import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "../../i18n/useLocale";
import type {
  Card,
  DetailGroup,
  DetailSection,
  FeaturedProject,
  LocaleText,
  Portfolio,
  ProjectMetric,
} from "../../types/portfolio";
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
  independentRole: { en: "Independent role", zhHans: "个人角色", zhHant: "個人角色" } satisfies LocaleText,
};

const FEATURED_ANCHORS: Array<{ id: string; label: LocaleText }> = [
  { id: "overview", label: { en: "Overview", zhHans: "概览", zhHant: "概覽" } },
  { id: "problem", label: { en: "Technical Route", zhHans: "技术路线", zhHant: "技術路線" } },
  { id: "results", label: { en: "Results", zhHans: "实验结果", zhHant: "實驗結果" } },
  { id: "reliability", label: { en: "Engineering", zhHans: "工程化", zhHant: "工程化" } },
];

export function DetailModal({ card, portfolio, onClose }: Props) {
  const { t } = useLocale();
  const mode = useResponsiveMode();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeAnchor, setActiveAnchor] = useState("overview");

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
  const featured = card.featuredProject;
  const isMobile = mode === "mobile";
  const isProfile = card.group === "profile";
  const headerLinks = !isProfile ? card.details.links : undefined;

  const updateActiveAnchor = useCallback(() => {
    const root = scrollRef.current;
    if (!root || !featured) return;
    const rootTop = root.getBoundingClientRect().top;
    let current = FEATURED_ANCHORS[0].id;
    for (const anchor of FEATURED_ANCHORS) {
      const section = root.querySelector<HTMLElement>(`[data-detail-section="${anchor.id}"]`);
      if (section && section.getBoundingClientRect().top - rootTop <= 120) current = anchor.id;
    }
    setActiveAnchor(current);
  }, [featured]);

  const scrollToSection = useCallback((id: string) => {
    const root = scrollRef.current;
    const section = root?.querySelector<HTMLElement>(`[data-detail-section="${id}"]`);
    if (!root || !section) return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    root.scrollTo({
      top: Math.max(0, section.offsetTop - 18),
      behavior: reduceMotion ? "auto" : "smooth",
    });
    setActiveAnchor(id);
  }, []);

  const containerClass = classNames(
    "fixed z-50 flex flex-col bg-white shadow-2xl font-sans-cjk",
    isMobile ? "inset-0" : "right-0 top-0 h-full border-l border-border-soft"
  );

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="detail-title" className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label={t({ en: "Close details", zhHans: "关闭详情", zhHant: "關閉詳情" })}
        onClick={onClose}
        className="absolute inset-0 bg-navy/30 backdrop-blur-sm"
      />
      <div
        ref={drawerRef}
        className={containerClass}
        style={isMobile ? undefined : { width: "clamp(760px, 62vw, 1080px)" }}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex flex-none items-start justify-between border-b border-border-soft px-5 pb-4 pt-5 sm:px-7">
          <div className="min-w-0 flex-1 pr-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.04em] text-text-muted">{t(card.timeLabel)}</p>
            <h2 id="detail-title" className="font-title font-title-strong mt-1 break-words text-[27px] leading-snug text-text-main sm:text-[30px]">
              {t(card.title)}
            </h2>
            {featured ? (
              <>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                  {card.subtitle && (
                    <p className="mr-auto font-title text-[17px] leading-snug text-text-muted">{t(card.subtitle)}</p>
                  )}
                  {headerLinks?.length ? <LinkList links={headerLinks} compact /> : null}
                </div>
                <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-navy">{t(featured.category)}</p>
                <p className="mt-2 max-w-[760px] text-[13px] leading-relaxed text-text-muted">{t(featured.ownership)}</p>
              </>
            ) : (
              <>
                {(card.subtitle || headerLinks?.length) && (
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {card.subtitle && (
                      <p className="mr-auto break-words font-title text-[17px] leading-snug text-text-muted">{t(card.subtitle)}</p>
                    )}
                    {headerLinks?.length ? <LinkList links={headerLinks} compact /> : null}
                  </div>
                )}
                {card.role && (
                  <p className={classNames("mt-2 break-words leading-snug text-navy", isProfile ? "text-[16px] font-semibold" : "font-mono text-[12px] uppercase")}>
                    {t(card.role)}
                  </p>
                )}
              </>
            )}
          </div>
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            className="flex h-10 w-10 flex-none items-center justify-center rounded-md border border-border-soft text-xl text-text-muted transition-colors hover:bg-slate-100 hover:text-text-main"
            aria-label={t({ en: "Close", zhHans: "关闭", zhHant: "關閉" })}
          >
            ×
          </button>
        </header>

        {featured && (
          <nav aria-label={t({ en: "Project sections", zhHans: "项目章节", zhHant: "專案章節" })} className="thin-scroll flex flex-none gap-1 overflow-x-auto border-b border-border-soft bg-white px-5 py-2.5 sm:px-7">
            {FEATURED_ANCHORS.map((anchor) => (
              <button
                key={anchor.id}
                type="button"
                aria-current={activeAnchor === anchor.id ? "location" : undefined}
                onClick={() => scrollToSection(anchor.id)}
                className={classNames(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                  activeAnchor === anchor.id ? "bg-navy text-white" : "text-text-muted hover:bg-navy/5 hover:text-navy"
                )}
              >
                {t(anchor.label)}
              </button>
            ))}
          </nav>
        )}

        <div ref={scrollRef} onScroll={updateActiveAnchor} className="thin-scroll flex-1 overflow-y-auto px-5 pb-10 pt-6 sm:px-7">
          {hasStructuredSections ? (
            sections.map((section) => (
              <StructuredSection key={section.id} section={section} featured={featured} />
            ))
          ) : (
            <LegacyDetails card={card} />
          )}

          {!featured && (tracks.length > 0 || skills.length > 0) && (
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

function StructuredSection({ section, featured }: { section: DetailSection; featured?: FeaturedProject }) {
  const { t } = useLocale();
  const wide = ["process", "comparison", "metrics", "cards", "stack"].includes(section.variant ?? "standard");
  const resultMetrics = section.variant === "metrics"
    ? [...(featured?.detailMetrics ?? []), ...(section.projectMetrics ?? [])]
    : section.projectMetrics ?? [];

  return (
    <section
      data-detail-section={section.id}
      className={classNames("mb-11 last:mb-0", wide ? "max-w-none" : "mx-auto max-w-[780px]")}
    >
      <SectionTitle>{t(section.title)}</SectionTitle>

      {section.paragraphs?.map((paragraph, index) => (
        <p key={index} className="mt-2.5 text-[15px] leading-[1.8] text-text-main/90">
          {t(paragraph)}
        </p>
      ))}

      {section.variant === "hero" && featured && (
        <>
          <div className="mt-5 rounded-lg border border-navy/15 bg-navy/[0.035] p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-amber">{t(LABELS.independentRole)}</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-text-main/90">{t(featured.ownership)}</p>
          </div>
          <ProjectMetricGrid metrics={featured.detailMetrics} layout="hero" />
        </>
      )}

      {section.variant === "process" && section.groups?.length ? <ProcessFlow groups={section.groups} /> : null}

      {section.variant === "comparison" && section.groups?.length ? (
        <Comparison groups={section.groups} callout={section.callout} />
      ) : null}

      {section.variant === "metrics" && resultMetrics.length ? (
        <ProjectMetricGrid metrics={resultMetrics} layout="results" />
      ) : null}

      {section.variant === "cards" && section.groups?.length ? <GroupCards groups={section.groups} /> : null}

      {section.variant === "stack" && section.groups?.length ? <StackGroups groups={section.groups} /> : null}

      {(!section.variant || section.variant === "standard") && section.items?.length ? (
        <BulletList items={section.items} />
      ) : null}

      {(!section.variant || section.variant === "standard") && section.metrics?.length ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {section.metrics.map((metricText, index) => (
            <div key={index} className="rounded-md border border-amber/30 bg-amber/5 px-3 py-2 font-mono text-[12px] leading-relaxed text-text-main">
              {t(metricText)}
            </div>
          ))}
        </div>
      ) : null}

      {(!section.variant || section.variant === "standard") && section.groups?.length ? <GroupCards groups={section.groups} /> : null}

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

function ProjectMetricGrid({ metrics, layout }: { metrics: ProjectMetric[]; layout: "hero" | "results" }) {
  return (
    <div className={classNames("mt-5 grid gap-3", layout === "hero" ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3")}>
      {metrics.map((metric) => <ProjectMetricCard key={metric.id} metric={metric} />)}
    </div>
  );
}

function ProjectMetricCard({ metric }: { metric: ProjectMetric }) {
  const { t } = useLocale();
  return (
    <article className="relative rounded-lg border border-border-soft bg-slate-50/70 px-4 pb-4 pt-5 shadow-sm">
      <span aria-hidden className="absolute left-4 top-0 h-[3px] w-9 rounded-b bg-amber" />
      <div className="flex items-start justify-between gap-3">
        <p className="font-title text-[29px] font-bold leading-none text-navy">{t(metric.value)}</p>
        {metric.tooltip && (
          <span className="group relative flex-none">
            <button
              type="button"
              aria-label={t({ en: `Explain ${metric.label.en}`, zhHans: `解释${metric.label.zhHans}`, zhHant: `解釋${metric.label.zhHant}` })}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-border-soft bg-white font-mono text-[10px] font-bold text-text-muted hover:border-navy hover:text-navy"
            >
              i
            </button>
            <span role="tooltip" className="pointer-events-none absolute right-0 top-7 z-20 w-64 rounded-md bg-text-main px-3 py-2 text-left text-[11px] font-normal leading-relaxed text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              {t(metric.tooltip)}
            </span>
          </span>
        )}
      </div>
      <p className="mt-2 text-[13px] font-bold leading-snug text-text-main">{t(metric.label)}</p>
      <p className="mt-1 text-[12px] leading-relaxed text-text-muted">{t(metric.note)}</p>
    </article>
  );
}

function ProcessFlow({ groups }: { groups: DetailGroup[] }) {
  const { t } = useLocale();
  return (
    <ol className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {groups.map((group, index) => (
        <li key={group.id} className="relative rounded-lg border border-border-soft bg-white p-3.5 shadow-sm">
          <span className="font-mono text-[10px] font-bold text-amber">{String(index + 1).padStart(2, "0")}</span>
          <h4 className="font-title mt-1 text-[15px] font-bold leading-snug text-navy">{t(group.title)}</h4>
          <p className="mt-1.5 text-[12px] leading-relaxed text-text-muted">{group.items.map((item) => t(item)).join(" · ")}</p>
        </li>
      ))}
    </ol>
  );
}

function Comparison({ groups, callout }: { groups: DetailGroup[]; callout?: LocaleText }) {
  const { t } = useLocale();
  return (
    <div className="mt-5">
      {callout && (
        <div className="mx-auto mb-4 w-fit rounded-full border border-amber/30 bg-amber/10 px-4 py-2 text-center font-mono text-[12px] font-bold text-amber">
          {t(callout)}
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map((group, index) => (
          <article key={group.id} className={classNames("rounded-lg border p-4", index === 0 ? "border-slate-300 bg-slate-50" : "border-navy/25 bg-navy/[0.035]")}>
            <p className={classNames("font-mono text-[10px] font-bold uppercase tracking-[0.08em]", index === 0 ? "text-text-muted" : "text-amber")}>
              {index === 0 ? "BEFORE" : "AFTER"}
            </p>
            <h4 className="font-title mt-1 text-[18px] font-bold leading-snug text-navy">{t(group.title)}</h4>
            <BulletList items={group.items} compact />
          </article>
        ))}
      </div>
    </div>
  );
}

function GroupCards({ groups }: { groups: DetailGroup[] }) {
  const { t } = useLocale();
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {groups.map((group) => (
        <article key={group.id} className="rounded-lg border border-border-soft bg-slate-50/55 p-4">
          <h4 className="font-title text-[16px] font-bold leading-snug text-navy">{t(group.title)}</h4>
          <BulletList items={group.items} compact />
        </article>
      ))}
    </div>
  );
}

function StackGroups({ groups }: { groups: DetailGroup[] }) {
  const { t } = useLocale();
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {groups.map((group) => (
        <article key={group.id} className="rounded-lg border border-border-soft bg-white p-4">
          <h4 className="font-title text-[16px] font-bold text-navy">{t(group.title)}</h4>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {group.items.map((item, index) => (
              <span key={index} className="rounded-full border border-navy/15 bg-navy/5 px-2.5 py-1 font-mono text-[11px] text-navy">
                {t(item)}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function BulletList({ items, compact = false }: { items: LocaleText[]; compact?: boolean }) {
  const { t } = useLocale();
  return (
    <ul className={classNames("space-y-2 leading-relaxed text-text-main/90", compact ? "mt-3 text-[13px]" : "mt-2 text-[15px]")}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-2">
          <span aria-hidden className="mt-2.5 h-1 w-1 flex-none rounded-full bg-navy" />
          <span>{t(item)}</span>
        </li>
      ))}
    </ul>
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
          <BulletList items={card.details.whatIDid} />
        </section>
      ) : null}
      {card.details.tech && <section className="mt-5"><SectionTitle>{t(LABELS.tech)}</SectionTitle><p className="mt-2 text-[13px] leading-relaxed text-text-muted">{t(card.details.tech)}</p></section>}
      {card.details.outcomes?.length ? (
        <section className="mt-5"><SectionTitle>{t(LABELS.outcomes)}</SectionTitle><ul className="mt-2 space-y-1.5 text-[14px] leading-relaxed text-text-main/90">{card.details.outcomes.map((line, index) => <li key={index}>{t(line)}</li>)}</ul></section>
      ) : null}
    </>
  );
}

function LinkList({ links, compact = false }: { links: NonNullable<Card["details"]["links"]>; compact?: boolean }) {
  const { t } = useLocale();
  return (
    <div className={classNames("flex flex-wrap gap-2", compact ? "ml-auto justify-end" : "mt-3")}>
      {links.map((link, index) => (
        <a key={`${link.url}-${index}`} href={link.url} target="_blank" rel="noreferrer noopener" className={classNames("whitespace-nowrap rounded-md border border-navy bg-navy font-mono text-white transition-colors hover:bg-[#16304f]", compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs")}>
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
  return <h3 className="font-title font-title-strong text-[21px] leading-snug text-text-main sm:text-[23px]">{children}</h3>;
}

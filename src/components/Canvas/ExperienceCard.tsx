import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { useLocale } from "../../i18n/useLocale";
import { classNames } from "../../utils/classNames";
import type { Card, LocaleText, Portfolio, SkillFilter } from "../../types/portfolio";
import { visibleSummary } from "../../utils/text";
import { SkillTag } from "./SkillTag";

type Props = {
  card: Card;
  portfolio: Portfolio;
  isActive: boolean;
  isDimmed: boolean;
  isHighlighted: boolean;
  activeFilter: SkillFilter;
  onOpenDetails: () => void;
  onFilterClick: (filter: Exclude<SkillFilter, null>) => void;
  onSelect: () => void;
  editable?: boolean;
  viewportScale: number;
  onMeasuredSize?: (id: string, size: Card["size"]) => void;
  onCardChange?: (id: string, patch: Partial<Pick<Card, "position" | "size">>) => void;
};

const EXPAND_LABEL: LocaleText = {
  en: "Expand Details",
  zhHans: "查看详情",
  zhHant: "查看詳情",
};

export function ExperienceCard({
  card,
  portfolio,
  isActive,
  isDimmed,
  isHighlighted,
  activeFilter,
  onOpenDetails,
  onFilterClick,
  onSelect,
  editable = false,
  viewportScale,
  onMeasuredSize,
  onCardChange,
}: Props) {
  const { locale, t } = useLocale();
  const interactionRef = useRef<{
    type: "move" | "resize";
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const cardRef = useRef<HTMLElement | null>(null);
  const skills = card.skills
    .map((id) => portfolio.skills.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const tracks = card.trackIds
    .map((id) => portfolio.skillTracks.find((track) => track.id === id))
    .filter((track): track is NonNullable<typeof track> => Boolean(track));

  const emphasis = card.emphasis ?? "normal";
  const titleText = t(card.title);
  const subtitleText = t(card.subtitle);
  const roleText = t(card.role);
  const isProfile = card.group === "profile";
  const displayTitleText = isProfile && locale === "en" ? subtitleText || titleText : titleText;
  const showSubtitle = Boolean(card.subtitle) && (!isProfile || locale !== "en");
  const summaryText = visibleSummary(t(card.summary), titleText, subtitleText, roleText);
  const emphasisRing =
    emphasis === "primary"
      ? "ring-2 ring-navy/15"
      : emphasis === "secondary"
      ? "ring-1 ring-border-soft"
      : "";

  // FYP card (project + primary) is the graduation project; surface a
  // localised label instead of a generic emphasis tag.
  const isFyp = card.group === "project" && emphasis === "primary";
  const badgeLabel: LocaleText | null = isFyp
    ? { en: "Final Year Project", zhHans: "毕业设计", zhHant: "畢業設計" }
    : null;
  const summaryLines = Math.max(2, Math.min(4, Math.floor((card.size.height - 220) / 24)));
  const cardStyle = {
    left: card.position.x,
    top: card.position.y,
    width: card.size.width,
    height: editable ? card.size.height : undefined,
    borderColor: isActive || isHighlighted ? "#1E3A5F" : undefined,
  } satisfies CSSProperties;

  useEffect(() => {
    if (editable || !onMeasuredSize || !cardRef.current) return;
    const element = cardRef.current;
    const reportSize = () => {
      onMeasuredSize(card.id, {
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    };
    reportSize();
    const observer = new ResizeObserver(reportSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [card.id, editable, onMeasuredSize]);

  function startInteraction(e: PointerEvent<HTMLElement>, type: "move" | "resize") {
    if (!editable || !onCardChange || e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (
      type === "move" &&
      target.closest("button, a, input, textarea, select, [data-resize-handle]")
    ) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    interactionRef.current = {
      type,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: card.position.x,
      startY: card.position.y,
      startWidth: card.size.width,
      startHeight: card.size.height,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function updateInteraction(e: PointerEvent<HTMLElement>) {
    const interaction = interactionRef.current;
    if (!interaction || interaction.pointerId !== e.pointerId || !onCardChange) return;
    e.preventDefault();
    e.stopPropagation();
    const scale = Math.max(viewportScale || 1, 0.1);
    const dx = (e.clientX - interaction.startClientX) / scale;
    const dy = (e.clientY - interaction.startClientY) / scale;
    if (Math.hypot(dx, dy) > 1.5) {
      interaction.moved = true;
      suppressClickRef.current = true;
    }
    if (interaction.type === "move") {
      onCardChange(card.id, {
        position: {
          x: Math.round(interaction.startX + dx),
          y: Math.round(interaction.startY + dy),
        },
      });
      return;
    }
    onCardChange(card.id, {
      size: {
        width: Math.max(260, Math.round(interaction.startWidth + dx)),
        height: Math.max(170, Math.round(interaction.startHeight + dy)),
      },
    });
  }

  function finishInteraction(e: PointerEvent<HTMLElement>) {
    const interaction = interactionRef.current;
    if (!interaction || interaction.pointerId !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Pointer capture may already be released if the browser cancelled it.
    }
    interactionRef.current = null;
  }

  return (
    <article
      ref={cardRef}
      data-card-id={card.id}
      onPointerDown={(e) => startInteraction(e, "move")}
      onPointerMove={updateInteraction}
      onPointerUp={finishInteraction}
      onPointerCancel={finishInteraction}
      onClick={(e) => {
        e.stopPropagation();
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          return;
        }
        onSelect();
      }}
      className={classNames(
        "experience-card absolute flex select-none flex-col overflow-hidden rounded-lg border-[1.5px] border-solid bg-card-bg p-[18px] shadow-card transition-all font-sans-cjk",
        editable && "cursor-move",
        emphasisRing,
        isProfile && "border-solid border-navy/40",
        isActive && "border-navy shadow-card-hover",
        isHighlighted && "border-navy shadow-card-hover",
        isDimmed && "card--dimmed opacity-25 saturate-[0.6]"
      )}
      style={cardStyle}
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase text-text-muted">
        <span>{t(card.timeLabel)}</span>
        {badgeLabel && (
          <span className="rounded-full bg-amber/10 px-2 py-0.5 text-[11px] text-amber">
            {t(badgeLabel)}
          </span>
        )}
      </div>

      <h3 className="font-title font-title-strong mt-1.5 text-[23px] leading-[1.2] text-text-main">
        {displayTitleText}
      </h3>
      {showSubtitle && (
        <p className="font-title mt-1 text-[15px] leading-snug text-text-muted">
          {subtitleText}
        </p>
      )}
      {card.role && (
        <p className={classNames(
          "mt-1 text-navy",
          isProfile ? "text-[15px] font-semibold leading-snug" : "font-mono text-[11px] uppercase"
        )}>
          {roleText}
        </p>
      )}

      {summaryText && (
        <p
          className="mt-2 min-h-0 text-[14px] leading-[1.5] text-text-main/90"
          style={{
            ...(editable
              ? {
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: summaryLines,
                  overflow: "hidden",
                }
              : undefined),
          }}
        >
          {summaryText}
        </p>
      )}

      {tracks.length > 0 && (
        <div className="mt-2 flex flex-none flex-wrap gap-1">
          {tracks.map((track) => {
            const active = activeFilter?.kind === "track" && activeFilter.id === track.id;
            return (
              <button
                key={track.id}
                type="button"
                aria-pressed={active}
                onClick={(e) => {
                  e.stopPropagation();
                  onFilterClick({ kind: "track", id: track.id });
                }}
                className={classNames(
                  "rounded border px-2 py-0.5 text-[10px] font-semibold leading-4 transition-colors",
                  active
                    ? "border-navy bg-navy text-white"
                    : "border-navy/35 bg-navy/5 text-navy hover:border-navy"
                )}
              >
                {t(track.label)}
              </button>
            );
          })}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mt-2 flex flex-none flex-wrap gap-1">
          {skills.map((s) => (
            <SkillTag
              key={s.id}
              skill={s}
              active={activeFilter?.kind === "skill" && activeFilter.id === s.id}
              onClick={() => onFilterClick({ kind: "skill", id: s.id })}
            />
          ))}
        </div>
      )}

      <div className={classNames(
        "flex items-center justify-end pt-3",
        editable ? "mt-auto" : "mt-2"
      )}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails();
          }}
          className="rounded-md border border-navy px-3 py-1.5 font-mono text-[11px] uppercase text-navy transition-colors hover:bg-navy hover:text-white"
        >
          {t(EXPAND_LABEL)}
        </button>
      </div>
      {editable && (
        <div
          data-resize-handle
          onPointerDown={(e) => startInteraction(e, "resize")}
          onPointerMove={updateInteraction}
          onPointerUp={finishInteraction}
          onPointerCancel={finishInteraction}
          className="absolute bottom-1.5 right-1.5 h-5 w-5 cursor-nwse-resize rounded-sm bg-white/70"
          aria-hidden="true"
          title="Resize card"
        >
          <span className="absolute bottom-1 right-1 h-3 w-3 border-b-2 border-r-2 border-navy/45" />
        </div>
      )}
    </article>
  );
}

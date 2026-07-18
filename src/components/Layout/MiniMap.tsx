import { useMemo, useRef } from "react";
import type { CardGroup, Portfolio } from "../../types/portfolio";
import { useLocale } from "../../i18n/useLocale";
import type { CardBoundsMap } from "../../hooks/useCardRegistry";
import { classNames } from "../../utils/classNames";

const GROUP_COLORS: Record<CardGroup, string> = {
  profile: "#94a3b8",
  education: "#2563EB",
  internship: "#0F766E",
  project: "#D97706",
};

type Props = {
  portfolio: Portfolio;
  boundsByCard: CardBoundsMap;
  viewport: { x: number; y: number; width: number; height: number; scale: number };
  onRecenter: (worldPoint: { x: number; y: number }) => void;
};

const MAP_W = 240;
const MAP_H = 160;
const PADDING = 12;

/**
 * Read-only minimap. Shows a thumbnail of every card and a rectangle
 * representing the current viewport. Clicking the map recenters the
 * canvas; the rectangle itself is not draggable in v1 (reserved for
 * future expansion).
 */
export function MiniMap({ portfolio, boundsByCard, viewport, onRecenter }: Props) {
  const { locale } = useLocale();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const layout = useMemo(() => {
    if (!portfolio.cards.length) {
      return { scale: 1, offsetX: 0, offsetY: 0, worldW: 1, worldH: 1 };
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const c of portfolio.cards) {
      const b = boundsByCard[c.id];
      if (!b) continue;
      if (b.x < minX) minX = b.x;
      if (b.y < minY) minY = b.y;
      if (b.x + b.width > maxX) maxX = b.x + b.width;
      if (b.y + b.height > maxY) maxY = b.y + b.height;
    }
    const worldW = Math.max(1, maxX - minX);
    const worldH = Math.max(1, maxY - minY);
    const innerW = MAP_W - PADDING * 2;
    const innerH = MAP_H - PADDING * 2;
    const scale = Math.min(innerW / worldW, innerH / worldH);
    const offsetX = PADDING - minX * scale;
    const offsetY = PADDING - minY * scale;
    return { scale, offsetX, offsetY, worldW, worldH };
  }, [portfolio, boundsByCard]);

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const worldX = (clickX - layout.offsetX) / layout.scale;
    const worldY = (clickY - layout.offsetY) / layout.scale;
    onRecenter({ x: worldX, y: worldY });
  }

  // Viewport rect in world coordinates.
  const viewWorldX = (-viewport.x) / viewport.scale;
  const viewWorldY = (-viewport.y) / viewport.scale;
  const viewWorldW = viewport.width / viewport.scale;
  const viewWorldH = viewport.height / viewport.scale;
  const rectX = viewWorldX * layout.scale + layout.offsetX;
  const rectY = viewWorldY * layout.scale + layout.offsetY;
  const rectW = viewWorldW * layout.scale;
  const rectH = viewWorldH * layout.scale;

  return (
    <div className="border-t border-border-soft bg-white/70 px-3 py-3">
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">
        <span>{locale === "en" ? "Minimap" : "缩略图"}</span>
        <span>{Math.round(viewport.scale * 100)}%</span>
      </div>
      <svg
        ref={svgRef}
        width={MAP_W}
        height={MAP_H}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        onClick={handleClick}
        className={classNames(
          "block rounded-md border border-border-soft bg-canvas-bg",
          "cursor-crosshair"
        )}
        role="img"
        aria-label={locale === "en" ? "Portfolio minimap" : "履历缩略图"}
      >
        {portfolio.cards.map((card) => {
          const b = boundsByCard[card.id];
          if (!b) return null;
          return (
            <rect
              key={card.id}
              x={b.x * layout.scale + layout.offsetX}
              y={b.y * layout.scale + layout.offsetY}
              width={Math.max(2, b.width * layout.scale)}
              height={Math.max(2, b.height * layout.scale)}
              rx={2}
              fill={GROUP_COLORS[card.group]}
              opacity={0.55}
            />
          );
        })}
        <rect
          x={rectX}
          y={rectY}
          width={Math.max(8, rectW)}
          height={Math.max(8, rectH)}
          rx={2}
          fill="none"
          stroke="#1E3A5F"
          strokeWidth={1.4}
          strokeDasharray="3 2"
        />
      </svg>
    </div>
  );
}

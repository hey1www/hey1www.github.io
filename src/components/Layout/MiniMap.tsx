import { useMemo, useRef, useState } from "react";
import type { CardGroup, Portfolio } from "../../types/portfolio";
import { useLocale } from "../../i18n/useLocale";
import type { CardBoundsMap } from "../../hooks/useCardRegistry";
import { classNames } from "../../utils/classNames";
import { ZoomControls } from "../Canvas/ZoomControls";

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
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

const MAP_W = 276;
const MAP_H = 160;
const PADDING = 12;

/**
 * Shows a thumbnail of every card and the current viewport. Pointer movement
 * previews a new viewport position; clicking commits that position to the
 * main canvas without changing its scale.
 */
export function MiniMap({
  portfolio,
  boundsByCard,
  viewport,
  onRecenter,
  onZoomIn,
  onZoomOut,
  onReset,
}: Props) {
  const { t } = useLocale();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [previewCenter, setPreviewCenter] = useState<{ x: number; y: number } | null>(null);

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

  function mapPointFromPointer(e: React.PointerEvent<SVGSVGElement> | React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: ((e.clientX - rect.left) / rect.width) * MAP_W,
      y: ((e.clientY - rect.top) / rect.height) * MAP_H,
    };
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const point = mapPointFromPointer(e);
    if (point) setPreviewCenter(point);
  }

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const point = previewCenter ?? mapPointFromPointer(e);
    if (!point) return;
    const worldX = (point.x - layout.offsetX) / layout.scale;
    const worldY = (point.y - layout.offsetY) / layout.scale;
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
  const displayRectX = previewCenter ? previewCenter.x - rectW / 2 : rectX;
  const displayRectY = previewCenter ? previewCenter.y - rectH / 2 : rectY;

  return (
    <div className="border-t border-border-soft bg-white/70 px-3 py-3">
      <div className="mb-1.5 flex items-center justify-between gap-2 font-mono uppercase text-text-muted">
        <span className="flex h-[30px] items-center text-[13px] font-semibold tracking-[0.08em]">
          {t({ en: "Minimap", zhHans: "缩略图", zhHant: "縮略圖" })}
        </span>
        <ZoomControls
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onReset={onReset}
          scale={viewport.scale}
        />
      </div>
      <svg
        ref={svgRef}
        width={MAP_W}
        height={MAP_H}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setPreviewCenter(null)}
        onClick={handleClick}
        className={classNames(
          "block rounded-md border border-border-soft bg-canvas-bg",
          "cursor-pointer"
        )}
        role="img"
        aria-label={t({ en: "Portfolio minimap", zhHans: "履历缩略图", zhHant: "履歷縮略圖" })}
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
          x={displayRectX}
          y={displayRectY}
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

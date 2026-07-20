import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Card, CardGroup, Portfolio, SkillFilter } from "../../types/portfolio";
import { CANVAS_LIMITS, useCanvasTransform, type CanvasTransform } from "../../hooks/useCanvasTransform";
import { useCardRegistry, type CardSizeMap } from "../../hooks/useCardRegistry";
import type { Point } from "../../utils/geometry";
import { ConnectionLayer } from "./ConnectionLayer";
import { TimelineAxis } from "./TimelineAxis";
import { TimelineRows } from "./TimelineRows";
import { useResponsiveMode } from "../../hooks/useResponsiveMode";
import { initialCanvasViewport } from "../../config/canvasLayout";

type Props = {
  portfolio: Portfolio;
  activeCardId: string | null;
  highlightedCardIds: Set<string> | null;
  activeFilter: SkillFilter;
  matchedConnectionIds: Set<string>;
  onOpenDetails: (id: string) => void;
  onSelectCard: (id: string) => void;
  onFilterClick: (filter: Exclude<SkillFilter, null>) => void;
  onClearFilter: () => void;
  onCardMount: (id: string, el: HTMLElement | null) => void;
  measuredCardSizes: CardSizeMap;
  onCardMeasure: (id: string, size: Card["size"]) => void;
  transform: CanvasTransform;
  onCenteredCardChange: (id: string | null) => void;
  editable?: boolean;
  onCardChange?: (id: string, patch: Partial<Pick<Card, "position" | "size">>) => void;
};

export function Canvas({
  portfolio,
  activeCardId,
  highlightedCardIds,
  activeFilter,
  matchedConnectionIds,
  onOpenDetails,
  onSelectCard,
  onFilterClick,
  onClearFilter,
  measuredCardSizes,
  onCardMeasure,
  transform,
  onCenteredCardChange,
  editable = false,
  onCardChange,
}: Props) {
  const { viewport, zoomAt, restoreInitialView, focusOnPoint, focusOnBounds } = transform;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{
    pointerId: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    moved: boolean;
  } | null>(null);
  const mode = useResponsiveMode();

  const { cardsById, cardsByGroup, groupBounds, allBounds } = useCardRegistry(
    portfolio,
    measuredCardSizes
  );

  // Track container size.
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    ro.observe(el);
    setContainerSize({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Initial framing: keep the profile card near the upper-left at a readable 60%.
  const didInitialFit = useRef(false);
  useEffect(() => {
    if (didInitialFit.current) return;
    if (!containerSize.width || !containerSize.height || !allBounds) return;
    transform.setViewport(initialCanvasViewport(containerSize));
    didInitialFit.current = true;
  }, [containerSize, allBounds, transform]);

  useEffect(() => {
    if (!didInitialFit.current) return;
    if (!containerSize.width || !containerSize.height) return;
    // The initial-fit effect and this size-sync effect run in the same commit.
    // Ignore the pre-fit viewport snapshot so it cannot overwrite the fitted scale.
    if (!viewport.width || !viewport.height) return;
    if (viewport.width === containerSize.width && viewport.height === containerSize.height) return;
    transform.setViewport({
      ...viewport,
      width: containerSize.width,
      height: containerSize.height,
    });
  }, [containerSize, viewport, transform]);

  // Detect the card nearest the viewport center so the sidebar can highlight it.
  useEffect(() => {
    if (!viewport.width || !cardsById) return;
    const cx = viewport.width / 2 - viewport.x;
    const cy = viewport.height / 2 - viewport.y;
    let bestId: string | null = null;
    let bestDist = Infinity;
    for (const sourceCard of portfolio.cards) {
      const card = cardsById[sourceCard.id] ?? sourceCard;
      const cardCx = card.position.x + card.size.width / 2;
      const cardCy = card.position.y + card.size.height / 2;
      // distance in canvas space
      const dx = (cardCx - cx / viewport.scale) * viewport.scale;
      const dy = (cardCy - cy / viewport.scale) * viewport.scale;
      const d = Math.hypot(dx, dy);
      if (d < bestDist) {
        bestDist = d;
        bestId = card.id;
      }
    }
    onCenteredCardChange(bestId);
  }, [viewport, portfolio.cards, cardsById, onCenteredCardChange]);

  // Native non-passive wheel listener keeps zoom immediate and allows the
  // canvas to prevent browser scrolling without Chrome console warnings.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      panStart.current = null;
      setIsPanning(false);
      const rect = element.getBoundingClientRect();
      const point: Point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const factor = e.deltaY < 0 ? 1 + CANVAS_LIMITS.ZOOM_STEP : 1 / (1 + CANVAS_LIMITS.ZOOM_STEP);
      zoomAt(point, factor);
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // A true background click clears the filter; a drag only pans the canvas.
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 || e.target !== e.currentTarget) return;
      setIsPanning(true);
      panStart.current = {
        pointerId: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        vx: viewport.x,
        vy: viewport.y,
        moved: false,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [viewport.x, viewport.y]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning || !panStart.current || panStart.current.pointerId !== e.pointerId) return;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      if (Math.hypot(dx, dy) > 4) panStart.current.moved = true;
      transform.setViewport({
        ...viewport,
        x: panStart.current.vx + dx,
        y: panStart.current.vy + dy,
      });
    },
    [isPanning, viewport, transform]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const candidate = panStart.current;
    if (!candidate || candidate.pointerId !== e.pointerId) return;
    if (!candidate.moved && e.target === e.currentTarget) onClearFilter();
    setIsPanning(false);
    panStart.current = null;
  }, [onClearFilter]);

  const onPointerCancel = useCallback((e: React.PointerEvent) => {
    if (panStart.current?.pointerId !== e.pointerId) return;
    setIsPanning(false);
    panStart.current = null;
  }, []);

  // Public: focus on a group (used by sidebar). Registered on the window
  // so the Sidebar component can call it without prop-drilling.
  useEffect(() => {
    (window as any).__heyi_focusGroup = (group: CardGroup) => {
      if (!cardsByGroup[group]?.length || !containerSize.width || !containerSize.height) return;
      const bounds = (() => {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const c of cardsByGroup[group]) {
          if (c.position.x < minX) minX = c.position.x;
          if (c.position.y < minY) minY = c.position.y;
          if (c.position.x + c.size.width > maxX) maxX = c.position.x + c.size.width;
          if (c.position.y + c.size.height > maxY) maxY = c.position.y + c.size.height;
        }
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      })();
      focusOnBounds(bounds, containerSize, { padding: 80, minScale: 0.45, maxScale: 1.1 });
    };
    (window as any).__heyi_focusCard = (id: string) => {
      const card = cardsById[id];
      if (!card || !containerSize.width || !containerSize.height) return;
      const bounds = {
        x: card.position.x,
        y: card.position.y,
        width: card.size.width,
        height: card.size.height,
      };
      focusOnBounds(bounds, containerSize, { padding: 60, minScale: 0.7, maxScale: 1.1 });
    };
  }, [cardsByGroup, cardsById, containerSize, focusOnBounds]);

  // Keyboard shortcuts.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        const cx = (containerSize.width || 0) / 2;
        const cy = (containerSize.height || 0) / 2;
        zoomAt({ x: cx, y: cy }, 1 + CANVAS_LIMITS.ZOOM_STEP, "smooth");
      } else if (e.key === "-") {
        e.preventDefault();
        const cx = (containerSize.width || 0) / 2;
        const cy = (containerSize.height || 0) / 2;
        zoomAt(
          { x: cx, y: cy },
          1 / (1 + CANVAS_LIMITS.ZOOM_STEP),
          "smooth"
        );
      } else if (e.key === "0") {
        e.preventDefault();
        restoreInitialView(containerSize);
      } else if ((e.key === "f" || e.key === "F") && activeCardId) {
        const card = cardsById[activeCardId];
        if (card) {
          focusOnPoint(
            { x: card.position.x + card.size.width / 2, y: card.position.y + card.size.height / 2 },
            containerSize,
            1.0
          );
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeCardId, cardsById, containerSize, focusOnPoint, restoreInitialView, zoomAt]);

  if (mode === "mobile") return null;

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      className={`canvas-grid relative h-full w-full overflow-hidden ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.scale})`,
          transformOrigin: "0 0",
          width: 1,
          height: 1,
        }}
      >
        <ConnectionLayer
          connections={portfolio.connections}
          cardsById={cardsById}
          highlighted={Boolean(highlightedCardIds)}
          activeFilter={activeFilter}
          matchedConnections={matchedConnectionIds}
        />
        <TimelineRows
          cards={portfolio.cards}
          portfolio={portfolio}
          activeCardId={activeCardId}
          highlightedCardIds={highlightedCardIds}
          activeFilter={activeFilter}
          onOpenDetails={onOpenDetails}
          onFilterClick={onFilterClick}
          onSelect={onSelectCard}
          editable={editable}
          viewportScale={viewport.scale}
          onCardMeasure={onCardMeasure}
          onCardChange={onCardChange}
        />
      </div>

      {/* Floating row-label overlay — stays glued to the viewport edge. */}
      <TimelineAxis viewport={viewport} groupBounds={groupBounds} />
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import type { Card, CardGroup, Portfolio, SkillFilter } from "./types/portfolio";
import { loadPortfolio } from "./data/portfolio";
import { useCanvasTransform } from "./hooks/useCanvasTransform";
import { useCardRegistry, type CardSizeMap } from "./hooks/useCardRegistry";
import { useSkillHighlight } from "./hooks/useSkillHighlight";
import { useResponsiveMode } from "./hooks/useResponsiveMode";
import { LocaleProvider } from "./i18n/LocaleProvider";
import { useLocale } from "./i18n/useLocale";
import { AppShell } from "./components/Layout/AppShell";
import { Canvas } from "./components/Canvas/Canvas";
import { MobileListView } from "./components/Canvas/MobileListView";
import { DetailModal } from "./components/Details/DetailModal";
import { EditorPanel } from "./components/Editor/EditorPanel";

const IS_EDITOR = __APP_MODE__ === "editor";

function AppRoot() {
  return (
    <LocaleProvider>
      <App />
    </LocaleProvider>
  );
}

function App() {
  const { locale, setLocale } = useLocale();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [openCard, setOpenCard] = useState<Card | null>(null);
  const [centeredCardId, setCenteredCardId] = useState<string | null>(null);
  const [measuredCardSizes, setMeasuredCardSizes] = useState<CardSizeMap>({});
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const mode = useResponsiveMode();
  const transform = useCanvasTransform();

  // Load portfolio (editor: from server; viewer: bundled).
  useEffect(() => {
    let alive = true;
    loadPortfolio().then((p) => {
      if (alive) setPortfolio(p);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Stable empty placeholder while loading so hook order doesn't change.
  const safePortfolio: Portfolio = portfolio ?? {
    meta: {
      name: { en: "", zhHans: "", zhHant: "" },
      displayName: { en: "", zhHans: "", zhHant: "" },
      tagline: { en: "", zhHans: "", zhHant: "" },
      defaultLocale: "en",
    },
    profile: { email: "", github: "", location: { en: "", zhHans: "", zhHant: "" } },
    skills: [],
    skillTracks: [],
    cards: [],
    connections: [],
  };

  const skill = useSkillHighlight(safePortfolio);
  const { cardsById, boundsByCard } = useCardRegistry(
    safePortfolio,
    measuredCardSizes
  );
  const { viewport, focusOnPoint } = transform;

  const matchedConnectionIds = (() => {
    if (!skill.activeFilter) return new Set<string>();
    const out = new Set<string>();
    if (!portfolio) return out;
    const matched = skill.matchedCardIds ?? new Set<string>();
    for (const c of portfolio.connections) {
      if (matched.has(c.from) && matched.has(c.to)) out.add(c.id);
    }
    return out;
  })();

  const handleSelectGroup = useCallback((g: CardGroup) => {
    (window as any).__heyi_focusGroup?.(g);
  }, []);

  const handleSelectCard = useCallback((id: string) => {
    if (!id) {
      setCenteredCardId(null);
      return;
    }
    (window as any).__heyi_focusCard?.(id);
    setCenteredCardId(id);
  }, []);

  const handleFilterClick = useCallback(
    (filter: Exclude<SkillFilter, null>) => {
      skill.toggle(filter);
    },
    [skill]
  );

  const handleOpenDetails = useCallback(
    (id: string) => {
      const card = cardsById[id];
      if (card) setOpenCard(card);
    },
    [cardsById]
  );

  const handleCardMeasure = useCallback((id: string, size: Card["size"]) => {
    setMeasuredCardSizes((current) => {
      const previous = current[id];
      if (previous?.width === size.width && previous.height === size.height) return current;
      return { ...current, [id]: size };
    });
  }, []);

  useEffect(() => {
    function onEscape(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (openCard) {
        setOpenCard(null);
        return;
      }
      if (skill.activeFilter) skill.clear();
    }
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [openCard, skill.activeFilter, skill.clear]);

  const handleMinimapRecenter = useCallback(
    (worldPoint: { x: number; y: number }) => {
      focusOnPoint(
        worldPoint,
        { width: viewport.width, height: viewport.height },
        viewport.scale
      );
    },
    [focusOnPoint, viewport.height, viewport.scale, viewport.width]
  );

  const updatePortfolioDraft = useCallback((next: Portfolio) => {
    if (!IS_EDITOR) return;
    setPortfolio(next);
  }, []);

  const updateCardDraft = useCallback(
    (id: string, patch: Partial<Pick<Card, "position" | "size">>) => {
      if (!IS_EDITOR) return;
      setPortfolio((prev) =>
        prev
          ? {
              ...prev,
              cards: prev.cards.map((card) =>
                card.id === id ? { ...card, ...patch } : card
              ),
            }
          : prev
      );
    },
    []
  );

  const savePortfolio = useCallback(async (next: Portfolio) => {
    if (!IS_EDITOR) return;
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error(`save failed: ${res.status}`);
      setPortfolio(next);
    } catch (err) {
      console.error("[editor] save failed", err);
    }
  }, []);

  const exportPortfolio = useCallback(async (next: Portfolio) => {
    if (!IS_EDITOR) return;
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error(`export failed: ${res.status}`);
    } catch (err) {
      console.error("[editor] export failed", err);
    }
  }, []);

  useEffect(() => {
    if (!IS_EDITOR) return;
    (window as any).__heyi_save = savePortfolio;
    return () => {
      delete (window as any).__heyi_save;
    };
  }, [savePortfolio]);

  if (!portfolio) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg-outer text-text-muted">
        <p className="font-mono text-sm">Loading canvas…</p>
      </div>
    );
  }

  if (mode === "mobile") {
    return (
      <div className="min-h-screen overflow-x-hidden bg-bg-outer">
        <AppShell
          portfolio={portfolio}
          activeCardId={centeredCardId}
          highlightedCardIds={skill.matchedCardIds}
          activeFilter={skill.activeFilter}
          boundsByCard={boundsByCard}
          viewport={viewport}
          onSelectGroup={handleSelectGroup}
          onSelectCard={handleSelectCard}
          onMinimapRecenter={handleMinimapRecenter}
          locale={locale}
          setLocale={setLocale}
          onFilterClick={handleFilterClick}
        />
        <MobileListView
          portfolio={portfolio}
          activeFilter={skill.activeFilter}
          matchedCardIds={skill.matchedCardIds}
          onFilterClick={handleFilterClick}
          onOpenDetails={handleOpenDetails}
        />
        {openCard && (
          <DetailModal
            card={openCard}
            portfolio={portfolio}
            onClose={() => setOpenCard(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-bg-outer">
      <div className="flex flex-1 overflow-hidden">
        <AppShell
          portfolio={portfolio}
          activeCardId={centeredCardId}
          highlightedCardIds={skill.matchedCardIds}
          activeFilter={skill.activeFilter}
          boundsByCard={boundsByCard}
          viewport={viewport}
          onSelectGroup={handleSelectGroup}
          onSelectCard={handleSelectCard}
          onMinimapRecenter={handleMinimapRecenter}
          locale={locale}
          setLocale={setLocale}
          onFilterClick={handleFilterClick}
        />
        <main ref={canvasContainerRef} className="relative flex-1 overflow-hidden">
          <Canvas
            portfolio={portfolio}
            activeCardId={centeredCardId}
            highlightedCardIds={skill.matchedCardIds}
            activeFilter={skill.activeFilter}
            matchedConnectionIds={matchedConnectionIds}
            onOpenDetails={handleOpenDetails}
            onSelectCard={handleSelectCard}
            onFilterClick={handleFilterClick}
            onClearFilter={skill.clear}
            onCardMount={() => {}}
            measuredCardSizes={measuredCardSizes}
            onCardMeasure={handleCardMeasure}
            transform={transform}
            onCenteredCardChange={setCenteredCardId}
            editable={IS_EDITOR}
            onCardChange={updateCardDraft}
          />
        </main>
        {IS_EDITOR && (
          <EditorPanel
            portfolio={portfolio}
            selectedCardId={centeredCardId}
            onSelectCard={handleSelectCard}
            onChange={updatePortfolioDraft}
            onSave={savePortfolio}
            onExport={exportPortfolio}
          />
        )}
      </div>
      {openCard && (
        <DetailModal
          card={openCard}
          portfolio={portfolio}
          onClose={() => setOpenCard(null)}
        />
      )}
      {IS_EDITOR && <EditorHint />}
    </div>
  );
}

function EditorHint() {
  return (
    <div className="pointer-events-none fixed bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full border border-amber/40 bg-white/90 px-3 py-1.5 text-[11px] font-mono text-amber shadow-card">
      Editor mode · use (window as any).__heyi_save(portfolio) to persist
    </div>
  );
}

export default AppRoot;

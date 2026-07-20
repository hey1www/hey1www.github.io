import { useResponsiveMode } from "../../hooks/useResponsiveMode";
import { Sidebar } from "./Sidebar";
import { MiniMap } from "./MiniMap";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { CardGroup, LocaleCode, Portfolio, SkillFilter } from "../../types/portfolio";
import type { CardBoundsMap } from "../../hooks/useCardRegistry";
import { useState } from "react";

type Props = {
  portfolio: Portfolio;
  activeCardId: string | null;
  highlightedCardIds: Set<string> | null;
  activeFilter: SkillFilter;
  boundsByCard: CardBoundsMap;
  viewport: { x: number; y: number; width: number; height: number; scale: number };
  onSelectGroup: (g: CardGroup) => void;
  onSelectCard: (id: string) => void;
  onMinimapRecenter: (worldPoint: { x: number; y: number }) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  locale: LocaleCode;
  setLocale: (l: LocaleCode) => void;
  onFilterClick: (filter: Exclude<SkillFilter, null>) => void;
};

const SIDEBAR_NAME_EN = "WANG Zouheyi";
const SIDEBAR_NAME_CJK: Record<Exclude<LocaleCode, "en">, { native: string; latin: string }> = {
  zhHans: { native: "王邹鹤仪", latin: "WANG Zouheyi" },
  zhHant: { native: "王鄒鶴儀", latin: "WANG Zouheyi" },
};

export function AppShell({
  portfolio,
  activeCardId,
  highlightedCardIds,
  activeFilter,
  boundsByCard,
  viewport,
  onSelectGroup,
  onSelectCard,
  onMinimapRecenter,
  onZoomIn,
  onZoomOut,
  onResetView,
  locale,
  setLocale,
  onFilterClick,
}: Props) {
  const mode = useResponsiveMode();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (mode === "mobile") {
    return (
      <aside className="border-b border-border-soft bg-white/85 px-4 py-3">
        <div className="flex items-center justify-between">
          {locale === "en" ? (
            <h1 className="font-title font-title-strong text-base leading-tight text-text-main">
              {SIDEBAR_NAME_EN}
            </h1>
          ) : (
            <div>
              <h1 className="font-title font-title-strong text-base leading-tight text-text-main">
                {SIDEBAR_NAME_CJK[locale].native}
              </h1>
              <p className="mt-0.5 font-title text-[12px] text-text-muted">
                {SIDEBAR_NAME_CJK[locale].latin}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <LanguageSwitcher locale={locale} onChange={setLocale} />
            <button
              type="button"
              onClick={() => setDrawerOpen((o) => !o)}
              className="rounded-md border border-border-soft px-3 py-1.5 text-xs font-mono text-text-muted"
              aria-expanded={drawerOpen}
              aria-label="Toggle navigation"
            >
              ☰ Menu
            </button>
          </div>
        </div>
        {drawerOpen && (
          <div className="mt-3 rounded-md border border-border-soft bg-white">
            <Sidebar
              portfolio={portfolio}
              activeCardId={activeCardId}
              highlightedCardIds={highlightedCardIds}
              activeFilter={activeFilter}
              boundsByCard={boundsByCard}
              onSelectGroup={(g) => {
                onSelectGroup(g);
                setDrawerOpen(false);
              }}
              onSelectCard={(id) => {
                onSelectCard(id);
                setDrawerOpen(false);
              }}
              locale={locale}
              setLocale={setLocale}
              onFilterClick={onFilterClick}
              showHeaderLanguage={false}
            />
          </div>
        )}
      </aside>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex h-full w-[300px] flex-col">
        <div className="flex-1 overflow-hidden">
          <Sidebar
            portfolio={portfolio}
            activeCardId={activeCardId}
            highlightedCardIds={highlightedCardIds}
            activeFilter={activeFilter}
            boundsByCard={boundsByCard}
            onSelectGroup={onSelectGroup}
            onSelectCard={onSelectCard}
            locale={locale}
            setLocale={setLocale}
            onFilterClick={onFilterClick}
          />
        </div>
        <MiniMap
          portfolio={portfolio}
          boundsByCard={boundsByCard}
          viewport={viewport}
          onRecenter={onMinimapRecenter}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onReset={onResetView}
        />
      </div>
    </div>
  );
}

import { useCallback, useMemo, useState } from "react";
import type { Portfolio, SkillFilter } from "../types/portfolio";
import { useCardRegistry } from "./useCardRegistry";

/**
 * Tracks which skill (if any) is active. Exposes helpers to toggle the
 * filter and a memoised list of card ids that match the filter.
 */
export function useSkillHighlight(portfolio: Portfolio) {
  const [activeFilter, setActiveFilter] = useState<SkillFilter>(null);
  const { cardIdsBySkill, cardIdsByTrack } = useCardRegistry(portfolio);

  const matchedCardIds = useMemo(() => {
    if (!activeFilter) return null;
    const ids =
      activeFilter.kind === "track"
        ? cardIdsByTrack[activeFilter.id]
        : cardIdsBySkill[activeFilter.id];
    return new Set(ids || []);
  }, [activeFilter, cardIdsBySkill, cardIdsByTrack]);

  const toggle = useCallback((filter: Exclude<SkillFilter, null>) => {
    setActiveFilter((prev) =>
      prev?.kind === filter.kind && prev.id === filter.id ? null : filter
    );
  }, []);

  const clear = useCallback(() => setActiveFilter(null), []);

  return { activeFilter, matchedCardIds, toggle, clear, setActiveFilter };
}

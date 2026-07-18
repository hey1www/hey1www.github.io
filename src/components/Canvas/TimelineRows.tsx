import type { Card, Portfolio, SkillFilter } from "../../types/portfolio";
import { ExperienceCard } from "./ExperienceCard";

type Props = {
  cards: Card[];
  portfolio: Portfolio;
  activeCardId: string | null;
  highlightedCardIds: Set<string> | null;
  activeFilter: SkillFilter;
  onOpenDetails: (id: string) => void;
  onFilterClick: (filter: Exclude<SkillFilter, null>) => void;
  onSelect: (id: string) => void;
  editable?: boolean;
  viewportScale: number;
  onCardMeasure?: (id: string, size: Card["size"]) => void;
  onCardChange?: (id: string, patch: Partial<Pick<Card, "position" | "size">>) => void;
};

export function TimelineRows({
  cards,
  portfolio,
  activeCardId,
  highlightedCardIds,
  activeFilter,
  onOpenDetails,
  onFilterClick,
  onSelect,
  editable = false,
  viewportScale,
  onCardMeasure,
  onCardChange,
}: Props) {
  return (
    <>
      {cards.map((card) => {
        const isActive = card.id === activeCardId;
        const isHighlighted =
          !highlightedCardIds || highlightedCardIds.has(card.id);
        const isDimmed = highlightedCardIds
          ? !highlightedCardIds.has(card.id)
          : false;
        return (
          <ExperienceCard
            key={card.id}
            card={card}
            portfolio={portfolio}
            isActive={isActive}
            isDimmed={isDimmed}
            isHighlighted={isHighlighted && !isActive}
            activeFilter={activeFilter}
            onOpenDetails={() => onOpenDetails(card.id)}
            onFilterClick={onFilterClick}
            onSelect={() => onSelect(card.id)}
            editable={editable}
            viewportScale={viewportScale}
            onMeasuredSize={onCardMeasure}
            onCardChange={onCardChange}
          />
        );
      })}
    </>
  );
}

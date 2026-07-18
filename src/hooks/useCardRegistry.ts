import { useMemo } from "react";
import type { Card, CardGroup, Portfolio, Skill, SkillTrackId } from "../types/portfolio";
import { boundsOf, type Rect } from "../utils/geometry";

export type CardBoundsMap = Record<string, Rect>;
export type CardSizeMap = Record<string, Card["size"]>;
const EMPTY_CARD_SIZES: CardSizeMap = {};

export type UseCardRegistryResult = {
  cardsById: Record<string, Card>;
  skillsById: Record<string, Skill>;
  cardsByGroup: Record<CardGroup, Card[]>;
  groupBounds: Record<CardGroup, Rect | null>;
  allBounds: Rect | null;
  cardIdsBySkill: Record<string, string[]>;
  cardIdsByTrack: Record<SkillTrackId, string[]>;
  boundsByCard: CardBoundsMap;
};

/**
 * Build quick lookup tables for cards, skills and groups. Memoised on
 * the portfolio reference so editor changes invalidate the cache.
 */
export function useCardRegistry(
  portfolio: Portfolio,
  sizeOverrides: CardSizeMap = EMPTY_CARD_SIZES
): UseCardRegistryResult {
  return useMemo(() => {
    const cardsById: Record<string, Card> = {};
    const cardsByGroup: Record<CardGroup, Card[]> = {
      profile: [],
      education: [],
      internship: [],
      project: [],
    };
    for (const sourceCard of portfolio.cards) {
      const measuredSize = sizeOverrides[sourceCard.id];
      const card = measuredSize
        ? { ...sourceCard, size: measuredSize }
        : sourceCard;
      cardsById[card.id] = card;
      cardsByGroup[card.group].push(card);
    }

    const skillsById: Record<string, Skill> = {};
    for (const skill of portfolio.skills) skillsById[skill.id] = skill;

    const cardIdsBySkill: Record<string, string[]> = {};
    const cardIdsByTrack: Record<SkillTrackId, string[]> = {
      "llm-ai": [],
      "ai-vision": [],
      "software-data": [],
      "iot-device": [],
    };
    for (const card of portfolio.cards) {
      for (const sid of card.skills) {
        (cardIdsBySkill[sid] ||= []).push(card.id);
      }
      for (const trackId of card.trackIds) cardIdsByTrack[trackId].push(card.id);
    }

    const groupBounds: Record<CardGroup, Rect | null> = {
      profile: boundsOf(cardsByGroup.profile.map(toRect)),
      education: boundsOf(cardsByGroup.education.map(toRect)),
      internship: boundsOf(cardsByGroup.internship.map(toRect)),
      project: boundsOf(cardsByGroup.project.map(toRect)),
    };

    const effectiveCards = Object.values(cardsById);
    const allBounds = boundsOf(effectiveCards.map(toRect));

    // Bounds lookup for the minimap / sidebar.
    const boundsByCard: CardBoundsMap = {};
    for (const c of effectiveCards) {
      const b = toRect(c);
      boundsByCard[c.id] = b;
    }

    return {
      cardsById,
      skillsById,
      cardsByGroup,
      groupBounds,
      allBounds,
      cardIdsBySkill,
      cardIdsByTrack,
      boundsByCard,
    };
  }, [portfolio, sizeOverrides]);
}

function toRect(card: Card): Rect {
  return {
    x: card.position.x,
    y: card.position.y,
    width: card.size.width,
    height: card.size.height,
  };
}

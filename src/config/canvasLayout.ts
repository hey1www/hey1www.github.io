import type { CardGroup } from "../types/portfolio";

export const CANVAS_LANE_Y: Record<CardGroup, number> = {
  profile: 0,
  education: 340,
  internship: 720,
  project: 1070,
};

export const CANVAS_COMPACT_CARD_SIZE = { width: 480, height: 320 } as const;
export const CANVAS_CARD_SIZE = { width: 480, height: 360 } as const;
export const CANVAS_DENSE_CARD_SIZE = { width: 480, height: 420 } as const;
export const CANVAS_PROFILE_SIZE = { width: 480, height: 340 } as const;
export const CANVAS_PRIMARY_CARD_SIZE = { width: 480, height: 420 } as const;

export const CANVAS_LAYOUT = {
  worldWidth: 3080,
  cardGap: 40,
  initialPadding: 80,
  initialMinScale: 0.3,
  initialMaxScale: 0.9,
} as const;

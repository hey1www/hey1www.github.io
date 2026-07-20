import type { CardGroup } from "../types/portfolio";
import type { Size, Viewport } from "../utils/geometry";

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
  initialScale: 0.6,
  initialOffsetXRatio: 0.12,
  initialOffsetYRatio: 0.1,
} as const;

export function initialCanvasViewport(canvasSize: Size): Viewport {
  return {
    x: canvasSize.width * CANVAS_LAYOUT.initialOffsetXRatio,
    y: canvasSize.height * CANVAS_LAYOUT.initialOffsetYRatio,
    width: canvasSize.width,
    height: canvasSize.height,
    scale: CANVAS_LAYOUT.initialScale,
  };
}

// Geometry helpers shared by canvas, sidebar and minimap.

export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
export type Rect = Point & Size;

export type Viewport = {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
};

/** Convert a screen point to canvas-space coordinates given the current viewport. */
export function screenToCanvas(p: Point, vp: Viewport): Point {
  return {
    x: (p.x - vp.x) / vp.scale,
    y: (p.y - vp.y) / vp.scale,
  };
}

/** Convert a canvas-space point back to screen coordinates. */
export function canvasToScreen(p: Point, vp: Viewport): Point {
  return {
    x: p.x * vp.scale + vp.x,
    y: p.y * vp.scale + vp.y,
  };
}

/** Bounding box of a set of rectangles. */
export function boundsOf(rects: Rect[]): Rect | null {
  if (!rects.length) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const r of rects) {
    if (r.x < minX) minX = r.x;
    if (r.y < minY) minY = r.y;
    if (r.x + r.width > maxX) maxX = r.x + r.width;
    if (r.y + r.height > maxY) maxY = r.y + r.height;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/** Compute viewport transform that fits a target rect within a viewport size, with padding. */
export function fitBoundsToViewport(
  bounds: Rect,
  viewport: Size,
  padding = 80,
  minScale = 0.4,
  maxScale = 1.4
): { x: number; y: number; scale: number } {
  const availableW = Math.max(1, viewport.width - padding * 2);
  const availableH = Math.max(1, viewport.height - padding * 2);
  const scale = Math.max(
    minScale,
    Math.min(maxScale, Math.min(availableW / bounds.width, availableH / bounds.height))
  );
  const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  return {
    scale,
    x: viewport.width / 2 - center.x * scale,
    y: viewport.height / 2 - center.y * scale,
  };
}

/** Clamp a value to [min, max]. */
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, type Point, type Size, type Viewport } from "../utils/geometry";
import { initialCanvasViewport } from "../config/canvasLayout";

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 1.6;
const ZOOM_STEP = 0.12;
const VIEWPORT_ANIMATION_MS = 280;

type ZoomBehavior = "instant" | "smooth";

type ActiveAnimation = {
  from: Viewport;
  to: Viewport;
  startedAt: number;
  duration: number;
};

export type CanvasTransform = {
  viewport: Viewport;
  setViewport: (vp: Viewport) => void;
  panBy: (dx: number, dy: number) => void;
  zoomAt: (client: Point, factor: number, behavior?: ZoomBehavior) => void;
  resetView: (canvasSize: Size) => void;
  restoreInitialView: (canvasSize: Size) => void;
  focusOnPoint: (canvasPoint: Point, canvasSize: Size, scale?: number) => void;
  focusOnBounds: (
    bounds: { x: number; y: number; width: number; height: number },
    canvasSize: Size,
    opts?: { padding?: number; minScale?: number; maxScale?: number }
  ) => void;
  isAnimating: boolean;
};

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function mixViewport(from: Viewport, to: Viewport, progress: number): Viewport {
  const mix = (a: number, b: number) => a + (b - a) * progress;
  return {
    x: mix(from.x, to.x),
    y: mix(from.y, to.y),
    width: mix(from.width, to.width),
    height: mix(from.height, to.height),
    scale: mix(from.scale, to.scale),
  };
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useCanvasTransform(initial?: Partial<Viewport>): CanvasTransform {
  const [viewport, setViewportState] = useState<Viewport>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    scale: 1,
    ...initial,
  });
  const viewportRef = useRef(viewport);
  const animationRef = useRef<ActiveAnimation | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  const cancelAnimation = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    animationRef.current = null;
    setIsAnimating(false);
  }, []);

  const commitViewport = useCallback((next: Viewport) => {
    viewportRef.current = next;
    setViewportState(next);
  }, []);

  const setViewport = useCallback(
    (next: Viewport) => {
      cancelAnimation();
      commitViewport(next);
    },
    [cancelAnimation, commitViewport]
  );

  const animateTo = useCallback(
    (target: Viewport, duration = VIEWPORT_ANIMATION_MS) => {
      if (prefersReducedMotion() || duration <= 0) {
        setViewport(target);
        return;
      }

      cancelAnimation();
      animationRef.current = {
        from: viewportRef.current,
        to: target,
        startedAt: performance.now(),
        duration,
      };
      setIsAnimating(true);

      const tick = (now: number) => {
        const animation = animationRef.current;
        if (!animation) {
          rafRef.current = null;
          return;
        }
        const rawProgress = clamp(
          (now - animation.startedAt) / animation.duration,
          0,
          1
        );
        const next = mixViewport(
          animation.from,
          animation.to,
          easeOutCubic(rawProgress)
        );
        commitViewport(next);

        if (rawProgress >= 1) {
          commitViewport(animation.to);
          animationRef.current = null;
          rafRef.current = null;
          setIsAnimating(false);
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [cancelAnimation, commitViewport, setViewport]
  );

  const panBy = useCallback(
    (dx: number, dy: number) => {
      const current = viewportRef.current;
      setViewport({
        ...current,
        x: current.x + dx,
        y: current.y + dy,
      });
    },
    [setViewport]
  );

  const zoomAt = useCallback(
    (client: Point, factor: number, behavior: ZoomBehavior = "instant") => {
      const current = viewportRef.current;
      const newScale = clamp(current.scale * factor, MIN_ZOOM, MAX_ZOOM);
      const canvasX = (client.x - current.x) / current.scale;
      const canvasY = (client.y - current.y) / current.scale;
      const next: Viewport = {
        ...current,
        scale: newScale,
        x: client.x - canvasX * newScale,
        y: client.y - canvasY * newScale,
      };
      if (behavior === "smooth") animateTo(next);
      else setViewport(next);
    },
    [animateTo, setViewport]
  );

  const resetView = useCallback(
    (canvasSize: Size) => {
      animateTo({
        x: canvasSize.width / 2,
        y: canvasSize.height / 2,
        width: canvasSize.width,
        height: canvasSize.height,
        scale: 1,
      });
    },
    [animateTo]
  );

  const restoreInitialView = useCallback(
    (canvasSize: Size) => {
      if (!canvasSize.width || !canvasSize.height) return;
      animateTo(initialCanvasViewport(canvasSize));
    },
    [animateTo]
  );

  const focusOnPoint = useCallback(
    (canvasPoint: Point, canvasSize: Size, scale = 1) => {
      const targetScale = clamp(scale, MIN_ZOOM, MAX_ZOOM);
      animateTo({
        x: canvasSize.width / 2 - canvasPoint.x * targetScale,
        y: canvasSize.height / 2 - canvasPoint.y * targetScale,
        width: canvasSize.width,
        height: canvasSize.height,
        scale: targetScale,
      });
    },
    [animateTo]
  );

  const focusOnBounds = useCallback(
    (
      bounds: { x: number; y: number; width: number; height: number },
      canvasSize: Size,
      opts?: { padding?: number; minScale?: number; maxScale?: number }
    ) => {
      const padding = opts?.padding ?? 80;
      const minScale = opts?.minScale ?? 0.4;
      const maxScale = opts?.maxScale ?? 1.4;
      if (!canvasSize.width || !canvasSize.height || !bounds.width || !bounds.height) return;
      const innerW = Math.max(1, canvasSize.width - padding * 2);
      const innerH = Math.max(1, canvasSize.height - padding * 2);
      const fit = Math.min(innerW / bounds.width, innerH / bounds.height);
      const scale = clamp(fit, minScale, maxScale);
      const centerX = bounds.x + bounds.width / 2;
      const centerY = bounds.y + bounds.height / 2;
      animateTo({
        x: canvasSize.width / 2 - centerX * scale,
        y: canvasSize.height / 2 - centerY * scale,
        width: canvasSize.width,
        height: canvasSize.height,
        scale,
      });
    },
    [animateTo]
  );

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return {
    viewport,
    setViewport,
    panBy,
    zoomAt,
    resetView,
    restoreInitialView,
    focusOnPoint,
    focusOnBounds,
    isAnimating,
  };
}

export const CANVAS_LIMITS = {
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
  VIEWPORT_ANIMATION_MS,
};

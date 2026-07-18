import { useResponsiveMode } from "../../hooks/useResponsiveMode";
import { useLocale } from "../../i18n/useLocale";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
};

export function ZoomControls({ onZoomIn, onZoomOut, onReset, scale }: Props) {
  const mode = useResponsiveMode();
  const { locale } = useLocale();
  if (mode !== "desktop") return null;
  return (
    <div className="pointer-events-auto absolute bottom-6 right-6 z-30 flex items-center gap-1 rounded-full border border-border-soft bg-white/95 px-1 py-1 shadow-card backdrop-blur">
      <button
        type="button"
        onClick={onZoomOut}
        className="h-7 w-7 rounded-full text-text-muted hover:bg-slate-100 hover:text-text-main"
        aria-label={locale === "en" ? "Zoom out" : "缩小"}
      >
        −
      </button>
      <button
        type="button"
        onClick={onReset}
        className="h-7 min-w-[3rem] rounded-full px-2 text-[11px] font-mono text-text-muted hover:bg-slate-100 hover:text-text-main"
        aria-label={locale === "en" ? "Reset view" : "重置视图"}
      >
        {Math.round(scale * 100)}%
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        className="h-7 w-7 rounded-full text-text-muted hover:bg-slate-100 hover:text-text-main"
        aria-label={locale === "en" ? "Zoom in" : "放大"}
      >
        +
      </button>
    </div>
  );
}

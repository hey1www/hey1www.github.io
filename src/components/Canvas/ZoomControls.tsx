import { useLocale } from "../../i18n/useLocale";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
};

export function ZoomControls({ onZoomIn, onZoomOut, onReset, scale }: Props) {
  const { locale } = useLocale();
  return (
    <div className="pointer-events-auto flex flex-none items-center gap-0.5 rounded-full border border-border-soft bg-white/95 p-0.5">
      <button
        type="button"
        onClick={onZoomOut}
        className="h-6 w-6 rounded-full text-[12px] text-text-muted hover:bg-slate-100 hover:text-text-main"
        aria-label={locale === "en" ? "Zoom out" : "缩小"}
      >
        −
      </button>
      <button
        type="button"
        onClick={onReset}
        className="h-6 min-w-[2.7rem] rounded-full px-1.5 text-[10px] font-mono text-text-muted hover:bg-slate-100 hover:text-text-main"
        aria-label={locale === "en" ? "Reset view" : "重置视图"}
      >
        {Math.round(scale * 100)}%
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        className="h-6 w-6 rounded-full text-[12px] text-text-muted hover:bg-slate-100 hover:text-text-main"
        aria-label={locale === "en" ? "Zoom in" : "放大"}
      >
        +
      </button>
    </div>
  );
}

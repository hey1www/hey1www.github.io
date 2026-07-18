import { useLocale } from "../../i18n/useLocale";
import type { Viewport } from "../../utils/geometry";
import { CANVAS_LANE_Y } from "../../config/canvasLayout";

type Props = {
  /** Live viewport — used to project world coords into screen pixels. */
  viewport: Viewport;
};

const ROW_LABELS: Record<string, { en: string; zhHans: string; zhHant: string }> = {
  profile: { en: "Profile", zhHans: "个人信息", zhHant: "個人資訊" },
  education: { en: "Education", zhHans: "教育经历", zhHant: "教育經歷" },
  internship: { en: "Internships", zhHans: "实习经历", zhHant: "實習經歷" },
  project: { en: "Projects", zhHans: "项目经历", zhHant: "項目經歷" },
};

const ROWS = ["profile", "education", "internship", "project"] as const;

function RowLabels({
  viewport,
}: {
  viewport: Viewport;
}) {
  const { locale } = useLocale();
  const project = (worldY: number) => worldY * viewport.scale + viewport.y;
  return (
    <>
      {ROWS.map((key) => {
        const screenY = project(CANVAS_LANE_Y[key]);
        return (
          <div
            key={key}
            className="pointer-events-none absolute left-4 z-20 -translate-y-1/2 rounded bg-canvas-bg/80 px-1.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted/65 backdrop-blur-sm"
            style={{
              top: screenY,
              writingMode: locale === "en" ? "horizontal-tb" : "vertical-rl",
              textOrientation: locale === "en" ? "mixed" : "upright",
            }}
          >
            {ROW_LABELS[key][locale]}
          </div>
        );
      })}
    </>
  );
}

/**
 * Floating overlay rendered inside the canvas viewport. Row labels are
 * positioned in screen space using the live viewport so they stay glued to
 * the canvas edge while the user pans/zooms.
 */
export function TimelineAxis({ viewport }: Props) {
  return (
    <>
      {/* Row labels — sticky to the left edge. */}
      <RowLabels viewport={viewport} />
    </>
  );
}

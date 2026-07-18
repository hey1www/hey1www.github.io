import type { Skill, SkillCategory } from "../../types/portfolio";
import { useLocale } from "../../i18n/useLocale";
import { classNames } from "../../utils/classNames";

const CATEGORY_COLOR: Record<SkillCategory, string> = {
  language: "#1E3A5F",
  ai: "#6D28D9",
  ml: "#0F766E",
  web: "#2563EB",
  data: "#B45309",
  robotics: "#9333EA",
  iot: "#0891B2",
  tool: "#475569",
  business: "#475569",
  communication: "#0EA5E9",
};

type Props = {
  skill: Skill;
  active: boolean;
  onClick: () => void;
};

export function SkillTag({ skill, active, onClick }: Props) {
  const { t } = useLocale();
  const color = CATEGORY_COLOR[skill.category];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={classNames(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] leading-4 transition-colors",
        active
          ? "border-navy bg-navy text-white"
          : "border-border-soft bg-white text-text-muted hover:border-navy hover:text-navy"
      )}
      style={!active ? { borderColor: `${color}55`, color: `${color}` } : undefined}
    >
      <span
        aria-hidden
        className="inline-block h-1 w-1 rounded-full"
        style={{ background: active ? "#fff" : color }}
      />
      {t(skill.label)}
    </button>
  );
}

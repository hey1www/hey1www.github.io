import type { Connection, ConnectionType, SkillFilter } from "../../types/portfolio";

type Props = {
  connections: Connection[];
  cardsById: Record<string, { position: { x: number; y: number }; size: { width: number; height: number } }>;
  highlighted: boolean;
  activeFilter: SkillFilter;
  matchedConnections: Set<string>;
};

const STROKE: Record<ConnectionType, { stroke: string; width: number; dash: string }> = {
  sequence: { stroke: "#64748b", width: 1.5, dash: "6 6" },
  "project-sequence": { stroke: "#1E3A5F", width: 2.4, dash: "" },
  related: { stroke: "#94a3b8", width: 1, dash: "4 8" },
  fyp: { stroke: "#1E3A5F", width: 2.5, dash: "8 6" },
  "profile-to-group": { stroke: "#94a3b8", width: 1.2, dash: "" },
  skill: { stroke: "#1E3A5F", width: 1.4, dash: "2 4" },
};

function anchor(card: { position: { x: number; y: number }; size: { width: number; height: number } }, side: "right" | "left" | "top" | "bottom") {
  const cx = card.position.x + card.size.width / 2;
  const cy = card.position.y + card.size.height / 2;
  switch (side) {
    case "right": return { x: card.position.x + card.size.width, y: cy };
    case "left": return { x: card.position.x, y: cy };
    case "top": return { x: cx, y: card.position.y };
    case "bottom": return { x: cx, y: card.position.y + card.size.height };
  }
}

function bestAnchors(
  from: NonNullable<Props["cardsById"][string]>,
  to: NonNullable<Props["cardsById"][string]>
) {
  const fromCx = from.position.x + from.size.width / 2;
  const toCx = to.position.x + to.size.width / 2;
  if (Math.abs(toCx - fromCx) > 40) {
    return toCx > fromCx
      ? { from: anchor(from, "right"), to: anchor(to, "left") }
      : { from: anchor(from, "left"), to: anchor(to, "right") };
  }
  return { from: anchor(from, "bottom"), to: anchor(to, "top") };
}

function curvePath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const c1 = { x: a.x + dx * 0.5, y: a.y };
  const c2 = { x: b.x - dx * 0.5, y: b.y };
  return `M ${a.x},${a.y} C ${c1.x},${c1.y} ${c2.x},${c2.y} ${b.x},${b.y}`;
}

function connectionPath(
  type: ConnectionType,
  a: { x: number; y: number },
  b: { x: number; y: number }
) {
  return type === "project-sequence" ? `M ${a.x},${a.y} L ${b.x},${b.y}` : curvePath(a, b);
}

export function ConnectionLayer({ connections, cardsById, highlighted, activeFilter, matchedConnections }: Props) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ overflow: "visible" }}
    >
      <defs>
        {Object.entries(STROKE).map(([k, s]) => {
          const isProjectSequence = k === "project-sequence";
          return (
            <marker
              id={`arrow-${k}`}
              key={k}
              viewBox="0 0 10 10"
              refX={isProjectSequence ? "8.5" : "9"}
              refY="5"
              markerWidth={isProjectSequence ? "11" : "6"}
              markerHeight={isProjectSequence ? "11" : "6"}
              markerUnits={isProjectSequence ? "userSpaceOnUse" : "strokeWidth"}
              orient="auto-start-reverse"
            >
              {isProjectSequence ? (
                <path
                  d="M2,1.5 L8.5,5 L2,8.5"
                  fill="none"
                  stroke={s.stroke}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path d="M0,0 L10,5 L0,10 z" fill={s.stroke} />
              )}
            </marker>
          );
        })}
      </defs>
      {connections.map((c) => {
        const from = cardsById[c.from];
        const to = cardsById[c.to];
        if (!from || !to) return null;
        const a = bestAnchors(from, to);
        const style = STROKE[c.type] ?? STROKE.related;
        const isMatched = matchedConnections.has(c.id);
        const baseOpacity = activeFilter
          ? isMatched
            ? 0.95
            : 0.08
          : highlighted
          ? 0.5
          : 0.7;
        return (
          <g key={c.id} style={{ opacity: baseOpacity }}>
            <path
              d={connectionPath(c.type, a.from, a.to)}
              fill="none"
              stroke={style.stroke}
              strokeWidth={style.width}
              strokeDasharray={style.dash || undefined}
              markerEnd={
                c.type === "sequence" || c.type === "project-sequence" || c.type === "fyp"
                  ? `url(#arrow-${c.type})`
                  : undefined
              }
            />
          </g>
        );
      })}
    </svg>
  );
}

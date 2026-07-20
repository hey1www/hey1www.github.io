import type { Card, LocaleText, Portfolio } from "../../types/portfolio";
import { useLocale } from "../../i18n/useLocale";
import { SUPPORTED_LOCALES } from "../../i18n/locale";
import { classNames } from "../../utils/classNames";

type Props = {
  portfolio: Portfolio;
  selectedCardId: string | null;
  onSelectCard: (id: string) => void;
  onChange: (next: Portfolio) => void;
  onSave: (next: Portfolio) => void;
  onExport: (next: Portfolio) => void;
};

const GROUP_LABELS: Record<string, Record<string, string>> = {
  profile: { en: "Profile", zhHans: "个人信息", zhHant: "個人資訊" },
  education: { en: "Education", zhHans: "教育", zhHant: "教育" },
  internship: { en: "Internship", zhHans: "实习", zhHant: "實習" },
  project: { en: "Project", zhHans: "项目", zhHant: "項目" },
};

export function EditorPanel({
  portfolio,
  selectedCardId,
  onSelectCard,
  onChange,
  onSave,
  onExport,
}: Props) {
  const { locale } = useLocale();
  const card = portfolio.cards.find((c) => c.id === selectedCardId) || null;

  function patchCard(id: string, patch: Partial<Card>) {
    onChange({
      ...portfolio,
      cards: portfolio.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  }

  function patchLocale(field: keyof Card, localeKey: string, value: string) {
    if (!card) return;
    const current = (card[field] as LocaleText | undefined) ?? { en: "", zhHans: "", zhHant: "" };
    patchCard(card.id, { [field]: { ...current, [localeKey]: value } } as any);
  }

  return (
    <aside className="thin-scroll w-[360px] flex-shrink-0 overflow-y-auto border-l border-border-soft bg-white/90 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-text-main">
          {locale === "en" ? "Editor" : "编辑器"}
        </h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onSave(portfolio)}
            className="rounded-md border border-navy bg-navy px-2.5 py-1 text-[11px] font-mono text-white"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => onExport(portfolio)}
            className="rounded-md border border-amber bg-amber px-2.5 py-1 text-[11px] font-mono text-white"
          >
            Export
          </button>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">
          {locale === "en" ? "Selected card" : "选中卡片"}
        </label>
        <select
          value={selectedCardId || ""}
          onChange={(e) => onSelectCard(e.target.value)}
          className="mt-1 w-full rounded-md border border-border-soft bg-white p-1.5 text-sm"
        >
          <option value="">—</option>
          {portfolio.cards.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} · {GROUP_LABELS[c.group]?.[locale] || c.group}
            </option>
          ))}
        </select>
      </div>

      {card && (
        <div className="space-y-3">
          <fieldset className="rounded-md border border-border-soft p-2">
            <legend className="px-1 text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">
              Title
            </legend>
            {SUPPORTED_LOCALES.map((lc) => (
              <input
                key={lc}
                value={card.title[lc]}
                onChange={(e) => patchLocale("title", lc, e.target.value)}
                placeholder={lc}
                className="mt-1 block w-full rounded-md border border-border-soft bg-white p-1.5 text-sm"
              />
            ))}
          </fieldset>

          <fieldset className="rounded-md border border-border-soft p-2">
            <legend className="px-1 text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">
              Time label
            </legend>
            {SUPPORTED_LOCALES.map((lc) => (
              <input
                key={lc}
                value={card.timeLabel[lc]}
                onChange={(e) => patchLocale("timeLabel", lc, e.target.value)}
                placeholder={lc}
                className="mt-1 block w-full rounded-md border border-border-soft bg-white p-1.5 text-sm"
              />
            ))}
          </fieldset>

          <fieldset className="rounded-md border border-border-soft p-2">
            <legend className="px-1 text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">
              Summary
            </legend>
            {SUPPORTED_LOCALES.map((lc) => (
              <textarea
                key={lc}
                value={card.summary[lc]}
                onChange={(e) => patchLocale("summary", lc, e.target.value)}
                placeholder={lc}
                rows={2}
                className="mt-1 block w-full rounded-md border border-border-soft bg-white p-1.5 text-sm"
              />
            ))}
          </fieldset>

          <fieldset className="rounded-md border border-border-soft p-2">
            <legend className="px-1 text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">
              Overview
            </legend>
            {SUPPORTED_LOCALES.map((lc) => (
              <textarea
                key={lc}
                value={card.details.overview[lc]}
                onChange={(e) => {
                  const v = e.target.value;
                  patchCard(card.id, {
                    details: { ...card.details, overview: { ...card.details.overview, [lc]: v } },
                  });
                }}
                placeholder={lc}
                rows={3}
                className="mt-1 block w-full rounded-md border border-border-soft bg-white p-1.5 text-sm"
              />
            ))}
          </fieldset>

          <fieldset className="rounded-md border border-border-soft p-2">
            <legend className="px-1 text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted">
              Position
            </legend>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="number"
                value={card.position.x}
                onChange={(e) =>
                  patchCard(card.id, {
                    position: { ...card.position, x: Number(e.target.value) },
                  })
                }
                className="rounded-md border border-border-soft bg-white p-1.5 text-sm"
                aria-label="X position"
              />
              <input
                type="number"
                value={card.position.y}
                onChange={(e) =>
                  patchCard(card.id, {
                    position: { ...card.position, y: Number(e.target.value) },
                  })
                }
                className="rounded-md border border-border-soft bg-white p-1.5 text-sm"
                aria-label="Y position"
              />
            </div>
          </fieldset>

          <div className="rounded-md border border-amber/40 bg-amber/5 p-2 text-[11px] text-amber">
            {locale === "en"
              ? "Edits are kept locally. Click Save to write to data/portfolio.json."
              : "编辑内容保留在本地,点击 Save 写入 data/portfolio.json。"}
          </div>
        </div>
      )}

      <div className={classNames("mt-3 grid grid-cols-2 gap-1.5", !card && "opacity-40 pointer-events-none")}>
        <button
          type="button"
          onClick={() => {
            if (!card) return;
            const clone: Card = {
              ...card,
              id: `${card.id}-copy-${Date.now()}`,
              title: { ...card.title },
              subtitle: card.subtitle ? { ...card.subtitle } : undefined,
              role: card.role ? { ...card.role } : undefined,
              timeLabel: { ...card.timeLabel },
              summary: { ...card.summary },
              details: {
                ...card.details,
                overview: { ...card.details.overview },
                whatIDid: card.details.whatIDid?.map((item) => ({ ...item })),
                technicalDecisions: card.details.technicalDecisions?.map((item) => ({ ...item })),
                outcomes: card.details.outcomes?.map((item) => ({ ...item })),
                tech: card.details.tech ? { ...card.details.tech } : undefined,
                links: card.details.links?.map((link) => ({
                  ...link,
                  label: { ...link.label },
                })),
                sections: card.details.sections?.map((section) => ({
                  ...section,
                  title: { ...section.title },
                  paragraphs: section.paragraphs?.map((item) => ({ ...item })),
                  items: section.items?.map((item) => ({ ...item })),
                  metrics: section.metrics?.map((item) => ({ ...item })),
                  groups: section.groups?.map((group) => ({
                    ...group,
                    title: { ...group.title },
                    items: group.items.map((item) => ({ ...item })),
                  })),
                  links: section.links?.map((link) => ({
                    ...link,
                    label: { ...link.label },
                  })),
                  media: section.media?.map((media) => ({
                    ...media,
                    alt: { ...media.alt },
                    caption: media.caption ? { ...media.caption } : undefined,
                  })),
                })),
              },
              skills: [...card.skills],
              trackIds: [...card.trackIds],
              position: { x: card.position.x + 40, y: card.position.y + 40 },
              size: { ...card.size },
            };
            onChange({ ...portfolio, cards: [...portfolio.cards, clone] });
            onSelectCard(clone.id);
          }}
          className="rounded-md border border-border-soft bg-white px-2 py-1 text-[11px] font-mono"
        >
          Duplicate
        </button>
        <button
          type="button"
          onClick={() => {
            if (!card) return;
            if (!confirm(`Delete card "${card.id}"?`)) return;
            onChange({
              ...portfolio,
              cards: portfolio.cards.filter((c) => c.id !== card.id),
              connections: portfolio.connections.filter(
                (connection) => connection.from !== card.id && connection.to !== card.id
              ),
            });
            onSelectCard("");
          }}
          className="rounded-md border border-rose-300 bg-white px-2 py-1 text-[11px] font-mono text-rose-600"
        >
          Delete
        </button>
      </div>
    </aside>
  );
}

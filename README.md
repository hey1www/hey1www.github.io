# heyi-portal

Interactive multilingual career canvas for **WANG Zouheyi**. The public viewer is designed as a resume portfolio link, not a traditional static resume page.

## What It Contains

- Desktop: canvas + sidebar + minimap with education, internship, and project rows.
- Mobile: vertical card flow with tabs, skill filtering, language switching, and detail drawer.
- Capability filters: four stable skill tracks plus individual technology tags.
- Languages: English, Simplified Chinese, Traditional Chinese.
- Data source: `src/data/defaultPortfolio.ts` by default, or `data/portfolio.json` in local editor mode.
- Export: deployable `dist-static/` directory, plus optional single-file export.

## Commands

```bash
npm install
npm run dev             # public viewer dev server
npm run editor          # local editor: API server + editor-mode Vite
npm run typecheck
npm run lint            # currently aliases TypeScript static checking
npm run build           # production viewer build
npm run build:viewer
npm run build:editor
npm run export          # writes dist-static/
npm run export:single   # writes dist-static/index.html with JS/CSS/data inlined
npm run preview
```

There is currently no `npm test` script.

## Public Viewer vs Editor Mode

Public viewer:

- Built with `VITE_APP_MODE=viewer` or the default Vite mode.
- Does not mount editor UI.
- Does not expose editor save hooks.
- Loads portfolio data in this order:
  1. embedded `<script id="heyi-portfolio-data">` from single-file export,
  2. `./data.json` from normal static export,
  3. bundled `src/data/defaultPortfolio.ts` seed.

Editor mode:

- Run with `npm run editor`.
- Starts the local API server at `127.0.0.1:5174`.
- Runs Vite with `VITE_APP_MODE=editor`.
- Mounts the editor panel locally.
- Saves to `data/portfolio.json`.
- Validates portfolio data before saving.
- Backs up existing JSON to `data/backups/`.
- Writes through a temporary file and then renames it, so failed writes do not replace the current JSON.

## Static Export

`npm run export` builds the viewer and writes:

```text
dist-static/
├─ index.html
├─ data.json
└─ assets/
```

`npm run export:single` writes a single `dist-static/index.html` with CSS, JS, and portfolio data inlined. This is useful for sharing a one-file preview, but normal export is better for public hosting.

## GitHub Pages / Base Path

The Vite config defaults to relative build paths via `base: "./"`, so `dist-static/` can usually be served from a project subpath.

If you need an explicit GitHub Pages base path, build with:

```bash
VITE_BASE=/heyi-portal/ npm run export
```

For static hosts that require a fallback page, copy `dist-static/index.html` to `dist-static/404.html`. The app does not currently depend on client-side route paths, but this keeps direct links resilient if routing is added later.

## Typography

The project uses system fonts only and does not download or bundle font files:

- English titles: Georgia / Times-style serif fallbacks.
- Simplified Chinese titles: Songti SC / STSong / SimSun.
- Traditional Chinese titles: Songti TC / PMingLiU / Songti SC.
- Body text, labels, and controls: platform sans-serif fallbacks.

This keeps normal and single-file exports small and avoids font licensing or browser decoding issues.

## Data Maintenance

Primary editable shape:

```ts
type LocaleText = { en: string; zhHans: string; zhHant: string };
type CardGroup = "profile" | "education" | "internship" | "project";
type SkillTrackId = "llm-ai" | "ai-vision" | "software-data" | "iot-device";
type SkillFilter =
  | { kind: "track"; id: SkillTrackId }
  | { kind: "skill"; id: string }
  | null;
type Card = {
  id: string;
  group: CardGroup;
  title: LocaleText;
  subtitle?: LocaleText;
  role?: LocaleText;
  timeLabel: LocaleText;
  startDate?: string;
  endDate?: string;
  summary: LocaleText;
  details: {
    overview: LocaleText;
    whatIDid: LocaleText[];
    technicalDecisions?: LocaleText[];
    outcomes?: LocaleText[];
    tech?: LocaleText;
    links?: { label: LocaleText; url: string }[];
    sections?: {
      id: string;
      title: LocaleText;
      paragraphs?: LocaleText[];
      items?: LocaleText[];
      metrics?: LocaleText[];
      links?: { label: LocaleText; url: string }[];
      media?: { src: string; alt: LocaleText; caption?: LocaleText }[];
    }[];
  };
  skills: string[];
  trackIds: SkillTrackId[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  emphasis?: "primary" | "normal" | "secondary";
};
```

Data validation checks:

- every card has `title`, `timeLabel`, `summary`, and `details.overview` in all three languages,
- every card skill references an existing skill id,
- every card capability track references an existing stable track id,
- structured detail sections validate translated titles, content, links, and media,
- skill ids and card ids are unique,
- links have labels and URLs,
- connections point to existing cards.

## Manual QA Checklist

Desktop:

- Open at 1440 x 900 and 1920 x 1080.
- Confirm profile, sidebar, canvas, and minimap are visible.
- Pan and zoom the canvas.
- Click sidebar cards and groups to center them.
- Open and close details.
- Click Python, LLM, and YOLOv5 skill tags.
- Confirm minimap viewport follows and click-to-recenter works.

Language:

- Switch EN / 简 / 繁.
- Refresh and confirm the choice persists.
- Confirm `document.documentElement.lang` updates.

Mobile:

- Check 390 x 844, 430 x 932, and 768 x 1024.
- Confirm no horizontal overflow.
- Confirm language switcher, tabs, skill filtering, and detail drawer work.

Export:

- Serve `dist-static/` with a static server.
- Confirm it does not call local API endpoints.
- Confirm no editor UI appears.

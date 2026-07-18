# Next Phase Changelog

## Fixed

- Mounted `EditorPanel` only in editor mode and changed `npm run editor` to start Vite with `VITE_APP_MODE=editor`.
- Removed editor save/export code from public viewer builds through compile-time mode gating.
- Fixed public data loading so exported viewers read embedded data first, then `data.json`, then the bundled seed.
- Fixed normal and single-file static export paths so edited portfolio data is exported consistently.
- Fixed single-file export asset handling for built JS, CSS, and portfolio JSON.
- Passed real canvas viewport dimensions to the minimap so minimap recentering can use current canvas size.
- Added mobile header language switching so language controls are visible without opening the drawer.
- Fixed profile-card name rendering: English shows `WANG Zouheyi` only; Chinese modes show the Chinese name with `WANG Zouheyi` on the second line.
- Added portfolio validation before editor save/export and before static export.
- Added editor save backup plus temp-file-and-rename writes before replacing `data/portfolio.json`.
- Fixed the initial-fit race that allowed the container-size sync effect to overwrite the fitted canvas viewport with `scale: 1`.
- Replaced passive React wheel handling with a native non-passive listener so wheel zoom can prevent browser scrolling without console errors.
- Cleared the active skill filter when the user clicks blank canvas space.

## Improved

- Added SEO title, description, Open Graph, Twitter card metadata, and favicon.
- Added stable relative Vite base path support with `VITE_BASE` override for GitHub Pages-style deployment.
- Hardened mobile root/list containers against horizontal overflow.
- Updated README with current public/editor mode behavior, export behavior, GitHub Pages notes, 404 fallback notes, font strategy, and maintenance workflow.
- Added a no-dependency `npm run lint` script mapped to TypeScript static checking.
- Removed stale unused `TopToolbar` and unused minimap/export plumbing.
- Removed all bundled fonts and font preloading; titles now use system serif/Songti stacks and all other UI uses system sans-serif stacks.
- Reorganized the desktop cards into four centered timeline lanes with shared lane coordinates and consistent 96px gaps.
- Unified zoom buttons, keyboard navigation, reset, sidebar focus, and minimap recentering on a cancellable 280ms `easeOutCubic` viewport animation.
- Changed desktop and mobile card borders from dashed to solid.
- Left-aligned all four desktop timeline lanes, enlarged the cards, and tightened tag sizing so every tag remains visible.
- Increased card title weight, allowed longer summaries, and let sidebar project names wrap without clipping.

## Data Changes

- Reordered PolyU before INSA and removed the `Expected` qualifier from the PolyU July 2026 graduation date.
- Renamed the radar internship, UAV FYP, machine-vision football robot car, and Sushiro queue status/prediction projects in all locales.
- Export validation confirmed the current public data has 11 cards and 73 skills.
- Export validation confirmed FYP remains present and the Simplified Chinese FYP subtitle is `毕业设计`.
- Export validation did not find a phone number in the exported portfolio JSON.

## Public Build / Export

- Normal export writes `dist-static/index.html`, `dist-static/data.json`, `dist-static/assets/*`, and `dist-static/favicon.svg`.
- Single-file export writes one `dist-static/index.html` with inline CSS, inline JS, and embedded portfolio data.
- Normal export is about 308 KB and single-file export is about 280 KB; neither contains font files, `@font-face`, or font data URLs.
- Public viewer bundle static check found no `__heyi_save`, `/api/portfolio`, or `/api/export` strings after compile-time editor stripping.

## Tests Run

| Command | Result | Notes |
|---|---|---|
| `npm run typecheck` | Pass | `tsc --noEmit`. |
| `npm run lint` | Pass | Currently aliases `tsc --noEmit`; no ESLint config exists. |
| `npm run build` | Pass | Viewer default production build. |
| `npm run build:viewer` | Pass | Explicit `VITE_APP_MODE=viewer` build. |
| `npm run build:editor` | Pass | Explicit `VITE_APP_MODE=editor` build. |
| `npm run export` | Pass | Required escalation because sandbox blocks `tsx` temp IPC pipe; final `dist-static/` left in normal deployable form. |
| `npm run export:single` | Pass | Required escalation for the same `tsx` temp IPC pipe; verified inline data/assets and no bundled fonts. |
| `npm test` | Not run | No `test` script exists in `package.json`. |

## Manual QA

| Area | Result | Notes |
|---|---|---|
| Static export structure | Pass | Verified normal export files, `data.json`, relative assets, favicon, sub-1 MB size, and no bundled fonts. |
| Single-file export structure | Pass | Verified one-file output with embedded data, inline CSS/JS, sub-1 MB size, and no bundled fonts. |
| Data quality | Pass | Static exported data check found 11 cards, 73 skills, FYP present, `毕业设计`, and no phone number. |
| Desktop browser interaction | Pass for layout/motion scope | Verified full initial framing at 1440x900 and 1920x1080, solid borders, system fonts, animated zoom/sidebar/minimap, repeated input, wheel interruption, and reduced-motion fallback. |
| Mobile browser interaction | Pass for layout/style scope | Verified 390x844 and 430x932 list rendering, system fonts, solid borders, and zero horizontal overflow. |
| Card content/layout follow-up | Pass | Verified left-aligned lanes, PolyU-before-INSA order, complete desktop tags, wrapped Chinese/English long titles, and blank-canvas skill-filter clearing. |
| Editor workflow | Not fully run | Build and code path verified; needs local browser pass for edit/save/reload/duplicate/delete/export. |

## Remaining Issues

- `ACCEPTANCE_REPORT.md` was not present, so this phase used repo-derived acceptance issues.
- `npm run lint` is a TypeScript static check, not a style linter.
- Editor interaction and unrelated detail/skill flows still need a full manual regression before a broader product release.

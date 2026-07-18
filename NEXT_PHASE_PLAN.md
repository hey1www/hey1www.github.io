# Next Phase Plan

## 1. Acceptance Summary

`ACCEPTANCE_REPORT.md` was not present in the repository, so this phase uses a repo-derived acceptance pass. No P0 product blocker was found during static inspection. The main blockers are editor reachability, static export data loading, single-file export, minimap recentering, and mobile language access.

## 2. Issues to Fix

### P0

- No product P0 identified from the current repository state.
- Acceptance report missing; issue classification is based on current code inspection.

### P1

- `P1-01` Editor mode is not reachable through `npm run editor`, and `EditorPanel` is not mounted.
- `P1-02` Public viewer ignores `dist-static/data.json` and single-file embedded portfolio data.
- `P1-03` `export:single` does not correctly inline built asset URLs or font assets.
- `P1-04` Minimap recentering receives `canvasSize` as `{ width: 0, height: 0 }`.
- `P1-05` Mobile language switching is hidden inside the menu drawer.

### P2

- `P2-01` Public/editor isolation can be stricter; public mode should not expose editor save hooks.
- `P2-02` Editor saves need validation, backup, and atomic writes.
- `P2-03` `/api/export` should align with the static viewer data loading path.
- `P2-04` SEO, Open Graph, favicon, title, description, and deployment asset paths are incomplete.
- `P2-05` `npm run lint` is required but no script exists.
- `P2-06` README is stale around fonts, GitHub Pages, export, and maintenance.
- `P2-07` Mobile layout needs hardening for readability and overflow.

### P3

- Remove or explain unused/stale pieces such as `TopToolbar`, `minimapCards`, `SEED_FILE`, and stale comments.
- Polish aria labels, hover/selected states, and minor text inconsistencies where low cost.

## 3. Implementation Plan

| Step | Issue IDs | Files likely affected | Risk | Expected outcome |
|---|---|---|---|---|
| 1 | Report missing, all | `NEXT_PHASE_PLAN.md` | Low | Create this plan and document repo-derived issue classification. |
| 2 | P1-01, P2-01 | `package.json`, `src/App.tsx`, `src/components/Editor/EditorPanel.tsx` | Medium | Editor mode runs with `VITE_APP_MODE=editor`, mounts editor UI only in editor, and public viewer exposes no save hook. |
| 3 | P1-02, P1-03, P2-03 | `src/data/portfolio.ts`, `server/export-static.ts`, `server/local-server.ts` | High | Viewer reads embedded export data, then `data.json`, then seed; export outputs deployable normal and single-file builds. |
| 4 | P2-02 | `server/local-server.ts`, `src/utils/portfolioValidation.ts` | Medium | Saves validate payloads, create backups, and write atomically. |
| 5 | P1-04 | `src/App.tsx`, `src/components/Canvas/Canvas.tsx`, `src/components/Layout/MiniMap.tsx` | Medium | Minimap gets real viewport size and recenters correctly. |
| 6 | P1-05, P2-07 | `src/components/Layout/AppShell.tsx`, `src/components/Canvas/MobileListView.tsx` | Medium | Mobile top bar has language switcher; mobile card flow remains readable and without horizontal overflow. |
| 7 | P2-04, P2-06 | `index.html`, `vite.config.ts`, `public/favicon.svg`, `README.md` | Low | Public metadata and deployment docs are production-ready. |
| 8 | P2-05, P3 | `package.json`, stale props/comments | Low | `npm run lint` exists; unused or stale code is cleaned where safe. |
| 9 | Final reporting | `CHANGELOG_NEXT_PHASE.md` | Low | Changelog records fixes, public export changes, tests, QA, and remaining issues. |

## 4. Testing Plan

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run build:viewer`
- `npm run build:editor`
- `npm run export`
- `npm run export:single`

Manual checks:

- Desktop: 1440 x 900 and 1920 x 1080, canvas opens, sidebar works, pan/zoom works, details open/close, skill highlight works, minimap follows and recenters.
- Language: EN, simplified Chinese, traditional Chinese, refresh persistence, and correct `document.documentElement.lang`.
- Mobile: 390 x 844, 430 x 932, 768 x 1024; no horizontal overflow, readable card flow, language switcher visible, tabs and skills usable.
- Editor: run editor, edit/save/reload, duplicate/delete, export, and confirm public build has no editor controls.
- Static export: serve `dist-static` without localhost API, verify interactions and no editor UI.
- Single export: open exported single file via static server or browser and verify data/styles/fonts load.

## 5. Out of Scope

- Do not redesign the project into a traditional resume page.
- Do not remove the desktop Canvas + Sidebar + Minimap structure.
- Do not remove education / internship / project rows.
- Do not add new external font dependencies or unauthorized font files.
- Do not introduce a new backend, database, routing framework, or heavy state framework.
- Do not spend this phase on fine typography changes beyond readability and public readiness.

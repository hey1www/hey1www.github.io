# FYP Route Visual — Future Implementation Plan

## Purpose

Add a compact, immediately understandable comparison between the geometrically shortest UAV route and a route that remains inside cellular coverage. This is deliberately deferred: the current FYP redesign must not render a placeholder, empty frame, or “coming soon” treatment.

## Visual language

- Coverage area: translucent blue-grey circles with a thin navy outline.
- Ground base station: solid navy point with a short `GBS n` label.
- Shortest straight route: red dashed line that visibly crosses an uncovered gap.
- Communication-feasible route: solid blue route passing through overlapping coverage areas.
- Active serving station: green ring and a subtle coverage fill increase.
- Handover direction: small arrowheads or a moving route marker, with no decorative map chrome.
- Legend: coverage, base station, shortest route, feasible route, and active handover.

The visual must stay schematic. It must not imply real geographic coordinates, radio propagation accuracy, or a production-flight map.

## Component contract

Create a reusable React component rather than a static asset:

```ts
type UavRouteVisualProps = {
  variant: "card" | "detail";
  locale: "en" | "zhHans" | "zhHant";
  paused?: boolean;
  className?: string;
};
```

- Use an HTML `<canvas>` so circles, paths, and animation scale as one scene without adding an authored SVG asset.
- Keep all scene coordinates in a normalized `0–1` coordinate system.
- Provide one deterministic scene shared by card and detail variants.
- Draw at `devicePixelRatio` resolution while sizing through CSS pixels.
- Observe container size with `ResizeObserver`; redraw without changing animation state.
- Mark the canvas itself `aria-hidden="true"` and provide a localized text explanation and legend outside it.

## Animation

1. Draw all coverage circles and ground base stations.
2. Reveal the red dashed straight route.
3. Reveal the blue feasible route from start to destination.
4. Highlight serving base stations in route order.
5. Pause on the completed state, then repeat.

Use a total cycle of approximately 6–8 seconds. The animation must be driven by `requestAnimationFrame`, cancelled on unmount, and paused when the document is hidden.

When `prefers-reduced-motion: reduce` is active, render the completed scene with every handover station visible and do not start an animation loop.

## Responsive variants

### Card

- Target height: `110–130px` inside the featured FYP card.
- Keep labels minimal; use the external legend only if it fits without reducing KPI readability.
- Hide secondary station labels below an effective width of `420px`.

### Detail drawer

- Target aspect ratio: approximately `16:7`, using the full drawer content width.
- Show the full legend and a one-sentence explanation.
- Keep route and station hit areas non-interactive in the first version.

## Future integration points

- Featured desktop card: between the project summary and the three KPI cells.
- Featured mobile card: full-width, above the KPI cells.
- FYP detail: inside the `problem` section, after the explanation that signal at the start and destination does not guarantee signal along the straight route.
- Do not add the component to other project cards unless a future data field explicitly selects this visual.

## Accessibility and localization

- Localize legend labels and the explanatory sentence in all three portfolio locales.
- Do not communicate route feasibility through colour alone; preserve dashed vs solid line styles and explicit labels.
- Maintain at least 3:1 contrast for diagram lines and 4.5:1 for text.
- Ensure the text alternative communicates: “the straight route crosses an uncovered region, while the feasible route follows overlapping base-station coverage and changes serving stations.”

## Acceptance criteria

- No layout shift when the canvas initializes or resizes.
- Sharp output on standard and Retina displays.
- Card and detail variants depict the same base stations and route sequence.
- Red straight route visibly leaves coverage; blue route remains within overlapping coverage regions.
- Serving stations highlight in the correct order and the loop does not leak animation frames.
- Reduced-motion mode is static.
- English, Simplified Chinese, and Traditional Chinese labels fit without clipping.
- Normal and single-file static exports retain identical behaviour.
- Browser QA covers `1440×900`, `1280×800`, and `390×844`.

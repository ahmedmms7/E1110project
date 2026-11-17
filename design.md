# Gardening Buddy — Design

## Core deliverables update
Header: five direct section links and transparent University of Strathclyde Bahrain logo instead of CTA. Engineering: original vector schematic only, always-visible filterable net table, eight native SVG hardware cards and component-document links. Remove browser screenshots from rendered UI. References and Contact Team are prominent main-body sections immediately after engineering; findings visible by default. Team cards expose email, mailto and copy controls. Lower-priority evidence/sustainability remain below the core deliverables. Add immediate QR-visitor jump links. Preserve responsive layout and transparent logos (dark lettering adaptation for light header).

> Starter design brief. Replace this content with the app you're building before writing any UI.
> Keep it short and concrete — it's the single source of truth for palette, typography, pages,
> screens, and flows across web, mobile, and desktop.

Responsive E1110 engineering exhibit, web only. Approved custom Apple-inspired warm-white / forest-green direction; no gallery template. Frontend-only with no database or API additions.
Use Manrope display/body and IBM Plex Mono metadata. Chalk #f6f7f2, forest #203a2c, sage #80917f, lime #c6eaa8. 1280px content width, generous whitespace, asymmetric oversized editorial hero, subtle pill controls. Dark forest simulator and footer. Uploaded university logos on dark backgrounds.
300vh reversible sticky SVG hardware stage: illustrative modules and enclosure, not dimensionally accurate CAD. Exact supplied electrical net mappings; all telemetry simulated. Eight interactive module hotspots, accessible bus filters, reduced-motion support. Four-tab real-image gallery with keyboard/touch zoom and pan. Published sensor statistics attributed to studies, not prototype performance; simulator thresholds illustrative.
Sections: hero, 11-net architecture, simulator, engineering viewer, evidence, Bahrain/SDGs, nine hardware documents, eleven user-supplied numbered references, four updated team contacts. UI implemented in components/showcase.tsx and composed by pages/index.tsx; shared style here and styles.css.

## Brand & Colors

One token set, consumed per platform:

- **Web & desktop**: CSS variables in `packages/web/src/web/styles.css` (desktop loads the web UI).
- **Mobile**: `Colors.light` / `Colors.dark` in `packages/mobile/constants/theme.ts`, read via `useColors()`; `userInterfaceStyle: "automatic"` follows the system light/dark setting.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| primary | #1F1F1F | #E5E5E5 | Buttons, active tab, accents |
| background | #FFFFFF | #0A0A0A | Page/screen background |
| card | #FFFFFF | #1A1A1A | Cards, surfaces |
| foreground | #171717 | #FAFAFA | Primary text |
| mutedForeground | #737373 | #A3A3A3 | Secondary text |
| border | #E5E5E5 | #262626 | Hairlines |
| destructive | #DC2626 | #EF4444 | Delete / errors |

## Typography

Name the display + body pairing here. Web: set font families in `styles.css` (self-hosted files go in `packages/web/public/fonts/`). Mobile: system font by default; load custom fonts with `useFonts` from `expo-font` and reference them via `Fonts` in `constants/theme.ts`.

## Pages & Screens

List each page/screen, its route file, and what it shows. Example:

- **Web — Home** (`packages/web/src/web/pages/index.tsx`) — what the user sees first.
- **Mobile — Home** (`packages/mobile/app/(tabs)/index.tsx`) — main tab.
- Add web pages under `src/web/pages/` (+ route in `app.tsx`); mobile tabs under `app/(tabs)/`, stack/modal screens under `app/`.

## Key User Flows

1. Describe the primary flow end to end (open → action → result).
2. ...

## Architecture

- **API**: typed oRPC client (`lib/api.ts` in each package) → the backend in `@template/web`. Query/mutation hooks live in `queries/` (one file per feature); pages/screens call them with `@tanstack/react-query`.
- **State/sync**: TanStack Query with optimistic updates for instant-feel interactions.
- **Auth / payments / uploads**: see `skills/app/references/` when those features are needed.

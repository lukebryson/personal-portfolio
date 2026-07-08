# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server at http://localhost:4321
- `npm run build` — static production build to `dist/`
- `npm run preview` — serve the built `dist/`
- `npx astro check` — TypeScript/Astro diagnostics (no test suite exists; this is the verification gate alongside a clean build)

## Source-of-truth documents

- **`build-brief.md` is the authoritative spec** for copy, design tokens, animation behaviour, responsive rules and accessibility requirements. Content in §3 is verbatim — don't rephrase it. Don't ask the user for information already in the brief.
- **`Luke Bryson Portfolio.html` is reference-only** — a Claude Design export on a proprietary runtime. Never import or copy code from it; it exists to check visual/behavioural intent.
- Placeholder links (Download CV, project card arrows) are deliberately inert `#` hrefs styled like real links — never convert them to "coming soon" states. Luke supplies real URLs later.

## Architecture

Single-page Astro 5 static site, no UI framework, no client-side dependencies. One page (`src/pages/index.astro`) assembles section components from `src/components/`; `src/layouts/Layout.astro` owns head/meta, font imports (Fontsource, self-hosted) and the global fixed elements (scroll progress bar, script entry).

**Styling:** design tokens live as CSS custom properties in `src/styles/global.css` (`--accent` is the single knob for the brand colour family), plus shared utilities (`.inner`, `.eyebrow`, `.section-title`), keyframes, reveal states and cursor styles. Everything section-specific is scoped `<style>` inside its component. Styles for JS-created elements (custom cursor) must live in `global.css` — Astro's scoped selectors won't match them.

**Interactivity:** all behaviour hangs off `data-*` attributes in the markup (`data-reveal`, `data-magnetic`, `data-magnet`, `data-particles`, `data-parallax`, `data-spotlight`, `data-tilt`, `data-nav`, `data-navlink`, `data-progress`). `src/scripts/main.ts` is the only entry point; it owns two `matchMedia` capability gates and decides which modules initialise:

- `(prefers-reduced-motion: reduce)` → no canvas loop (static frame instead), no parallax/tilt/magnet/cursor; reveals become opacity-only fades (handled in CSS).
- `(hover: hover) and (pointer: fine)` → cursor, magnetic, tilt and spotlight effects only exist on hover-capable devices.

New effects must go through these gates, use passive rAF-coalesced listeners, and cache rects on pointerenter rather than reading layout in move handlers. Exact animation parameters (distances, degrees, easings, thresholds) are specified in brief §4 — match them, don't invent.

**Progressive enhancement:** an inline head script adds the `js` class to `<html>`; all reveal "hidden" states are scoped under `html.js` so no-JS users and crawlers get fully visible content. There is intentionally **no** blanket reveal-all timeout — the IntersectionObserver handles visibility (a timeout would neutralise below-fold reveal animations).

## Deliberate deviations from the reference design

- Readable text at `#5c5c63` fails WCAG AA on this background — it was lightened to `#8b8b93` (`--text-faint`) wherever text is meant to be read; `--text-ghost` (`#5c5c63`) remains only on decorative elements (scroll cue, `(04)` counter).
- Scroll reveal uses IntersectionObserver (brief's instruction) rather than the reference's scroll listener.

## Repo conventions

- Work is committed in section-scoped increments so Luke can review per commit.
- Git identity is repo-local (`Luke Bryson <lukeb73@outlook.com>`).
- Deploy target is Vercel (static, no adapter). Deployment to a public URL needs an IT/security review sign-off first per Luke's org policy — flag it, don't just ship it.

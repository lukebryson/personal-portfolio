# Luke Bryson — Portfolio

Personal portfolio site for Luke Bryson, Cloud Technical Engineer. A single-page static site built with [Astro 5](https://astro.build) and vanilla TypeScript — no UI framework, no client-side dependencies, self-hosted fonts.

The full spec (content, design tokens, animation behaviour, responsive and accessibility requirements) lives in [`build-brief.md`](build-brief.md).

## Getting started

Requires Node.js 18+ and npm.

```sh
npm install
```

### Development

```sh
npm run dev
```

Starts the dev server at http://localhost:4321 with hot reload.

### Build

```sh
npm run build
```

Outputs the static site to `dist/`. Preview the production build locally with:

```sh
npm run preview
```

### Type checking

```sh
npx astro check
```

## Project layout

```
src/
  pages/index.astro      single page, assembles the sections
  layouts/Layout.astro   head/meta, fonts, global fixed elements
  components/            one .astro component per section
  scripts/               vanilla TS effect modules (main.ts is the entry)
  styles/global.css      design tokens, shared utilities, keyframes
public/                  logo, favicon, OG image
```

All animation is gated on `prefers-reduced-motion` and pointer capability — touch devices and reduced-motion users get a calmer, fully functional site.

## Placeholders

- **Download CV** and the four **project card links** are inert `#` links until the real URLs/PDF are supplied.
- OG image and full SEO pass are pending final content.

## Deploying

Static output — zero-config on Vercel (no adapter needed). Pushes get automatic preview URLs once the repo is connected.

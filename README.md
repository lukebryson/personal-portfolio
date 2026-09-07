# Luke Bryson- Portfolio

This is my personal portfolio. 

It's a single-page static site built with [Astro 7](https://astro.build) and vanilla TypeScript- no UI framework, no client-side dependencies, self-hosted fonts.

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

All animation is gated on `prefers-reduced-motion` and pointer capability- touch devices and reduced-motion users get a calmer, fully functional site.

## Placeholders

- **Download CV** and the four **project card links** are inert `#` links until the real URLs/PDF are supplied.

## Deploying

Static output deployed to [Cloudflare Workers](https://workers.cloudflare.com). `wrangler.jsonc` holds the config, including the `lukebryson.dev` apex domain as a `custom_domain` route.

```sh
npm run deploy
```

Runs `astro build && wrangler deploy`. The repo is also connected to Cloudflare's Git integration, so pushes build automatically and pull requests get commit and branch preview URLs.

`site` is set to `https://lukebryson.dev` in `astro.config.mjs`- `Layout.astro` derives the canonical link and the `og:`/`twitter:` tags from it, so those resolve to absolute production URLs even when viewed on a preview deployment.

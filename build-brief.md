# Luke Bryson Portfolio — Build Brief

## 0. What this document is

This is the spec for building a production portfolio site. A reference file
(`Luke_Bryson_Portfolio.html`) exists from a Claude Design session — **do not
use it as source code.** It runs on Claude Design's proprietary component
runtime (`DCLogic`, `sc-for` loops, a canvas/print bootstrapping script) and
is not deployable. Treat it as the source of truth for: copy, layout,
palette, type, and the *logic* of each animation — then reimplement cleanly.

**Enter plan mode before writing any code.** Confirm project structure,
component breakdown, and build tooling before generating files.

---

## 1. Stack

- **Astro** (static output, component-based authoring, ships zero JS by
  default — only the interaction script we actually need)
- **Vanilla TypeScript** for all interactivity (canvas particle hero,
  magnetic card hover, scroll reveals, nav scroll state, parallax, cursor,
  contact tilt). No React/Vue — there's no app state here, just DOM/canvas
  effects.
- **Deploy target: Vercel.** Zero-config for Astro, automatic preview URLs
  per push, easy custom domain later.

## 2. Design tokens

**Colour**
```
--bg:            #08080a
--bg-alt:        #0a0a0c
--bg-card:       #0e0e11 / #0f0f12 (gradient 141418 -> 0f0f12)
--border:        rgba(255,255,255,.07–.14) depending on emphasis
--text-primary:  #ededf0
--text-secondary:#b6b6bd
--text-muted:    #9a9aa2
--text-faint:    #5c5c63 / #8b8b93
--accent:        #c41414 (default) — configurable, brand family:
                  #c41414, #e0332f, #b81d1d, #a01212
--silver-grad:   linear-gradient(180deg, #f5f5f5 0%, #d2d2d8 52%, #8f8f96 100%)
--status-good:   #9fe0b0 (cert "passed" dot)
```

**Type**
- Display/headings: **Space Grotesk** (600–700 weight)
- Body: **IBM Plex Sans** (400–500)
- Mono/labels/eyebrows: **IBM Plex Mono** (500, wide letter-spacing ~0.28em)
- Hero name: `clamp(56px, 10vw, 140px)`, weight 700, line-height 0.9,
  letter-spacing -0.035em, silver gradient text-fill, red full stop.

**Spacing/shape**
- Section padding: ~110–130px vertical, 40px horizontal (desktop)
- Card radius: 14–16px
- Pill radius: 100px (nav links, buttons)

## 3. Content (verbatim — use exactly as written)

### Nav
Logo mark + "Luke Bryson" · links: About, Work, Skills, Certs · CTA button
"Get in touch" → `#contact`

### Hero
- Eyebrow: `CLOUD TECHNICAL ENGINEER`
- H1: `Luke Bryson.` (silver gradient, red full stop)
- Subhead: "I build and untangle solutions across SharePoint, the Power
  Platform and Microsoft's AI stack — at an MSP, usually with a soft spot
  for the messy edge cases most people would rather avoid."
- Stats row: `3×` Microsoft certified · `L4` SWE apprentice · EPA stage ·
  `MSP` Microsoft cloud, daily
- Scroll cue: "SCROLL" + animated bar

### About
- Eyebrow: `ABOUT`
- H2: "Equal parts systems thinking and things people actually enjoy using."
- Para 1: "I'm a Cloud Technical Engineer at a managed service provider —
  which is a polite way of saying I get handed a lot of different problems
  across a lot of different tenants, and I genuinely like it that way. Most
  of my week lives in SharePoint, the Power Platform, and increasingly the
  AI side of Microsoft's stack."
- Para 2: "I'm finishing a Level 4 Software Engineering apprenticeship —
  currently at the End-Point Assessment stage — which has been a great
  excuse to get deliberate about the engineering fundamentals sitting under
  all the low-code. I care about solutions that are maintainable, properly
  deployed, and pleasant to actually live with."
- Info grid: ROLE "Cloud Technical Engineer, MSP" · BASED "UK · working
  remotely" · STUDYING "L4 Software Engineering · EPA" · FOCUS "SharePoint ·
  Power Platform · AI"

### Work (4 cards)
1. **SPFx Incident-Management Web Part** — "React Flow swim-lane diagrams
   that turn tangled incident timelines into something a team can read at a
   glance." Tags: SPFx, React, React Flow, TypeScript
2. **Power Automate → Dataverse ALM** — "Rebuilt a sprawl of cloud flows as
   a managed Dataverse solution with real ALM — repeatable, promotable, no
   more copy-paste deployments." Tags: Power Automate, Dataverse, Solutions
   & ALM, Managed Env
3. **Personal Budgeting App** — "Open Banking data, a Telegram bot
   front-end and the Claude API — a budgeting companion that nudges me so I
   don't chase a spreadsheet." Tags: Open Banking, Telegram, Claude API,
   Node
4. **power-platform-architect** — "An AI tooling skill that scaffolds
   Power Platform architecture calls — turning 'where should this logic
   live?' into a guided answer." Tags: AI Tooling, Copilot Studio, Prompt
   Design

Cards use placeholder links for now (see §7).

### Skills (4 groups)
- **SharePoint**: SPFx, PnP, Site Architecture, Lists & Libraries,
  Permissions, Search
- **Power Platform**: Power Automate, Power Apps, Dataverse, Solutions &
  ALM, Power Fx, Managed Env
- **Azure / AI**: Copilot Studio, Azure AI Foundry, Azure Functions, AI
  Agents, Prompting
- **Dev Tooling**: TypeScript, React, Node, Git, PowerShell, CI/CD

### Certifications
- PL-200 — Power Platform Functional Consultant — PASSED
- AI-901 — Microsoft Azure AI — PASSED
- AB-620 — Microsoft Certified — PASSED
- PL-400 — Power Platform Developer — IN PROGRESS (progress bar ~62%)
- Subhead: "Three passed, one in progress — with PL-400 the next on the
  list."

### Contact
- Eyebrow: `SAY HELLO`
- H2: "Let's talk shop."
- Body: "I'm not chasing a new seat right now — but I'm always happy to
  compare notes, swap war stories, or nerd out about the Power Platform. My
  inbox is open."
- Links: `mailto:lukeb73@outlook.com`, LinkedIn
  (linkedin.com/in/luke-bryson), GitHub (github.com/lukebryson), Download
  CV (placeholder, see §7)
- Footer: logo + "LUKE BRYSON" · "© 2026 Luke Bryson · Cloud Technical
  Engineer"

## 4. Animation/interaction spec

Reimplement these behaviours in TypeScript — logic reference only, not the
literal code:

1. **Hero canvas particle network** — ~54 floating points with drifting
   velocity, connecting lines drawn between points within ~155px, red tint
   for ~15% of particles, mouse-proximity lines strengthen near cursor.
   Redraw on resize.
2. **Magnetic project cards** — on mousemove within a card: subtle
   translate + 3D tilt (rotateX/Y) toward cursor, radial glow following
   cursor position, border colour and box-shadow shift to accent red, arrow
   icon nudges up-right and recolours. Spring back on mouseleave.
3. **Magnetic buttons** (`data-magnet`) — nav CTA, contact links: subtle
   translate toward cursor within the button, spring back on leave.
4. **Section spotlight** — hero section gets a soft radial gradient
   following cursor, fades in/out.
5. **Scroll reveal** — elements fade up (translateY 28px → 0, opacity 0→1)
   on intersection, staggered by a `delay` value per element, via
   IntersectionObserver.
6. **Nav scroll state** — nav background goes transparent → blurred dark
   (backdrop-filter) past 40px scroll, padding tightens; active section
   link highlighted via IntersectionObserver on section ids.
7. **Scroll progress bar** — fixed 2px top bar, scaleX tracks scroll
   position, accent-coloured with glow.
8. **Hero parallax** — hero content translates/fades slightly as user
   scrolls through the first viewport.
9. **Contact logo tilt** — 3D tilt on the footer/contact logo following
   cursor position within the section, perspective transform.
10. **Custom cursor** (desktop only, hover-capable devices) — dot + lagging
    ring that follows cursor, ring grows and recolours over interactive
    elements. Disable entirely under `(hover: none)`.

**Respect `prefers-reduced-motion: reduce`** — disable canvas animation,
parallax, cursor follow, and card tilt; keep simple opacity fades only.

## 5. Responsive requirements (undefined in the Design reference — needs building)

- **Breakpoints**: mobile (<640px), tablet (640–1024px), desktop (1024px+)
- Hero stat row: wrap to 2 columns or stack vertically below 640px
- About grid (0.85fr/1.15fr): collapse to single column below 900px
- Work grid (2 columns): single column below 768px
- Skills grid: already `auto-fit minmax(230px,1fr)` — fine as-is
- Nav: collapse links into a hamburger/menu below ~700px; keep logo + CTA
  visible
- Disable magnetic tilt and custom cursor on touch devices
  (`(hover: none)` / `(pointer: coarse)`)
- Reduce hero type size and section padding proportionally on mobile
  (current clamp() values need re-checking against small viewports)

## 6. Assets

- Logo: `lb-logo.svg` (transparent background, scalable) — use in nav and
  footer at small sizes
- `lb-logo-512.png`, `lb-favicon-64.png` — favicon and OG image base
- All provided in this conversation's outputs

## 7. Placeholders to swap later

- CV file: link to `/assets/cv.pdf`, doesn't exist yet — Luke will provide
- Project card links: currently non-functional arrows — wire up to `#` for
  now, Luke will supply repo/case-study URLs later
- Add a favicon, `<title>`, and basic meta description now; OG image and
  full SEO pass can come after content is finalised

## 8. Accessibility

- Ensure all interactive elements are keyboard-reachable and have visible
  focus states (the reference design has none defined)
- Check contrast on muted text (`#5c5c63` on `#08080a` is borderline —
  verify against WCAG AA for any body-sized text using it)
- `prefers-reduced-motion` handling per §4
- Alt text on logo images

## 9. Suggested file structure

```
src/
  components/
    Nav.astro
    Hero.astro
    About.astro
    Work.astro
    WorkCard.astro
    Skills.astro
    Certifications.astro
    Contact.astro
  scripts/
    particles.ts
    magnetic.ts
    reveal.ts
    navScroll.ts
    cursor.ts
  styles/
    tokens.css
  pages/
    index.astro
public/
  lb-logo.svg
  favicon.ico (from lb-favicon-64.png)
```

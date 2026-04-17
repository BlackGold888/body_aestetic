# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Single-page marketing site for "AIURU Tashkent" — a body-aesthetic studio (Russian-language copy, theme "убираем живот и бока без спортзала и диет"). The site is built from a repurposed TemplateMo "Barber Shop" Bootstrap template; filenames/class names like `templatemo-barber-shop.css`, `images/barber/`, and `.hero-section` are legacy from that template and do **not** reflect the product.

## Stack & build

- **No build system, no package manager, no tests.** Pure static HTML/CSS/JS served directly.
- **Runtime deps** (all vendored under `css/` and `js/`): Bootstrap 5, Bootstrap Icons, jQuery. Fonts loaded from Google Fonts (Unbounded).
- **Local dev:** open `index.html` directly, or serve with any static server (e.g. `python -m http.server`). WebStorm's built-in server works out of the box.
- **Deploy:** copy the repo contents to any static host — there is nothing to compile.

## Architecture

Everything the user sees lives in a single file: [index.html](index.html) (~900 lines). It's structured as a fixed left `#sidebarMenu` sidebar plus a stack of anchor-linked sections in the right column:

| Anchor id       | Purpose   |
| --------------- | --------- |
| `#section_1`    | Hero      |
| `#section_cases`| Cases     |
| `#section_2`    | About     |
| `#section_3`    | Services  |
| `#section_4`    | Prices    |
| `#section_5`    | FAQ       |
| `#section_reviews` | Reviews |
| `#section_6`    | Contacts  |

The sidebar nav links use these ids — **adding/renaming a section means updating both the `<section id=...>` and every matching `href="#..."` in the sidebar and CTA buttons.**

### JS behavior

Only two small scripts, both jQuery-based:

- [js/click-scroll.js](js/click-scroll.js) — smooth-scrolls sidebar links to their target sections and toggles `.active`/`.inactive` on the currently visible section as the user scrolls. It builds its section list from the sidebar's `.nav-link[href^="#"]` anchors, so a new section only gets scroll-spy behavior once it's added to `#sidebarMenu`.
- [js/custom.js](js/custom.js) — collapses the mobile sidebar on nav click and provides a generic `.smoothscroll` handler for in-page CTA buttons.

There is overlap between the two scripts (both handle smooth scrolling); prefer extending `click-scroll.js` for sidebar-driven behavior and `custom.js` for arbitrary `.smoothscroll` buttons.

### Contact / conversion

The primary CTA is a Telegram link to `https://t.me/Body_aesthetic_aiuru` (often with a `?text=...` prefill). A floating Telegram button (`.telegram-floating`) is rendered at the top of `<body>` and repeated inline throughout sections. When changing the Telegram handle or prefill text, search the whole file — it appears in many places.

### Styling

All custom styles live in [css/templatemo-barber-shop.css](css/templatemo-barber-shop.css). Bootstrap overrides and the colour palette (CSS custom properties) are defined at the top of that file. Stick to the existing custom properties rather than introducing new hex literals.

## Git & language conventions

- Recent commit style is short imperative English (`Add contact btn`, `update hero`) — match it.
- All user-facing copy is **Russian**. Preserve language/tone when editing text.

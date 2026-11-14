---
name: legume-content
description: "Use when adding, editing, restructuring or shipping content on le.railhead (james-gibson/le.railhead) — the local-time record of an RL environment where models play OpenTTD from a shell. Inherited from le.gume. Covers the one-file content model (src/content/<section>/<slug>.md), frontmatter and the `seeds:` membership, derived navigation, the three declared live routes, base-path-safe links, the publish guard's checks, the SSR route smoke test, the scheduled upstream check, GitHub Pages deploy, the house voice, and the PlopUI rule (tokens and props come from the installed package, not from memory). Trigger on: le.railhead, add a page to the record, update the scoreboard, write a brief or ops page, content model, publish guard, smoke test, deploy the record, restructure sections, derived navigation."
---

# le.railhead content

`le.railhead` (GitHub: `james-gibson/le.railhead`) is a child seed of
[le.gume](https://github.com/james-gibson/le.gume): React + Vite, content as Markdown, navigation
derived from the file tree, one publish guard, GitHub Pages on push **and on a daily schedule**.

Repo: `~/projects/personal/le.railhead`. Live: https://james-gibson.github.io/le.railhead/

The difference from the parent is the subject and the design system, not the pipeline. The record
describes `rachittshah/railhead` at a pinned commit; the site is the receipt.

## Contract

**In:** a topic, a correction, or a request to restructure the site.

**Out:** a change where

1. Content lives in exactly one Markdown file per page — no second list to update.
2. Frontmatter carries `title` and `description`; `order`, `updated`, `tags`, `seeds` are optional.
3. Every new page renders, appears in its section index in the right position, and reaches
   `llms.txt`.
4. `npm run build` passes — including the guard — and `npm run smoke` renders every route.
5. Copy is dry, technical and specific. A number is preferred to an adjective, and a stated limit
   is preferred to a hedge.

**Hard rules.**

- **Never maintain a navigation list.** `src/lib/content.ts` derives the nav, section indexes,
  `llms.txt` and the sitemap from `import.meta.glob('../content/**/*.md')`. A page missing from the
  nav means the file or its folder is wrong, not the nav.
- **Facts live in modules, not in prose.** Arena numbers are in `src/lib/arena.ts`, verifier gaps in
  `src/lib/gaps.ts`, the universe in `src/universes/railhead.ts`. A page that repeats a number is a
  page that can drift; a page that reads the module cannot.
- **Link with the mount in mind.** A raw `href` string needs `import.meta.env.BASE_URL`; the helper
  is `href()` in `src/lib/base.ts`. Internal Markdown links are written root-absolute
  (`/arena/scoreboard`) and the guard resolves every one of them.
- **Content is Markdown, never MDX.** A live widget is a route under `src/pages/`, declared once in
  `EXTRA_ROUTES`. Adding one means: the page, the entry, `scripts/postbuild.mjs`,
  `scripts/verify-publish.mjs`, `scripts/smoke.tsx`.
- **Do not add infrastructure the site argues against.** No search index, no CMS, no analytics, no
  database. The record is files on a CDN.
- **PlopUI props are read from the package, not remembered.** The source is
  `node_modules/@plop-ui/react/dist/**/*.d.ts`; the docs are `https://plopui.com/llms-full.txt`.
  Colour, shadow, corners and motion come from `--plop-*` tokens: never a hex, never a second
  palette. `/design` lists what the site uses, with the props it passes.

## Add a page

```bash
cd ~/projects/personal/le.railhead
# 1. write src/content/<section>/<slug>.md
# 2. frontmatter
```

```markdown
---
title: The free tier
description: One line that also serves as the nav subtitle and the llms.txt entry.
order: 4
updated: 2026-11-14
tags: arena, free-tier
seeds: reader
---

# The free tier

Body. `##` and `###` become the table of contents; `#` does not.
```

```bash
npm run build   # upstream check, tsc, vite, prerender, postbuild, guard
npm run smoke   # every route rendered server-side, including the 404
```

Sections are `brief`, `arena`, `verify`, `ops`, `seeds` (`SECTIONS` in `src/lib/content.ts`). A new
section is an entry there plus a folder — the header, footer, index and 404 pick it up.

A page may declare one or more `seeds:` ids. The ids must exist in `src/lib/seeds.ts`; membership is
derived from the pages, so the ladder on `/seeds` cannot disagree with the pages that claim it.

## Edit or restructure

- **Edit prose:** change the file, bump `updated` if the meaning changed. Do not touch routes.
- **Rename a slug:** the URL changes; `rg "old-slug" src` for cross-links, then rebuild. The guard
  fails on a link that resolves to nothing.
- **Reorder:** `order` within the section. Ties fall back to title order.
- **Change a published fact:** change the module it lives in, and the citation with it.

## Voice

Dry, precise, unafraid of cost. State the limit before the finding.

- Good: "One map, one game per model. Second and third place are 2.5% apart and could swap."
- Bad: "A groundbreaking benchmark that pushes the frontier."
- Good: "0.1.2 is unreleased; `v0.1.1` is the latest published tag."
- Bad: "The latest and greatest release."

The site quotes the upstream authors rather than paraphrasing their hedges away. When a number is
missing upstream, say it is missing.

## Child seeds ship back

This site inherited the parent's rules list (`upstream/rules.md`, vendored by
`scripts/sync-upstream.mjs`) and records exactly one override in `upstream/overrides.md`. When this
child invents something the parent does not have — the scheduled upstream check, the
`upstream.json` snapshot, a PlopUI composition — consider packaging it as an isotope and proposing
it upstream. A child-specific preference is not an isotope; declining is a valid answer.

## Files that matter

| Path | Role |
| --- | --- |
| `src/lib/content.ts` | Content model: glob, frontmatter, ordering, headings, `SECTIONS`, `EXTRA_ROUTES` |
| `src/lib/seeds.ts` | The seed registry and the readiness ladder |
| `src/lib/arena.ts` | Arena 2 as data, with the commit it was read from |
| `src/lib/gaps.ts` | The five open verifier holes, from the upstream tests |
| `src/lib/upstream.ts` | The snapshot: live if the check ran, else the pinned file |
| `src/universes/railhead.ts` | The local-time universe the `/universe` route renders |
| `src/components/plop/` | `paper.tsx` (the provider), `StatLine.tsx`, `StatusLegend.tsx` |
| `src/pages/` | The routes; the three live ones are declared in `EXTRA_ROUTES` |
| `scripts/upstream.mjs` | The scheduled check; writes `src/data/upstream.live.json` |
| `scripts/postbuild.mjs` | Shells, 404, sitemap, robots, `llms.txt`, `upstream.json`, `rules.md` |
| `scripts/verify-publish.mjs` | The guard; read it before arguing with it |
| `scripts/smoke.tsx` | Renders every route (and the 404) to a string |
| `.github/workflows/deploy.yml` | `npm ci && npm run build && npm run smoke` → Pages, on push and daily |

## Verification

1. `npm run build` — the guard must print `guard: clean`.
2. `npm run smoke` — every route, including the intentional miss.
3. `rg "old-slug|/src/|localhost|/Users/" src` before shipping a rename.
4. Load one deep link on the deployed site after the Actions run, not just the home page.

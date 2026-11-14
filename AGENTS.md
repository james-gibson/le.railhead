# Agent hints

## This repository

`le.railhead` is a public local-time record of `rachittshah/railhead`: an RL environment where
language models play OpenTTD from a shell. It is a child seed of `james-gibson/le.gume`, and the
shared context the studies team (`that-train-dashboard`) publishes its research changes against.

Live: https://james-gibson.github.io/le.railhead/ · Repo: `james-gibson/le.railhead`

## Commands

```bash
npm run dev       # vite
npm run build     # upstream check, tsc, vite, prerender, postbuild, guard   <- CI
npm run smoke     # render every route (and the 404) to a string
npm run guard     # the gate alone, against an existing dist/
npm run upstream  # re-check the upstream repository by hand
npm run sync      # re-vendor the parent's rules.md and its hash
```

`npm run build` is the gate. The guard fails on placeholders, an absolute home path, a credential, a
base path that disagrees with `package.json.homepage`, a missing `404.html`/`.nojekyll`, a source
map, a page with no shell, a link to a route that does not exist, a page absent from `llms.txt`, a
missing `upstream.json`, a drift the pages do not state, or a rule override with no reason. Do not
weaken a check to make a build pass; fix the output.

## Content

- One page = one file: `src/content/<section>/<slug>.md`, frontmatter `title` + `description` (plus
  optional `order`, `updated`, `tags`, `seeds`).
- The nav, section indexes, TOC, `llms.txt` and the sitemap are derived from the file tree. There is
  no nav array. Adding a file is adding a page.
- Markdown only. A live widget is a route under `src/pages/`, declared once in `EXTRA_ROUTES`
  (`src/lib/content.ts`). Adding one means a page, an entry, and the same entry in
  `scripts/postbuild.mjs` and `scripts/verify-publish.mjs`.
- Router links are basename-relative: `href()` from `src/lib/base.ts`. A raw `href` string needs
  `import.meta.env.BASE_URL`.
- Voice: dry, technical, specific. State the limit before the finding. Numbers over adjectives.

## Facts and their homes

- **The studies register** lives in `src/lib/studies.ts`: the three studies, their stages, and the
  publication log. A research change is a dated row carrying the study, the kind of change, the
  upstream pin it was read against, and the date it was published here. Never promote a stage here —
  copy it from the study page — and never summarise a conclusion; the study page keeps the argument.
- **Arena numbers** live in `src/lib/arena.ts`, never in prose. A page that disagrees with that
  module is a bug the build cannot see; a page that reads it cannot drift.
- **The verifier gaps** live in `src/lib/gaps.ts`, copied from the strict `xfail` tests upstream.
- **The universe** lives in `src/universes/railhead.ts` and mirrors local-time's `Universe` shape.
  Do not add a dependency on the private local-time repo.
- **Upstream state** is `src/data/upstream.json` (the committed pin) and
  `src/data/upstream.live.json` (this build's check, git-ignored). A scheduled job may write the
  second; nothing may rewrite authored content from the network.

## The team does not control upstream

Railhead belongs to its authors. The team pins it, cites it, and runs studies against it. A drift
reported by the daily check is **context, not a failure**: it is the team's decision whether to re-run
an arm at the new pin, and that decision is published as a row, never applied automatically. Do not
write a page that implies this site can upgrade or patch the environment.

## Design

Components are [PlopUI](https://plopui.com) (`@plop-ui/react`), installed as a dependency. One
`PlopProvider` at the root, in `src/components/plop/paper.tsx`. Colour, shadow, corners and motion
come from `--plop-*` tokens; `src/index.css` adds a grid and prose typography only, so there is no
second palette.

- A `Count`'s `label` is an accessible name, not a caption: every row of counts is followed by a
  visible `StatLine`. See `src/components/plop/StatLine.tsx`.
- Status is the words. `StatusDot` and `Tag` only repeat them. One legend per vocabulary, in
  `src/components/plop/StatusLegend.tsx`.
- `/design` is the live catalogue. Keep it in step with what the site actually uses, and list what
  it deliberately does not use.

## Privacy and provenance

The record is about a public repository and public results. Do not add a credential, a private path,
a token count that is not published, or a figure that was inferred rather than cited. Every page
that makes a factual claim should say where it came from, and the pin is the answer to "when".

## Skills

`.opencode/skills/legume-content/SKILL.md` — the inherited content workflow (if present).
`opencode.json` — the schema and an explicit pointer at this file.

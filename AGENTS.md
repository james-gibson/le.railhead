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
npm run rules     # the catch-up check: is this seed still following the parent?
npm run overflow  # 320px horizontal overflow, the part that is statically certain
```

`npm run build` is the gate. The guard fails on placeholders, an absolute home path, a credential, a
base path that disagrees with `package.json.homepage`, a missing `404.html`/`.nojekyll`, a source
map, a page with no shell, a link to a route that does not exist, a page absent from `llms.txt`, a
missing `upstream.json`, a drift the pages do not state, or a rule override with no reason. Do not
weaken a check to make a build pass; fix the output.

### No overflow, on every seed

`npm run overflow` refuses the causes of a sideways scroll at 320px that can be known
without a browser: a missing `device-width` viewport, a literal width over 320px on a
selector in use, an inline width over 320px, and a `<table>` / `<pre>` in a styled page
with nothing to scroll in. There is **no waiver list**: other gates take overrides with
reasons (zaphood may be a marquee), but a horizontal scrollbar is content the reader
cannot reach, so a finding here is fixed. A stylesheet-free page is exempt from the broad
table rule and fails only on text that cannot wrap — its own guard already forbids it a
style.

## Following the parent's rules

The child defers to `le.gume`'s rule list. `upstream/rules.md` is the vendored copy, `upstream/
manifest.json` records its `version` and `sha256`, and `/rules.md` republishes both plus this child's
`upstream/overrides.md` — so which rules this site claims to follow is checkable at the URL, not
asserted here.

`npm run sync` re-vendors by hand. `npm run rules` is the catch-up check, and the deploy workflow
runs it **before** `npm run build`: a cycle that would publish against an older rule list refuses to
deploy and names the rules that moved. `--check` writes nothing, so the build stays reproducible from
the checkout — a tightened rule arrives as a commit, never as a network read inside the build.

A rule that conflicts with this seed is an override with a reason in `upstream/overrides.md`, not a
local edit to `upstream/rules.md` (the guard catches the edit, since the hash no longer matches).
When the parent drops a rule, the check prints it: an override naming that id must be retracted in
the same commit.

## The rotation record

This seed keeps its own record of update cycles in `upstream/rotations.jsonl` — append-only,
committed, and the thing that decides whether the next cycle may publish. The units are the lab's,
not a private vocabulary: an **isotope** is the kind of cycle (`rules`, `contrast`, `build`), a
**rotation** is one verified cycle with a contiguous id (`r000001`), and a **departure** is a cycle
that did not verify. Distance accumulates by 8 per departure, is capped at 80, and is reset by a
rotation — the same rungs as 42i, so the state means "right now":

| rung | distance | publishing |
| --- | --- | --- |
| HEALTHY | 0 | normal |
| MINOR | 8–40 | allowed, with the departures printed |
| DEGRADED | 48–72 | refused: repair before advancing |
| COMPROMISED | 80 | refused: the seed is not the thing to update |

```bash
npm run rotation                      # status: rung, head, distance, rotations per isotope
npm run rotation -- gate              # the policy CI runs; exits 1 with the repair named
npm run rotation -- open --isotope rules --note "29d863e → 41ac0f2"
npm run rotation -- verify --isotope rules --subject <sha> --gates build,smoke,guard,contrast
npm run rotation -- depart --kind guard --isotope contrast
npm run rotation -- abandon --reason "…"   # close a cycle that will not verify; the line stays
```

The id is allocated only when the line lands, so a rotation recorded but never committed does not
exist for the next cycle — the ledger travels with the seed, which is the point. A gap in the ids is
a **finding, not an ambiguity**: `gate` refuses until the missing line is restored.

The release loop is one cycle end to end: `npm run rules` → `npm run rotation -- open` →
`npm run sync` (if behind) → `npm run build && npm run smoke` → `npm run rotation -- verify` →
commit, push. The deploy workflow runs `gate` before anything else, with a read-only token; it never
writes the ledger. The state is published at `/rotations.json` and the guard refuses a build where
the published state disagrees with the ledger.

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

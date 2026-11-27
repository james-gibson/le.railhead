# le.railhead

A local-time record of [Railhead](https://github.com/rachittshah/railhead): a reinforcement-learning
environment in which a language model plays [OpenTTD](https://www.openttd.org) first person, from a
shell, with the same commands a human player has.

<p align="center">
  <a href="https://github.com/james-gibson/le.railhead/actions/workflows/deploy.yml"><img src="https://shieldcn.dev/github/ci/james-gibson/le.railhead.svg?workflow=deploy.yml&branch=main&variant=secondary" alt="deploy" /></a>
  <a href="https://github.com/james-gibson/le.railhead/blob/main/LICENSE"><img src="https://shieldcn.dev/github/license/james-gibson/le.railhead.svg?variant=secondary" alt="license" /></a>
  <a href="https://github.com/james-gibson/le.railhead/commits/main"><img src="https://shieldcn.dev/github/last-commit/james-gibson/le.railhead.svg?variant=secondary" alt="last commit" /></a>
</p>

**Live:** https://james-gibson.github.io/le.railhead/

## What this is

A **child seed** of [le.gume](https://github.com/james-gibson/le.gume): the same content model, the
same derived navigation, the same prerender and the same publish gate, with a different question and
a different design system.

It is also the **shared context the studies team publishes against**. The team behind
[that-train-dashboard](https://james-gibson.github.io/that-train-dashboard/) studies economic
questions by running them as OpenTTD simulations. They do not control Railhead, so they pin it and
cite the record; every research change — a stage move, a corrected finding, a new arm, a move to a new
pin — is published here, with the pin it was read against.

- **24 Markdown pages** in six sections — brief, arena, verify, research, ops, seeds — plus five live
  routes (`/universe`, `/studies`, `/known-gaps`, `/station-flow`, `/design`).
- **A local-time universe**: `src/universes/railhead.ts`, `technology:railhead:2026`, one epoch with
  a declared zero, four phases and sixteen keyframes — each one a commit, a tag, a published result
  or a document at the pinned commit.
- **The pin**: every fact was read from `rachittshah/railhead` at `6158e15` (2026-11-10). The build
  re-checks upstream and publishes the drift.
- **The studies register**: `src/lib/studies.ts` holds five studies, their stages, and every change
  published through these docs, each with the pin it was read against.
- **PlopUI**, MIT, as the design system — a different library from the parent's, on purpose. The
  pipeline did not change: that is the claim the swap is here to make checkable.

## What it deliberately is not

No accounts, no analytics, no search, no CMS, no database, and no copy of Railhead's code. The
record is not a fork: it cites the repository and describes it, and the upstream project keeps its
own licence.

## Run it

```bash
npm install
npm run dev      # vite
npm run build    # upstream check, tsc, vite, prerender, shells, llms.txt, guard
npm run smoke    # render every route, including the 404, to a string
npm run guard    # the gate alone
```

`npm run build` is the gate. A guard failure stops the deploy, not the reader.

## Deploy

GitHub Pages, from `.github/workflows/deploy.yml`, on three triggers:

| Trigger | When |
| --- | --- |
| `push` | every push to `main` |
| `schedule` | `17 6 * * *` — daily at 06:17 UTC |
| `workflow_dispatch` | by hand |

The scheduled run exists because the record describes a moving project. It re-reads the upstream
repository, writes the answer to `/upstream.json`, prints the result at the foot of every page, and
deploys even when nothing in this repository changed — so "stale" is a visible fact rather than a
silent one. [How it works](https://james-gibson.github.io/le.railhead/ops/schedule/).

## The structure

```text
src/content/<section>/<slug>.md   one page per file; the path is the URL
src/lib/content.ts                the content model, the sections, the live routes
src/lib/arena.ts                  Arena 2 as data, with the commit it was read from
src/lib/gaps.ts                   the five open verifier holes, from the upstream tests
src/lib/studies.ts                the studies register and the publication log
src/lib/upstream.ts               the snapshot: live if the check ran, else the pin
src/universes/railhead.ts         the local-time universe this site renders
src/pages/Studies.tsx             the register route
src/components/plop/paper.tsx     the one PlopProvider
scripts/upstream.mjs              the scheduled check
scripts/postbuild.mjs             shells, 404, sitemap, robots, llms.txt, upstream.json, rules.md
scripts/verify-publish.mjs        the guard
scripts/smoke.tsx                 server-render every route
```

Navigation, section indexes, `llms.txt` and the sitemap are derived from the file tree. There is no
nav array to keep in step.

## Publishing a research change

A change is a dated row in `PUBLICATIONS` (`src/lib/studies.ts`) with four things: the study, the kind
of change, the upstream pin it was read against, and the date it was published here. A stage is copied
from the study page and never promoted here; conclusions stay on the study page. The rule, and what is
deliberately not published, is `/research/how-a-change-is-published`.

## Licence

The site is **AGPL-3.0-only**. Railhead is **MIT** (the harness) and **GPL-2.0-only** (the engine
patches and the GameScript bridge); OpenTTD and OpenGFX carry their own licences. See
`/brief/provenance`.

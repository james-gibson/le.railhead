---
title: For agents
description: The machine entry: what this repository promises, how to build it, and which facts are pinned rather than generated.
order: 3
updated: 2026-11-14
tags: ops, agents, llms.txt
seeds: agent-operations
---

# For agents

This page is the written contract behind `llms.txt`, which the build generates from the content tree.
If the two disagree, `llms.txt` is right and this page is stale.

## The entry points, in order

| Path | What it is |
| --- | --- |
| `/llms.txt` | Every page with its description, the commands, and the invariants. Generated. |
| `/upstream.json` | The snapshot the build published: pinned SHA, checked head, drift. Generated. |
| `/rules.md` | The rules this child follows, vendored from the parent, plus its own override. |
| `/sitemap.xml` | Every route. Generated from the content tree. |
| `/universe` | The local-time record, rendered from `src/universes/railhead.ts`. |

## The commands

```bash
npm install
npm run dev       # vite
npm run build     # upstream check, tsc, vite, prerender, shells, llms.txt, guard
npm run smoke     # render every route, including the 404, to a string
npm run guard     # the gate alone, against an existing dist/
npm run upstream  # the upstream check alone
```

`npm run build` is the gate. It refuses to publish on a placeholder, an absolute home path, a
credential, a base path that disagrees with `package.json.homepage`, a missing `404.html` or
`.nojekyll`, a source map, a page with no shell, a link to a route that does not exist, a page absent
from `llms.txt`, or a missing upstream snapshot. Do not weaken a check to make a build pass.

## What is generated and what is authored

- **Generated:** `llms.txt`, `sitemap.xml`, `robots.txt`, `upstream.json`, `rules.md`, the per-route
  shells and `404.html`. Never hand-edit them.
- **Authored:** every file under `src/content/`, `src/lib/arena.ts`, `src/lib/gaps.ts` and
  `src/universes/railhead.ts`. These carry citations and must not be rewritten by a scheduled job.

## The five facts to check before quoting this site

1. **The pin.** `src/data/upstream.json` names the commit the record was read from. If the deployed
   page's `upstream.json` shows `source: "pinned"`, the last check had no network.
2. **The version.** `0.1.2` is unreleased; `v0.1.1` is the latest published tag and image. A page
   that calls 0.1.2 released is wrong.
3. **The arena.** One map, one game per model, no error bars. Do not describe the table as a
   ranking.
4. **The licence.** Railhead is MIT (harness) and GPL-2.0-only (engine patches and GameScript). This
   site is AGPL-3.0-only. They are different grants about different artefacts.
5. **The gaps.** Five verifier holes are open and named at `/known-gaps`. A claim that the verifier
   is airtight contradicts the upstream tests.

## Where the record of truth lives

The universe has three forms, and they are meant to agree:

```text
kb/lore/lore/railhead.md                                  the vault document, enrolled in the sync
local-time/src/config/universes/openttd/railhead.ts       the registry entry
src/universes/railhead.ts                                 the projection this site builds from
```

If they disagree, the vault document is the source and the other two are behind. The site's `/universe`
page renders the projection, because the seed must build from a clean checkout with no private
dependency.

## What this site promises an agent

- Every page is in the initial HTML; nothing needs JavaScript to be read.
- Every internal link resolves, and the guard proves it rather than promising it.
- Every number that matters is in a module with a comment saying where it came from.
- The build is one command with one exit code.

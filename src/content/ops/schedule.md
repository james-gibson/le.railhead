---
title: How this site stays current
description: A daily rebuild that re-reads the upstream repository, records the answer, and publishes the drift instead of hiding it.
order: 2
updated: 2026-11-14
tags: ops, schedule, drift, ci
seeds: operator, agent-operations
---

# How this site stays current

The site describes a project that is still moving. A static site about a moving target has two
honest options: claim a date and never check it, or check and publish the answer. This one does the
second.

## The workflow

```yaml
# .github/workflows/deploy.yml (abridged)
on:
  push:     { branches: [main] }
  schedule: [{ cron: '17 6 * * *' }]   # 06:17 UTC, daily
  workflow_dispatch:
```

A schedule and a push run the same two jobs: build, then deploy to GitHub Pages. One artifact, one
environment, no `gh-pages` branch to reconcile.

## What the build checks

`scripts/upstream.mjs` runs before TypeScript and before Vite. It asks the GitHub API three
questions:

1. What is `rachittshah/railhead`'s head commit, and when was it authored?
2. What is the latest tag?
3. What version does `CHANGELOG.md` claim at that head?

It writes the answers to `src/data/upstream.live.json`, which is **git-ignored**: it is the result of
this build's check, not a fact about the repository. The committed `src/data/upstream.json` is the
pin, and it is what ships when the build has no network.

## What the reader sees

The result of the last check is printed at the foot of every page: the pinned commit, the version in
the upstream tree and whether it is released, and — when the head has moved — a drift tag with the
new short commit and its date.

| Situation | What the page says |
| --- | --- |
| Head equals the pin | the pin, the version, `checked <date>, live` |
| Head has moved | a `drift` tag and the upstream head's short commit and date |
| No network at build time | the pin, `last checked <date>, from the pin` |

The guard refuses to publish if the drift cannot be found in the built HTML or if
`dist/upstream.json` is missing — a page that says it checks upstream has to show the result of the
check it just ran.

## Why a schedule rather than a webhook

A webhook would need a secret, a receiver and something to be awake. A daily rebuild needs nothing:
GitHub's scheduler starts the runner, the build reads a public API, and the result is a commit-free
deploy. The cost is staleness measured in hours, which the page states rather than hides.

## What the schedule does not do

It does not rewrite content. Nothing regenerates the prose, the universe's keyframes, or the
scoreboard from the network: those are authored facts with citations. A daily job that quietly
rewrote a page would make every other claim on the site unverifiable, so the job's only write is the
snapshot the page then reads.

## Turning it off

Delete the `schedule:` block. The site still deploys on push, and the committed pin becomes the only
source. Nothing else depends on the cron.

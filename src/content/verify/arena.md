---
title: arena — the same map, several players
description: Tycoon at five or ten years on a fixed map, one copy per model, and a log-scaled score that does not saturate.
order: 8
updated: 2026-11-27
tags: verify, tasks, arena, ranking
seeds: operator, reader
---

# arena — the same map, several players

**The job.** A [`tycoon`](/verify/tycoon) task with a longer horizon and a fixed map size, so several
models can play the same task in their own copy of the world and the results can be placed beside each
other.

**In the catalog.** 67 tasks — 31 `train`, 26 `dev`, 10 `ood` — all certified. 41 are five-year games
on 256² maps; 26 are ten-year games on 512².

## What is different from tycoon

| Field | Value |
| --- | --- |
| `task.json` `family` | `tycoon` — the reward family, not the variant |
| `scenario.family` | `arena` |
| `objective.score` | `log50` |
| Horizon | 365 game days per year of `--years` (5 or 10) |
| Run-off | 365 game days |
| Forks | 2, with 73 fork-days per year |
| Map | `--map 256`, `512` or `1024`; the catalog uses 256 and 512 |

The score is a log of the gain over the baseline, capped at 50×. The cap is why the long game is
playable at all: a linear scale saturates at the top and stops separating the players that are still
improving.

## What the score does not mean

A rank here is not a benchmark. The arena's own page lists the limits that matter for reading it —
one map and one game per model in the original run, the model-plus-harness confound, usage limits
that ended runs early, and net worth's silence on reputation, ratings and timetable quality. Read
[what the arena does not show](/arena/what-it-does-not-show) before quoting a placement.

## Where to read next

Back to [the catalog](/verify/tasks), or to [`tycoon`](/verify/tycoon) for the reward family this one
reuses.

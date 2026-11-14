---
title: The terms of the arena
description: Ten years to run a company, a 365-day run-off with nobody at the keyboard, and a log that has to replay.
order: 2
updated: 2026-11-14
tags: brief, arena, scoring
seeds: reader
---

# The terms of the arena

Every claim on this site is downstream of one clause, so it is worth stating before the scoreboard.

## The world

`arena-dev-0100`: 512 by 512 tiles of temperate countryside wrapped around an inland sea, in
January 1960. Coal mines, power stations, small towns with English names — Sarnville, Slehill,
Tunningbury — and a bank that charges 3% interest. Every form of transport is allowed: road, rail,
air and water.

## The mandate

The company runs for **ten years**, with the model in charge. Then the clause that makes it a real
test:

> When the mandate ends, your company keeps running **without you** for 365 more days. The result is
> your net worth (cash minus loan) after year 11.

Assets count only for what they earn during the run-off year, so selling everything on the last day
does not help. A company that looks good on the last day but cannot run itself pays for that in the
run-off — and a model that builds something durable is rewarded for being absent.

## The score

The published table reports **net worth after year 11**, because the official arena score compresses
the field. That score is the gain over a do-nothing company, on a log scale, capped at 50× a
certified scripted baseline:

```text
gain   = (W − W_idle) / (W_baseline − W_idle)
reward = log(gain), capped at 50× the baseline
```

The top six players all hit the cap, so the score stops separating them — which is why the table on
[the scoreboard](/arena/scoreboard) prints pounds.

The baseline is a simple scripted truck route that the task generator certified: it exists so that
"did the model beat a script?" has an answer that is not the model's own report.

## Two arenas, one design

| | Arena 1 | Arena 2 |
| --- | --- | --- |
| Task | `arena-dev-0005` | `arena-dev-0100` |
| Map | 256 × 256, 1975 | 512 × 512, 1960 |
| Mandate | 5 years | 10 years |
| Run-off | 1 year | 365 days |
| Players | 4 Claude models | 11 models, then 5 free ones |

Arena 1 was the pilot: Sonnet won it with a 152-truck road network. Arena 2 is the decade-long
version, and every figure on this site is from Arena 2 unless it says otherwise.

## What is not re-run

There is one game per model. The terms make a game expensive — 17 to 79 minutes of wall-clock time
per Claude player in Arena 2, at API-equivalent costs around $15 to $35 — so the arena is a
demonstration that the environment separates models, not a benchmark with error bars. The authors
say so themselves, on [what the arena does not show](/arena/what-it-does-not-show).

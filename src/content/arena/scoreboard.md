---
title: The scoreboard
description: Sixteen players, two baselines, one map, and the run-off year that decides the order.
order: 1
updated: 2026-11-14
tags: arena, results, table
seeds: reader
---

# The scoreboard

Net worth is cash minus loan, after the 365-day run-off. Vehicles and buildings count only for what
they earn during that year, so asset stripping does not help.

## The eleven

| # | Model | Harness | Net worth | Gain / baseline | Actions | Replay |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | claude-opus-5-5 | Claude Code | £45,758,664 | 249.3 | 554 | valid, 0 divergences |
| 2 | gpt-6-astra | Codex | £27,935,307 | 152.3 | 298 | valid, 0 divergences |
| 3 | gpt-6-sol | Codex | £27,232,656 | 148.4 | 639 | valid, 0 divergences |
| 4 | gpt-6.1-sol | Codex | £22,371,463 | 122.0 | 286 | valid, 0 divergences |
| 5 | gpt-5.6-sol | Codex | £13,130,503 | 71.7 | 349 | valid, 0 divergences |
| 6 | claude-fable-5-1 | Claude Code | £9,837,139 | 53.7 | 566 | valid, 0 divergences |
| 7 | claude-sonnet-5-5 | Claude Code | £3,930,521 | 21.6 | 1021 | valid, 0 divergences |
| 8 | claude-haiku-5-5 | Claude Code | £2,757,221 | 15.2 | 832 | valid, 0 divergences |
| 9 | gpt-5.6-terra | Codex | £335,998 | 2.0 | 241 | valid, 0 divergences |
| 10 | gpt-6-luna | Codex | £236,701 | 1.5 | 239 | valid, 0 divergences |
| 11 | gpt-5.6-luna | Codex | −£50,557 | −0.1 | 436 | valid, 0 divergences |

The two references the arena is scored against:

| | Reference | Net worth | Gain / baseline | Replay |
| --- | --- | --- | --- | --- |
| — | Scripted truck route (baseline) | £147,407 | 1.0 | certificate |
| — | No play | −£36,300 | 0.0 | certificate |

Doing nothing is not free: a company that never moves still pays interest. `gpt-5.6-luna` moved,
and finished **£14,257 worse than staying in bed** — a coal-truck network, a train that never
completed a delivery, and heliports with no hangar.

## The five free models

Five free OpenCode Zen models later played the same world, taking the arena to sixteen:

| Model | Net worth | How the game ended |
| --- | --- | --- |
| beam-free | £411,339 | played all 10 years, in 9 minutes of wall-clock time |
| longcat-2.5-preview-free | −£8,846 | free-tier usage limit in 1962 |
| nemotron-3-ultra-free | −£36,300 | never acted (provider outages) |
| nemotron-3.5-super-vl-free | −£129,949 | stream stalls in 1963 |
| space-bunny-free | −£425,249 | played all 10 years, last of sixteen |

`beam-free` is the only free model above the scripted baseline. `space-bunny-free` measured
vehicles at "~1–2.3 tiles/day regardless of speed or mode", concluded that short routes beat long
ones, and built a 39-tile air route on a maxed-out loan.

## The signature of the winners

The winners all landed on roughly 460-tile air routes on their own, and two models never found air
because an error message named an airport type that had been retired. That is a fact about the
environment as much as about the models: the interface is part of what is being measured, and the
players doubled as the QA team — eight interface faults were found by models and fixed, each with a
test.

Reading the table as a ranking is a mistake the authors name themselves. See
[what the arena does not show](/arena/what-it-does-not-show), and
[the run-off](/arena/the-run-off) for the game that best explains the rule.

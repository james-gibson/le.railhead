---
title: deliver — one cargo, one destination
description: 300 game days, one industry to supply, and a quantity set from what the scripted oracle actually delivered.
order: 3
updated: 2026-11-27
tags: verify, tasks, deliver
seeds: operator
---

# deliver — one cargo, one destination

**The job.** Deliver at least `Q` units of cargo `C` to industry `B` within 300 game days. Any source
industry is allowed; the monitor counts only cargo delivered by the agent's own company to `B`.

**In the catalog.** 586 tasks — 400 `train`, 93 `dev`, 93 `ood` — all certified.

## What each side holds

| Where | Fields | Why |
| --- | --- | --- |
| `task.json` | `objective.cargo`, `quantity`, source and destination ids, names and tiles | the contract, and the map positions it refers to |
| `secret.json` | `feasible = true`, `oracle_delivered = d` | the exact oracle result, and that abstaining scores 0 |
| `briefing` | the cargo, the destination, and **a** possible source | a suggestion, not a constraint |

## The quantity is not arbitrary

`Q = max(20, round(u · d, −10))` with `u` drawn from `[0.5, 0.7]`, seeded by the task id. The oracle
must deliver at least 40 units or the seed is dropped. Because `u` is derived from the id, an agent
cannot recover `d` from `Q` — but anyone reading the repository can, which is the leak
[the catalog](/verify/tasks) describes.

## What is scored

```
D      = monitored deliveries at the end of the horizon
reward = 0                 if the agent abstains
reward = min(1, D / Q)     otherwise
```

There is no run-off: the task ends when the mandate does, so the score is what was delivered, not what
the company might have gone on to earn. Two forks are allowed, 180 fork-days in total; a fork is
reseeded, so it shows a possible future rather than the one being played.

## Where to read next

[`deliver_bid`](/verify/deliver-bid) adds a binding promise to this reward. [`impossible`](/verify/impossible)
is the same briefing with a quantity no company can reach. Back to [the catalog](/verify/tasks).

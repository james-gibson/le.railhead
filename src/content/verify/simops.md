---
title: simops — repair a route that stopped working
description: A truck route with one or two faults, 60 days to find them, and a 365-day run-off that scores whether cargo moves again.
order: 6
updated: 2026-11-27
tags: verify, tasks, simops, repair
seeds: operator
---

# simops — repair a route that stopped working

**The job.** A truck route that used to deliver is broken. Diagnose it and repair it within 60 game
days; the company then runs unattended for 365 days and the reward is the cargo delivered during
that run-off.

**In the catalog.** 370 tasks — 239 `train`, 64 `dev`, 67 `ood` — all certified.

## How the start state is made

1. The road oracle builds a truck route. Those actions are **not** in the log.
2. The route runs for 120 game days.
3. One fault is chosen (probability 0.6) or two.
4. The faults are applied with player actions and the world is saved.

The route's history is therefore sealed into the world rather than written down, and the agent starts
with a broken company it did not build.

| Fault | What the agent finds | The repair |
| --- | --- | --- |
| `fleet_stopped` | every truck stopped | start each truck |
| `orders_cleared` | trucks have no orders | give each truck its two orders |
| `road_gap` | one road tile missing mid-route | rebuild the two road pieces |
| `pickup_removed` | the pickup station is gone | rebuild the stop, re-order the trucks |

## What is scored

```
K      = cargo delivered during the run-off
K0     = K for a do-nothing log
K*     = K for the oracle's repair
reward = clip((K − K0) / (K* − K0))     if K* > K0
reward = 1 if K ≥ K* else 0             if K* ≤ K0
```

The generator keeps a seed only if `K* ≥ max(40, 1.5 · K0 + 10)`, so a repair has to be clearly
better than doing nothing before the task exists. `k0` and `kstar` are in the secret with the fault
list, which is the answer to the diagnosis.

## Where to read next

The route's economics are a smaller version of [`tycoon`](/verify/tycoon). Back to
[the catalog](/verify/tasks).

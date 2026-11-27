---
title: tycoon — open play, scored after you leave
description: 365 days to build whatever network you like, then 730 days without you, scored on net worth that survives.
order: 7
updated: 2026-11-27
tags: verify, tasks, tycoon, run-off
seeds: operator
---

# tycoon — open play, scored after you leave

**The job.** Build any network you like for 365 game days. The company then keeps running without
you for 730 more, and the reward is net worth — cash minus loan — after that run-off.

**In the catalog.** 110 tasks — 74 `train`, 30 `dev`, 6 `ood`. **Seven of the ten uncertified
directories in the catalog are tycoon tasks**, and three of those have no oracle log either; see
[what we re-derived](/research/re-derived).

## The baseline

The generator picks the most profitable road route it can find: 25 to 60 tiles, ranked by production
times distance, excluding oil wells (their production can only fall). It replays that route as the
oracle and rejects the seed if it does not beat doing nothing. The baseline's net worth is printed in
the briefing, so the target is stated rather than hidden.

## What is scored

```
W      = cash − loan after the run-off
W_idle = W for a do-nothing log
W_base = W for the baseline log
reward = clip(0.5 · (W − W_idle) / max(W_base − W_idle, 1))
```

`0` is no play, `0.5` is the baseline, `1` is twice the baseline's gain. `w_idle` and `w_base` are in
`objective`, not in the secret: the scale is part of the task. The run-off is what makes the score a
claim about sustainable operation — asset stripping and loan games do not survive a year of
unattended running.

## Facts a study needs

- Horizon 365, run-off 730, two forks with 365 fork-days between them.
- `secret.json` holds only `scenario_private` — the seeds. There is no answer to give away, which is
  why `tycoon` is the one family where the leak changes nothing.
- The reward is bounded by `1`, and the briefing names the baseline, so a run's number can be
  compared with the map it was played on rather than only with other runs.

## Where to read next

[`arena`](/verify/arena) is this task at five or ten years, played by several models on one map. Back
to [the catalog](/verify/tasks).

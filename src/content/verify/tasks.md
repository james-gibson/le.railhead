---
title: The catalog
description: About 1,540 certified tasks in six families, a scripted oracle, and no secret held out of the public repository.
order: 2
updated: 2026-11-14
tags: verify, tasks, harbor
seeds: operator
---

# The catalog

The arenas are the spectacle. The training data is about **1,540 generated tasks**, and every one is
certified before it is kept: the generator plays it with a scripted oracle and with a do-nothing log,
and deletes the task unless the oracle's replay is valid and beats doing nothing.

## Six families

| Family | The job | Horizon | Run-off | Reward |
| --- | --- | --- | --- | --- |
| `deliver` | Deliver `Q` units of a cargo to one industry. | 300 days | 0 days | `min(1, D / Q)` |
| `deliver_bid` | The same, plus a binding promise in the first 30 days. | 300 days | 0 days | linear map of `min(D, B) − max(0, B − D)` to 0–1 |
| `impossible` | A `deliver` contract that no company can complete. | 300 days | 0 days | 1 if the agent abstains, else 0 |
| `simops` | Repair a truck route that has one or two faults. | 60 days | 365 days | `clip((K − K0) / (K* − K0))` |
| `tycoon` | Open play. Grow the net worth. | 365 days | 730 days | `clip(0.5 × (W − W_idle) / max(W_base − W_idle, 1))` |
| `arena` | `tycoon` for several models on one map. | 5 or 10 years | 365 days | log of the gain, capped at 50× the baseline |

`D` is the cargo delivered, `B` the promise, `K` the cargo delivered during the run-off (`K0` when
doing nothing, `K*` after the oracle's repair), and `W` the net worth after the run-off.

## Splits

- `train` and `dev` are temperate.
- `ood` moves to arctic or tropic maps, with cargo chains that do not exist in training.

The IDs of `deliver`, `deliver_bid` and `simops` tasks are opaque, and the facts that would give a
task away — which contract is impossible, the seeds, the oracle's targets — live in `secret.json`,
which never enters the image, so a model playing inside it cannot read them.

## The leak, stated plainly

Those files are not secret from the world. The public repository tracks the `secret.json` of all
**1,565** tasks and the oracle log of **1,562** of them. Anyone who trains on the repository sees the
answers, so **no split here is held out**.

That is a deliberate trade, not an oversight: the tasks are published so the results can be
reproduced and criticised, and reproducibility was chosen over a held-out split. A team that wanted
to train on this catalog would need to generate its own tasks — the generator is in
`src/railhead/gen/`, and the certifier is what makes a new task trustworthy.

## Where the tasks live

```text
tasks/          the tracked catalog, one directory per task
  <task>/start.sav      the sealed start state
  <task>/task.json      the briefing and the scoring rule
  <task>/secret.json    the answers, never copied into the image
  <task>/oracle.jsonl   the scripted oracle's log
```

`tasks/` is public because it has to be: the tasks are the environment's interface, and a sealed
manifest is what keeps the *engine* honest rather than the task text. See
[proof of play](/verify/proof-of-play) for the mechanism.

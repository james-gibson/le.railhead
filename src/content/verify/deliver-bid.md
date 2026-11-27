---
title: deliver_bid — a contract with a promise
description: The deliver task plus a binding quantity promised in the first 30 days, scored so optimism and sandbagging both cost.
order: 4
updated: 2026-11-27
tags: verify, tasks, deliver, bid
seeds: operator
---

# deliver_bid — a contract with a promise

**The job.** The [`deliver`](/verify/deliver) objective, plus a quantity `B` promised in the first 30
game days with `rh promise quantity=<N>`. Only promises inside the window count; if there are
several, the last one does.

**In the catalog.** 249 tasks — 167 `train`, 38 `dev`, 44 `ood` — all certified.

## What each side holds

| Where | Fields | Why |
| --- | --- | --- |
| `task.json` | the deliver objective, plus `bid = true`, `bid_scale`, `bid_deadline_days = 30` | the cap on `B`, and the deadline the log must beat |
| `secret.json` | `feasible = true`, `oracle_delivered = d` | the oracle's result; the promise is scored against the agent's own `D` |
| `briefing` | the contract and the promise rule | the only place the scoring rule is stated |

`bid_scale = max(Q + 10, round(v · Q, −10))` with `v` in `[2, 3]`, from the same id-seeded generator
as `Q`. The verifier clamps `B` to `[0, bid_scale]`.

## What is scored

```
S      = bid_scale
payout = min(D, B) − max(0, B − D)        in [−S, S]
reward = 0                                if the agent abstains
reward = clip(0.5 + payout / (2 · S))     otherwise
```

Without a valid promise `B = 0`, and the reward is `0.5`. That flat default is the tell: a model that
never promises neither wins nor loses, while a model that promises badly pays for it. The payout is a
newsvendor-style proper scoring rule — the best `B` is the median of the agent's own delivery
distribution — so the task scores a belief about the plan, not just the plan.

## Where to read next

[`impossible`](/verify/impossible) uses the same briefing shape and expects an abstain. Back to
[the catalog](/verify/tasks).

---
title: What we re-derived
description: Every task spec regenerated from its seed at the pin, the one difference the generator explains, and the numbers on this site that did not survive. Stage: standing.
order: 3
updated: 2026-11-27
tags: research, verify, provenance, tasks
seeds: research, operator
---

# What we re-derived

These docs describe a catalog of **1,565** tasks, six variants, and a generator that is public and
deterministic. That is a projection of someone else's repository, and a projection should be read
against the data rather than trusted. The generator is the cheapest part to check: a task's scenario
is a pure function of three values, so the spec can be regenerated without building the engine.

## What was run

A clone of `rachittshah/railhead` at `6158e15`, and
[`scripts/rederive_tasks.py`](https://github.com/james-gibson/le.railhead/blob/main/scripts/rederive_tasks.py),
which imports `sample_scenario()` from that checkout, reads every `tasks/<id>/task.json` and
`secret.json`, recovers `(variant, split, seed)` from the task's own identifiers, and compares the
public scenario block. No engine, no `start.sav`, no reward.

## What reproduced

| Variant | Tasks | Regenerated exactly | Differ only in map size |
| --- | --- | --- | --- |
| `deliver` | 586 | 586 | — |
| `deliver_bid` | 249 | 249 | — |
| `impossible` | 183 | 183 | — |
| `simops` | 370 | 370 | — |
| `tycoon` | 110 | 110 | — |
| `arena` | 67 | 8 | 59 |

**1,506 of 1,565** scenarios reproduce exactly, including `scenario_private`'s seed and generation
seed. The IDs reproduce too: 1,388 tasks carry an opaque id, and every one of them hashes back to the
`source_task_id` it records.

## The arena exception

An arena differs in one field only — `map_log2` — and the generator explains it: `gen_arena()` takes
the map size after sampling, and `railhead gen arena` passes `--map 256|512` (log² 8 or 9). The
5-year arenas are 256², the 10-year ones 512²; 41 and 26 respectively. So the catalog is what the
pinned generator produces with the invocation its own CLI documents, not a drift.

## Three numbers that did not survive

The re-derivation is worth having because it corrected the page you were reading.

1. **"About 1,540 certified tasks"** was a paraphrase. The data: 1,565 directories, 1,562 oracle
   logs, 1,558 certificates — and every certificate has `oracle_valid = 1`.
2. **"Every one is certified"** is not true of the tracked tree. Seven `tycoon` tasks have no
   certificate, and three of those have no oracle log either. The generator deletes a task that fails
   certification; these seven are in the repository anyway. That is a fact about the snapshot, not a
   verdict on the method.
3. **The six-family table** is a table of *variants*, while `task.json`'s `family` field holds the
   *reward* family — three values, not six. `deliver_bid` and `impossible` are published under the
   `deliver` prefix, and impossible tasks hide in a 9xxx seed range. Counting the field's values gives
   1,018 `deliver`, 370 `simops` and 177 `tycoon`, which is correct and is not the six families.

The catalog page now carries the measured numbers and the distinction between the two taxonomies.

## What this does not prove

- **Not the start state.** `start.sav` needs the engine, the three patches and a build; a matching
  scenario is a necessary condition, not a replayed world.
- **Not the rewards.** Certificates were counted and checked for validity, not recomputed. The
  oracle's replay, the do-nothing baseline and the calibrated targets are untested here.
- **Not the leak.** The count says the answers are public; it does not change the fact that no split
  is held out.

The engine half is the expensive half, and it is the next check rather than this one: a task
regenerated end to end is the only thing that would let someone claim the catalog is reproducible
rather than seed-addressable.

## Repeat it

```bash
git clone https://github.com/rachittshah/railhead
git -C railhead checkout 6158e15
python3 scripts/rederive_tasks.py --repo railhead
```

The script exits non-zero on any difference it cannot explain, so a second run against a newer pin is
a diff, not a reading.

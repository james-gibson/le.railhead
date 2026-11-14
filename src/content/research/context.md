---
title: The context these docs provide
description: Five things a study has to cite, and four it must not assume. What the shared context is, and where it stops.
order: 2
updated: 2026-11-14
tags: research, context, pin
seeds: research, reader
---

# The context these docs provide

These docs are not a copy of Railhead and they are not a summary of the team's findings. They are the
fixed reference a study points at, so that two studies read a year apart can be compared without
re-reading a 220 MB repository.

## Five things to cite

| Cite | Where | Why it matters to a study |
| --- | --- | --- |
| **The pin** | [the foot of every page](/ops/schedule), and `/upstream.json` | which commit the environment was read at; a second study at another pin is not the same world |
| **The terms** | [the arena terms](/brief/the-terms) | the mandate, the run-off, and the score — the reason a study's arms must include a run-off |
| **The limits** | [what the arena does not show](/arena/what-it-does-not-show) | one map, one game per model, no error bars; a study that quotes a rank as a measurement has misread it |
| **The verifier's open holes** | [known gaps](/known-gaps) | five named attacks the replay cannot stop; a result that depends on a log being live has to say so |
| **The task families** | [the catalog](/verify/tasks) | `deliver`, `deliver_bid`, `impossible`, `simops`, `tycoon`, `arena`, and the horizon and run-off each one uses |

## Four things not to assume

1. **That these docs are authoritative.** They are a projection of a repository the team does not
   control. If a page and the upstream file disagree, upstream is right; the pin is how you check.
2. **That "current" means "what the study used".** A study run at an earlier pin is still valid *as
   a study at that pin*. Drift at the foot of the page is context, not a correction.
3. **That the arena score is a benchmark.** It is an existence proof with a receipt. There is one
   game per model on one map, and the authors say so in their own document.
4. **That a verifier verdict is proof of honest play.** The replay proves a log is legal play from
   the sealed start. It cannot prove the play happened live — see the five gaps.

## What the docs do not do

- They do not run, score or re-verify a task. That is Railhead's job, on the team's machine.
- They do not host a run record. A run belongs beside its study, with its scenario, seed and version.
- They do not track the team's conclusions. [The register](/studies) tracks stages and publication
  dates; the argument stays on the study page.
- They do not decide anything about the new docs' own freshness. The daily rebuild reports upstream
  drift; a person decides what a study does about it.

## The boundary, in one sentence

The team reads Railhead, cites it at a pin, and publishes the change here; Railhead is not theirs to
change, and this site is not allowed to claim otherwise.

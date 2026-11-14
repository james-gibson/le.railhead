---
title: How a research change is published
description: The team does not control upstream. Every research change lands here, with the pin it was read against.
order: 1
updated: 2026-11-14
tags: research, process, publication
seeds: research
---

# How a research change is published

The studies team runs its own dashboard and owns its own study pages. It does **not** control
Railhead: the environment, the verifier and the task catalog belong to `rachittshah/railhead`, and
the team reads them at a pinned commit.

That asymmetry is the reason this site exists. These docs are the shared context the team publishes
against: the environment as it was measured, the limits it states, and the commit the team is
describing. A study can then say *which world it was run in* without re-deriving one.

## Who controls what

| Thing | Owner | How the team relates to it |
| --- | --- | --- |
| Railhead's code, verifier, tasks, releases | `rachittshah/railhead` | reads at the pin; cannot change, upgrade or patch it |
| The record of what Railhead does | these docs | publishes changes here |
| The studies themselves | [the team's dashboard](https://james-gibson.github.io/that-train-dashboard/studies/) | owns the study pages; registers them [here](/studies) |
| The cadence (weekly review, monthly recut) | [the team](https://james-gibson.github.io/that-train-dashboard/ops/cadence/) | unchanged by this site |

## What a published change carries

A change is a row in [the register's log](/studies#published), and it is not publishable without
four things:

1. **The study.** Its slug, as it is addressed on the team's dashboard.
2. **The kind of change.** A stage move, a corrected finding, a new arm, or a move to a new pin.
3. **The pin.** The upstream commit the change was read against — not the commit these docs were
   built from. Those are two different dates, and conflating them is the failure mode this rule
   exists to prevent.
4. **The date it was published here.** A change with no publication date is a change nobody can
   order against the others.

The study page keeps the argument, the arms and the counter-case. The register keeps the index:
question, stage, pin. If the two disagree, the study page is right and the register is stale until
the next publication.

## Why publish the change and not the conclusion

A conclusion with no date and no pin is not reusable. A reader cannot tell whether a study is
describing the environment as it is, as it was before resume-after-failure landed, or as it was
before the verifier began rejecting contradicted logs. Publishing the change — date plus pin — is
what lets a reader answer that without asking the team.

It also makes the team's own failure mode visible. A monthly recut that no longer reproduces is a
finding about the version, so it belongs in the log; a study that quietly keeps a conclusion from an
older pin does not.

## The cadence this sits inside

The team's cadence is weekly review, monthly recut, and an on-trigger review when a conclusion
changes. This site adds no schedule of its own to that: the **daily rebuild** only re-checks
upstream and reports drift, and the **publication log** changes when a person publishes a change.

| Event | Who acts | What changes here |
| --- | --- | --- |
| Weekly review | the team | a stage row in the register, or nothing |
| Monthly recut | the team | a row per study that was re-run, with the pin it was re-run against |
| Conclusion changed | the team | a row, and the study page carries the correction |
| Upstream moved | nobody | the foot of every page says so; no study is re-described automatically |

## What is deliberately not published here

- **No conclusions.** The register indexes studies; it does not summarise findings, because a
  summary is a second copy that drifts.
- **No runs.** A run record belongs beside the study, with its scenario, seed and version. This site
  has no database and no upload path, which is the same absence the team's dashboard documents.
- **No promotion.** A stage is copied from the study page at the date on the row. This site never
  advances a study.

## The first publication

The register opened on **2026-11-14**, when these docs deployed: three studies at the stages their
own pages recorded on 2026-11-13 — running, design, analysis. Nothing earlier is reconstructed,
because the dashboard is the record of that period and inventing rows would make the log a story
rather than a log.

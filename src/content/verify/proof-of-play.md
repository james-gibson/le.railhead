---
title: Proof of play
description: Five mechanisms, and the one thing the replay cannot prove — stated by the people who built the verifier.
order: 1
updated: 2026-11-14
tags: verify, replay, verifier
seeds: reader, operator
---

# Proof of play

Most game environments read the score off the screen. Railhead does not believe the screen. It rests
on five mechanisms, and each one works only because OpenTTD is a deterministic economic simulation
that you can save, load and fork.

## M1 — proof of play

The live game is only a rumour. The reward comes from a **replay of the model's action log**,
started from a sealed start state in a fresh engine process. If something changed the live game
without going into the log — a lucky glitch, a tampered save, a clever exploit — it does not exist
for the verifier.

After each wait the log carries a checksum of the world, and the replay must reproduce every one.
Across 1,539 oracle games and every verified model game the number of divergences is **zero**, and
logs recorded on macOS replay identically on Linux.

**What it cannot prove.** The replay proves a log is legal play from the sealed start. It cannot
prove the play happened live: an agent with root in the same container can run a private engine, or
cut its log at the best point.

## M2 — the run-off

After the mandate the model is gone and the world keeps running for 365 days. Asset stripping, loan
games and last-minute window dressing do not survive a year of unattended operation.
[The clearest game](/arena/the-run-off) is a company that outlived its player by seven years.

## M3 — priced, reseeded forks

A model can copy the world and try an idea in the copy. Opus did, twice — testing "wait until full"
loading orders against its live timetable. Over 180 simulated days the variant earned about £384k
less, because the planes sat idle at the gate. Opus threw the idea away and never touched the live
company with it.

Each fork is **reseeded**, so industry output, breakdowns and town growth take a different path. A
fork shows a *possible* future, not *the* future. Fork days come out of a budget, and nothing done
in a fork counts.

## M4 — promises that are scored properly

In `deliver_bid` tasks the model must promise a delivery quantity `B` early in the game. The payout

```text
min(D, B) − max(0, B − D)
```

is a newsvendor-style proper scoring rule: the best promise is the median of what the model believes
it will deliver. Optimism costs as much as sandbagging. Some contracts are secretly impossible, and
the right move there is to say so with `rh abstain`.

## M5 — exact credit

Every turn ends at an exact, replayable checkpoint, so the verifier can remove one turn from the log,
replay the rest, and measure how much that turn was worth (leave-one-turn-out credit). A task can
also start from any savegame: the `simops` family drops the model into a broken transport network
and asks it to repair it.

## The seal

Harbor runs each task in one container. Before any Python runs, the verifier checks a sealed SHA-256
manifest of the engine, the scripts and the package with `sha256sum`, then replays the log and writes
`reward.json`. There is one manifest per CPU architecture, because the engine binary differs on amd64
and arm64.

A log that a deterministic replay contradicts now gets `rejected = 1` and reward 0: when a checksum
differs, the verifier replays a second time, and if the two replays agree the log is false.

## What is still open

The threat model lists every attack that was tried, the test that closes each closed one, and the
ones still open. See [the known gaps](/known-gaps).

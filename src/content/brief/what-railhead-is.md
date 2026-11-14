---
title: What Railhead is
description: A reinforcement-learning environment in which a language model plays OpenTTD from a shell, first person, with the commands a human player has.
order: 1
updated: 2026-11-14
tags: brief, environment, openttd
seeds: reader, operator
---

# What Railhead is

Railhead hands a language model a transport company, a bank that will lend up to £500,000, and ten
years. The model plays [OpenTTD](https://www.openttd.org) **directly**: first person, from a shell,
with the same commands a human player has. There is no autopilot, no advisor, and no helper script
that builds the railway for it. If a road has to be laid, the model lays it, tile coordinate by tile
coordinate.

The whole environment is a Python package plus a patched OpenTTD 15.3 dedicated server. A model
talks to it through `rh`, a command-line client:

```text
$ rh brief
$ rh towns
$ rh air airport tile=198,412 type=large
$ rh vehicle buy depot_tile=199,414 engine=220
$ rh wait days=90 until=vehicle_crashed,cash_below:20000
```

## The clock is the strange part

**The world is frozen while the model thinks.** Game time moves only inside `rh wait`, so a model
can spend five minutes on one junction and lose no game time at all. It is the opposite of a reflex
benchmark; it is closer to playing chess against an economy.

That is not a detail of the wrapper. The engine is patched so a paused frame costs about a
millisecond, and the game advances only in explicit steps of N ticks, with 74 ticks to a game day.
The GameScript bridge counts the unpaused ticks itself and keeps the count in the savegame. That
counter — not wall-clock time and not the frame number — is the clock of the replay.

## What the model sees and does

- **Observation** is text: the map, the towns, the industries, the vehicles, the company's books.
  There is no screen and no screenshot.
- **Actions** are 42 verbs with GUI parity — build, buy, attach, order, terraform, advertise, sell.
  The engine's own rules decide what is legal; the environment does not re-implement them.
- **Waits** are the only place time passes, and each one ends with a checksum of the world written
  into the action log.

## Why a shell

A mouse-and-pixels interface measures the model's ability to operate a mouse. A shell measures what
it decides to build, and leaves a record you can replay. Every episode is an `actions.jsonl` file
plus a sealed start state, and the score is computed from those two files rather than from the live
game.

That choice is also the environment's main limit: it does not measure whether a model could use the
GUI a human uses, and it does not measure a coding agent's ability to write a helper — the helper is
not allowed to exist.

## Where to go next

- [The terms of the arena](/brief/the-terms): the mandate, the run-off year, and the score.
- [Provenance](/brief/provenance): the version chain, the licences, and the commit this record pins.
- [The universe](/universe): the same facts as a local-time record, with addresses you can check.

## Who uses this record

A research team studies economic questions by running them as OpenTTD simulations, and publishes
every research change through these docs. They do not control Railhead — the environment, the
verifier and the task catalog belong upstream — so the pin is the citation that makes two studies
comparable. [The register](/studies) lists what they are studying; [how a change is
published](/research/how-a-change-is-published) is the rule they follow.

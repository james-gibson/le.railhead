---
title: The operator
description: For an engineer who will build the engine, run one task, and check the reward against a replay.
order: 2
updated: 2026-11-14
tags: seeds, audience
---

# The operator

**Audience.** An engineer who wants to run one task, watch it, and verify the log.

**Assumes.** Python 3.11+, `uv`, a shell, and a C++ toolchain. You have compiled something before;
you can read a bash script before running it.

**Entrance.** [Run it locally](/ops/quickstart).

## What this seed teaches

- The engine build, and the three patches that make a paused world answer queries in a millisecond.
- One task from start to reward, and where the action log and its checksums live.
- How to replay a log and read the verdict rather than the screen.

## What it costs

- **An hour of build time**, most of it compiling OpenTTD. There is no prebuilt engine for your
  machine; the image exists but it is amd64 and arm64 containers, not a laptop binary.
- **Docker and Harbor** for the image and dataset steps. The single-task path does not need them.
- **Attention** on the integration tests, which start real engines.

## Reading order

1. [Run it locally](/ops/quickstart) — build, install, play, verify.
2. [Proof of play](/verify/proof-of-play) — what the verifier does with your log.
3. [The catalog](/verify/tasks) — the task families and what a certified task is.
4. [Provenance](/brief/provenance) — the version chain and the licences, before you redistribute
   anything.

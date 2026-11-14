---
title: Run it locally
description: Build one patched engine, start one task, play one turn, and replay the log. About an hour, most of it compiling.
order: 1
updated: 2026-11-14
tags: ops, quickstart, build
seeds: operator
---

# Run it locally

Railhead is not a hosted service. There is no sandbox to sign into; the environment is a repository
you build. Budget an hour, most of it compiling OpenTTD.

## What you need

- Python 3.11 or later, with [`uv`](https://docs.astral.sh/uv/).
- git, CMake, Ninja, a C++ compiler, curl and unzip.
- The development libraries for zlib, liblzma and liblzo2.
- Docker and Harbor 0.22 only for the image and dataset steps.

## Build the engine

```bash
git clone https://github.com/rachittshah/railhead
cd railhead
engine/build.sh
```

The script applies three patches before it builds a dedicated server only:

| Patch | What it does |
| --- | --- |
| `0001-console-gamespeed-and-reseed` | `gamespeed 0` runs the simulation unthrottled (3,000–5,000 game days a second); `reseed` re-rolls the random generator of a fork. |
| `0002-fast-paused-frames` | A paused frame takes about 1 ms, so a frozen world answers queries at once. Stock takes a full tick, about 27 ms. |
| `0003-large-gamescript-json` | A GameScript message to the admin port can be about 32 KB instead of 1,456 bytes. |

## Install the package

```bash
uv venv --python 3.12 .venv
uv pip install -e ".[dev,hub,viz]"
source .venv/bin/activate
pytest -q -m "not integration"
pytest -q -m integration      # these start real engines
```

## Play one task

```bash
export RAILHEAD_TASKS="$PWD/tasks" RAILHEAD_TASK=arena-dev-0005
export RAILHEAD_STATE="$HOME/.railhead/episodes/arena-dev-0005"
railhead up arena-dev-0005
rh brief && rh help
railhead down
```

`rh help` lists every verb and its arguments — 42 actions with GUI parity. `rh wait` is the only
place game time passes.

## Watch it instead of reading it

```bash
railhead view          # the OpenTTD GUI, live, on this machine
```

The viewer replays a game tick for tick; it is a window onto the same world the model sees as text,
not a second simulation.

## Verify what you played

```bash
python -m railhead.verify tasks/arena-dev-0005 tasks/arena-dev-0005/start.sav \
  run/actions.jsonl verify-out
```

The verifier replays the log in a fresh engine from the sealed start and writes `reward.json`. If a
checksum differs it replays a second time; if the two replays agree, the log is false and the result
is `rejected = 1` with reward 0.

## What this costs

- **Disk:** the engine build tree and the task catalog are the bulk of it; the repository is around
  220 MB before the build.
- **Time:** the build is the long pole. A first build on a laptop is tens of minutes; a rebuild after
  a patch change is much shorter because CMake caches.
- **Attention:** the integration tests start real engines and are slower and noisier than the unit
  tests. Run them on a machine you are not using for something else.

---
title: Provenance
description: The commit this record was read from, the version chain that only half-shipped, and the two licences.
order: 3
updated: 2026-11-14
tags: brief, provenance, licence, version
seeds: operator, agent-operations
---

# Provenance

A record that does not say where it came from is a rumour with formatting.

## The pin

Everything on this site was read from `rachittshah/railhead` at

```text
6158e15907f9b644d8afbe3fccd8e42e0917cfc0   2026-11-10T13:27:06Z
Merge pull request #7 from rachittshah/stack/2026-11-sota
```

The build re-checks the upstream head on every run and records the answer. When the head has moved,
the page and the published `upstream.json` say so; when the build has no network, the committed pin
is what ships and the snapshot is marked `source: "pinned"`. [How the check works](/ops/schedule).

## The version chain

| Version | State | What it is |
| --- | --- | --- |
| 0.1.0 | tagged 2026-10-16 | The first release; its image reported the wrong version. |
| 0.1.1 | tagged 2026-10-16 | The latest published image and datasets (`ghcr.io/rachittshah/railhead:0.1.1`), because it carries the task start states. |
| 0.1.2 | **unreleased** at the pin | `railhead.__version__` is now the single source: `pyproject.toml`, the image tag and the Harbor task version derive from it, and the build stops if they disagree. |

The 0.1.2 entry in `CHANGELOG.md` is the most useful document in the repository for a reader who
wants to know what the authors think is still wrong. It opens with "Not published yet", which is
the sentence this site repeats rather than smoothing over.

## The licences

Railhead is three different things under three different grants, and the repository ships all three
texts:

- **MIT** — the harness and the Python package.
- **GPL-2.0-only** — the engine patches and the GameScript bridge, because they link against
  OpenTTD.
- **OpenTTD and OpenGFX** — their own licences, with the upstream commit and a written offer of the
  source code at `/opt/railhead/licenses/` in the image.

`NOTICE` says which paths are under which licence. This site's own source is AGPL-3.0-only, which
is a grant about *this* site, not about the record it describes.

## What is recorded, and what is quoted

- **Recorded:** commit timestamps and subjects, tag dates, version state, licences, the published
  results table, and the limits the authors state in their own documents.
- **Quoted:** the README's prose about specific games, marked as quotation where it is speech.
- **Not inferred:** no figure on this site was estimated from a screenshot, a chart, or a
  description of a game. Where a number is missing upstream, the site says it is missing.

The machine-readable form is [the universe](/universe), and the vault document behind it is
`kb/lore/lore/railhead.md`.

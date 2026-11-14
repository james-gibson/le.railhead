---
title: Agent operations
description: For an LLM agent, or the person who points one at this repository, and wants the machine entry to be true.
order: 3
updated: 2026-11-14
tags: seeds, audience, agents
---

# Agent operations

**Audience.** An LLM agent, or the person who points one at this repository.

**Assumes.** Node 22, a shell, and the willingness to read a guard script rather than work around it.

**Entrance.** [For agents](/ops/for-agents), then `/llms.txt` on the deployed site.

## What this seed teaches

- Where the machine entry is, and what the site promises it: every page in the initial HTML, every
  link resolvable, one build command with one exit code.
- What the daily rebuild checks upstream, and why it publishes drift instead of hiding it.
- Which facts are pinned rather than generated, and how to re-derive them.

## What an agent should not do here

- **Do not make the build green by weakening a check.** The guard is the site's only claim to
  being checkable; every other statement on the site depends on it.
- **Do not regenerate content from the network.** The snapshot is data; the prose is authored and
  cited. A scheduled job that rewrote a page would make the page's citations unverifiable.
- **Do not treat the scoreboard as a ranking.** The page says so twice, and the upstream authors say
  so in their own document.

## Reading order

1. [For agents](/ops/for-agents) — the contract, the commands, the five facts to check.
2. [How this site stays current](/ops/schedule) — the schedule, the snapshot, the drift record.
3. [Known gaps](/known-gaps) — the five open holes in the verifier, named.
4. [The universe](/universe) — the record as a timeline with addresses.

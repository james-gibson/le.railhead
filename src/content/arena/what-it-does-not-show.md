---
title: What the arena does not show
description: No error bars, no ceiling, no way to separate a model from its harness, and no held-out split — in the authors' words.
order: 2
updated: 2026-11-14
tags: arena, limits, evidence
seeds: reader
---

# What the arena does not show

This page is the part of the record that makes the rest of it worth reading. Every limit below is
stated by the authors in the repository at the pinned commit, not inferred here.

## A ranking with error bars

There was **one map and one game per model**, so there are no confidence intervals. Second and third
place are £0.7 million apart — about 2.5% — and another map could swap them. The arena shows that
the environment separates models clearly. It is not a benchmark.

The authors then did the work: 23 more games on ten other maps, scored with a bootstrap over maps
and an exact sign test. Opus, gpt-6-astra and gpt-6-sol finish in that order on every map they
share, and Opus reaches £103 million and £115 million on two of them.

## How close to the ceiling

Not close. Eleven community script AIs — the scripted opponents OpenTTD players have written over
twenty years — played the same map, three seeds each. The best, AAAHogEx, ended the mandate at about
**£180 million** against **£41.3 million** for Opus, and five of them beat Opus in every seed.

The comparison flatters the scripts in one way and the models in another: a script acts on every
tick of running time and keeps playing through the run-off year, while a model thinks with the clock
stopped and lays each tile by hand.

## The model apart from its harness

The Claude models played through Claude Code and the OpenAI models through Codex. Every gap between
a Claude model and an OpenAI model is a gap between **model-plus-harness pairs**, and this arena
cannot split the two. The players also ran with the operator's own Claude Code and Codex settings,
not in clean configurations.

## Full games for everyone

`claude-fable-5-1` stopped in February 1963 at a session usage limit, not by choice. In Arena 1,
Opus and Sonnet stopped at usage limits after about 2.3 game years. The rules let their companies
run on, so their results measure what they had built by then, not what they would have built with
the whole mandate.

## What a game costs

The dollar figures — about $15 for Opus, $35.58 for Fable — are API-equivalent estimates: the price
Claude Code reports for the tokens at API rates. There is no dollar figure for the Codex players.
Wall-clock time per Claude player in Arena 2 was 17 to 79 minutes.

## No held-out split

The task IDs of `deliver`, `deliver_bid` and `simops` tasks are opaque, and the facts that would give
a task away live in `secret.json`, which never enters the image. They are not secret from the world:
the public repository tracks the `secret.json` of all 1,565 tasks and the oracle log of 1,562 of
them. Anyone who trains on the repository sees the answers, so **no split here is held out**.

## What "net worth" hides

Net worth is cash minus loan. It does not price a company's reputation, its station ratings, or the
quality of its timetable — things a transport operator would care about and a replay can check only
indirectly, through what they eventually earn.

## The honest summary

The arena is an existence proof with a receipt: these models can play this game from a shell, they
can be scored without trusting the screen, and the environment separates them by a wide margin. It
is not a leaderboard, and the difference between those two things is this page.

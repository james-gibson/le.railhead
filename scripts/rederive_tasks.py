#!/usr/bin/env python3
"""Re-derive the task spec of every catalog entry from its seed, and say what did not reproduce.

    python3 scripts/rederive_tasks.py --repo /path/to/railhead

No engine, no start.sav, no reward: this reads `tasks/*/task.json` and `secret.json`, calls the
pinned generator's `sample_scenario()` with the seed the directory names, and compares the public
scenario block. It is the cheap half of "the generator is public and deterministic" — a task's
*start state* still needs the engine to reproduce.

Exit 1 on any difference the generator does not explain. The one explained difference is an arena
task's `map_log2`: `railhead gen arena --map 256|512` sets it after sampling, so the catalog's 256²
and 512² arenas differ from the sampled size by design.
"""
from __future__ import annotations

import argparse
import collections
import json
import sys
from pathlib import Path

SKIP = {"family", "seed", "generation_seed", "variant"}
IMPOSSIBLE_OFFSET = 9000


def locate(task: dict, secret: dict) -> tuple[str, str, int]:
    """(family for the sampler, split, seed) from the task's own identifiers."""
    source = secret.get("source_task_id")
    variant = secret.get("variant")
    if source:
        prefix, split, seed = source.split("-")
        if variant == "impossible":
            return "impossible", split, int(seed) - IMPOSSIBLE_OFFSET
        return variant or prefix, split, int(seed)
    family, split, seed = task["task_id"].split("-")
    return family, split, int(seed)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True, help="a checkout of rachittshah/railhead")
    args = parser.parse_args()

    repo = Path(args.repo)
    sys.path.insert(0, str(repo / "src"))
    from railhead.gen.scenario import sample_scenario, task_id  # noqa: E402

    exact = collections.Counter()
    map_only = collections.Counter()
    broken: list[tuple[str, str]] = []
    hashed = 0

    task_dirs = sorted(p for p in (repo / "tasks").iterdir() if p.is_dir())
    for directory in task_dirs:
        task = json.loads((directory / "task.json").read_text())
        secret = json.loads((directory / "secret.json").read_text())
        family, split, seed = locate(task, secret)

        if secret.get("source_task_id"):
            hashed += 1
            prefix, _, stored = secret["source_task_id"].split("-")
            if task_id(prefix, split, int(stored)) != secret["source_task_id"]:
                broken.append((task["task_id"], "seed id does not reproduce"))

        scenario = sample_scenario(seed, split, family)
        observed = {k: v for k, v in task["scenario"].items() if k not in SKIP}
        regenerated = {k: v for k, v in scenario.items() if k in observed}
        label = secret.get("variant") or family

        if observed == regenerated:
            exact[label] += 1
        elif (
            family == "arena"
            and {k: v for k, v in observed.items() if k != "map_log2"}
            == {k: v for k, v in regenerated.items() if k != "map_log2"}
        ):
            map_only[label] += 1
        else:
            differing = sorted(k for k in observed if observed[k] != regenerated.get(k))
            broken.append((task["task_id"], ", ".join(differing) or "unknown"))

        private = secret.get("scenario_private")
        if private and (
            private.get("seed") != seed or private.get("generation_seed") != scenario["generation_seed"]
        ):
            broken.append((task["task_id"], "scenario_private disagrees"))

    oracle = sum(1 for d in task_dirs if (d / "oracle.jsonl").exists())
    certificates = [json.loads(p.read_text()) for p in repo.glob("tasks/*/certificates.json")]
    invalid = [c for c in certificates if not c.get("oracle_valid")]

    print(f"tasks            {len(task_dirs)}")
    print(f"  seed ids        {len(task_dirs) - hashed}   (tycoon and arena keep their seed)")
    print(f"  opaque ids      {hashed}")
    print(f"oracle logs      {oracle}")
    print(f"certificates     {len(certificates)}  ({len(invalid)} not valid)")
    print()
    print(f"{'variant':<14}{'exact':>7}{'map only':>10}")
    for label in sorted(exact | map_only):
        print(f"{label:<14}{exact[label]:>7}{map_only[label]:>10}")
    print()
    if broken:
        print(f"{len(broken)} unexplained difference(s):")
        for task, why in broken[:20]:
            print(f"  {task}: {why}")
        return 1
    if invalid:
        print(f"{len(invalid)} certificate(s) do not have oracle_valid=1")
        return 1
    print("every scenario reproduced; the arena map size is the only explained difference")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

---
description: Add one Markdown page to le.railhead, verify it with the guard and smoke, and commit locally
---

Add one page to the le.railhead record. The argument names the section, and may include a slug:

$ARGUMENTS

Follow `.opencode/skills/legume-content/SKILL.md` and `AGENTS.md`:

1. Pick the section the request actually belongs to, and say why in one line. Sections are `brief`,
   `arena`, `verify`, `ops`, `seeds`.
2. If the page states a number, put the number in its module (`src/lib/arena.ts`, `src/lib/gaps.ts`,
   `src/universes/railhead.ts`) and cite the commit it came from. A number typed into prose is a
   number that will drift.
3. Write exactly one file: `src/content/<section>/<slug>.md`, with `title` and `description`
   frontmatter, `order` where the section is ordered, and `seeds:` if the page belongs to one.
4. Write internal links root-absolute (`/arena/scoreboard`); never hand-write the `/le.railhead/`
   mount.
5. Keep the house voice: dry, specific, cost-first, and honest about what is unreleased or unknown.
6. Run `npm run build` (the guard is the gate) and `npm run smoke`.
7. Commit locally. Push only when the request says publish, ship or deploy.

Report, in this order: the file you touched, the guard line, the smoke count, and whether the
change is live.

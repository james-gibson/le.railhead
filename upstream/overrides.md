# Local overrides

This child defers to the parent's rules list, vendored at build time by
`scripts/sync-upstream.mjs`. A rule is only replaced here with a reason, and the
override is published at `/rules.md`.

- RULES-02: Navigation is derived from the content tree — this child adds three declared live routes (`/universe`, `/known-gaps`, `/design`) whose content is a module rather than a Markdown file. They are listed once in `EXTRA_ROUTES` and the guard checks that each has a shell and an `llms.txt` entry, so the derivation still covers every route.

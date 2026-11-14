/**
 * Railhead — a reinforcement-learning environment in which a language model
 * plays OpenTTD from a shell (`technology:railhead:2026`).
 *
 * WHY `technology:` AND NOT `game:`. The universe being recorded is not the
 * simulated transport economy that OpenTTD runs; that is `game:openttd:openttd:2004`,
 * which this universe declares as its parent. Railhead is a real piece of
 * software built around that game — an environment, a verifier and a task
 * catalog — so it takes the technology namespace.
 *
 * WHY `documentary`. Every keyframe is a commit, a tag, a published result or a
 * document in the upstream repository at the pinned commit. Nothing here is
 * inferred from a screenshot of a game; the game is the fiction, and the record
 * is the real artefact.
 *
 * THE ZERO POINT is the first commit, 2026-10-16T08:07:15Z ("Scaffold Railhead
 * and write the design"), not the Arena 2 start. The scaffold is when the
 * project exists; the arena is what it did seven hours later. A reader who
 * wants "how long until a model played" reads the address of `arena-2-opens`:
 * T+02:05:45.
 *
 * SOURCES are the repository at the pinned commit, its tag objects and its
 * commit history, retrieved 2026-11-14. The commit timestamps here are commit
 * *author* dates, which is what the log records; a merge commit's date can be
 * later than the work it merges.
 *
 * This module is the same universe the vault declares at
 * `kb/lore/lore/railhead.md` and the local-time registry carries as
 * `src/config/universes/openttd/railhead.ts`. The site renders it at /universe;
 * the KB doc is the record of truth and this is the public projection.
 */
import { DAY_NS, SECOND_NS, type LocalTimeUniverse } from './types'

const at = (iso: string) => BigInt(Date.parse(iso)) * 1_000_000n

const ZERO = '2026-10-16T08:07:15Z'

export const railheadUniverse: LocalTimeUniverse = {
  universeId: 'technology:railhead:2026',
  type: 'TECHNOLOGY',
  identifiers: {
    primary: 'technology:railhead:2026',
    aliases: ['railhead', 'rh', 'railhead env'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0,
    realityAnchors: [
      {
        realEventId: 'technology:railhead:2026',
        relationshipType: 'documents',
        confidence: 1,
        evidence: [
          'the commit history of rachittshah/railhead at 6158e15',
          'README.md and CHANGELOG.md at the pinned commit',
          'tag objects v0.1.0 and v0.1.1',
        ],
      },
    ],
  },
  attribution: {
    copyright: { holders: ['Rachit Shah'], year: 2026, status: 'active' },
    citations_required: true,
    usage_restrictions: [
      'MIT for the harness and the package; GPL-2.0-only for the engine patches and the GameScript bridge (see the upstream NOTICE and LICENSES/).',
    ],
    sources: [
      'https://github.com/rachittshah/railhead — README.md (arena terms, results, limits)',
      'https://github.com/rachittshah/railhead/blob/main/CHANGELOG.md — 0.1.2 unreleased, 0.1.1 published',
      'https://github.com/rachittshah/railhead/blob/main/docs/ARCHITECTURE.md — engine patches, layers',
      'https://github.com/rachittshah/railhead/blob/main/docs/VERIFICATION.md — threat model and open attacks',
      'https://github.com/rachittshah/railhead/blob/main/docs/TASKS.md — the task catalog and its families',
      'https://github.com/rachittshah/railhead — commit history, author dates, retrieved 2026-11-14',
    ],
  },
  connections: {
    natural: {
      // The platform the environment runs on, and the game world it drives.
      parentUniverses: ['game:openttd:openttd:2004'],
    },
  },
  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        zero_reference: {
          epochId: 'zero_reference',
          startTime: at(ZERO),
          precision: SECOND_NS,
          zeroPoint: at(ZERO),
          zeroEvent:
            'The first commit: "Scaffold Railhead and write the design". The project exists before any model plays.',
          beforePrefix: 'T-',
          afterPrefix: 'T+',
          relativeFormat: 'HMS',
          zeroStatus: 'established',
        },
        'scaffold': {
          epochId: 'scaffold',
          start: at(ZERO),
          end: at('2026-10-16T09:57:14Z'),
          precision: SECOND_NS,
          description:
            'Seven hours of scaffolding: engine patches, the admin-port client, the player actions, the observation layer and the first task catalog, ending with the v0.1.0 tag.',
        },
        'arena-2': {
          epochId: 'arena-2',
          start: at('2026-10-16T10:13:00Z'),
          end: at('2026-10-17T13:30:03Z'),
          precision: SECOND_NS,
          description:
            'Eleven models, then five free ones, on arena-dev-0100: one game each, ten years, then a 365-day run-off with nobody at the keyboard.',
        },
        'hardening': {
          epochId: 'hardening',
          start: at('2026-10-20T09:28:34Z'),
          end: at('2026-11-10T13:27:06Z'),
          precision: DAY_NS,
          description:
            'Resume after a provider outage, verifier hardening, a threat table, licence files, one version source, and the Arena 2 timelapse.',
        },
      },
    },
  ],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'scaffold',
        start: at(ZERO),
        end: at('2026-10-16T09:57:14Z'),
        type: 'phase',
        status: 'inactive',
        description: 'The interface is built before anything plays on it.',
      },
      {
        id: 'arena-2',
        start: at('2026-10-16T10:13:00Z'),
        end: at('2026-10-17T13:30:03Z'),
        type: 'phase',
        status: 'inactive',
        description: 'Sixteen companies, one map, eleven years of game time each.',
      },
      {
        id: 'hardening',
        start: at('2026-10-20T09:28:34Z'),
        end: at('2026-11-10T13:27:06Z'),
        type: 'phase',
        status: 'inactive',
        description: 'The claims get tests: resume, threats, licences, one version.',
      },
      {
        id: 'pinned',
        start: at('2026-11-10T13:27:06Z'),
        end: at('2026-11-14T00:00:00Z'),
        type: 'phase',
        status: 'active',
        description: 'The commit this record pins. 0.1.2 is in the working tree, unreleased.',
      },
    ],
    keyframes: [
      {
        id: 'scaffold',
        address: 'railhead-build:T+00:00:00',
        timestamp: at(ZERO),
        significance: 1,
        certainty: 1,
        tags: ['origin', 'design', 'scaffold'],
        description:
          'The first commit writes the design and the package skeleton. No engine is patched yet; nothing has played.',
      },
      {
        id: 'packaging',
        address: 'railhead-build:T+00:24:41',
        timestamp: at('2026-10-16T08:31:56Z'),
        significance: 0.6,
        certainty: 1,
        tags: ['packaging', 'ci', 'harbor'],
        description:
          'The Docker image, the CI workflow, the Harbor export and the Hugging Face dataset builder arrive in one push.',
      },
      {
        id: 'observation-layer',
        address: 'railhead-build:T+00:41:18',
        timestamp: at('2026-10-16T08:48:33Z'),
        significance: 0.7,
        certainty: 1,
        tags: ['interface', 'observation'],
        description:
          'The observation layer and the `rh` text interface are complete: a model can see the world through a shell.',
      },
      {
        id: 'action-layer',
        address: 'railhead-build:T+00:45:30',
        timestamp: at('2026-10-16T08:52:45Z'),
        significance: 0.8,
        certainty: 1,
        tags: ['interface', 'actions'],
        description:
          'The player action layer is complete — 42 verbs with GUI parity — so a model can build what a human can build.',
      },
      {
        id: 'catalog-v0-1',
        address: 'railhead-build:T+01:49:43',
        timestamp: at('2026-10-16T09:56:58Z'),
        significance: 0.9,
        certainty: 1,
        tags: ['catalog', 'tasks', 'certification'],
        description:
          'The v0.1 task catalog: 1,540 tasks, each certified by a scripted oracle and a do-nothing log before it is kept.',
      },
      {
        id: 'v0-1-0',
        address: 'railhead-build:T+01:49:59',
        timestamp: at('2026-10-16T09:57:14Z'),
        significance: 0.9,
        certainty: 1,
        tags: ['release', 'version'],
        description: 'v0.1.0 is tagged, sixteen seconds after the catalog commit.',
      },
      {
        id: 'v0-1-1',
        address: 'railhead-build:T+02:02:30',
        timestamp: at('2026-10-16T10:09:45Z'),
        significance: 0.7,
        certainty: 1,
        tags: ['release', 'version', 'fix'],
        description:
          'v0.1.1 adds the task start states the image needs. It is the latest published tag.',
      },
      {
        id: 'arena-2-opens',
        address: 'railhead-build:T+02:05:45',
        timestamp: at('2026-10-16T10:13:00Z'),
        significance: 1,
        certainty: 1,
        tags: ['arena', 'play'],
        description:
          'At 15:43 India time, eleven companies come into existence on arena-dev-0100: a 512 by 512 temperate map, January 1960, ten years and a 365-day run-off.',
      },
      {
        id: 'arena-2-results',
        address: 'railhead-build:T+02:25:35',
        timestamp: at('2026-10-16T10:32:50Z'),
        significance: 0.95,
        certainty: 1,
        tags: ['arena', 'results', 'publication'],
        description:
          'The README publishes the Arena 2 results: eleven models, ten years, replay-verified. Claude Opus 5.5 leads at £45,758,664.',
      },
      {
        id: 'dataset-published',
        address: 'railhead-build:T+04:09:03',
        timestamp: at('2026-10-16T12:16:18Z'),
        significance: 0.8,
        certainty: 1,
        tags: ['dataset', 'release', 'hugging-face'],
        description: 'The Harbor datasets are published on Hugging Face: dev and ood, plus a train split.',
      },
      {
        id: 'free-models',
        address: 'railhead-build:T+29:22:48',
        timestamp: at('2026-10-17T13:30:03Z'),
        significance: 0.7,
        certainty: 1,
        tags: ['arena', 'free-tier', 'opencode-zen'],
        description:
          'Five free OpenCode Zen models play the same world, taking the arena to sixteen. One beats the scripted baseline; one finishes last at −£425,249.',
      },
      {
        id: 'resume',
        address: 'railhead-build:T+97:21:19',
        timestamp: at('2026-10-20T09:28:34Z'),
        significance: 0.6,
        certainty: 1,
        tags: ['supervisor', 'reliability'],
        description:
          'Arena players resume after a crash, a reboot or a usage limit. The supervisor classifies outage, quota and stall, and never restarts a model that stopped on its own.',
      },
      {
        id: 'optional-engine-knobs',
        address: 'railhead-build:T+312:12:25',
        timestamp: at('2026-10-29T08:19:40Z'),
        significance: 0.4,
        certainty: 1,
        tags: ['engine', 'build'],
        description:
          'The engine build accepts CXX_FLAGS and EXTRA_PATCHES, so a variant engine gets its own tree. The default build and its checksums are unchanged.',
      },
      {
        id: 'release-0-1-2-surface',
        address: 'railhead-build:T+598:28:09',
        timestamp: at('2026-11-10T06:35:24Z'),
        significance: 0.8,
        certainty: 1,
        tags: ['release', 'version', 'licence', 'docs'],
        description:
          'The 0.1.2 surface: one version source, the MIT and GPL-2.0 licence files and NOTICE, a quick start with tested links, verifier hardening, and the threat table.',
      },
      {
        id: 'arena-2-timelapse',
        address: 'railhead-build:T+598:41:01',
        timestamp: at('2026-11-10T06:48:16Z'),
        significance: 0.6,
        certainty: 1,
        tags: ['arena', 'replay', 'video'],
        description:
          'The Arena 2 timelapse: eleven networks growing from 1960 to 1971, every frame from a replay.',
      },
      {
        id: 'pinned-commit',
        address: 'railhead-build:T+605:19:51',
        timestamp: at('2026-11-10T13:27:06Z'),
        significance: 0.7,
        certainty: 1,
        tags: ['pin', 'record'],
        description:
          'The commit this record is read from: 6158e15, the merge of the 2026-11 stack. CHANGELOG.md at this commit says 0.1.2 is unreleased.',
      },
    ],
    windows: { strategy: 'time_based', avgWindowSize: BigInt(DAY_NS) },
  },
  metadata: {
    canonicalName: 'Railhead',
    creators: ['Rachit Shah'],
    released: new Date('2026-10-16T09:57:14Z'),
    cultural_significance: 0.4,
    platform: 'OpenTTD 15.3, patched, dedicated server',
    language: 'Python 3.11+',
    pinnedCommit: '6158e15907f9b644d8afbe3fccd8e42e0917cfc0',
  },
}

import { PAGES, type Page } from './content'

/**
 * Seeds, on the parent's scale.
 *
 * A seed is a body of knowledge with three things stated up front: who it is
 * for, what it assumes, and where it starts. The scale adds the fourth: how
 * much of the machine the audience is willing to touch.
 *
 * Membership is derived from `seeds:` in page frontmatter, so a seed's contents
 * cannot drift from the pages that declare them. This child keeps the parent's
 * rungs 1 to 3 only: there is no rung-0 audience for a Python environment you
 * have to build an OpenTTD server for, and pretending otherwise would be a
 * brochure.
 */

export type Seed = {
  id: string
  title: string
  /** who this is written for, in one line */
  audience: string
  /** what they must already know — "nothing" is a valid and useful answer */
  assumes: string
  /** three claims the seed makes good on */
  teaches: string[]
  /** the route a newcomer should open first */
  entry: string
  /** position on the readiness scale */
  rung: number
  /** what this audience does with the machine */
  touches: string
}

export const SCALE: Record<number, { label: string; touches: string }> = {
  0: { label: 'Just a website', touches: 'wants a website and a bill; will not open a terminal' },
  1: { label: 'Understand', touches: 'reads concepts; will not deploy anything' },
  2: { label: 'Learn', touches: 'runs it locally and breaks it on purpose' },
  3: { label: 'Operate', touches: 'delegates the running; wants it repeatable' },
  4: { label: 'Package', touches: 'designs systems other people will operate' },
}

export const SEEDS: Seed[] = [
  {
    id: 'reader',
    title: 'The reader',
    audience: 'Someone who wants to know what the arena measured, and what it did not.',
    assumes: 'Nothing. You do not need to have played OpenTTD.',
    teaches: [
      'what a first-person game environment is, and why a shell is the interesting interface',
      'why the run-off year, not the last day, is the score',
      'which limits the eleven-model arena cannot answer, in its own words',
    ],
    entry: '/brief/what-railhead-is',
    rung: 1,
    touches: 'reads the scoreboard and the limits; will not open a terminal',
  },
  {
    id: 'operator',
    title: 'The operator',
    audience: 'An engineer who wants to run one task, watch it, and verify the log.',
    assumes: 'Python 3.11+, uv, a C++ toolchain, and about an hour for the engine build.',
    teaches: [
      'the engine build and the three patches that make a paused world answer queries',
      'one task from start to reward, and where the action log and its checksums live',
      'how to replay a log and read the verdict rather than the screen',
    ],
    entry: '/ops/quickstart',
    rung: 2,
    touches: 'runs it locally and breaks it on purpose',
  },
  {
    id: 'agent-operations',
    title: 'Agent operations',
    audience: 'An LLM agent, or the person who points one at this repository.',
    assumes: 'Node 22, a shell, and the willingness to read a guard script.',
    teaches: [
      'where the machine entry is, and what the site promises it',
      'what the daily rebuild checks upstream, and what it refuses to hide',
      'which facts on this site are pinned, and how to re-derive them',
    ],
    entry: '/ops/for-agents',
    rung: 3,
    touches: 'delegates the running; wants it repeatable',
  },
]

export function getSeed(id: string): Seed | undefined {
  return SEEDS.find((seed) => seed.id === id)
}

/** Pages that declare this seed, in section order. */
export function seedMembers(id: string): Page[] {
  return PAGES.filter((page) => page.seeds.includes(id))
}

/** Seeds a page belongs to. */
export function seedsOf(page: Page): Seed[] {
  return page.seeds.map(getSeed).filter((seed): seed is Seed => !!seed)
}

/** The rungs, with the seeds that sit on each. */
export function scale(): { level: number; label: string; touches: string; seeds: Seed[] }[] {
  return Object.entries(SCALE)
    .map(([level, step]) => ({
      level: Number(level),
      ...step,
      seeds: SEEDS.filter((seed) => seed.rung === Number(level)),
    }))
    .sort((a, b) => a.level - b.level)
}

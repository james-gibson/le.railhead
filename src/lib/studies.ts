/**
 * The studies register, and the log of what this docs site published.
 *
 * The team does not control `rachittshah/railhead`. They pin it, cite it, and
 * run studies against it; this repository is the shared context they publish
 * against, so the register lives here and the study pages stay where they are
 * owned (`that-train-dashboard`).
 *
 * A row is registered from the study's own frontmatter at the date shown. The
 * register is not a copy of the study: it carries the question, the stage, and
 * the pin the team is reading today, so a reader can tell whether a study is
 * being described against the world it was run in.
 */

export type Stage = 'design' | 'running' | 'analysis' | 'closed'

export type Study = {
  /** the study's slug in the team's dashboard; the URL is the source */
  slug: string
  title: string
  /** the question the study is trying to answer, one sentence */
  question: string
  stage: Stage
  /** the study page's own `updated:` date, not this register's */
  studyUpdated: string
  url: string
  /** what a reader should know before reading the study */
  note: string
}

export const TEAM = {
  name: 'The studies team',
  // The dashboard is the team's own record; this site is the context it runs against.
  dashboard: 'https://james-gibson.github.io/that-train-dashboard/',
  studiesIndex: 'https://james-gibson.github.io/that-train-dashboard/studies/',
  cadence: 'https://james-gibson.github.io/that-train-dashboard/ops/cadence/',
  limits: 'https://james-gibson.github.io/that-train-dashboard/notes/what-we-do-not-claim/',
} as const

export const STAGE_MEANING: Record<Stage, string> = {
  design: 'the design is written and at least one arm is still missing; nothing here is a finding',
  running: 'at least one arm is recorded; the study has not reached a conclusion',
  analysis: 'the runs exist and the team is arguing with them; conclusions are provisional',
  closed: 'the team recorded an answer, and the study is kept for the counter-case',
}

export const STUDIES: Study[] = [
  {
    slug: 'freight-rate-shock',
    title: 'A freight-rate shock',
    question: 'If one freight lane’s rate doubles, does the network re-route, absorb the cost, or stall?',
    stage: 'running',
    studyUpdated: '2026-11-13',
    url: `${TEAM.dashboard}studies/freight-rate-shock/`,
    note: 'The baseline is recorded; the shock arm is scheduled for the next review. Nothing on it is a finding yet.',
  },
  {
    slug: 'station-subsidy',
    title: 'Station subsidies',
    question: 'Does a subsidy buy coverage, or does it buy empty trains?',
    stage: 'design',
    studyUpdated: '2026-11-13',
    url: `${TEAM.dashboard}studies/station-subsidy/`,
    note: 'The per-passenger arm needs a scenario hook that does not exist yet. The study says so on its own page.',
  },
  {
    slug: 'timetable-discipline',
    title: 'Timetable discipline under load',
    question: 'At what demand does a working timetable stop working?',
    stage: 'analysis',
    studyUpdated: '2026-11-13',
    url: `${TEAM.dashboard}studies/timetable-discipline/`,
    note: 'The failure is not gradual: the queue appears in one month and stays. The analyst refuses to call the failure point a property of the timetable.',
  },
  {
    slug: 'rng-comprehension',
    title: 'RNG comprehension tests',
    question: 'Does the team’s model of OpenTTD’s random generator survive measurement — and which claim fails first?',
    stage: 'design',
    studyUpdated: '2026-11-26',
    url: `${TEAM.dashboard}studies/rng-comprehension/`,
    note: 'Six probes: the null map, a draw census, the invertible step, the one-word release check, reseed spread, and the prediction sheet. Nothing is run yet.',
  },
  {
    slug: 'contested-corridors',
    title: 'Contested corridors',
    question: 'When three companies converge on the same town, does a dated pre-plan plus a cheap triage tier beat the scripts’ race?',
    stage: 'design',
    studyUpdated: '2026-11-26',
    url: `${TEAM.dashboard}studies/contested-corridors/`,
    note: 'Four arms and a plan-time broker. The digest — the typed brief the frontier tier sees — is named as the open design decision, not assumed.',
  },
]

export type Publication = {
  /** the day the change was published here */
  date: string
  study: string
  change: string
  /** the upstream commit the change was read against */
  pin: string
}

/**
 * The change log. One row per research change published through these docs.
 *
 * The first row is the register itself: the three studies were seeded from their
 * own pages on 2026-11-13 and published here on 2026-11-14, when this site went
 * live. Nothing before that date is reconstructed — the studies dashboard is the
 * only record of it, and inventing rows would make the log a story.
 */
export const PUBLICATIONS: Publication[] = [
  {
    date: '2026-11-14',
    study: 'freight-rate-shock, station-subsidy, timetable-discipline',
    change:
      'Register opened: three studies published at the stage recorded on their own pages (running, design, analysis), with the pin they are described against.',
    pin: '6158e15',
  },
  {
    date: '2026-11-27',
    study: 'rng-comprehension, contested-corridors',
    change:
      'Two studies opened at design stage, both derived from gibsunas/openttd#80: the RNG probe set and the triage-plus-pre-plan design. In the same cycle, every task spec was re-derived from its seed and the catalog numbers on this site were corrected.',
    pin: '6158e15',
  },
]

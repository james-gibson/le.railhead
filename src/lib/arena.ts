/**
 * Arena 2, as one data module.
 *
 * The numbers are copied from README.md at the pinned commit
 * (`6158e15`), not typed into prose on a page. A page that disagrees with this
 * file is a bug the build cannot see; a page that reads it cannot drift.
 *
 * The arena ran one game per player on one map. Nothing here is an estimate,
 * and nothing here has an error bar — see /arena/what-it-does-not-show.
 */

export type Replay = 'valid' | 'certificate' | 'none'

export type Player = {
  model: string
  harness: string
  /** net worth after the run-off year, as published */
  netWorth: string
  /** the same figure as a number, for sorting and comparison */
  value: number
  /** (W - W_idle) / (W_base - W_idle) */
  gain: number
  actions: number | null
  replay: Replay
  note?: string
}

export const ARENA = {
  task: 'arena-dev-0100',
  map: '512 × 512 tiles, temperate, one inland sea',
  starts: 'January 1960',
  mandateYears: 10,
  runOffDays: 365,
  openedAt: '2026-10-16T10:13:00Z',
  openedLocal: 'Friday 15:43, India time',
  players: 11,
  freeModels: 5,
  divergences: 0,
  tasks: 1540,
  tasksInRepo: 1565,
} as const

/** The eleven models, in published order. */
export const PLAYERS: Player[] = [
  { model: 'claude-opus-5-5', harness: 'Claude Code', netWorth: '£45,758,664', value: 45758664, gain: 249.3, actions: 554, replay: 'valid' },
  { model: 'gpt-6-astra', harness: 'Codex', netWorth: '£27,935,307', value: 27935307, gain: 152.3, actions: 298, replay: 'valid' },
  { model: 'gpt-6-sol', harness: 'Codex', netWorth: '£27,232,656', value: 27232656, gain: 148.4, actions: 639, replay: 'valid' },
  { model: 'gpt-6.1-sol', harness: 'Codex', netWorth: '£22,371,463', value: 22371463, gain: 122.0, actions: 286, replay: 'valid' },
  { model: 'gpt-5.6-sol', harness: 'Codex', netWorth: '£13,130,503', value: 13130503, gain: 71.7, actions: 349, replay: 'valid' },
  {
    model: 'claude-fable-5-1',
    harness: 'Claude Code',
    netWorth: '£9,837,139',
    value: 9837139,
    gain: 53.7,
    actions: 566,
    replay: 'valid',
    note: 'Stopped in February 1963 at a session usage limit; the company ran on without it.',
  },
  { model: 'claude-sonnet-5-5', harness: 'Claude Code', netWorth: '£3,930,521', value: 3930521, gain: 21.6, actions: 1021, replay: 'valid' },
  { model: 'claude-haiku-5-5', harness: 'Claude Code', netWorth: '£2,757,221', value: 2757221, gain: 15.2, actions: 832, replay: 'valid' },
  { model: 'gpt-5.6-terra', harness: 'Codex', netWorth: '£335,998', value: 335998, gain: 2.0, actions: 241, replay: 'valid' },
  { model: 'gpt-6-luna', harness: 'Codex', netWorth: '£236,701', value: 236701, gain: 1.5, actions: 239, replay: 'valid' },
  {
    model: 'gpt-5.6-luna',
    harness: 'Codex',
    netWorth: '−£50,557',
    value: -50557,
    gain: -0.1,
    actions: 436,
    replay: 'valid',
    note: '£14,257 worse than a company that never acts.',
  },
]

/** The two references every player is scored against. */
export const BASELINES: Player[] = [
  { model: 'Scripted truck route', harness: 'baseline', netWorth: '£147,407', value: 147407, gain: 1, actions: null, replay: 'certificate' },
  { model: 'No play', harness: 'idle', netWorth: '−£36,300', value: -36300, gain: 0, actions: 0, replay: 'certificate' },
]

/** The five free OpenCode Zen models that played the same world later. */
export const FREE_PLAYERS: Player[] = [
  { model: 'beam-free', harness: 'OpenCode Zen', netWorth: '£411,339', value: 411339, gain: 2.3, actions: null, replay: 'valid', note: 'Played the whole decade in 9 minutes of wall-clock time.' },
  { model: 'longcat-2.5-preview-free', harness: 'OpenCode Zen', netWorth: '−£8,846', value: -8846, gain: 0.1, actions: null, replay: 'valid', note: 'Free-tier usage limit in 1962.' },
  { model: 'nemotron-3-ultra-free', harness: 'OpenCode Zen', netWorth: '−£36,300', value: -36300, gain: 0, actions: 0, replay: 'valid', note: 'Never acted: provider outages.' },
  { model: 'nemotron-3.5-super-vl-free', harness: 'OpenCode Zen', netWorth: '−£129,949', value: -129949, gain: -1.8, actions: null, replay: 'valid', note: 'Stream stalls in 1963.' },
  { model: 'space-bunny-free', harness: 'OpenCode Zen', netWorth: '−£425,249', value: -425249, gain: -7.5, actions: null, replay: 'valid', note: 'Played the whole decade; last of sixteen.' },
]

export const REPLAY_MEANING: Record<Replay, { label: string; meaning: string }> = {
  valid: {
    label: 'replay valid',
    meaning: 'a fresh engine replayed the action log from the sealed start state and reproduced every checksum',
  },
  certificate: {
    label: 'certificate',
    meaning: 'a scripted oracle or a do-nothing log, certified by the task generator rather than by a model',
  },
  none: {
    label: 'not replayed',
    meaning: 'no replay verdict is published for this row',
  },
}

/** Why this row carries this verdict. The status is a verdict with visible reasoning. */
export function replayReason(player: Player): string {
  if (player.replay === 'certificate') {
    return `${player.model} is a reference, not a player: the task generator played it and certified the result. There is no model log to replay.`
  }
  return `${player.model} finished with ${player.actions ?? 'an unrecorded number of'} actions and a replay that reproduced every checksum, ${ARENA.divergences} divergences. The replay proves the log is legal play from the sealed start; it does not prove the play happened live.`
}

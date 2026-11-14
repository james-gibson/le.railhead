import pinned from '../data/upstream.json'

/**
 * The upstream snapshot this site is describing.
 *
 * `scripts/upstream.mjs` runs before every build and writes
 * `src/data/upstream.live.json` when the GitHub API answers. That file is
 * git-ignored: it is the result of *this* build's check, not a fact about the
 * repository. When the build has no network, the committed pin is what ships,
 * and the page says so by carrying `source: "pinned"`.
 *
 * The glob is the conditional: with no live file it matches nothing, and the
 * committed pin is used.
 */

export type UpstreamSnapshot = {
  repo: string
  url: string
  /** the commit this site's facts were read from */
  pinnedSha: string
  pinnedCommitAt: string
  pinnedSubject: string
  latestTag: string
  latestTagAt: string
  /** the version in the working tree at the pinned commit */
  version: string
  versionStatus: 'released' | 'unreleased'
  /** when the check ran */
  checkedAt: string
  /** `pinned` when nothing was fetched at build time, `live` when it was */
  source: 'pinned' | 'live'
  licence: string
  /** present only on a live check: what upstream head was at that moment */
  headSha?: string
  headCommitAt?: string
  headSubject?: string
  /** true when upstream head differs from the pinned commit */
  drift?: boolean
  /** the error, when the live check could not answer */
  note?: string
}

const liveModules = import.meta.glob<{ default: UpstreamSnapshot }>('../data/upstream.live.json', {
  eager: true,
})

const live = Object.values(liveModules)[0]?.default

export const upstream: UpstreamSnapshot = live ?? (pinned as UpstreamSnapshot)

/** The short form a page shows: seven characters, the git convention. */
export const shortSha = (sha: string) => sha.slice(0, 7)

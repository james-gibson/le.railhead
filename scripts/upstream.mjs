#!/usr/bin/env node
/**
 * Re-check the upstream repository before the build, and write what it found.
 *
 * The result goes to `src/data/upstream.live.json`, which is git-ignored: it is
 * the outcome of *this* build's check, not a fact about the repository. The
 * committed `src/data/upstream.json` is the pin, and stays what ships when the
 * check cannot run.
 *
 * The job has one write and no opinion. It does not update the prose, the
 * universe's keyframes or the scoreboard: those are authored facts with
 * citations, and a scheduled job that rewrote them would make every other claim
 * on the site unverifiable.
 *
 *   node scripts/upstream.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'

const PIN = 'src/data/upstream.json'
const OUT = 'src/data/upstream.live.json'
const API = 'https://api.github.com'

const pinned = JSON.parse(await readFile(PIN, 'utf8'))
const headers = { accept: 'application/vnd.github+json', 'user-agent': 'le.railhead-build' }
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`

const get = async (path, raw = false) => {
  const response = await fetch(`${API}${path}`, { headers })
  if (!response.ok) throw new Error(`${path} answered ${response.status}`)
  return raw ? response.text() : response.json()
}

try {
  const repo = await get(`/repos/${pinned.repo}`)
  const [headCommits, tags, versionSource] = await Promise.all([
    get(`/repos/${pinned.repo}/commits?per_page=1`),
    get(`/repos/${pinned.repo}/tags`),
    // `pyproject.toml` is dynamic on purpose: `__init__.py` is the single source
    // of the version (the 0.1.2 change). Read the source, not the manifest.
    fetch(`https://raw.githubusercontent.com/${pinned.repo}/${repo.default_branch}/src/railhead/__init__.py`, {
      headers: { 'user-agent': 'le.railhead-build' },
    }).then((response) => (response.ok ? response.text() : '')),
  ])

  const head = headCommits[0]
  const version = /^__version__\s*=\s*["']([^"']+)["']/m.exec(versionSource)?.[1] ?? 'unknown'
  const latestTag = tags[0]?.name ?? pinned.latestTag
  // "Unreleased" is derived, not remembered: a tag that matches the version in
  // the tree is what makes it released.
  const versionStatus = latestTag === `v${version}` ? 'released' : 'unreleased'
  const drift = head.sha !== pinned.pinnedSha

  const snapshot = {
    ...pinned,
    source: 'live',
    checkedAt: new Date().toISOString(),
    headSha: head.sha,
    headCommitAt: head.commit.author.date,
    headSubject: head.commit.message.split('\n')[0],
    latestTag,
    version,
    versionStatus,
    drift,
  }

  await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')

  const verdict = drift
    ? `DRIFT — upstream is ${head.sha.slice(0, 7)} (${head.commit.author.date}), pin is ${pinned.pinnedSha.slice(0, 7)}`
    : `current at ${head.sha.slice(0, 7)}`
  console.log(`upstream: ${pinned.repo} ${verdict}; version ${version}`)
} catch (error) {
  // No network, a rate limit or an API change. The committed pin ships, and the
  // page's date is the date of the last check that did run. Never a silent zero.
  console.warn(`upstream: check skipped — ${error.message}`)
  console.warn(`upstream: serving the committed pin ${pinned.pinnedSha.slice(0, 7)} (${pinned.checkedAt.slice(0, 10)})`)
}

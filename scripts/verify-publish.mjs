#!/usr/bin/env node
/**
 * The publish gate. Same job as the parent seed's: refuse to publish an output
 * that would 404, link nowhere, leak the machine it was built on, or claim a
 * check it cannot show the result of.
 */
import { access, readdir, readFile, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join, relative } from 'node:path'

const DIST = 'dist'
const EXTRA_ROUTES = ['universe', 'studies', 'known-gaps', 'design']
const failures = []
const notes = []
const fail = (check, detail) => failures.push({ check, detail })

const walk = async (dir) => {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const readText = (file) => readFile(file, 'utf8').catch(() => '')
const files = await walk(DIST)
const rel = files.map((file) => relative(DIST, file))

// 1. base path agrees with package.json homepage
const pkg = JSON.parse(await readText('package.json'))
const expectedBase = new URL(pkg.homepage).pathname
const indexHtml = await readText(join(DIST, 'index.html'))
if (!indexHtml.includes(`${expectedBase}assets/`)) {
  fail('base-path', `index.html does not load assets from ${expectedBase}assets/`)
}

// 2. no placeholders, secrets or machine paths
const placeholder = /\b(?:TODO|FIXME|lorem ipsum)\b|example\.com/i
const secrets = [
  [/\/Users\/[A-Za-z0-9._-]+/, 'an absolute macOS home path'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'an AWS key id'],
  [/\b(?:password|secret|token)\s*[:=]\s*["'][^"']{8,}["']/i, 'a hardcoded credential'],
]
for (const file of rel.filter((name) => name.endsWith('.html'))) {
  const html = await readText(join(DIST, file))
  if (placeholder.test(html)) fail('placeholder', `${file} contains placeholder text`)
  for (const [pattern, what] of secrets) if (pattern.test(html)) fail('secret', `${file} contains ${what}`)
}
for (const file of rel.filter((name) => name.endsWith('.map'))) fail('sourcemap', `${file} is a source map`)

// 3. every page and live route has its own shell, and the shell carries the page
const contentFiles = (await walk('src/content')).filter((file) => file.endsWith('.md'))
const routes = [
  ...new Set(contentFiles.map((file) => relative('src/content', file).split('/')[0])),
  ...EXTRA_ROUTES,
  ...contentFiles.map((file) => relative('src/content', file).replace(/\.md$/, '')),
]
for (const route of routes) {
  try {
    await access(join(DIST, route, 'index.html'))
  } catch {
    fail('route-shell', `dist/${route}/index.html is missing`)
  }
}
for (const route of ['index.html', '404.html']) {
  const html = await readText(join(DIST, route))
  if (!/<h1[\s>]/i.test(html)) fail('prerender', `dist/${route} has no <h1> in the initial HTML`)
}
for (const route of routes) {
  const html = await readText(join(DIST, route, 'index.html'))
  if (!/<h1[\s>]/i.test(html)) fail('prerender', `dist/${route}/index.html has no <h1>`)
}

// 4. internal links resolve
const known = new Set([
  '/',
  ...routes.map((route) => `/${route}`),
  ...EXTRA_ROUTES.map((route) => `/${route}`),
])
const llms = await readText(join(DIST, 'llms.txt'))
for (const file of [...contentFiles, ...(await walk('src/pages')).filter((f) => f.endsWith('.tsx'))]) {
  const source = await readText(file)
  for (const match of source.matchAll(/['"(](\/[a-z0-9][a-z0-9/-]*)['")]/g)) {
    const target = match[1].replace(/\/$/, '') || '/'
    // Only guard paths that look like routes, not files or API paths.
    if (/\.[a-z]{2,4}$/.test(target)) continue
    if (target === '/' || known.has(target)) continue
    fail('link', `${file} points at ${target}, which is not a route`)
  }
}

// 5. llms.txt lists every page and every live route
for (const file of contentFiles) {
  const route = relative('src/content', file).replace(/\.md$/, '')
  const title = /^title:\s*(.+)$/m.exec(await readText(file))?.[1]?.trim().replace(/^["']|["']$/g, '')
  if (title && !llms.includes(title)) fail('llms', `${file} ("${title}") is not in llms.txt`)
  if (!llms.includes(`/${route}/`)) fail('llms', `${route} is not listed in llms.txt`)
}
for (const route of EXTRA_ROUTES) {
  if (!llms.includes(`/${route}/`)) fail('llms', `live route ${route} is not listed in llms.txt`)
}

// 6. the upstream snapshot is published, and a drift is visible on the page
const snapshotText = await readText(join(DIST, 'upstream.json'))
if (!snapshotText) {
  fail('upstream', 'dist/upstream.json is missing — run node scripts/upstream.mjs')
} else {
  const snapshot = JSON.parse(snapshotText)
  for (const field of ['repo', 'pinnedSha', 'checkedAt', 'version', 'source']) {
    if (!snapshot[field]) fail('upstream', `dist/upstream.json has no ${field}`)
  }
  if (!/^[0-9a-f]{40}$/i.test(snapshot.pinnedSha ?? '')) {
    fail('upstream', 'dist/upstream.json pinnedSha is not a full commit sha')
  }
  if (snapshot.drift) {
    const page = await readText(join(DIST, 'ops', 'schedule', 'index.html'))
    const short = String(snapshot.headSha ?? '').slice(0, 7)
    if (!page.includes(short)) fail('upstream', `upstream drifted to ${short} but the schedule page does not say so`)
    notes.push(`DRIFT since ${snapshot.pinnedSha.slice(0, 7)}`)
  }
  // The pinned sha is on the front page, so the record a reader sees is tied to
  // a commit rather than to "recently".
  const home = await readText(join(DIST, 'index.html'))
  if (!home.includes(snapshot.pinnedSha.slice(0, 7))) {
    fail('upstream', 'the front page does not carry the pinned commit')
  }
}

// 7. the upstream rules are vendored, hashed, and overridden on the record
const rules = await readText('upstream/rules.md')
const manifest = JSON.parse((await readText('upstream/manifest.json')) || 'null')
if (!rules) {
  fail('rules', 'upstream/rules.md is missing — run node scripts/sync-upstream.mjs')
} else {
  const ids = new Set([...rules.matchAll(/^- (RULES-\d+):/gm)].map((match) => match[1]))
  if (!ids.size) fail('rules', 'upstream/rules.md defines no rules')
  if (!manifest) {
    fail('rules', 'upstream/manifest.json is missing')
  } else {
    const hash = createHash('sha256').update(rules).digest('hex')
    if (hash !== manifest.sha256) fail('rules', 'upstream/rules.md does not match its manifest hash')
  }
  const overrides = await readText('upstream/overrides.md')
  for (const match of overrides.matchAll(/^- (RULES-\d+):\s*(.+)$/gm)) {
    if (!ids.has(match[1])) fail('rules', `override names ${match[1]}, which upstream does not define`)
    if (match[2].trim().length < 20) fail('rules', `override for ${match[1]} has no reason`)
  }
  if (!(await readText(join(DIST, 'rules.md')))) fail('rules', 'dist/rules.md is not published')
}

// 8. size sanity
const total = (await Promise.all(files.map(async (file) => (await stat(file)).size))).reduce((a, b) => a + b, 0)
if (total > 8 * 1024 * 1024) fail('size', `dist/ is ${(total / 1024 / 1024).toFixed(1)}MB, over 8MB`)
notes.push(`${rel.length} files, ${(total / 1024).toFixed(0)}KB total`)

if (failures.length) {
  console.error('guard: refused to publish\n')
  for (const { check, detail } of failures) console.error(`  [${check}] ${detail}`)
  console.error('\nNothing was published. Fix the checks above and rebuild.')
  process.exit(1)
}

console.log(`guard: clean — ${notes.join(' · ')}`)

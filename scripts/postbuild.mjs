#!/usr/bin/env node
/**
 * Shells, 404, robots, sitemap, llms.txt, upstream.json, rules.md and rotations.json —
 * everything Pages needs and Vite does not know about. The route list is
 * derived from the content tree plus the declared live routes.
 */
import { access, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

import { readState } from './rotation-state.mjs'

const SITE = 'https://james-gibson.github.io/le.railhead'
const DIST = 'dist'
const CONTENT = 'src/content'
const INDEX = join(DIST, 'index.html')

/** Live routes: a route in src/pages/ with no content file. Declared once. */
const EXTRA_ROUTES = ['universe', 'studies', 'known-gaps', 'station-flow', 'design']

try {
  await access(INDEX)
} catch {
  console.error('postbuild: dist/index.html is missing — run vite build first')
  process.exit(1)
}

const walk = async (dir) => {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const sections = (await readdir(CONTENT, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

const pages = await Promise.all(
  (await walk(CONTENT))
    .filter((file) => file.endsWith('.md'))
    .map(async (file) => {
      const source = await readFile(file, 'utf8')
      const route = relative(CONTENT, file).replace(/\.md$/, '')
      const field = (name) =>
        new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(source)?.[1]?.trim().replace(/^["']|["']$/g, '') ?? ''
      return {
        route,
        title: field('title'),
        description: field('description'),
        order: Number(field('order')) || 99,
      }
    }),
)

const routes = [...sections, ...EXTRA_ROUTES, ...pages.map((page) => page.route)]
const template = await readFile(INDEX, 'utf8')

const PRERENDER = join(DIST, '.prerender')
const markup = new Map()
try {
  for (const file of await readdir(PRERENDER)) {
    markup.set(file.replace(/\.html$/, ''), await readFile(join(PRERENDER, file), 'utf8'))
  }
} catch {
  console.warn('postbuild: no prerendered markup — shells will be empty')
}

const shell = (key, title) => {
  const content = markup.get(key)
  const html = content
    ? template.replace('<div id="root"></div>', `<div id="root">${content}</div>`)
    : template
  return title ? html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title} · le.railhead</title>`) : html
}

const TITLES = new Map(pages.map((page) => [page.route, page.title]))
const EXTRA_TITLES = {
  universe: 'The record, in local time',
  studies: 'The studies register',
  'known-gaps': 'Known gaps',
  'station-flow': 'Station flow',
  design: 'Design',
}

for (const route of routes) {
  const dir = join(DIST, route)
  await mkdir(dir, { recursive: true })
  const title =
    TITLES.get(route) ?? EXTRA_TITLES[route] ?? route.charAt(0).toUpperCase() + route.slice(1)
  await writeFile(join(dir, 'index.html'), shell(route.replace(/\//g, '__'), title), 'utf8')
}

await writeFile(INDEX, shell('home', null), 'utf8')
await writeFile(join(DIST, '404.html'), shell('404', 'Not found'), 'utf8')
await writeFile(join(DIST, '.nojekyll'), '')

const urls = ['', ...routes.map((route) => `${route}/`)]
await writeFile(
  join(DIST, 'sitemap.xml'),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${url ? `${SITE}/${url}` : `${SITE}/`}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n'),
  'utf8',
)

await writeFile(
  join(DIST, 'robots.txt'),
  ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE}/sitemap.xml`, ''].join('\n'),
  'utf8',
)

// --- upstream.json: what this build checked -------------------------------
// The live snapshot if the check ran, else the committed pin. It is the file a
// machine reads to answer "what is this site describing, and when did it look?"
const readJson = async (file) => {
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch {
    return null
  }
}
const live = await readJson('src/data/upstream.live.json')
const pinned = await readJson('src/data/upstream.json')
const snapshot = live ?? pinned
if (snapshot) await writeFile(join(DIST, 'upstream.json'), `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
else console.warn('postbuild: no upstream snapshot — the guard will fail')

// --- llms.txt: the machine entry ------------------------------------------
const bySection = sections.map((section) => ({
  section,
  pages: pages.filter((page) => page.route.startsWith(`${section}/`)).sort((a, b) => a.order - b.order),
}))

const llmsLines = [
  '# le.railhead',
  '',
  'A local-time record of Railhead: a reinforcement-learning environment in which a',
  'language model plays OpenTTD first person from a shell. A child seed of le.gume,',
  'and the shared context the studies team publishes its research changes against.',
  '',
  'One page per Markdown file; the path is the URL; navigation, llms.txt and the',
  'sitemap are derived from the content tree plus five declared live routes.',
  '',
  '## Pinned upstream',
  '',
  snapshot
    ? `- repository: ${snapshot.repo} (${snapshot.url})`
    : '- repository: rachittshah/railhead',
  snapshot ? `- pinned commit: ${snapshot.pinnedSha} (${snapshot.pinnedCommitAt})` : '',
  snapshot ? `- latest tag: ${snapshot.latestTag}; version in the tree: ${snapshot.version} (${snapshot.versionStatus})` : '',
  snapshot ? `- checked at: ${snapshot.checkedAt} (source: ${snapshot.source})` : '',
  snapshot?.drift ? `- DRIFT: upstream head is ${snapshot.headSha}, the pin is ${snapshot.pinnedSha}` : '',
  snapshot ? `- licence: ${snapshot.licence}` : '',
  '',
  '## Commands',
  '',
  '- `npm install`',
  '- `npm run dev`',
  '- `npm run build` — upstream check, type-check, bundle, prerender, shells, llms.txt, guard',
  '- `npm run smoke` — render every route, including the 404, to a string',
  '- `npm run guard` — the publish gate alone',
  '',
  '## Pages',
  '',
  ...bySection.flatMap(({ section, pages: list }) => [
    `### ${section}`,
    '',
    ...list.map((page) => `- [${page.title}](${SITE}/${page.route}/): ${page.description}`),
    '',
  ]),
  '### live routes',
  '',
  `- [The record, in local time](${SITE}/universe/): the local-time universe, rendered from src/universes/railhead.ts`,
  `- [The studies register](${SITE}/studies/): five studies, their stages, and every research change published here`,
  `- [Known gaps](${SITE}/known-gaps/): the five open holes in the verifier, one ticket each`,
  `- [Station flow](${SITE}/station-flow/): an isometric model of block occupancy, queueing and station dwell`,
  `- [Design](${SITE}/design/): the PlopUI components the site uses, with the props it passes`,
  '',
  '## Machine files',
  '',
  `- [upstream.json](${SITE}/upstream.json): the snapshot this build published`,
  `- [rules.md](${SITE}/rules.md): the rules this child follows, and its one override`,
  `- [rotations.json](${SITE}/rotations.json): this seed's own rotation record — state, head, and distance`,
  `- [sitemap.xml](${SITE}/sitemap.xml): every route`,
  '',
  '## Invariants',
  '',
  '- The path is the URL.',
  '- Navigation is derived from the content tree, plus five declared live routes.',
  '- Content is Markdown, never MDX. A live widget is a route in src/pages/.',
  '- The guard is the gate: a broken link, a missing shell or a missing snapshot stops the publish.',
  '- A scheduled build checks upstream and publishes the drift; it never rewrites authored content.',
  '- A research change is published as a dated row with the pin it was read against; the study page keeps the argument.',
  '',
].filter((line) => line !== '')

// Join, then open a blank line before every heading: filtering the blanks would
// glue each heading to the list above it.
const llms = `${llmsLines
  .join('\n')
  .replace(/^(#{1,3} .+)$/gm, (heading) => (heading.startsWith('# ') ? `${heading}\n` : `\n${heading}`))
  .trimStart()
  .trim()}\n`

await writeFile(join(DIST, 'llms.txt'), llms, 'utf8')

// --- rules.md: inherited, with this child's override on the record --------
const upstream = await readFile('upstream/rules.md', 'utf8').catch(() => '')
const overrides = await readFile('upstream/overrides.md', 'utf8').catch(() => '')
if (upstream) {
  await writeFile(
    join(DIST, 'rules.md'),
    `${upstream}\n## Local overrides\n\n${overrides.replace(/^# Local overrides\n+/, '')}`,
    'utf8',
  )
}

// --- rotations.json: the seed's own record, published so it is checkable ----
// RULES-06: a claim that the site does X must be checkable at the URL. "This
// seed follows its own rotation record" is a claim, so the record is served.
const rotationState = readState()
await writeFile(join(DIST, 'rotations.json'), `${JSON.stringify(rotationState, null, 2)}\n`, 'utf8')

await rm(PRERENDER, { recursive: true, force: true })
console.log(
  `postbuild: ${routes.length} shells, 404, sitemap, robots, llms.txt, upstream.json, rules.md, rotations.json (${pages.length} pages)`,
)

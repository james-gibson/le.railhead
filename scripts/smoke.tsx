/**
 * Render every route to a string and assert what a reader without JavaScript
 * gets. The PlopUI display components render on the server, so this catches a
 * broken composition before the browser is involved.
 *
 * The text checks strip tags and comments WITHOUT inserting whitespace:
 * `Heading` letters a heading per character and PlopUI adds comments between
 * text nodes, so a naive strip with spaces turns "Arena 2" into "A r e n a 2".
 */
import { renderToString } from 'react-dom/server'
import { App } from '../src/App'
import { EXTRA_ROUTES, PAGES, SECTIONS } from '../src/lib/content'

const routes = [
  { path: '/', name: 'home' },
  ...SECTIONS.map((section) => ({ path: `/${section.id}`, name: section.id })),
  ...EXTRA_ROUTES.map((route) => ({ path: `/${route}`, name: route })),
  ...PAGES.map((page) => ({ path: `/${page.section}/${page.slug}`, name: `${page.section}/${page.slug}` })),
  { path: '/this-route-does-not-exist', name: '404' },
]

const strip = (html: string) =>
  html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

let failures = 0
const fail = (name: string, detail: string) => {
  failures += 1
  console.error(`smoke: ${name} — ${detail}`)
}

for (const route of routes) {
  let html = ''
  try {
    html = renderToString(<App path={route.path} />)
  } catch (error) {
    fail(route.name, `render failed: ${(error as Error).message}`)
    continue
  }

  const text = strip(html)
  if (!/<h1[\s>]/i.test(html)) fail(route.name, 'no h1')
  if (text.length < 200) fail(route.name, `only ${text.length} characters of text`)
  if (/\bundefined\b|\bNaN\b/.test(text)) fail(route.name, 'renders undefined or NaN')
  // The nav is on every page; a route that loses it has lost the layout.
  if (!text.includes('le.railhead')) fail(route.name, 'the site name is missing from the rail')
  // PlopUI lettering renders an aria-hidden copy per character plus the readable
  // text, so the plain text must still contain a whole sentence from the page.
  if (!/[a-z]{4,} [a-z]{4,} [a-z]{4,}/.test(text)) {
    fail(route.name, 'no readable sentence survived the render')
  }
}

// Facts that must survive the render, checked as text rather than as markup.
const home = strip(renderToString(<App path="/" />))
for (const fact of ['45,758,664', 'Arena 2', 'replay verified']) {
  if (!home.includes(fact)) fail('home', `is missing "${fact}"`)
}

const universe = strip(renderToString(<App path="/universe" />))
for (const fact of ['T+02:05:45', 'technology:railhead:2026', '6158e15']) {
  if (!universe.includes(fact)) fail('universe', `is missing "${fact}"`)
}

const gaps = strip(renderToString(<App path="/known-gaps" />))
if (!gaps.includes('GAP 1')) fail('known-gaps', 'the ticket list is empty')

if (failures) {
  console.error(`smoke: ${failures} failure(s) across ${routes.length} routes`)
  process.exit(1)
}

console.log(`smoke: ${routes.length} routes rendered, text and facts intact`)

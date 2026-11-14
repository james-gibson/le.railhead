/**
 * The content model.
 *
 * One page = one file under src/content/<section>/<slug>.md. The path is the
 * URL; the navigation, the section indexes, llms.txt and the sitemap are
 * derived from the file tree. There is no nav array and there is no route
 * table to keep in step.
 *
 * Frontmatter is a deliberately small subset of YAML — `key: value` lines — so
 * the site needs no parser dependency and the contract stays readable.
 */

export type SectionId = 'brief' | 'arena' | 'verify' | 'ops' | 'seeds'

export const SECTIONS: { id: SectionId; label: string; blurb: string }[] = [
  { id: 'brief', label: 'Brief', blurb: 'What Railhead is, the terms of the arena, and where the facts came from.' },
  { id: 'arena', label: 'Arena', blurb: 'Eleven models, ten years, and the run-off year that decides the score.' },
  { id: 'verify', label: 'Verify', blurb: 'Why the scoreboard does not trust the game, and which attacks are still open.' },
  { id: 'ops', label: 'Ops', blurb: 'Run it locally, rebuild the record on a schedule, and the agent entry.' },
  { id: 'seeds', label: 'Seeds', blurb: 'Bodies of knowledge with a stated audience, a stated assumption and an entrance.' },
]

export type Page = {
  path: string
  section: SectionId
  slug: string
  title: string
  description: string
  order: number
  updated: string
  tags: string[]
  /** seed ids this page belongs to; a page can be shared by several seeds */
  seeds: string[]
  body: string
  headings: { id: string; text: string }[]
}

const rawFiles = import.meta.glob('../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const field = (frontmatter: string, name: string) =>
  new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(frontmatter)?.[1]?.trim().replace(/^["']|["']$/g, '') ?? ''

const list = (frontmatter: string, name: string) =>
  field(frontmatter, name)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

const slugify = (text: string) =>
  text.toLowerCase().replace(/`|\*|_/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function toPage(path: string, source: string): Page | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  const frontmatter = match?.[1] ?? ''
  const body = source.slice(match?.[0].length ?? 0).trim()
  const relativePath = path.replace(/^.*\/content\//, '').replace(/\.md$/, '')
  const [section, slug] = relativePath.split('/')
  if (!section || !slug) return null
  if (!SECTIONS.some((candidate) => candidate.id === section)) return null
  return {
    path: relativePath,
    section: section as SectionId,
    slug,
    title: field(frontmatter, 'title'),
    description: field(frontmatter, 'description'),
    order: Number(field(frontmatter, 'order')) || 99,
    updated: field(frontmatter, 'updated'),
    tags: list(frontmatter, 'tags'),
    seeds: list(frontmatter, 'seeds'),
    body,
    headings: [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => ({
      id: slugify(m[1]),
      text: m[1],
    })),
  }
}

export const PAGES: Page[] = Object.entries(rawFiles)
  .map(([path, source]) => toPage(path, source))
  .filter((page): page is Page => page !== null)
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))

export const pagesIn = (section: SectionId) => PAGES.filter((page) => page.section === section)

export const getPage = (section: string, slug: string) =>
  PAGES.find((page) => page.section === section && page.slug === slug)

export const sectionMeta = (id: SectionId) => SECTIONS.find((section) => section.id === id)!

export const routeOf = (page: Page) => `/${page.section}/${page.slug}`

export const latestUpdate = () => PAGES.map((page) => page.updated).filter(Boolean).sort().at(-1) ?? 'unknown'

/** Routes that are not Markdown: live views of data the build produced. */
export const EXTRA_ROUTES = ['universe', 'known-gaps', 'design'] as const

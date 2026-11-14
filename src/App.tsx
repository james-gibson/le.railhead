import { Layout } from '@/components/Layout'
import { SitePaper } from '@/components/plop/paper'
import { Design } from '@/pages/Design'
import { DocPage } from '@/pages/DocPage'
import { Home } from '@/pages/Home'
import { KnownGaps } from '@/pages/KnownGaps'
import { NotFound } from '@/pages/NotFound'
import { SectionIndex } from '@/pages/SectionIndex'
import { Studies } from '@/pages/Studies'
import { Universe } from '@/pages/Universe'
import { EXTRA_ROUTES, getPage, SECTIONS, type SectionId } from '@/lib/content'

const isSection = (value: string): value is SectionId => SECTIONS.some((section) => section.id === value)
const isExtra = (value: string): boolean => EXTRA_ROUTES.includes(value as (typeof EXTRA_ROUTES)[number])

/**
 * No router. Every link is a real URL and every route has its own shell, so the
 * page to render is decided by the path the build (or the browser) hands in.
 *
 * The provider lives here, inside the app, so the prerender and the browser get
 * the same paper. A provider in `main.tsx` only would leave the server render
 * outside the surface it is meant to paint.
 */
export function App({ path }: { path: string }) {
  const clean = path.replace(/\/+$/, '') || '/'
  const [, section, slug] = clean.split('/')

  let content = <NotFound />
  if (clean === '/') content = <Home />
  else if (clean === '/universe') content = <Universe />
  else if (clean === '/studies') content = <Studies />
  else if (clean === '/known-gaps') content = <KnownGaps />
  else if (clean === '/design') content = <Design />
  else if (section && !slug && isSection(section)) content = <SectionIndex section={section} />
  else if (section && slug && isSection(section) && !isExtra(section)) {
    const page = getPage(section, slug)
    if (page) content = <DocPage page={page} />
  }

  return (
    <SitePaper>
      <Layout path={clean}>{content}</Layout>
    </SitePaper>
  )
}

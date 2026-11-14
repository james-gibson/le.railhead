import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Heading, Tag } from '@plop-ui/react'
import { sectionMeta, type Page } from '@/lib/content'
import { getSeed } from '@/lib/seeds'
import { href } from '@/lib/base'

/**
 * One page of Markdown, rendered into the site's own typography.
 *
 * The Markdown body's own `#` heading is removed: the `title` in frontmatter is
 * the h1 and the path is the URL, so a second title in the body would be a
 * duplicate heading for a screen reader.
 */
export function DocPage({ page }: { page: Page }) {
  const meta = sectionMeta(page.section)
  const seeds = page.seeds.map(getSeed).filter((seed) => seed !== undefined)

  return (
    <>
      <header className="stack">
        <p className="meta" style={{ margin: 0 }}>
          <a href={href(`/${page.section}`)}>{meta.label}</a> · path is the URL ·{' '}
          <span className="mono">/{page.section}/{page.slug}</span>
        </p>
        <Heading level={1}>{page.title}</Heading>
        <p style={{ margin: 0, maxWidth: '62ch', fontSize: 17 }}>
          {page.description}
        </p>
        <div className="row">
          {seeds.map((seed) => (
            <Tag key={seed.id} tone="periwinkle" pattern="grid">
              for {seed.title.toLowerCase()}
            </Tag>
          ))}
          {page.updated ? (
            <span className="meta">
              updated <span className="mono">{page.updated}</span>
            </span>
          ) : null}
        </div>
      </header>

      <article className="sheet">
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {page.body.replace(/^\s*#\s+[^\n]*\n/, '')}
          </ReactMarkdown>
        </div>
      </article>

      <p className="meta" style={{ margin: 0 }}>
        <a href={href(`/${page.section}`)}>← all of {meta.label.toLowerCase()}</a>
      </p>
    </>
  )
}

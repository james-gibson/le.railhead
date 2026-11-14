import { Heading, Tag } from '@plop-ui/react'
import { pagesIn, sectionMeta, type SectionId } from '@/lib/content'
import { getSeed, scale, seedMembers } from '@/lib/seeds'
import { href } from '@/lib/base'

/**
 * A section's pages, in file order.
 *
 * The seeds section is the one exception: it renders the readiness ladder
 * rather than a list, because the order that matters there is the rung, not the
 * `order:` field. Membership is derived from page frontmatter, so the ladder
 * cannot disagree with the pages that declare a seed.
 */
export function SectionIndex({ section }: { section: SectionId }) {
  const meta = sectionMeta(section)

  if (section === 'seeds') {
    return (
      <>
        <header className="stack">
          <p className="meta" style={{ margin: 0 }}>
            Section
          </p>
          <Heading level={1}>{meta.label}</Heading>
          <p style={{ margin: 0, maxWidth: '62ch' }}>{meta.blurb}</p>
          <p className="meta" style={{ margin: 0 }}>
            The rung is how much of the machine the audience will touch, not how senior they are. A
            reader who does not want to deploy software ranks below one who does; there is no rung 0
            here, and the site says why.
          </p>
        </header>

        <div className="stack" data-gap="loose">
          {scale().map((step) => (
            <div key={step.level} className="stack" data-gap="tight">
              <div className="row">
                <Tag tone={step.seeds.length ? 'mint' : 'periwinkle'} pattern="stripes">
                  rung {step.level} · {step.label}
                </Tag>
                <span className="meta">{step.touches}</span>
              </div>
              {step.seeds.map((seed) => (
                <div key={seed.id} className="sheet stack" data-gap="tight">
                  <Heading level={3}>{seed.title}</Heading>
                  <p style={{ margin: 0 }}>{seed.audience}</p>
                  <p className="meta" style={{ margin: 0 }}>
                    assumes: {seed.assumes}
                  </p>
                  <p className="meta" style={{ margin: 0 }}>
                    {seedMembers(seed.id).length} pages · entrance{' '}
                    <a href={href(seed.entry)}>{seed.entry}</a>
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </>
    )
  }

  const pages = pagesIn(section)

  return (
    <>
      <header className="stack">
        <p className="meta" style={{ margin: 0 }}>
          Section
        </p>
        <Heading level={1}>{meta.label}</Heading>
        <p style={{ margin: 0, maxWidth: '62ch' }}>{meta.blurb}</p>
      </header>

      <div className="grid" data-cols="2">
        {pages.map((page) => (
          <article key={page.path} className="sheet stack" data-gap="tight">
            <Heading level={3}>{page.title}</Heading>
            <p style={{ margin: 0 }}>{page.description}</p>
            <p style={{ margin: 0 }}>
              <a href={href(`/${page.section}/${page.slug}`)}>Read it</a>
            </p>
            <div className="row">
              {page.seeds.map((id) => {
                const seed = getSeed(id)
                return seed ? (
                  <Tag key={id} tone="periwinkle" pattern="grid">
                    {seed.title.toLowerCase()}
                  </Tag>
                ) : null
              })}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

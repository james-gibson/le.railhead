import type { ReactNode } from 'react'
import { Heading, Tag } from '@plop-ui/react'
import { EXTRA_ROUTES, PAGES, SECTIONS } from '@/lib/content'
import { upstream, shortSha } from '@/lib/upstream'
import { href } from '@/lib/base'

const EXTRA_LABEL: Record<(typeof EXTRA_ROUTES)[number], string> = {
  universe: 'Universe',
  'known-gaps': 'Known gaps',
  design: 'Design',
}

/**
 * Chrome is plain: a rail of ordinary links, a heading, and a footer.
 *
 * The stickers are for the objects on the page — counts, verdicts, tickets,
 * notes. A nav made of washi tape would make the paper language mean nothing.
 */
export function Layout({ path, children }: { path: string; children: ReactNode }) {
  const current = (target: string) => (path === target ? { 'aria-current': 'page' as const } : {})

  return (
    <div className="shell">
      <aside className="rail no-print">
        <div className="stack" data-gap="tight">
          <Heading level={3} scribble={false} writeOn={false}>
            le.railhead
          </Heading>
          <p className="meta" style={{ margin: 0 }}>
            A local-time record of Railhead, an RL environment where language models play OpenTTD
            from a shell.
          </p>
        </div>

        <nav aria-label="Sections">
          <ul>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a href={href(`/${section.id}`)} {...current(`/${section.id}`)}>
                  {section.label}
                </a>
              </li>
            ))}
            {EXTRA_ROUTES.map((route) => (
              <li key={route}>
                <a href={href(`/${route}`)} {...current(`/${route}`)}>
                  {EXTRA_LABEL[route]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="stack" data-gap="tight">
          <p className="meta" style={{ margin: 0 }}>
            Pinned to <span className="mono">{shortSha(upstream.pinnedSha)}</span>
          </p>
          <Tag tone="periwinkle" pattern="grid">
            {upstream.latestTag}
          </Tag>
        </div>

        <p className="meta" style={{ margin: 0 }}>
          A child seed of{' '}
          <a href="https://james-gibson.github.io/le.gume/">le.gume</a>. Same content model, same
          gate, different question.
        </p>
      </aside>

      <main className="page">
        {children}

        <footer className="stack" data-gap="loose" style={{ marginTop: 32 }}>
          <hr style={{ border: 0, borderTop: '2px solid var(--plop-line-a)', margin: 0 }} />
          <div className="grid" data-cols="3">
            <div className="stack" data-gap="tight">
              <b>Sections</b>
              {SECTIONS.map((section) => (
                <a key={section.id} href={href(`/${section.id}`)}>
                  {section.label}
                </a>
              ))}
            </div>
            <div className="stack" data-gap="tight">
              <b>Elsewhere</b>
              <a href={upstream.url}>Upstream: rachittshah/railhead</a>
              <a href="https://james-gibson.github.io/le.gume/">le.gume, the parent seed</a>
              <a href="https://github.com/james-gibson/local-time">local-time</a>
            </div>
            <div className="stack" data-gap="tight">
              <b>This build</b>
              <span className="meta">
                {PAGES.length} pages, {SECTIONS.length} sections, {EXTRA_ROUTES.length} live routes
              </span>
              <span className="meta">
                Upstream <span className="mono">{shortSha(upstream.pinnedSha)}</span> · version{' '}
                <span className="mono">{upstream.version}</span> ({upstream.versionStatus})
              </span>
              <span className="meta">
                {upstream.source === 'live' ? 'Checked' : 'Last checked'}{' '}
                <span className="mono">{upstream.checkedAt.slice(0, 10)}</span>
                {upstream.source === 'live' ? ', live' : ', from the pin'}
              </span>
              {upstream.drift && upstream.headSha ? (
                <span className="row" style={{ gap: 8 }}>
                  <Tag tone="mustard" pattern="dots">
                    drift
                  </Tag>
                  <span className="meta">
                    upstream is now <span className="mono">{shortSha(upstream.headSha)}</span> (
                    {upstream.headCommitAt?.slice(0, 10)})
                  </span>
                </span>
              ) : null}
            </div>
          </div>
          <p className="meta" style={{ margin: 0 }}>
            The site is AGPL-3.0-only; the record describes MIT and GPL-2.0-only software. No
            accounts, no analytics, no search, no database. The build is the receipt.
          </p>
        </footer>
      </main>
    </div>
  )
}
